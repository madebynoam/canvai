# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates elements on the canvas to iterate, and the final code gets PR'd to a production repo.

## User workflow

1. **`/canvai-init <project-name>`** — Creates a new design project, installs canvai if needed, starts the dev server + annotation MCP.
2. **Describe** — The designer describes the component (or attaches a sketch). The agent generates the component with variations and states as a manifest.
3. **Annotate** — The designer clicks "Annotate" on the canvas, selects an element, types a comment, and clicks "Apply". The annotation is pushed to the agent automatically via the MCP watch loop.
4. **`/canvai-iterate`** — Creates a new iteration in the manifest. Old iterations are frozen.
5. **`/canvai-ship`** — PR the finished components to a production codebase.

## Project structure

```
src/projects/
  <project-name>/
    Component.tsx       ← the React component
    manifest.ts         ← pages × frames (auto-discovered by the canvas)
```

## Manifest format

Each project has a `manifest.ts` that exports a `ProjectManifest`:

```ts
import { MyComponent } from './MyComponent'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: 'my-project',
  iterations: [
    {
      name: 'V1',
      pages: [
        {
          name: 'Initial',
          grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
          frames: [
            { id: 'comp-variant-state', title: 'Comp / Variant / State', component: MyComponent, props: { ... } },
          ],
        },
      ],
    },
  ],
}

export default manifest
```

## Component matrix

When the designer describes a component, think through its **variations** and **states**, then generate all meaningful combinations as frames in the manifest.

- **Columns** = states or interaction phases (e.g. Default, Hover, Active, Disabled)
- **Rows** = variations or content scenarios (e.g. Short text, Long text, With icon, Error)
- Set `grid.columns` to match the number of states
- Frames flow left-to-right, wrapping at the column count — the layout engine computes positions

### Naming convention

- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`

## Design language

Canvai follows a **Braun / Jony Ive** aesthetic — clean, minimal, functional. Modern like Figma, not retro.

### Palette

| Token | Value | Usage |
|---|---|---|
| Accent | `#E8590C` | Buttons, highlights, selection outlines |
| Accent muted | `rgba(232, 89, 12, 0.15)` | Disabled accent backgrounds |
| Canvas | `#F0F0F0` | Canvas background (light gray) |
| Surface | `#FFFFFF` | Cards, popovers, panels |
| Border | `#E5E7EB` | Borders, dividers |
| Text primary | `#1F2937` | Body text |
| Text secondary | `#6B7280` | Labels, captions |
| Text tertiary | `#9CA3AF` | Hints, metadata |

### Principles

- **One accent color.** Orange (`#E8590C`) is the only color. Everything else is grayscale.
- **Light canvas.** The background is always light gray, never dark.
- **Minimal chrome.** Subtle borders, soft shadows, no heavy outlines.
- **Generous spacing.** Comfortable padding (10-16px). Don't crowd elements.
- **Rounded but not bubbly.** Border radius 8-10px for cards, 20px for pill buttons.

## Annotation flow (push-driven)

The canvas has a built-in annotation overlay. The designer clicks "Annotate", selects an element, types a comment, and clicks "Apply". The annotation is pushed to the canvai HTTP server.

### Two modes

**Chat mode (default):** The agent stays conversational. The designer can chat and request changes. To process annotations, the agent calls `get_pending_annotations` between tasks or when the designer asks.

**Watch mode (opt-in):** The designer says "enter watch mode" or uses `/canvai-dev`. The agent calls `watch_annotations` in a blocking loop for rapid annotation sessions. Exit by sending any message.

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

## V2 — Refined

- **input**: Added 8px padding and border-radius 6px (annotation #3)
```

Each entry includes the `selector`, a brief description of the change, and the annotation number. Group entries under the current iteration name.

## Skills

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-check`** — Check for pending annotations and process them
- **`/canvai-dev`** — Start (or restart) the dev server (chat mode)
- **`/canvai-watch`** — Enter watch mode for rapid annotation sessions
- **`/canvai-iterate`** — Create a new design iteration
- **`/canvai-ship`** — Ship component to a production repo
- **`/canvai-update`** — Update canvai to the latest version
