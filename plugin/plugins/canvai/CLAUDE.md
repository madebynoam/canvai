# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates elements on the canvas to iterate, and the final code gets PR'd to a production repo.

## User workflow

1. **`/canvai-init <project-name>`** — Creates a new design project, installs canvai if needed, starts the dev server + annotation MCP.
2. **Describe** — The designer describes the component (or attaches a sketch). The agent generates the component with variations and states as a manifest.
3. **Annotate** — The designer clicks "Annotate" on the canvas, selects an element, types a comment, and clicks "Apply". The annotation is pushed to the agent automatically via the MCP watch loop.
4. **`/canvai-iterate`** — Creates a new page (version) in the manifest. Old versions are frozen.
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

When the designer describes a component, think through its **variations** and **states**, then generate all meaningful combinations as frames in the manifest.

- **Columns** = states or interaction phases (e.g. Default, Hover, Active, Disabled)
- **Rows** = variations or content scenarios (e.g. Short text, Long text, With icon, Error)
- Set `grid.columns` to match the number of states
- Frames flow left-to-right, wrapping at the column count — the layout engine computes positions

### Naming convention

- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`

## Annotation flow (push-driven)

The canvas has a built-in annotation overlay. The designer clicks "Annotate", selects an element, types a comment, and clicks "Apply". The annotation is pushed to the canvai MCP server, which unblocks the `watch_annotations` tool.

**Agent watch loop:** After starting the dev server, call `watch_annotations` to enter the loop. When an annotation arrives:
1. Read the annotation — it includes `frameId`, `componentName`, `selector`, `comment`, and `computedStyles`
2. Map the `componentName` and `selector` to the relevant component file and element
3. Apply the requested changes to the component code
4. Call `resolve_annotation` with the annotation ID
5. Call `watch_annotations` again — back to waiting

The agent never needs to be told "go check annotations." It's always listening.

## Skills

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-dev`** — Start (or restart) the dev server and annotation MCP
- **`/canvai-iterate`** — Create a new design iteration (page)
- **`/canvai-ship`** — Ship component to a production repo
- **`/canvai-update`** — Update canvai to the latest version
