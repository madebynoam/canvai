# Canvai — Agent Instructions

Canvai is a design thinking space. An infinite canvas where the designer directs and the agent generates — many variations, many directions, fast. The underlying format is live React code (not a proprietary tree), so ideas move freely from exploration to production. The designer describes, reacts, annotates, and refines. The agent does the hand-work.

## Tenets

Tenets are decision-making tools — each names the alternative and rejects it.

1. **The code is the design.** Not a mockup. Not a proprietary format. The thing on the canvas runs — what the designer sees is live, not a simulation. Because the format is code, shipping to production is a command, not a project. The canvas is exploration space first, production pipeline second.
2. **One component, infinite states.** Not an app. Not a page. Canvai renders every variation and state of a single component on one canvas — the matrix is the design artifact. Completeness is visible at a glance.
3. **Point, don't describe.** Not a ticket. Not a meeting. The designer clicks the element, types the change, and the agent applies it. The annotation carries the selector, the computed styles, and the intent. No ambiguity survives the click.
4. **The agent never waits.** Not a sprint. Not a queue. Every annotation resolves in the same session. The feedback loop is measured in seconds, not days. Speed is not a feature — it is the product.
5. **The canvas is the only meeting room.** Not Slack. Not Figma comments. Every decision is made on the canvas, visible in the changelog, and shipped from the same place it was designed. Context never leaves the surface it was created on.
6. **Proliferate before converging.** Not one option. Not a single interpretation. When a designer describes anything for the first time, generate multiple distinct design directions — different bets, not just different states of the same idea. The canvas has infinite room; use it. The designer's job is to react and select, not to specify every detail upfront. Three directions minimum on first pass.

## User workflow

1. **`/canvai-init <project-name>`** — Creates a new design project, installs canvai if needed, starts the dev server + annotation MCP.
2. **Describe** — The designer describes the component (or attaches a sketch). The agent generates **multiple distinct design directions** — not just one version with states, but several different design bets shown simultaneously on the canvas. The designer reacts visually and picks a direction (or mixes elements). Then refine from there.
3. **Annotate** — The designer clicks "Annotate" on the canvas, selects an element, types a comment, and clicks "Apply". The annotation is pushed to the agent automatically via the MCP watch loop.
4. **`/canvai-iterate`** — Creates a new iteration (complete snapshot copy). Old iterations are frozen.
5. **`/canvai-ship`** — PR the finished components to a production codebase.

## Project structure

Each project uses **snapshot iterations** — every iteration is a complete, self-contained folder. No shared state across iterations.

```
src/projects/<project-name>/
  v1/                        ← complete snapshot (the active iteration)
    tokens.css               ← OKLCH custom properties (.iter-v1 scope)
    components/              ← building blocks
      index.ts               ← barrel export
      Button.tsx, Input.tsx, Form.tsx...
    pages/                   ← compositions (import ONLY from ../components/)
      settings.tsx, shell.tsx...
    spring.ts                ← optional, per iteration
  v2/                        ← literal copy of v1, then modified
    tokens.css
    components/
    pages/
    spring.ts
  manifest.ts                ← declares iterations, pages, frames
  CHANGELOG.md               ← running record of design decisions
```

## Component hierarchy (mandatory)

Three layers, strict dependency direction:

```
Tokens (v<N>/tokens.css)     → CSS custom properties, all visual values
  ↓
Components (v<N>/components/) → building blocks, use ONLY tokens, can compose each other
  ↓
Pages (v<N>/pages/)           → compositions, import ONLY from ../components/
```

| Layer | Location | Rule |
|-------|----------|------|
| Tokens | `v<N>/tokens.css` | All visual values. OKLCH only. Scoped to `.iter-v<N>`. |
| Components | `v<N>/components/` | Use ONLY `var(--token)`. Can compose other components. |
| Pages | `v<N>/pages/` | Import ONLY from `../components/`. No raw styled HTML. |

### The rule

If a page needs a button, it imports `Button` from `../components/`. If `Button` doesn't exist yet, create it in `components/` FIRST, then use it in the page. Never inline a styled `<button>` in a page file.

Components can compose other components. `Form` imports `Button` + `Input`. All flat in `components/`. No nesting, no atomic classification.

### Components barrel export

Every component in `v<N>/components/` must be re-exported from `v<N>/components/index.ts`. Pages import from the barrel:

```ts
import { Button, Input, Avatar } from '../components'
```

## Token system

Each iteration owns its complete token set, scoped under `.iter-v<N>`. No cascade across iterations. The first iteration also includes `:root` fallbacks.

```css
/* v1/tokens.css */
:root,
.iter-v1 {
  --surface: oklch(0.995 0 0);
  --chrome: oklch(0.952 0.003 80);
  --text-primary: oklch(0.180 0.005 80);
  --accent: oklch(0.52 0.14 155);
  /* ... complete set ... */
}
```

```css
/* v2/tokens.css — completely standalone */
.iter-v2 {
  --surface: oklch(0.993 0.003 80);
  --chrome: oklch(0.940 0.005 80);
  --text-primary: oklch(0.200 0.005 80);
  --accent: oklch(0.55 0.16 28);
  /* ... complete set ... */
}
```

Rules:
- **All colors in OKLCH.** Never introduce a raw hex value.
- Every iteration has the COMPLETE token set — no inheriting from a base.
- Scope class `.iter-v<N>` is applied by the canvas frame wrapper.

## Iteration model

### Naming

Iterations are always named **V1, V2, V3, ...** — sequential, uppercase V + number. Never use descriptive names, dates, or any other format. The folder is `v1/`, `v2/`, etc. (lowercase). The manifest `name` is `'V1'`, `'V2'`, etc. (uppercase).

### Creating iterations (`/canvai-iterate`)

1. Freeze the current iteration in the manifest (`frozen: true`)
2. **Literal folder copy:** `cp -r v<N>/ v<N+1>/`
3. Rename CSS scope: `.iter-v<N>` → `.iter-v<N+1>` in `v<N+1>/tokens.css`
4. Add new iteration to manifest with `frozen: false`
5. Update import paths from `v<N>` to `v<N+1>`

### Freezing rules

Everything in a frozen iteration folder is immutable. The `frozen: true` flag in the manifest is enforced by a PreToolUse hook — the agent cannot edit files in a frozen iteration's folder.

No exceptions. If you need to change something, create a new iteration.

### Forward-only

- Never merge iterations. Never delete iterations.
- No cross-iteration imports. Each `v<N>/` is completely self-contained.
- Later iterations carry forward ALL pages from previous iterations (the folder copy handles this).

## Before any edit (guard protocol)

Before editing any file in `src/projects/<name>/v<N>/`:

1. **Read `manifest.ts`** — check if `v<N>` is `frozen: true`. If frozen, stop.
2. **Component hierarchy check:**
   - Editing a file in `pages/`? → It MUST import only from `../components/`. No raw styled HTML.
   - Editing a file in `components/`? → It MUST use only `var(--token)` for visual values. No hardcoded colors. If you need a value that doesn't have a token yet, create the token first in `v<N>/tokens.css`.
3. **Check `components/index.ts`** — does a component already exist for what you need?
   - Yes → import and use it.
   - No → create it in `components/` first, add to `index.ts`, then use it in the page.
4. **When creating a new component** — add it to `components/index.ts` AND add a showcase entry to the Components page (`pages/components.tsx`) with its variations and states. The barrel and the showcase are two separate registrations — both are mandatory.
5. **Log to `CHANGELOG.md`** — every design change gets recorded.
6. **Commit after each change** — After completing the requested changes, stage and commit project files:
   `git add src/projects/ && git commit -m 'style: <brief description of change>'`
   Every change gets its own commit. This creates a clean history the designer can rewind with `/canvai-undo`.

## Manifest format

```ts
import type { ProjectManifest } from 'canvai/runtime'
import './v1/tokens.css'
import './v2/tokens.css'
import { ShellPage } from './v1/pages/shell'
import { ComponentsPage } from './v1/pages/components'
import { ShellPage as ShellPageV2 } from './v2/pages/shell'

const manifest: ProjectManifest = {
  project: 'my-project',
  iterations: [
    {
      name: 'V1',
      frozen: true,
      pages: [
        {
          name: 'Components',
          grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
          frames: [
            { id: 'v1-btn-primary', title: 'Button / Primary', component: ComponentsPage },
          ],
        },
        {
          name: 'Shell',
          grid: { columns: 1, columnWidth: 800, rowHeight: 560, gap: 40 },
          frames: [
            { id: 'v1-shell', title: 'Shell Assembly', component: ShellPage },
          ],
        },
      ],
    },
    {
      name: 'V2',
      frozen: false,
      pages: [
        /* ... carried forward + new pages ... */
      ],
    },
  ],
}

export default manifest
```

## Component matrix

### Design directions (proliferate first)

When a designer first describes a component or feature, do NOT generate one design and ask for feedback. Generate **multiple distinct design directions** — different visual bets, not just different states of the same idea. Three directions minimum. Use the canvas's infinite room.

The designer is not a spec-writer. They are a reactor and curator. Your job is to give them things to react to.

#### Layout: one page, one wall

All directions live on a **single manifest page** called "All Directions". Think of it like pinning designs on a wall — everything visible at once, scannable top to bottom.

Use a `DirectionLabel` component as the first frame in each row to explain the concept. The grid uses **N+1 columns** (1 label + N state/variation frames per direction):

```ts
{
  name: 'All Directions',
  grid: { columns: 6, columnWidth: 960, rowHeight: 800, gap: 40 },
  frames: [
    // Row 1: Direction A
    { id: 'label-a', title: 'Direction A', component: DirectionLabel, props: { letter: 'A', title: 'Minimal', description: '...' } },
    { id: 'dir-a-default', title: 'Dir A / Default', component: DirA, props: { state: 'default' } },
    { id: 'dir-a-hover', title: 'Dir A / Hover', component: DirA, props: { state: 'hover' } },
    // ... more states fill the row
    // Row 2: Direction B
    { id: 'label-b', title: 'Direction B', component: DirectionLabel, props: { letter: 'B', title: 'Structured', description: '...' } },
    // ... B frames
  ],
}
```

The `DirectionLabel` component renders a styled text card with the direction letter (badge), title, and description. Create it in `components/` — it follows the same token rules as any component.

Each direction should make a genuinely different design bet. Let the designer react — "I like A's density with C's color" — then converge.

### States and variations (within a direction)

Once a direction is chosen, think through its **variations** and **states**, then generate all meaningful combinations as frames in the manifest.

- **Columns** = states or interaction phases (e.g. Default, Hover, Active, Disabled)
- **Rows** = variations or content scenarios (e.g. Short text, Long text, With icon, Error)
- Set `grid.columns` to match the number of states
- Frames flow left-to-right, wrapping at the column count — the layout engine computes positions

### Naming convention

- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`

### Standard frame widths

Use these widths for responsive design frames. They match real device viewports.

| Breakpoint | Width | Use for |
|---|---|---|
| Desktop | `1440` | Default for full-width layouts, dashboards, landing pages |
| Tablet | `768` | iPad portrait, responsive midpoint |
| Mobile | `390` | iPhone (modern), narrow layouts |

Set `grid.columnWidth` in the manifest page config. For a responsive component matrix, use one column per breakpoint:

```ts
{
  name: 'Shell',
  grid: { columns: 3, columnWidth: 1440, gap: 40 },
  frames: [
    { id: 'shell-desktop', title: 'Shell / Desktop', component: ShellPage, width: 1440 },
    { id: 'shell-tablet', title: 'Shell / Tablet', component: ShellPage, width: 768 },
    { id: 'shell-mobile', title: 'Shell / Mobile', component: ShellPage, width: 390 },
  ],
}
```

For single-breakpoint pages (most common), set `columnWidth` to the target width. Components pages typically use smaller widths (320-640) to show isolated building blocks.

### Mandatory pages

Every project must include:
- **Tokens** — renders color swatches (using `TokenSwatch` from `canvai/runtime`), typography scale, and spacing grid from `tokens.css`. Makes the token system visible on the canvas. The designer can click any color swatch to open the OKLCH color picker and visually edit tokens.
- **Components** — shows all building blocks individually with their variations and states.

### Token swatches (runtime)

Canvai provides `TokenSwatch` and `ColorPicker` from `canvai/runtime` for the Tokens page. The designer clicks a swatch to open an OKLCH color picker, sees a live preview across the entire canvas, and posts an annotation to change the token value.

```tsx
import { TokenSwatch } from 'canvai/runtime'

<TokenSwatch
  color="var(--chrome)"
  label="chrome"
  sublabel="oklch(0.952 0.003 80)"
  oklch={{ l: 0.952, c: 0.003, h: 80 }}
  tokenPath="--chrome"
/>
```

Props:
- `color` — CSS color string for display
- `label` — Token name shown next to the swatch
- `sublabel` — Optional secondary text (e.g. the OKLCH value)
- `oklch` — If provided, swatch is clickable and opens the color picker (`{ l, c, h }`)
- `tokenPath` — CSS custom property name for the annotation (e.g. `"--chrome"`)

When the designer clicks Apply, `TokenSwatch` posts an annotation (frame ID is derived automatically from the DOM). The agent updates `tokens.css`. Use `TokenSwatch` for every color token on the Tokens page.

### Interactive navigation

The matrix model (variations × states as separate frames) is for **isolated component states**. For components with internal navigation (tabs, sidebar nav, segmented sections), do NOT split navigable sections into separate frames. That produces static snapshots where nothing is clickable.

Instead, build one interactive component with React state that actually swaps content on click. One frame, one component, full interactivity. If a page has internal navigation, the navigation must work.

## Design language

Canvai follows a **Braun / Jony Ive** aesthetic — clean, minimal, functional. Modern like Figma, not retro. Every decision is measured against Rams' principles.

### Rams' 10 principles (the law)

1. **Innovative** — Use technology to enable new forms of interaction, not to decorate.
2. **Useful** — Every element serves a purpose. If it doesn't help the user, remove it.
3. **Aesthetic** — Visual quality is integral to usefulness. Precision and nature.
4. **Understandable** — The UI should explain itself. No labels that repeat context ("Delete thread" → just "Delete"). No redundant words.
5. **Unobtrusive** — Tools, not personalities. The UI disappears when the work begins.
6. **Honest** — Don't make elements appear more than they are. No fake depth, no gratuitous shadows.
7. **Long-lasting** — Avoid trends. System fonts, not branded typefaces. Grayscale + one accent, not palettes that date.
8. **Thorough** — Every state matters. Hover, focus, empty, loading, error — nothing is an afterthought.
9. **Environmentally friendly** — Minimal bundle. No heavy animation libraries when 30 lines of spring physics suffice.
10. **As little design as possible** — Back to purity, back to simplicity. Less, but better.

### OKLCH Palette

All colors MUST be in OKLCH. No hex values. Every color belongs to a cohesive perceptual system.

**Warm neutrals — h=80, c=0.003 (shell material):**

| Token | OKLCH | Role |
|---|---|---|
| `chrome` | `oklch(0.952 0.003 80)` | Sidebar + topbar surface |
| `chromeSub` | `oklch(0.935 0.003 80)` | Hover/active on chrome |
| `canvas` | `oklch(0.972 0.003 80)` | Workspace background |
| `card` | `oklch(0.993 0.003 80)` | Cards on canvas |
| `border` | `oklch(0.895 0.005 80)` | Chrome borders |
| `borderSoft` | `oklch(0.925 0.003 80)` | Card borders (softer) |
| `txtPri` | `oklch(0.180 0.005 80)` | Primary text |
| `txtSec` | `oklch(0.380 0.005 80)` | Secondary text |
| `txtTer` | `oklch(0.540 0.005 80)` | Tertiary text |
| `txtFaint` | `oklch(0.660 0.003 80)` | Ghost / placeholder |

**Accent — signal red h=28 (Braun TG 60 record button):**

| Token | OKLCH | Role |
|---|---|---|
| `accent` | `oklch(0.52 0.20 28)` | Primary action |
| `hover` | `oklch(0.62 0.18 28)` | Hover state |
| `muted` | `oklch(0.92 0.05 28)` | Subtle backgrounds |
| `strong` | `oklch(0.46 0.18 28)` | High contrast accent text |
| `border` | `oklch(0.85 0.08 28)` | Accent borders |

**Watch mode — indicator green h=155 (Braun SK 4 power light):**

| Token | OKLCH | Role |
|---|---|---|
| `bg` | `oklch(0.92 0.04 155)` | Watch pill background |
| `dot` | `oklch(0.52 0.14 155)` | Watch dot |
| `text` | `oklch(0.40 0.12 155)` | Watch text |

**Functional:**

| Token | OKLCH | Role |
|---|---|---|
| `success` | `oklch(0.55 0.14 155)` | Success states |
| `danger` | `oklch(0.52 0.20 28)` | Destructive actions |

**Interaction states:** Hover `rgba(0,0,0,0.03)`, Active `rgba(0,0,0,0.06)`.

### Typography

- **Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- **Mono:** `SF Mono, Monaco, Inconsolata, monospace` (code values, technical labels)
- **Scale (token names):** `label: 9px`, `pill: 10px`, `caption: 11px`, `body: 12px`, `title: 13px`
- **Weights:** 400 regular, 500 medium, 600 semibold
- **Uppercase section headers:** `fontSize: T.label (9), fontWeight: 600, color: txtFaint, textTransform: 'uppercase', letterSpacing: '0.08em'`

### Spacing (4px grid)

All spacing values must be multiples of 4. Token names: `xs: 4`, `sm: 8`, `md: 12`, `lg: 16`, `xl: 20`, `xxl: 24`. Never use off-grid values. The only exception is `1px` or `2px` for borders.

### Border radius (tiered)

| Token | Value | Usage |
|---|---|---|
| `control` | `4px` | Buttons, active rows, toggles |
| `card` | `8px` | Cards, dropdowns |
| `panel` | `12px` | Canvas, modals, large surfaces |
| `pill` | `20px` | Toast pills, full-round elements |

### Elevation

Canvas is inset from chrome with `12px` padding, `12px` border-radius, and a subtle shadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px oklch(0.915 0.003 80)`.

### Icon sizes (Lucide React)

| Token | Size | Usage |
|---|---|---|
| `sm` | `12px` | Decorative: chevrons, sidebar icons |
| `md` | `14px` | Secondary: close, trash, checks |
| `lg` | `16px` | Primary: menu items, FAB, topbar actions |

Always `strokeWidth={1.5}`. Always from `lucide-react`. No hand-drawn SVGs.

### Principles

- **All colors in OKLCH.** No hex values. Derive every color from the OKLCH system.
- **Achromatic shell (c <= 0.003).** The shell has no hue. Only the accent has color.
- **One accent hue.** Everything else is warm neutral grayscale.
- **4px spacing grid.** Every spacing value must be a multiple of 4. Font sizes exempt.
- **`cursor: default`** for all shell UI. Never `cursor: pointer`.
- **`text-wrap: pretty`** on all text elements. No widows.
- **Components must be interactive.** Text inputs typeable, menus open on click, buttons have hover/active states.
- **Menus dismiss on outside click.** Use `pointerdown` listener on `document` or a fixed overlay.

### Motion

Not animation — **motion**. Objects have mass, momentum, and friction. Rams' restraint meets Matas' physics. Precision and nature.

#### Golden ratio foundation

Canvai springs are derived from the Fibonacci sequence and the golden ratio (phi = 1.618...).

- **Tensions** are consecutive Fibonacci numbers: 89, 144, 233. Each related by phi — the same proportion found in leaf arrangement, shell spirals, and branching patterns.
- **Damping ratio** = 1/phi (~0.618) for all presets. This is nature's spring — a branch pulled and released overshoots slightly, then settles with purpose. Enough life to feel real, enough friction to feel controlled.
- **Friction** is derived, not arbitrary: `friction = 2 x (1/phi) x sqrt(tension)`

#### Spring presets

| Preset | Tension | Friction | zeta | Use for |
|---|---|---|---|---|
| `snappy` | 233 | 19 | 0.623 | Buttons, toggles, checkboxes |
| `gentle` | 144 | 15 | 0.625 | Cards, panels, sidebars, menus |
| `soft` | 89 | 12 | 0.636 | Tooltips, toasts, page transitions |

All three presets share the golden damping character. They differ in speed, not feel. The spring module lives at `v<N>/spring.ts` — import `{ SPRING, useSpring }` from there.

#### When to use springs vs CSS

- **Springs (mandatory):** Reveals, dismissals, presses, slides, scale changes, height/width animations — anything where position, size, or visibility changes.
- **CSS transitions (allowed):** Hover background-color changes (`120ms`), focus ring appearance, color changes on state toggle. These are instantaneous state feedback, not motion.
- **Never:** `ease-in-out`, `ease`, or any CSS easing curve on animated elements. If it moves, it springs.

#### Spring implementation

Use the `useSpring` hook from `v<N>/spring.ts`. It drives `ref.style.transform` via `requestAnimationFrame` with fixed-timestep physics (120Hz) and an accumulator pattern for frame-rate independence. No React state for animation values — direct DOM updates for 60fps+.

```ts
import { SPRING, useSpring } from '../spring'
const spring = useSpring(SPRING.gentle)
spring.set(1, (v) => { ref.current.style.transform = `scale(${v})` })
```

## Feature inventory

This is a hard constraint. Before rendering any component or feature, check this inventory. If it's not listed here, it doesn't exist.

### Runtime components

| Component | What it does |
|---|---|
| `Canvas` | Infinite pannable/zoomable surface. Renders Frame children at absolute positions. |
| `Frame` | Draggable card on the canvas. Title bar + content area. Wraps a single component instance. |
| `TopBar` | Top navigation bar. Shows project picker, sidebar toggle, iteration pills (center), watch mode pill, pending annotation count. |
| `ProjectPicker` | Dropdown to switch between design projects. Orange letter avatar + chevron trigger. |
| `IterationPills` | Pill strip in TopBar center for switching iterations. Click, drag-to-scrub, arrows + counter for 5+ items. |
| `IterationSidebar` | Collapsible left sidebar showing the active iteration's pages as a flat list. |
| `AnnotationOverlay` | Fixed overlay for the annotation workflow: FAB button, targeting crosshair, highlight box, comment card, numbered markers, toast notifications. |

### Does NOT exist

The following features are **not implemented** and must never be rendered, referenced, or implied:

- Dark mode / theme switching
- User authentication / login / avatars / user profiles
- Search / command palette / spotlight
- Notifications / notification bell
- Settings panel / preferences
- Keyboard shortcuts overlay
- Version history / undo-redo timeline
- Export / download / share dialog (beyond the `/canvai-share` CLI command)
- Comment threads / threaded replies / reactions (the annotation system is single-comment, not threaded)
- Real-time collaboration / cursors / presence indicators
- Generic component library (buttons, inputs, etc.) — Canvai renders the designer's components, it is not a UI kit
- Password inputs / form validation
- File upload / drag-and-drop

### Rule

If a designer asks for a feature not in this inventory, the agent must say: "That feature doesn't exist in Canvai yet. Would you like to design it as a new component instead?" — never invent UI for features that aren't built.

## Annotation flow (push-driven)

The canvas has a built-in annotation overlay. The designer clicks "Annotate", selects an element, types a comment, and clicks "Apply". The annotation is pushed to the canvai HTTP server.

### Two modes

**Chat mode (default):** The agent stays conversational. The designer can chat and request changes. To process annotations, the agent calls `get_pending_annotations` between tasks or when the designer asks.

**Watch mode (opt-in):** The designer says "enter watch mode" or uses `/canvai-dev`. The agent calls `watch_annotations` in a blocking loop for rapid annotation sessions. Exit by sending any message.

### Processing an annotation

When an annotation arrives (via either mode):
1. Read the annotation — it includes `frameId`, `componentName`, `selector`, `comment`, and `computedStyles`
2. **Follow the guard protocol** — check frozen status, component hierarchy
3. Map the `componentName` and `selector` to the relevant file in `v<N>/components/` or `v<N>/pages/`
4. If the change targets a page, ensure changes go through components (create/modify a component, then use it)
5. **Route visual changes through tokens:**
   - If the annotation changes a visual value (color, background, border, shadow, spacing, typography):
     a. Open `v<N>/tokens.css` — find the matching semantic token
     b. If a matching token exists: update its value (the component already uses `var(--token)`)
     c. If no matching token exists: create a new semantic token (e.g. `--button-secondary-bg`), add it to `tokens.css`, then reference it as `var(--token-name)` in the component
     d. Never apply a hardcoded value — not in components, not in pages
   - If the annotation changes structure (layout, composition, new element): follow the component hierarchy — pages import from components, never inline styled HTML
6. Call `resolve_annotation` with the annotation ID
7. **Log the change** to `src/projects/<project-name>/CHANGELOG.md`

### Change history

Every annotation fix must be logged in the project's `CHANGELOG.md`. This provides a running record of all design iterations. Format:

```markdown
# Changelog

## V1

- **button > span**: Changed font size from 14px to 16px (annotation #1)
- **card > h2**: Updated color to #1F2937 (annotation #2)

## V2

- Created V2 from V1
- **input**: Added 8px padding and border-radius 6px (annotation #3)
```

Each entry includes the `selector`, a brief description of the change, and the annotation number. Group entries under the current iteration name.

## Skills

- **`/canvai-init <project-name>`** — Create a new design project and start designing
- **`/canvai-check`** — Check for pending annotations and process them
- **`/canvai-dev`** — Start (or restart) the dev server (chat mode)
- **`/canvai-watch`** — Enter watch mode for rapid annotation sessions
- **`/canvai-iterate`** — Create a new design iteration
- **`/canvai-share`** — Build and deploy to GitHub Pages for sharing
- **`/canvai-ship`** — Ship component to a production repo
- **`/canvai-undo`** — Revert the last design change commit
- **`/canvai-update`** — Update canvai to the latest version
