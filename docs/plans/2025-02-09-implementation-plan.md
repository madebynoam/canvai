# Implementation Plan: Canvai as Package + Plugin

## Goal

Restructure Canvai from a single-repo app into:
- An **npm package** (installable from GitHub) providing the canvas runtime + CLI
- A **Claude Code plugin** (same repo, `plugin/` folder) providing skills + MCP config

The designer's repo becomes lightweight — just `src/projects/` with components and manifests.

## Current State → Target State

### Current
```
canvai/                     ← one repo, the app IS the repo
  src/app/                  ← canvas runtime (Canvas, Frame, etc.)
  src/projects/             ← design work
  src/App.tsx               ← manual frame wiring
  index.html                ← Vite entry
  vite.config.ts            ← standard Vite config
  .claude/skills/           ← skills live in the app repo
  .mcp.json                 ← Agentation config in the app repo
```

### Target
```
canvai/                     ← the package repo (madebynoam/canvai)
  src/
    runtime/                ← canvas runtime (exported as library)
      Canvas.tsx
      Frame.tsx
      useFrames.ts
      types.ts
      PageTabs.tsx          ← NEW: page tab navigation
      ProjectSidebar.tsx    ← NEW: project list sidebar
    vite-plugin/            ← NEW: auto-discovers manifests
      index.ts
    cli/                    ← NEW: `canvai dev` command
      index.ts
    template/               ← NEW: files scaffolded by /canvai-init
      index.html
      main.tsx
      App.tsx               ← auto-wiring, reads manifests
  plugin/                   ← NEW: Claude Code plugin
    plugin.json
    CLAUDE.md               ← agent instructions
    skills/
      canvai-init/SKILL.md
      canvai-iterate/SKILL.md
      canvai-ship/SKILL.md
    .mcp.json               ← Agentation config
  package.json              ← bin: { canvai: "./src/cli/index.ts" }
```

### Designer's repo (after /canvai-init)
```
my-designs/
  package.json              ← { "dependencies": { "canvai": "github:madebynoam/canvai" } }
  src/projects/
    button/
      Button.tsx
      manifest.ts
```

That's it. No index.html, no vite.config, no App.tsx, no .claude/ folder.

---

## Implementation Steps

### Phase 1: Restructure the runtime (no new features, just move files)

1. **Move `src/app/` → `src/runtime/`**
   - Canvas.tsx, Frame.tsx, useFrames.ts, types.ts
   - Update all imports

2. **Add package exports to `package.json`**
   ```json
   {
     "exports": {
       "./runtime": "./src/runtime/index.ts"
     },
     "bin": {
       "canvai": "./src/cli/index.ts"
     }
   }
   ```

3. **Create `src/runtime/index.ts`** — barrel export
   ```ts
   export { Canvas } from './Canvas'
   export { Frame } from './Frame'
   export { useFrames } from './useFrames'
   export type { CanvasFrame } from './types'
   ```

### Phase 2: Manifest system

4. **Define the manifest format** — `src/runtime/manifest.ts`
   ```ts
   export interface PageManifest {
     name: string
     frames: CanvasFrame[]
   }
   export interface ProjectManifest {
     project: string
     pages: PageManifest[]
   }
   ```

5. **Create Vite plugin** — `src/vite-plugin/index.ts`
   - Watches `src/projects/*/manifest.ts`
   - Generates a virtual module that imports and re-exports all manifests
   - On file change, triggers HMR

6. **Create auto-wiring App.tsx** — `src/template/App.tsx`
   - Imports all manifests via the virtual module
   - Renders project sidebar + page tabs + canvas with frames from active page
   - No manual frame arrays

### Phase 3: Pages UI

7. **Build `PageTabs.tsx`** — tab bar above the canvas
   - Shows pages for the active project
   - Click to switch, active tab highlighted
   - Sits outside the canvas transform (fixed position)

8. **Build `ProjectSidebar.tsx`** — left sidebar
   - Lists all projects discovered from manifests
   - Click to switch active project
   - Collapsible

### Phase 4: CLI

9. **Build `canvai dev`** — `src/cli/index.ts`
   - Starts Vite with the canvai Vite plugin
   - Starts Agentation MCP server
   - Both in one process, one command
   - Opens browser

10. **Build `canvai init`** (optional, since the plugin skill does this)
    - Scaffolds `package.json` + `src/projects/` in current directory
    - Installs canvai as dependency

### Phase 5: Plugin

11. **Create `plugin/plugin.json`**
    ```json
    {
      "name": "canvai",
      "description": "Design studio — infinite canvas with live React code",
      "skills": "./skills",
      "mcpServers": "./.mcp.json"
    }
    ```

12. **Move and update skills**
    - `/canvai-init` — scaffolds project, runs `canvai dev`
    - `/canvai-iterate` — adds a new page to the manifest
    - `/canvai-ship` — copies component to target repo, opens PR

13. **Write new CLAUDE.md** — agent instructions for the manifest-based workflow

### Phase 6: Migration

14. **Move existing projects** — `agency-expertise/` and `test-tabs/` become examples with manifests
15. **Update docs**
16. **Test end-to-end** — fresh folder, install plugin, `/canvai-init`, describe, annotate, iterate

---

## What We're NOT Building Yet

- npm registry publishing (install from GitHub is fine)
- Theme system or design tokens
- Multi-designer collaboration (git branches handle this)
- Component library export (ship step is manual for now)

---

## Risk / Open Questions

1. **Vite plugin complexity** — auto-discovering manifests and generating virtual modules is non-trivial. May need to start simpler (convention-based file scanning without a virtual module).

2. **Plugin installation from subdirectory** — need to verify `claude plugin add github:madebynoam/canvai/plugin` works. If not, plugin may need its own repo or a different install path.

3. **Template files** — the App.tsx / index.html / main.tsx that the designer's repo needs. Are these served from node_modules or scaffolded on init? Serving from node_modules is cleaner (like Next.js) but requires the Vite plugin to handle entry points.

4. **HMR with manifests** — when the agent adds a frame to a manifest, does Vite hot-reload correctly? Needs testing.
