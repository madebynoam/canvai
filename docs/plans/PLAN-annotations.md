# Replace Agentation with canvai-native annotations

## Context

Agentation's element targeting is poor — it's a generic tool that doesn't know about canvai's frame/component structure. Canvai can do dramatically better because it owns the mapping: every element lives inside a Frame, every Frame maps to a known component + props via the manifest. Targeting becomes "which Frame → which element inside it" instead of guessing from the full page DOM.

**Push-driven design:** The designer never leaves the canvas to tell Claude Code what to do. They annotate, click "Apply", and the agent acts automatically. The MCP server bridges the browser and the agent via a blocking watch tool — when an annotation arrives, the tool unblocks and the agent processes it immediately.

## Architecture

```
Browser (AnnotationOverlay)           Node (canvai MCP server)              Claude Code agent
                                                                              │
  hover → highlight element             HTTP :4748 ← receives annotations     │
  click → capture targeting info         in-memory store                      │
  comment + click "Apply"               POST /annotations ──────────────┐     │
      │                                                                 │     │
      └──────── POST ──────────►  receive annotation                    │     │
                                  unblock watch_annotations ───────────►│     │
                                                                        │     │
                                                                  agent receives annotation
                                                                  edits component code
                                                                  Vite HMR reloads canvas
                                                                  agent calls watch_annotations again
                                                                        ▼
                                                                  (waiting for next annotation)
```

**The loop:** After `canvai dev` starts, the agent calls `watch_annotations`. This tool blocks until the designer submits an annotation from the canvas. When it returns, the agent processes the annotation (edits code), then calls `watch_annotations` again. The agent is always listening — the designer just clicks "Apply" and sees changes appear.

## New files

### 1. `src/runtime/AnnotationOverlay.tsx` (~200 lines)

Replaces `<Agentation>`. Fixed-position overlay with three modes: `idle`, `targeting`, `commenting`.

**Props:** `endpoint: string`, `frames: CanvasFrame[]`

**Targeting flow:**
1. User clicks "Annotate" → mode = `targeting`, transparent event-capturing overlay covers viewport
2. On `pointermove`: toggle overlay to `pointer-events:none`, call `document.elementFromPoint(x,y)`, restore. Walk up to `el.closest('[data-frame-id]')` to find frame.
3. Show highlight box at `hitElement.getBoundingClientRect()` (screen coords, works with zoom)
4. On click: capture `frameId`, build CSS selector relative to `[data-frame-content]` boundary, grab tag/classes/text/computedStyles, look up `componentName`+`props` from `frames` prop. Mode = `commenting`.
5. Show popup with textarea + **"Apply" button**. On Apply: POST to `${endpoint}/annotations`. Show a brief "Sent to agent" toast. The MCP server unblocks `watch_annotations` and the agent immediately processes the change — no manual step needed.

**Apply flow (push-driven):**
- The "Apply" button is the only action the designer takes. No switching to Claude Code, no "go read annotations."
- After clicking Apply, the overlay returns to `idle` mode. The designer can keep working — annotate another element, pan around, etc.
- When the agent finishes processing, Vite HMR updates the canvas live. The designer sees the change without refreshing.

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
- `watch_annotations` — **the core tool**. Blocks until a new annotation arrives via HTTP, then returns it. The agent calls this in a loop: process annotation → call `watch_annotations` again. This is what makes the push flow work — the browser POST unblocks the tool, so the agent reacts instantly.
- `resolve_annotation { id }` — mark resolved (agent calls this after successfully applying a change)
- `get_pending_annotations` — return annotations where status=pending (fallback/recovery if agent restarts mid-session)
- `list_annotations` — all annotations with status

**Store:** in-memory `Map<id, annotation>` + waiters array for `watch_annotations` blocking.

**Push mechanics:** When `POST /annotations` arrives from the browser, the server adds the annotation to the store and resolves any pending `watch_annotations` promise. The MCP tool call that was blocking returns immediately with the new annotation. From the agent's perspective, `watch_annotations` is like `await nextAnnotation()` — it sleeps until there's work to do.

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

## Agent watch loop

The push flow depends on the agent entering a watch loop after starting the dev server. This is driven by the `canvai-dev` skill:

```
Agent starts dev server
  ↓
Agent calls watch_annotations (blocks, waiting)
  ↓
Designer annotates on canvas, clicks "Apply"
  ↓
POST /annotations → MCP server → unblocks watch_annotations
  ↓
Agent receives annotation: { frameId, componentName, selector, comment, ... }
  ↓
Agent edits the component code based on the comment
  ↓
Vite HMR reloads the canvas — designer sees the change
  ↓
Agent calls resolve_annotation(id)
  ↓
Agent calls watch_annotations again (blocks, waiting for next)
  ↓
... loop continues until session ends
```

The skill should instruct the agent to:
1. Start the dev server
2. Call `watch_annotations` to enter the loop
3. When an annotation arrives, read the `comment`, `componentName`, `selector`, and `computedStyles`
4. Edit the component file accordingly
5. Call `resolve_annotation` to mark it done
6. Call `watch_annotations` again — back to waiting

The agent never needs to be told "go check annotations." It's already listening.

## Implementation order

1. `annotation-types.ts` — shared type
2. `src/mcp/server.js` — MCP + HTTP server (test standalone with curl)
3. `Frame.tsx` — add data-frame-id
4. `AnnotationOverlay.tsx` — browser overlay with Apply button
5. `index.ts` — exports
6. `App.tsx` — swap component
7. `cli/index.js` — swap server spawn + deps
8. `cli/templates.js` — update template
9. `.mcp.json` files — update both
10. `package.json` — deps swap, `npm install`
11. Docs/skills/plugin version bump — update `canvai-dev` skill to instruct agent to enter watch loop

## Verification

1. `npm run dev` — canvas loads, annotation button visible bottom-center
2. Click "Annotate" → hover over elements → blue highlight follows cursor
3. Click element → popup with textarea + **"Apply" button**
4. **Push flow test:** Agent calls `watch_annotations` (blocks). Designer types comment, clicks Apply. Agent immediately receives annotation — no manual trigger needed.
5. Agent edits the component code → Vite HMR → canvas updates live
6. Agent calls `resolve_annotation` → status changes to resolved
7. Agent calls `watch_annotations` again → blocks, ready for next annotation
8. **Multi-annotation test:** Submit 3 annotations in quick succession. Agent processes them one by one (FIFO from the waiter queue).
9. Canvas pan/zoom still work during annotation mode
10. Frame drag still works (title bar, not content)
11. Consumer scaffold: `npx canvai init` installs correct deps, App.tsx has AnnotationOverlay
