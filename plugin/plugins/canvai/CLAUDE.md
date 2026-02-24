# Canvai — Agent Instructions

Canvai is a canvas for Claude Code design. An infinite, zoomable surface where every generation lives as a frame — visible side by side, comparable across iterations. The comparison surface is the product.

## Core tenets

1. **Many at once, not one at a time.** Generate 3+ distinct design directions simultaneously. Without multiple directions visible side by side, Canvai has no advantage over bare Claude Code.
2. **The code is the design.** Live React code, not mockups. What the designer sees runs.
3. **Point, don't describe.** Annotations carry selector, computed styles, and intent. No ambiguity survives the click.
4. **Proliferate before converging.** When a designer describes anything for the first time, generate multiple distinct directions — different bets, not states of the same idea.

## User workflow

1. `/canvai-new <name>` — create project, start dev server
2. Describe — agent generates multiple directions on the canvas
3. Annotate — designer clicks elements, types changes, clicks Apply
4. Iterate — designer clicks "New Iteration" for snapshot copies
5. `/canvai-share` — build and deploy to GitHub Pages

## Project structure

```
src/projects/<name>/
  v1/
    tokens.css          ← OKLCH custom properties (.iter-v1 scope)
    components/
      index.ts          ← barrel export
    pages/
  v2/                   ← literal copy of v1, then modified
  manifest.ts
  CHANGELOG.md
```

## Component hierarchy (mandatory)

```
Tokens (v<N>/tokens.css)     → CSS custom properties, all visual values
  ↓
Components (v<N>/components/) → use ONLY var(--token), can compose each other
  ↓
Pages (v<N>/pages/)           → import ONLY from ../components/
```

If a page needs a button, import `Button` from `../components/`. If it doesn't exist, create it in `components/` first. Never inline styled HTML in a page.

## Token system

Each iteration owns a complete token set scoped under `.iter-v<N>`. No cascade across iterations. First iteration includes `:root` fallbacks. **All colors in OKLCH — no hex.**

## Iterations

- Named **V1, V2, V3** — sequential, never descriptive. Include `description` field.
- Creating: freeze current (`frozen: true`), `cp -r v<N>/ v<N+1>/`, rename scope, add to manifest with `frozen: false`.
- Frozen iterations are immutable. No exceptions.
- No cross-iteration imports. Each `v<N>/` is self-contained.

## Before any edit (guard protocol)

1. **Read `manifest.ts`** — frozen? Stop.
2. **Hierarchy check** — pages import only from `../components/`. Components use only `var(--token)`.
3. **Check `components/index.ts`** — component exists? If not, create first.
4. **New components** — add to barrel AND to Components showcase page.
5. **Log to `CHANGELOG.md`**.
6. **Auto-commit** — `resolve_annotation` auto-stages and commits. No manual git needed.

## Design directions

All directions on a single "All Directions" manifest page. Use `DirectionLabel` as first frame per row in N+1 column grid (1 label + N states). Each direction makes a genuinely different design bet.

Once chosen, generate all meaningful **variations × states** as frames. Columns = states, Rows = variations. Frame IDs: `<component>-<variation>-<state>`.

## Standard frame widths

Desktop: `1440` · Tablet: `768` · Mobile: `390`

## Mandatory pages

- **Tokens** — color swatches (using `TokenSwatch` from `canvai/runtime`), typography, spacing
- **Components** — all building blocks with variations and states

### TokenSwatch

```tsx
import { TokenSwatch } from 'canvai/runtime'
<TokenSwatch color="var(--chrome)" label="chrome" sublabel="oklch(0.952 0.003 80)"
  oklch={{ l: 0.952, c: 0.003, h: 80 }} tokenPath="--chrome" />
```

## Interactive navigation

Components with internal navigation (tabs, sidebar) use React state inside one component. Don't split into separate frames — navigation must work.

## Design language

Braun / Jony Ive aesthetic. For full palette tables, typography scale, spacing, border radius, spring presets, and feature inventory, see `DESIGN-REFERENCE.md`.

**Key rules:**
- All colors OKLCH. No hex values.
- 4px spacing grid (font sizes exempt).
- One accent hue. Shell is achromatic (c <= 0.003).
- `cursor: default` for shell UI.
- `text-wrap: pretty` on all text.
- Components must be interactive — inputs typeable, menus openable.
- Icons: Lucide React, `strokeWidth={1.5}`. Sizes: 16/14/12px.
- Motion: spring physics, not CSS durations. Never `ease-in-out`.

### Feature inventory rule

If a designer asks for a feature not in the inventory (see `DESIGN-REFERENCE.md`), say: "That feature doesn't exist in Canvai yet. Would you like to design it as a new component instead?"

## Annotation flow

```
draft → pending → resolved
(Save)   (Apply)   (agent done)
```

Drafts created on Save, visible in TopBar dropdown. "Apply" promotes to pending — only then does the agent receive them. Immediate annotations (`type: 'iteration'`, `type: 'project'`) skip draft stage.

### Processing annotations

1. Read `frameId`, `componentName`, `selector`, `comment`, `computedStyles`
2. Follow guard protocol
3. Map to file in `v<N>/components/` or `v<N>/pages/`
4. **Route visual changes through tokens** — find/create semantic token in `tokens.css`, never hardcode values
5. `resolve_annotation` with annotation ID (auto-commits)
6. Log to `CHANGELOG.md`

### Processing project annotations (`type: 'project'`)

Parse JSON comment `{ name, description, prompt }`, create project folder, generate initial design if prompted, resolve.

## Skills

- `/canvai-new <name>` — Create project and start designing
- `/canvai-design` — Start dev server and watch mode
- `/canvai-share` — Build and deploy to GitHub Pages
- `/canvai-close` — Stop dev servers
- `/canvai-update` — Update canvai
