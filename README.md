# Canvai

A design studio on an infinite canvas where every design is live React code. Describe what you want, the agent builds it on the canvas, annotate with [Agentation](https://github.com/madebynoam/agentation) to iterate, and ship the final code to a production repo.

## Quick start

### 1. Install the Claude Code plugin

```bash
claude plugin add --from github:madebynoam/canvai/plugin
```

### 2. Create a project

Open Claude Code in any directory and run:

```
/canvai-init my-component
```

This will:
- Install canvai and dependencies
- Scaffold the project files (`index.html`, `vite.config.ts`, `App.tsx`, etc.)
- Start the dev server with live canvas + annotation MCP

### 3. Describe your component

Tell the agent what to build. It generates a React component with all meaningful variations and states laid out as a matrix on the canvas:

- **Columns** = states (Default, Hover, Active, Disabled)
- **Rows** = variations (Short text, Long text, With icon, Error)

### 4. Annotate and iterate

Click elements in the browser to annotate them with feedback. The agent receives structured annotations via MCP and updates the component live.

Run `/canvai-iterate` to create a new version (page) while keeping previous iterations frozen.

### 5. Ship

Run `/canvai-ship` to PR the finished component to a production repo.

## CLI

```bash
npx canvai init    # Scaffold project files and install dependencies
npx canvai dev     # Start Vite dev server + Agentation MCP
```

## Project structure

Each design project lives in `src/projects/<name>/`:

```
src/projects/
  my-component/
    MyComponent.tsx   # The React component
    manifest.ts       # Pages and frames (auto-discovered by the canvas)
```

The manifest declares which component variations to render:

```ts
import { MyComponent } from './MyComponent'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: 'my-component',
  pages: [
    {
      name: 'V1 — Initial',
      grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
      frames: [
        { id: 'my-component-short-default', title: 'MyComponent / Short / Default', component: MyComponent, props: { text: 'Click' } },
        { id: 'my-component-short-hover', title: 'MyComponent / Short / Hover', component: MyComponent, props: { text: 'Click', state: 'hover' } },
      ],
    },
  ],
}

export default manifest
```

## Architecture

- **npm package** — canvas runtime, Vite plugin, and CLI (`canvai init`, `canvai dev`)
- **Claude Code plugin** — skills (`/canvai-init`, `/canvai-iterate`, `/canvai-ship`), MCP config, and agent instructions
