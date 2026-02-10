# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates with Agentation to iterate, and the final code gets PR'd to a production repo.

## User workflow

1. **`/canvai-init <project-name>`** — Creates a new design project, installs canvai if needed, starts the dev server + Agentation MCP.
2. **Describe** — The designer describes the component (or attaches a sketch). The agent generates the component with variations and states as a manifest.
3. **Annotate** — The designer uses Agentation to annotate elements in the browser. The MCP feeds structured feedback to the agent.
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
import type { ProjectManifest } from '../../runtime/types'

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

## Annotation flow (Agentation)

When you receive annotation feedback via the Agentation MCP:
1. Read the annotation — it includes CSS selectors, component names, and computed styles
2. Map the selector to the relevant component
3. Apply the requested changes to the component code
4. The canvas re-renders live via Vite HMR

## Skills

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-iterate`** — Create a new design iteration (page)
- **`/canvai-ship`** — Ship component to a production repo
