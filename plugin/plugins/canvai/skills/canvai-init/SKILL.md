---
name: canvai-init
description: Create a new design project and start designing
---

# /canvai-init <project-name>

Create a new design project inside Canvai and launch the dev environment.

## Steps

1. **Parse the project name** from the user's command (e.g. `/canvai-init button`). If no name is provided, ask for one.

2. **Check if canvai is installed.** Look for `package.json` in the current directory.
   - If no `package.json`: run `npm init -y && npm install github:madebynoam/canvai`
   - If `package.json` exists but no canvai dependency: run `npm install github:madebynoam/canvai`
   - If already installed: continue

3. **Scaffold the project.** Run:
   ```bash
   npx canvai init
   ```
   This creates `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, tsconfigs, and installs peer dependencies. It skips files that already exist.

4. **Create the project folder:**
   ```
   src/projects/<project-name>/
   ```

5. **Launch the dev server** in the background:
   ```bash
   npx canvai dev
   ```
   This starts both Vite and the annotation MCP in one command.

6. **Confirm:** "Project `<project-name>` is ready. Describe a component — I'll generate its variations and states as a matrix on the canvas."

## What happens next

After init, the designer describes a component (or attaches a sketch). The agent then:

1. **Identifies variations** — content scenarios, types, sizes (these become rows)
2. **Identifies states** — interaction phases, conditions (these become columns)
3. **Generates the component** — creates `<ComponentName>.tsx` in the project folder
4. **Generates the manifest** — creates `manifest.ts` with page V1 containing the full matrix of frames
5. **The canvas auto-discovers the manifest** and renders all frames

## Manifest format

```ts
import { MyComponent } from './MyComponent'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: '<project-name>',
  pages: [
    {
      name: 'V1 — Initial',
      grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
      frames: [
        { id: '<component>-<variation>-<state>', title: 'Component / Variation / State', component: MyComponent, props: { ... } },
      ],
    },
  ],
}

export default manifest
```

## Layout rules

- **Columns** = states, flowing left to right
- **Rows** = variations, flowing top to bottom
- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`
- The grid config in the manifest controls column width, row height, and gap
- The layout engine computes x/y positions — never set them manually
