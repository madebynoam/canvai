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
   This creates `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `CLAUDE.md` (project rules), `.claude/settings.json` (frozen guard hook), tsconfigs, and installs peer dependencies. It skips files that already exist.

4. **Create the project folder structure:**
   ```
   src/projects/<project-name>/
     v1/
       tokens.css             ← OKLCH custom properties (.iter-v1 + :root scope)
       components/
         index.ts             ← barrel export (empty initially)
       pages/                 ← empty initially
       spring.ts              ← if motion is needed (copy from canvai template)
     manifest.ts
     CHANGELOG.md
   ```

5. **Launch the dev server** in the background:
   ```bash
   npx canvai dev
   ```
   This starts both Vite and the annotation MCP in one command.

6. **Initial commit:** Create a git commit with the scaffolded project:
   ```bash
   git add . && git commit -m 'feat: init <project-name> project'
   ```

7. **Confirm:** "Project `<project-name>` is ready. Describe a component — I'll generate its variations and states as a matrix on the canvas."

## What happens next

After init, the designer describes a component (or attaches a sketch). The agent follows this exact sequence — **order matters**:

1. **Populate tokens** — Write the complete OKLCH token set in `v1/tokens.css`, scoped under `:root, .iter-v1`. Derive colors from the OKLCH palette defined in CLAUDE.md. Every visual value (color, background, border, shadow) must be a CSS custom property. No hex values.
2. **Identify variations** — content scenarios, types, sizes (these become rows in the matrix)
3. **Identify states** — interaction phases, conditions (these become columns in the matrix)
4. **Create components** — build each component in `v1/components/`. Components use ONLY `var(--token)` for visual values — no hardcoded colors, sizes, or spacing. Export every component from `v1/components/index.ts`.
5. **Create pages** — pages in `v1/pages/` that compose components. Pages import ONLY from `../components/` — never inline styled HTML. Two pages are **mandatory**:
   - **Tokens page** — renders color swatches using `TokenSwatch` from `canvai/runtime` (click to open OKLCH picker, live preview, annotations on apply), typography scale, and spacing grid from `tokens.css`. This makes the token system visible and editable on the canvas.
   - **Components page** — shows all building blocks individually with their variations and states.
6. **Generate the manifest** — `manifest.ts` with iteration `name: 'V1'` containing all pages. Import `./v1/tokens.css` at the top. Iterations are always named V1, V2, V3 — sequential, never descriptive names.
7. **Log to CHANGELOG.md** — record the initial design decisions and component inventory
8. **The canvas auto-discovers the manifest** and renders all frames

The full token system, design language, component hierarchy, and guard protocol are defined in CLAUDE.md — those rules apply to every file the agent creates.

## Component hierarchy

The agent MUST follow the three-layer hierarchy:

```
Tokens (v1/tokens.css)      → CSS custom properties, all visual values
  ↓
Components (v1/components/)  → building blocks, use ONLY tokens
  ↓
Pages (v1/pages/)            → compositions, import ONLY from ../components/
```

If a page needs a button, create `Button.tsx` in `components/` FIRST, then import it in the page. Never inline styled HTML in page files.

## Components must be interactive

This is the whole point of Canvai — the code IS the design. Every component must work:
- Text inputs are typeable
- Buttons have hover and active states
- Menus open on click and dismiss on outside click
- Tabs and navigation switch content via React state

No static mockups. If it looks like it should do something, it does.

## Interactive navigation

If a component has internal navigation (tabs, sidebar nav, segmented sections), handle it with **React state inside one component**. Do not split navigable sections into separate frames.

The matrix model (variations × states as separate frames) is for isolated component states. For a dashboard with sidebar nav, build one interactive component that actually swaps content on click — don't create separate frames for each nav section. That produces static snapshots where nothing is clickable, which defeats the purpose.

**Rule:** If a page has internal navigation, the navigation must work. Use `useState` to track the active section and render the correct content. One frame, one component, full interactivity.

## Manifest format

```ts
import type { ProjectManifest } from 'canvai/runtime'
import './v1/tokens.css'
import { TokensPage } from './v1/pages/tokens'
import { ComponentsPage } from './v1/pages/components'
import { MainPage } from './v1/pages/main'

const manifest: ProjectManifest = {
  project: '<project-name>',
  iterations: [
    {
      name: 'V1',
      frozen: false,
      pages: [
        {
          name: 'Tokens',
          grid: { columns: 4, columnWidth: 240, rowHeight: 200, gap: 40 },
          frames: [
            { id: 'v1-tok-colors', title: 'Tokens / Colors', component: TokensPage, props: { section: 'colors' } },
            { id: 'v1-tok-type', title: 'Tokens / Typography', component: TokensPage, props: { section: 'typography' } },
            { id: 'v1-tok-spacing', title: 'Tokens / Spacing', component: TokensPage, props: { section: 'spacing' } },
            { id: 'v1-tok-radii', title: 'Tokens / Radii', component: TokensPage, props: { section: 'radii' } },
          ],
        },
        {
          name: 'Components',
          grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
          frames: [
            { id: 'v1-btn-primary', title: 'Button / Primary / Default', component: ComponentsPage, props: { variant: 'primary' } },
          ],
        },
        {
          name: 'Main',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-main', title: 'Main Composition', component: MainPage },
          ],
        },
      ],
    },
  ],
}

export default manifest
```

## Spring module

If the designer wants motion, create `v1/spring.ts` with golden ratio spring physics:

```ts
import { useRef, useEffect, useCallback } from 'react'

export const PHI = (1 + Math.sqrt(5)) / 2

export const SPRING = {
  snappy: { tension: 233, friction: 19 },
  gentle: { tension: 144, friction: 15 },
  soft: { tension: 89, friction: 12 },
}

// ... useSpring hook (fixed-timestep 120Hz physics)
```

Components import spring as `import { SPRING, useSpring } from '../spring'`.

## Layout rules

- **Columns** = states, flowing left to right
- **Rows** = variations, flowing top to bottom
- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`
- The grid config in the manifest controls column width, row height, and gap
- The layout engine computes x/y positions — never set them manually
