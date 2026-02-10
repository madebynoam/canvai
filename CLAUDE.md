# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates with Agentation to iterate, and the final code gets PR'd to a production repo.

## Architecture

Canvai has two pieces:
- **npm package** — the canvas runtime, Vite plugin, and CLI (`canvai dev`)
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

When the designer describes a component, think through its **variations** and **states**, then generate all meaningful combinations as frames.

- **Columns** = states (Default, Hover, Active, Disabled)
- **Rows** = variations (Short text, Long text, With icon, Error)
- Set `grid.columns` to match the number of states
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

## Commands

- `npx canvai dev` — start dev server + Agentation MCP
