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

4. **Create the project folder with primitives + iterations structure:**
   ```
   src/projects/<project-name>/
     primitives/
       tokens.css
       index.ts
     iterations/
       v1/
         tokens.css
         index.ts
     manifest.ts
     CHANGELOG.md
   ```

5. **Launch the dev server** in the background:
   ```bash
   npx canvai dev
   ```
   This starts both Vite and the annotation MCP in one command.

6. **Ask about motion:**
   - "Does this project need interactive motion (spring-animated buttons, toggles, reveals)?"
   - **Yes, spring physics** → copy `spring.ts` into `primitives/`, add to `primitives/index.ts`
   - **Yes, CSS transitions** → no extra files needed, note in CHANGELOG that project uses CSS transitions
   - **No motion** → skip, note in CHANGELOG that project is static

   Motion can always be added later — copy `spring.ts` from the archive or another project.

7. **Confirm:** "Project `<project-name>` is ready. Describe a component -- I'll generate its variations and states as a matrix on the canvas."

## What happens next

After scaffolding, the project has the following foundation files:

- **`primitives/tokens.css`** -- CSS custom properties defining the OKLCH base palette, spacing grid, radius tiers, and type scale. Every primitive references these via `var(--token-name)`.
- **`primitives/index.ts`** -- Barrel export and component index. Auto-maintained by the agent: each line is a comment with component name, description, and file path.
- **`primitives/spring.ts`** (optional) -- Spring physics engine with golden-ratio-derived presets (`snappy`, `gentle`, `soft`) and a `useSpring` hook for direct-DOM animation. Only present if the designer chose spring physics at init time.
- **`iterations/v1/tokens.css`** -- Iteration-scoped token overrides. Starts empty (inherits everything from base). Frozen iterations pin their visual expression here.
- **`iterations/v1/index.ts`** -- Variation index for V1. Auto-maintained: each line lists the variation name, description, and file path.

When the designer describes a component, the agent then:

1. **Identifies variations** -- content scenarios, types, sizes (these become rows)
2. **Identifies states** -- interaction phases, conditions (these become columns)
3. **Creates shared primitives** -- reusable atoms (Button, Avatar, Label, etc.) go in `primitives/`
4. **Creates variations** -- each variation is a single file in `iterations/v1/`
5. **Generates the manifest** -- creates `manifest.ts` with iteration V1 containing the full matrix of frames
6. **The canvas auto-discovers the manifest** and renders all frames

## Project structure

```
src/projects/<project-name>/
  primitives/
    tokens.css          <- CSS custom properties (OKLCH base tokens)
    spring.ts           <- spring physics engine (if motion chosen)
    Button.tsx          <- shared button primitive
    index.ts            <- barrel export
  iterations/
    v1/
      tokens.css        <- iteration-scoped overrides (empty = inherit)
      index.ts          <- variation exports
      <variation>.tsx   <- design variations
  manifest.ts
  CHANGELOG.md
```

**Key rules:**
- **Primitives are shared.** Every iteration imports from `primitives/`. No copy-pasting atoms between variations.
- **One file per variation.** Each variation lives in its own `.tsx` file inside the iteration folder.
- **Tokens cascade.** `primitives/tokens.css` is the base. `iterations/v1/tokens.css` overrides only what it needs to pin. Unoverridden tokens float with the base.
- **Frozen iterations are read-only.** Check `frozen` in the manifest before editing any iteration folder.

## Manifest format

```ts
import './primitives/tokens.css'
import './iterations/v1/tokens.css'
import { MyComponent } from './iterations/v1/MyComponent'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: '<project-name>',
  iterations: [
    {
      name: 'V1',
      frozen: false,
      pages: [
        {
          name: 'Initial',
          grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
          frames: [
            { id: '<component>-<variation>-<state>', title: 'Component / Variation / State', component: MyComponent, props: { ... } },
          ],
        },
      ],
    },
  ],
}

export default manifest
```

**Notes:**
- Both CSS imports are at the top -- base tokens first, then iteration overrides
- Each iteration has a `frozen` field (`false` for active, `true` for frozen)
- Pages are nested inside iterations, not at the top level

## Layout rules

- **Columns** = states, flowing left to right
- **Rows** = variations, flowing top to bottom
- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`
- The grid config in the manifest controls column width, row height, and gap
- The layout engine computes x/y positions -- never set them manually
