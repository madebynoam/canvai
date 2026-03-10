---
name: bryllen-new
description: Create a new design project and start designing
---

# /bryllen-new <project-name>

Create a new design project inside Bryllen and launch the dev environment.

## Steps

1. **Parse the command.** The format is `/bryllen-new <project-name> [description]`.
   - If both name AND description are provided: proceed to step 2
   - If only name is provided (no description/prompt): **Use AskUserQuestion** to ask "What would you like to design?" with example options like "Dashboard", "Landing page", "Mobile app", "Component library". Use their response as the description and proceed.
   - If no name provided: **Use AskUserQuestion** to ask for a project name first, then ask what they want to design.

2. **Initialize git** — check for a `.git` directory in the current folder.
   - If missing: run `git init`
   - If already a repo: continue

3. **Create `.gitignore`** — check if `.gitignore` exists.
   - If missing: create it with this content:
     ```
     node_modules
     dist
     .DS_Store
     *.local
     .bryllen
     ```
   - If exists: leave it alone

4. **Check if bryllen is installed.** Look for `package.json` in the current directory.
   - If no `package.json`: run `npm init -y && npm install github:madebynoam/bryllen`
   - If `package.json` exists but no bryllen dependency: run `npm install github:madebynoam/bryllen`
   - If already installed: continue

   If `npm install` fails, stop immediately and tell the user what went wrong. Do not proceed to step 5.

5. **Scaffold the project.** Run:
   ```bash
   npx bryllen new
   ```
   This creates `index.html`, `vite.config.ts`, `src/App.tsx`, `src/main.tsx`, `CLAUDE.md` (project rules), `.claude/settings.json` (frozen guard hook), tsconfigs, and installs peer dependencies. Files that already exist are skipped.

6. **Create the project folder structure:**
   ```
   src/projects/<project-name>/
     v1/
       tokens.css             ← OKLCH custom properties (.iter-v1 + :root scope)
       components/
         index.ts             ← barrel export — add every new component here when you create it
       pages/                 ← empty initially
       context/               ← inspiration images (designer pastes via Cmd+V)
     manifest.ts
     CHANGELOG.md
   ```

7. **Initial commit:** Create a git commit with the scaffolded project:
   ```bash
   git add . && git commit -m 'feat: init <project-name> project'
   ```
   This captures the scaffold. A second commit will follow after the design is generated in the 'What happens next' sequence.

8. **Launch the dev server:**
   ```bash
   npx bryllen design
   ```
   This starts both Vite and the annotation HTTP server in one command.

9. **Confirm:** Tell the designer the canvas is ready:
   > "Project `<project-name>` is live at http://localhost:5173"

10. **Continue immediately** with the **What happens next** sequence below to generate the initial design. After generating, **enter watch mode automatically** so the designer can annotate without running any commands.

## What happens next

After init, the designer describes what they want. The agent follows this exact sequence — **order matters**:

0. **Check for context images** — Run `npx bryllen context --project <name> --iteration v1` to see if the designer pasted any inspiration images. If present, read them via the Read tool and analyze via Vision. Incorporate their style into the design directions.

1. **GENERATE 3-5 DESIGN DIRECTIONS (MANDATORY)** — This is the whole point of Bryllen. Before writing any code:
   - Brainstorm 3-5 **genuinely different** design approaches
   - "Genuinely different" means different in **layout, hierarchy, interaction pattern, or information density** — NOT just color or font variations
   - Examples of genuinely different:
     - Dashboard: card grid vs. data table vs. sidebar+detail vs. timeline view
     - Landing page: hero-first vs. feature grid vs. testimonial-led vs. interactive demo
     - Component: horizontal pills vs. vertical list vs. icon grid vs. dropdown
   - **NOT genuinely different:** same layout with different colors, same hierarchy with different fonts
   - Add each direction component to `manifest.components`, then register frames via `POST /frames`
   - Each direction gets its own row (use `DirectionLabel` as first frame, then the direction's frames)
   - The designer will pick one — only then do you build out variations/states

2. **Populate tokens** — Write the complete OKLCH token set in `v1/tokens.css`, scoped under `:root, .iter-v1`. Derive colors from the OKLCH palette defined in CLAUDE.md. If context images are present, extract colors from them. Every visual value (color, background, border, shadow) must be a CSS custom property. No hex values.

3. **Create components for ALL directions** — build each component in `v1/components/`. Components use ONLY `var(--token)` for visual values — no hardcoded colors, sizes, or spacing. Export every component from `v1/components/index.ts`.

4. **Create pages** — pages in `v1/pages/` that compose components. Pages import ONLY from `../components/` — never inline styled HTML. Three pages are **mandatory**:
   - **All Directions page** — shows all 3-5 design directions side by side. This is the FIRST thing the designer sees.
   - **Tokens page** — renders color swatches using `TokenSwatch` from `bryllen/runtime`, typography scale, and spacing grid.
   - **Components page** — shows all building blocks individually.

5. **Update the manifest** — The scaffold already created `manifest.ts` with `components: {}`. Add each component to the `components` map (key = component name, value = imported component). Import `./v1/tokens.css` at the top. Then register frames via the HTTP API (see Manifest format below).

6. **Log to CHANGELOG.md** — record the design directions and why each is different

7. **The canvas auto-discovers the manifest** and renders all frames — designer sees all directions at once

8. **Enter watch mode** — run `npx bryllen watch` to start listening for designer annotations. This is critical — the designer should be able to click and annotate immediately without running any commands.

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

This is the whole point of Bryllen — the code IS the design. Every component must work:
- Text inputs are typeable
- Buttons have hover and active states
- Menus open on click and dismiss on outside click
- Tabs and navigation switch content via React state

No static mockups. If it looks like it should do something, it does.

## Interactive navigation

If a component has internal navigation (tabs, sidebar nav, segmented sections), handle it with **React state inside one component**. Do not split navigable sections into separate frames.

The matrix model (variations × states as separate frames) is for isolated component states. For a dashboard with sidebar nav, build one interactive component that actually swaps content on click — don't create separate frames for each nav section. That produces static snapshots where nothing is clickable, which defeats the purpose.

**Rule:** If a page has internal navigation, the navigation must work. Use `useState` to track the active section and render the correct content. One frame, one component, full interactivity.

## Manifest format (DB mode)

The manifest only maps component keys to React components. Frame metadata (title, width, height, order) lives in SQLite.

```ts
import type { ProjectManifest } from 'bryllen/runtime'
import './v1/tokens.css'
import { TokensPage } from './v1/pages/tokens'
import { ComponentsPage } from './v1/pages/components'
import { DirA } from './v1/pages/DirA'
import { DirB } from './v1/pages/DirB'

const manifest: ProjectManifest = {
  id: '<uuid>',
  project: '<project-name>',
  components: {
    TokensPage,
    ComponentsPage,
    DirA,
    DirB,
  },
}

export default manifest
```

After adding components to the manifest, register frames via HTTP:

```bash
# Register each frame (canvas picks it up via SSE — no reload needed)
curl -X POST http://localhost:4748/frames -H 'Content-Type: application/json' \
  -d '{"project":"<project-name>","id":"dir-a","title":"Direction A","componentKey":"DirA","width":1440,"height":900}'

curl -X POST http://localhost:4748/frames -H 'Content-Type: application/json' \
  -d '{"project":"<project-name>","id":"tok-colors","title":"Tokens / Colors","componentKey":"TokensPage","width":240,"height":200,"props":{"section":"colors"}}'
```

**CRITICAL:** The `componentKey` in the POST must match the key in `manifest.components`.

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
