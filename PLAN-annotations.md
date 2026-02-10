# Replace Agentation with canvai-native annotations

## Context

Agentation's element targeting is poor — it's a generic tool that doesn't know about canvai's frame/component structure. Canvai can do dramatically better because it owns the mapping: every element lives inside a Frame, every Frame maps to a known component + props via the manifest. Targeting becomes "which Frame → which element inside it" instead of guessing from the full page DOM.

## Architecture

```
Browser (AnnotationOverlay)           Node (canvai MCP server)
  hover → highlight element             HTTP :4748 ← receives annotations
  click → capture targeting info         in-memory store
  comment → POST to :4748               MCP stdio → Claude Code agent
```

## New files

### 1. `src/runtime/AnnotationOverlay.tsx` (~200 lines)

Replaces `<Agentation>`. Fixed-position overlay with three modes: `idle`, `targeting`, `commenting`.

**Props:** `endpoint: string`, `frames: CanvasFrame[]`

**Targeting flow:**
1. User clicks "Annotate" → mode = `targeting`, transparent event-capturing overlay covers viewport
2. On `pointermove`: toggle overlay to `pointer-events:none`, call `document.elementFromPoint(x,y)`, restore. Walk up to `el.closest('[data-frame-id]')` to find frame.
3. Show highlight box at `hitElement.getBoundingClientRect()` (screen coords, works with zoom)
4. On click: capture `frameId`, build CSS selector relative to `[data-frame-content]` boundary, grab tag/classes/text/computedStyles, look up `componentName`+`props` from `frames` prop. Mode = `commenting`.
5. Show popup with textarea. On submit: POST to `${endpoint}/annotations`.

**Key helpers:**
- `buildSelector(el, boundary)` — walk from element to frame content div, build `tag:nth-of-type(n)` path
- `getStyleSubset(el)` — extract key computed styles (color, bg, fontSize, padding, border, etc.)

### 2. `src/mcp/server.js` (~200 lines)

Plain JS (ES modules, no TS — matches cli/index.js pattern). Single process, two interfaces:

**HTTP server (port 4748):**
- `POST /annotations` — receive from browser, add to store, notify waiters
- `GET /annotations` — list all
- `POST /annotations/:id/resolve` — mark resolved
- CORS headers for localhost:5173

**MCP server (stdio, `@modelcontextprotocol/sdk`):**
- `get_pending_annotations` — return annotations where status=pending
- `resolve_annotation { id }` — mark resolved
- `watch_annotations` — blocking poll, returns when new annotation arrives
- `list_annotations` — all annotations

**Store:** in-memory `Map<id, annotation>` + waiters array for blocking poll.

### 3. `src/runtime/annotation-types.ts` (~20 lines)

```ts
export interface CanvaiAnnotation {
  id: string
  frameId: string
  componentName: string
  props: Record<string, unknown>
  selector: string          // CSS path within frame content div
  elementTag: string
  elementClasses: string
  elementText: string       // trimmed, max 100 chars
  computedStyles: Record<string, string>
  comment: string
  timestamp: number
  status: 'pending' | 'resolved'
}
```

## Modified files

### 4. `src/runtime/Frame.tsx`

Add `data-frame-id` to content wrapper div so overlay can find containing frame:
```tsx
<div data-frame-id={id} data-frame-content>
  {children}
</div>
```

### 5. `src/runtime/index.ts`

Add exports: `AnnotationOverlay`, `CanvaiAnnotation` type

### 6. `src/App.tsx`

- Remove: `import { Agentation } from 'agentation'`
- Add: `import { AnnotationOverlay } from './runtime/AnnotationOverlay'`
- Replace: `<Agentation endpoint="http://localhost:4747" />` → `<AnnotationOverlay endpoint="http://localhost:4748" frames={frames} />`

### 7. `src/cli/templates.js`

Same swap in the `appTsx` template string. Import from `canvai/runtime` instead of `agentation`.

### 8. `src/cli/index.js`

- `startDev()`: replace `spawn('npx', ['agentation-mcp', 'server'])` with `spawn('node', [mcpServerPath])` where mcpServerPath resolves to `src/mcp/server.js`. Use `stdio: ['pipe', 'pipe', 'inherit']` (MCP on stdin/stdout, logs on stderr).
- `scaffold()`: remove `'agentation'`, `'agentation-mcp'` from `needed` deps array. Add `'@modelcontextprotocol/sdk'`.
- Update help text.

### 9. `.mcp.json` (project root)

```json
{ "mcpServers": { "canvai-annotations": { "command": "node", "args": ["src/mcp/server.js"] } } }
```

### 10. `plugin/plugins/canvai/.mcp.json`

Same — point to canvai-annotations server.

### 11. `package.json`

- Remove devDeps: `agentation`, `agentation-mcp`
- Add dep: `@modelcontextprotocol/sdk` (currently transitive, needs to be direct)

### 12. Docs/skills updates

- `CLAUDE.md` + `plugin/plugins/canvai/CLAUDE.md`: replace Agentation references, update MCP tool names
- `plugin/plugins/canvai/skills/canvai-dev/SKILL.md`: update pkill/process names
- `plugin/plugins/canvai/skills/canvai-init/SKILL.md`: update references
- Bump `plugin/.claude-plugin/marketplace.json` version

## Implementation order

1. `annotation-types.ts` — shared type
2. `src/mcp/server.js` — MCP + HTTP server (test standalone)
3. `Frame.tsx` — add data-frame-id
4. `AnnotationOverlay.tsx` — browser overlay
5. `index.ts` — exports
6. `App.tsx` — swap component
7. `cli/index.js` — swap server spawn + deps
8. `cli/templates.js` — update template
9. `.mcp.json` files — update both
10. `package.json` — deps swap, `npm install`
11. Docs/skills/plugin version bump

## Verification

1. `npm run dev` — canvas loads, annotation button visible bottom-center
2. Click "Annotate" → hover over elements → blue highlight follows cursor
3. Click element → popup shows frame ID + element info → type comment → submit
4. In Claude Code: MCP tools `get_pending_annotations` returns the annotation with frameId, componentName, selector
5. Call `resolve_annotation` → status changes
6. `watch_annotations` blocks until new annotation arrives
7. Canvas pan/zoom still work during annotation mode
8. Frame drag still works (title bar, not content)
9. Consumer scaffold: `npx canvai init` installs correct deps, App.tsx has AnnotationOverlay
