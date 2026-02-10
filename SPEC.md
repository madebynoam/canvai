# Canvai

A design studio on an infinite canvas where every design is live React code.

Canvai gives designers a Figma-like infinite canvas where every iteration is code from the start. Pair it with Claude Code and Agentation, and the full design loop (concept, iteration, review, production) happens without switching tools or translating formats.

## Architecture

Canvai is two pieces in one repo:

- **npm package** (`src/runtime/`, `src/vite-plugin/`, `src/cli/`) — the canvas runtime, manifest auto-discovery, and `canvai dev` CLI
- **Claude Code plugin** (`plugin/`) — skills, Agentation MCP config, and agent instructions

The designer's repo only contains `src/projects/` with components and manifests. Everything else comes from the package.

## How it works

1. **`/canvai-init button`** — Creates a project, installs canvai, starts dev server + Agentation MCP
2. **Describe** — Tell the agent what to build. It generates a component + manifest with every variation × state as a grid
3. **Annotate** — Use Agentation in the browser. The MCP feeds structured feedback to the agent
4. **`/canvai-iterate`** — Creates a new page (version) in the manifest. Old versions stay frozen
5. **`/canvai-ship`** — PR the finished components to a production repo

## What's in the box

### Runtime (`src/runtime/`)
- `Canvas.tsx` — infinite canvas with pan, zoom (native event listeners, zero React renders during gestures)
- `Frame.tsx` — draggable frame, hug-fits content
- `useFrames.ts` — frame registry with page-switch sync
- `layout.ts` — computes grid positions from manifest frames
- `PageTabs.tsx` — segmented page tab navigation
- `ProjectSidebar.tsx` — collapsible project list sidebar
- `types.ts` — CanvasFrame, ManifestFrame, PageManifest, ProjectManifest

### Vite Plugin (`src/vite-plugin/`)
- Auto-discovers `src/projects/*/manifest.ts`
- Generates virtual module (`virtual:canvai-manifests`) with all project manifests
- Watches for new/removed manifests and triggers HMR

### CLI (`src/cli/`)
- `canvai dev` — starts Vite + Agentation MCP in one process

### Plugin (`plugin/`)
- Skills: `/canvai-init`, `/canvai-iterate`, `/canvai-ship`
- MCP config for Agentation
- CLAUDE.md agent instructions for manifest workflow

## The manifest

Each project declares its frames in a `manifest.ts`:

```ts
const manifest: ProjectManifest = {
  project: 'button',
  pages: [
    {
      name: 'V1 — Initial',
      grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
      frames: [
        { id: 'btn-primary-default', title: 'Button / Primary / Default', component: Button, props: { variant: 'primary' } },
      ],
    },
  ],
}
```

Pages are iterations. `/canvai-iterate` adds a new page. The canvas shows tabs to switch between them.

## The canvas

- **Zoom** — Ctrl/Cmd+scroll, proportional to deltaY (Figma-style precision)
- **Pan** — scroll or click+drag on background, direct DOM writes via native listeners
- **Keyboard** — Cmd+Plus/Minus for zoom, Cmd+0 to fit all
- **Default cursor** — trackpad panning like Figma, no grab cursor

## Stack

- React + Vite
- Custom canvas component (no dependencies)
- Agentation MCP
- Claude Code plugin (skills + MCP)

## Reference

- Pan/zoom implementation adapted from [WPUI Lab ProjectCanvas](https://github.com/madebynoam/WPUI-Lab)
- Annotation layer powered by [Agentation](https://agentation.dev)
