# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates elements on the canvas to iterate, and the final code gets PR'd to a production repo.

## Architecture

Canvai has two pieces:
- **npm package** — the canvas runtime, Vite plugin, and CLI (`canvai init`, `canvai dev`)
- **Claude Code plugin** — skills, MCP config, and agent instructions (marketplace in `plugin/`, plugin at `plugin/plugins/canvai/`)

## Project structure

```
src/
  runtime/            ← canvas platform (Canvas, Frame, layout, types)
  vite-plugin/        ← auto-discovers project manifests
  cli/                ← canvai dev command
  projects/           ← design projects (one folder per project)
    <project-name>/
      Component.tsx   ← the React component
      manifest.ts     ← pages × frames (auto-discovered)
plugin/               ← Claude Code plugin marketplace
  .claude-plugin/     ← marketplace manifest
  plugins/canvai/     ← the plugin (skills, MCP, CLAUDE.md)
```

## How it works

1. Each project has a `manifest.ts` that declares pages and frames
2. The Vite plugin auto-discovers all `src/projects/*/manifest.ts`
3. The canvas renders frames from the active project's active page
4. The layout engine computes grid positions — no manual x/y coordinates

## Manifest format

```ts
import { MyComponent } from './MyComponent'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: 'my-project',
  pages: [
    {
      name: 'V1 — Initial',
      grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
      frames: [
        { id: 'comp-variant-state', title: 'Comp / Variant / State', component: MyComponent, props: { ... } },
      ],
    },
  ],
}

export default manifest
```

## Component matrix

When the designer describes a component, think through its **variations** and **states**, then generate all meaningful combinations as frames.

- **Columns** = states (Default, Hover, Active, Disabled)
- **Rows** = variations (Short text, Long text, With icon, Error)
- Set `grid.columns` to match the number of states
- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`

## Design language

Canvai follows a **Braun / Jony Ive** aesthetic — clean, minimal, functional. Modern like Figma, not retro.

### Palette

| Token | Value | Usage |
|---|---|---|
| Accent | `#E8590C` | Buttons, highlights, selection outlines |
| Accent muted | `rgba(232, 89, 12, 0.15)` | Disabled accent backgrounds |
| Accent shadow | `rgba(232, 89, 12, 0.25)` | Button glow/shadow |
| Canvas | `#F0F0F0` | Canvas background (light gray) |
| Surface | `#FFFFFF` | Cards, popovers, panels |
| Surface alt | `#F9FAFB` | Input backgrounds, secondary surfaces |
| Border | `#E5E7EB` | Borders, dividers |
| Text primary | `#1F2937` | Body text |
| Text secondary | `#6B7280` | Labels, captions |
| Text tertiary | `#9CA3AF` | Hints, metadata |

### Typography

- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- Body: 13px, weight 400
- Labels/captions: 11-12px
- Buttons: 12-13px, weight 500

### Principles

- **One accent color.** Orange (`#E8590C`) is the only color. Everything else is grayscale.
- **Light canvas.** The background is always light gray, never dark.
- **Minimal chrome.** Borders are subtle (`#E5E7EB`), shadows are soft and diffused, no heavy outlines.
- **Generous spacing.** Use comfortable padding (10-16px) and margins. Don't crowd elements.
- **Rounded but not bubbly.** Border radius 8-10px for cards/popovers, 20px for pill buttons.

## Annotation flow (push-driven)

The canvas has a built-in annotation overlay. The designer clicks "Annotate", selects an element, types a comment, and clicks "Apply". The annotation is pushed to the canvai HTTP server, which the MCP server can poll for.

### Two modes

**Chat mode (default):** The agent stays conversational. The designer can chat, ask questions, and request changes. When the designer submits annotations from the canvas, they can tell the agent to check — or the agent can proactively call `get_pending_annotations` between tasks to see if anything is waiting.

**Watch mode (opt-in):** The designer says "enter watch mode" or runs `/canvai-dev` with watch. The agent calls `watch_annotations` in a blocking loop, processing each annotation as it arrives. This is ideal for rapid annotation sessions where the designer is iterating visually and doesn't need to chat. The designer can exit watch mode by sending any message.

### Processing an annotation

When an annotation arrives (via either mode):
1. Read the annotation — it includes `frameId`, `componentName`, `selector`, `comment`, and `computedStyles`
2. Map the `componentName` and `selector` to the relevant component file and element
3. Apply the requested changes to the component code
4. Call `resolve_annotation` with the annotation ID
5. **Log the change** to `src/projects/<project-name>/CHANGELOG.md` (create if it doesn't exist)

### Change history

Every annotation fix must be logged in the project's `CHANGELOG.md`. This provides a running record of all design iterations. Format:

```markdown
# Changelog

## V1 — Initial

- **button > span**: Changed font size from 14px to 16px (annotation #1)
- **card > h2**: Updated color to #1F2937 (annotation #2)
```

Each entry includes the `selector`, a brief description of the change, and the annotation number. Group entries under the current iteration (page name).

## Skills

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-dev`** — Start (or restart) the dev server (chat mode)
- **`/canvai-watch`** — Enter watch mode for rapid annotation sessions
- **`/canvai-iterate`** — Create a new design iteration (page)
- **`/canvai-ship`** — Ship component to a production repo
- **`/canvai-update`** — Update canvai to the latest version

## Commands

- `npx canvai init` — scaffold project files (index.html, vite.config, App.tsx, etc.)
- `npx canvai dev` — start dev server + annotation MCP
- `npx canvai update` — update canvai to latest from GitHub
