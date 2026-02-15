# Canvai — Agent Instructions

Canvai is a design studio. A Figma-like infinite canvas where every design is live React code. The designer describes what they want, the agent builds it on the canvas, the designer annotates elements on the canvas to iterate, and the final code gets PR'd to a production repo.

## Tenets

Tenets are decision-making tools — each names the alternative and rejects it.

1. **The code is the design.** Not a mockup. Not a specification. The thing on the canvas runs. What the designer sees is what ships. There is no handoff because there is nothing to hand off.
2. **One component, infinite states.** Not an app. Not a page. Canvai renders every variation and state of a single component on one canvas — the matrix is the design artifact. Completeness is visible at a glance.
3. **Point, don't describe.** Not a ticket. Not a meeting. The designer clicks the element, types the change, and the agent applies it. The annotation carries the selector, the computed styles, and the intent. No ambiguity survives the click.
4. **The agent never waits.** Not a sprint. Not a queue. Every annotation resolves in the same session. The feedback loop is measured in seconds, not days. Speed is not a feature — it is the product.
5. **The canvas is the only meeting room.** Not Slack. Not Figma comments. Every decision is made on the canvas, visible in the changelog, and shipped from the same place it was designed. Context never leaves the surface it was created on.

## User workflow

1. **`/canvai-init <project-name>`** — Creates a new design project, installs canvai if needed, starts the dev server + annotation MCP.
2. **Describe** — The designer describes the component (or attaches a sketch). The agent generates the component with variations and states as a manifest.
3. **Annotate** — The designer clicks "Annotate" on the canvas, selects an element, types a comment, and clicks "Apply". The annotation is pushed to the agent automatically via the MCP watch loop.
4. **`/canvai-iterate`** — Creates a new iteration in the manifest. Old iterations are frozen.
5. **`/canvai-ship`** — PR the finished components to a production codebase.

## Project structure

```
src/projects/
  <project-name>/
    primitives/
      tokens.css         ← CSS custom properties (OKLCH base tokens)
      spring.ts          ← spring physics engine (optional, chosen at init)
      Button.tsx          ← shared button primitive
      Avatar.tsx          ← shared avatar primitive
      index.ts            ← barrel export + component index
    iterations/
      v1/
        tokens.css       ← iteration-scoped token overrides
        index.ts         ← variation exports
        <variation>.tsx  ← design variations
      v2/
        tokens.css       ← different accent, spacing, etc.
        ...
    manifest.ts          ← pages × frames (auto-discovered by the canvas)
    CHANGELOG.md         ← annotation + iteration history
```

## Manifest format

Each project has a `manifest.ts` that exports a `ProjectManifest`:

```ts
import './primitives/tokens.css'
import './iterations/v1/tokens.css'
import './iterations/v2/tokens.css'
import { MyVariation } from './iterations/v1/my-variation'
import type { ProjectManifest } from 'canvai/runtime'

const manifest: ProjectManifest = {
  project: 'my-project',
  iterations: [
    {
      name: 'V1',
      frozen: true,
      pages: [
        {
          name: 'Initial',
          grid: { columns: 3, columnWidth: 300, rowHeight: 160, gap: 40 },
          frames: [
            { id: 'comp-variant-state', title: 'Comp / Variant / State', component: MyVariation, props: { ... } },
          ],
        },
      ],
    },
    {
      name: 'V2',
      frozen: false,
      pages: [ ... ],
    },
  ],
}

export default manifest
```

The manifest imports CSS tokens at the top — base tokens from `primitives/tokens.css`, then each iteration's scoped overrides. The `frozen` flag marks whether an iteration can be edited.

## Component matrix

When the designer describes a component, think through its **variations** and **states**, then generate all meaningful combinations as frames in the manifest.

- **Columns** = states or interaction phases (e.g. Default, Hover, Active, Disabled)
- **Rows** = variations or content scenarios (e.g. Short text, Long text, With icon, Error)
- Set `grid.columns` to match the number of states
- Frames flow left-to-right, wrapping at the column count — the layout engine computes positions

### Naming convention

- Frame IDs: `<component>-<variation>-<state>`
- Frame titles: `Component / Variation / State`

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

### Palette (OKLCH)

All colors are defined in OKLCH — no hex values. The shell is achromatic (c=0, no hue). The accent is the one color.

| Token | CSS var | OKLCH | Usage |
|---|---|---|---|
| Surface | `--surface` | `oklch(0.995 0 0)` | Cards, popovers, panels |
| Chrome | `--chrome` | `oklch(0.955 0 0)` | Sidebar + topbar surface |
| Canvas | `--canvas-bg` | `oklch(0.975 0 0)` | Workspace background |
| Border | `--border` | `oklch(0.900 0 0)` | Chrome borders |
| Border soft | `--border-soft` | `oklch(0.920 0 0)` | Card borders |
| Text primary | `--text-primary` | `oklch(0.200 0 0)` | Body text |
| Text secondary | `--text-secondary` | `oklch(0.400 0 0)` | Labels, captions |
| Text tertiary | `--text-tertiary` | `oklch(0.560 0 0)` | Hints, metadata |
| Text faint | `--text-faint` | `oklch(0.680 0 0)` | Ghost / placeholder |
| Accent | `--accent` | `oklch(0.68 0.18 235)` | Buttons, highlights (cerulean) |
| Accent hover | `--accent-hover` | `oklch(0.78 0.14 235)` | Hover state |
| Accent muted | `--accent-muted` | `oklch(0.93 0.05 235)` | Tint backgrounds |
| Success | `--success` | `oklch(0.55 0.14 155)` | Success states |
| Danger | `--danger` | `oklch(0.52 0.20 28)` | Destructive actions |
| Hover bg | — | `rgba(0,0,0,0.03)` | Hover background |
| Active bg | — | `rgba(0,0,0,0.06)` | Active/pressed background |

**Use CSS custom properties** (`var(--accent)`) in component styles instead of hardcoded values. This enables iteration-scoped token overrides.

### Typography

- **Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- **Mono:** `SF Mono, Monaco, Inconsolata, monospace` (for code values, technical labels)
- **Scale:** 24px display, 18px heading, 15px subheading, 13px body, 12px caption, 11px meta, 10px micro, 9px tiny
- **Weights:** 400 regular, 500 medium, 600 semibold, 700 bold
- **Line-height:** 1.5 for body (13px and below), 1.4 for headings (15px and above)
- **Uppercase labels:** `fontSize: 13, fontWeight: 600, color: TEXT_TER, textTransform: 'uppercase', letterSpacing: '0.05em'`

### Spacing (4px grid)

All spacing values must be multiples of 4: `4, 8, 12, 16, 20, 24, 28, 32`. Never use `3px`, `5px`, `6px`, `10px`, or other off-grid values for padding, margin, or gap. The only exception is `1px` or `2px` for borders and fine adjustments.

### Border radius

- **Cards, panels, inputs:** `borderRadius: 10` (standard)
- **Dropdown menus, small cards:** `borderRadius: 8`
- **Pill buttons, pills, toasts:** `borderRadius: 20`
- **Inline items (dropdown options, sidebar rows):** `borderRadius: 4`
- **Small controls (checkboxes, swatches):** `borderRadius: 4`

### Shadows

- **Cards:** `boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'`
- **Dropdown menus:** `boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)'`
- **Toasts:** `boxShadow: '0 2px 12px rgba(0,0,0,0.12)'`
- **Subtle (skeleton, light cards):** `boxShadow: '0 2px 8px rgba(0,0,0,0.04)'`

### Principles

- **All colors in OKLCH.** Never introduce hex values. Use `var(--token)` CSS custom properties or `oklch()` with intentional L/C/H values.
- **One accent color.** Cerulean (`var(--accent)`) is the only color. Everything else is achromatic (c=0). Exception: semantic status colors (success h=155, danger h=28) are allowed in status indicators only.
- **Light canvas.** The background is always `var(--canvas-bg)`, never dark.
- **Minimal chrome.** Subtle borders (`1px solid var(--border)`), soft shadows, no heavy outlines.
- **4px spacing grid.** All padding, margin, and gap values must be multiples of 4.
- **Rounded but not bubbly.** `borderRadius: 10` for cards, `8` for menus, `20` for pills. See Border radius section.
- **Icons: Lucide React** (`lucide-react`). No hand-drawn SVGs. Size tiers: 16px primary actions (menu items, FAB, sidebar toggle), 14px secondary (close, trash, checks, send), 12px decorative (chevrons in triggers). Always `strokeWidth={1.5}`.
- **`text-wrap: pretty`** on all text elements. Cast as `React.CSSProperties` in TypeScript. No widows.
- **Components must be interactive.** Text inputs should be typeable, menus should open on click, buttons should have hover/active states. No static mockups.
- **Menus dismiss on outside click.** Every dropdown/popover must close when clicking outside. Use a fixed overlay (`position: fixed, inset: 0`) or a `pointerdown` listener on `document`.

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

All three presets share the golden damping character. They differ in speed, not feel. The shared module lives at `spring.ts` — import `{ SPRING, useSpring }` from there.

#### When to use springs vs CSS

- **Springs (mandatory):** Reveals, dismissals, presses, slides, scale changes, height/width animations — anything where position, size, or visibility changes.
- **CSS transitions (allowed):** Hover background-color changes (`120ms`), focus ring appearance, color changes on state toggle. These are instantaneous state feedback, not motion.
- **Never:** `ease-in-out`, `ease`, or any CSS easing curve on animated elements. If it moves, it springs.

#### Spring implementation

Use the shared `useSpring` hook from `spring.ts`. It drives `ref.style.transform` via `requestAnimationFrame` with fixed-timestep physics (120Hz) and an accumulator pattern for frame-rate independence. No React state for animation values — direct DOM updates for 60fps+.

```ts
import { SPRING, useSpring } from './spring'
const spring = useSpring(SPRING.gentle)
spring.set(1, (v) => { ref.current.style.transform = `scale(${v})` })
```

#### Shared modules

All components import from the `primitives/` folder:
- **`primitives/tokens.css`** — CSS custom properties (single source of truth for colors, spacing, radius, type scale)
- **`primitives/index.ts`** — barrel export for shared components (Button, Avatar, Label, Swatch, HoverButton)

Projects that use spring physics also have `primitives/spring.ts`:
- **`primitives/spring.ts`** — spring physics hook, presets, golden ratio constants

Not every project uses spring. The motion approach is chosen at init time:
- **Spring physics** — for interactive components (buttons, toggles, menus, reveals). Import `{ SPRING, useSpring }` from `./spring`.
- **CSS transitions** — for simple hover states, color changes. Use `transition: background-color 120ms` directly in styles.
- **No motion** — for static designs, layouts, palette explorations.

To add spring to an existing project: copy `spring.ts` from `_archive/canvai-ui/` or another project into `primitives/`.

## Primitives workflow

Primitives are shared components in `primitives/` that use CSS custom properties for all visual values. They are shared across all iterations.

### When to create a primitive

- A pattern repeats across 2+ variations
- The component is purely visual (no business logic)
- It can be styled entirely via CSS custom properties

### When to use a local component instead

- The component is specific to one iteration
- It needs logic that doesn't generalize
- The designer wants to experiment without affecting other iterations

### Promotion flow

1. Start as a local component in `iterations/v<N>/`
2. If it gets reused, extract to `primitives/`
3. Update both `primitives/index.ts` and the iteration indexes

### Primitives must use CSS custom properties

```tsx
// Good — respects token overrides
<div style={{ background: 'var(--accent)', borderRadius: 'var(--radius-md)' }}>

// Bad — hardcoded, won't respond to iteration tokens
<div style={{ background: 'oklch(0.68 0.18 235)', borderRadius: '8px' }}>
```

## Token system

Tokens cascade in two layers:

1. **Base tokens** — `primitives/tokens.css` defines `:root` custom properties. These are the defaults.
2. **Iteration overrides** — `iterations/v<N>/tokens.css` scopes overrides under `.iter-<name>`. These override base tokens for that iteration only.

### How scoping works

The runtime wraps the canvas area in a div with class `iter-<name>` (lowercased iteration name). CSS specificity does the rest:

```css
/* primitives/tokens.css — defaults */
:root {
  --accent: oklch(0.68 0.18 235);
}

/* iterations/v1/tokens.css — pinned when frozen */
.iter-v1 {
  --accent: oklch(0.68 0.18 235);
}

/* iterations/v2/tokens.css — new direction */
.iter-v2 {
  --accent: oklch(0.55 0.18 250);
}
```

### Rules

- **Always use `var(--token)`** in component styles. Never hardcode OKLCH values in components.
- **Base tokens change freely.** Updating `primitives/tokens.css` affects all unfrozen iterations.
- **Frozen iteration tokens are pinned.** When freezing, copy the current accent (and any overridden tokens) into the iteration's `tokens.css` so it's preserved.

## Freezing rules

Frozen iterations are read-only snapshots. The `frozen: true` flag in the manifest marks them.

### Before editing any file, check the manifest

1. Read `manifest.ts`
2. Find the iteration that owns the file you're about to edit
3. If `frozen: true` — **do not edit**. Create a new iteration instead.
4. If `frozen: false` — edit freely.

### What gets frozen

- All files in `iterations/v<N>/` — variations, tokens.css, index.ts
- The iteration's entry in the manifest (pages, frames)

### What is NOT frozen

- **Primitives** (`primitives/`) — shared across all iterations, always editable
- **Base tokens** (`primitives/tokens.css`) — changes propagate to unfrozen iterations
- **CHANGELOG.md** — always appendable

## Before any edit

Every time you are about to modify a file in `src/projects/<name>/`, follow this checklist:

1. **Read `manifest.ts`** — find which iteration owns the file.
   - If `frozen: true` → STOP. Tell the designer: "That's in a frozen iteration. Use /canvai-iterate to create a new one."
   - If `frozen: false` → continue.

2. **Check `primitives/index.ts`** — does a shared primitive already handle what you're changing?
   - If yes → modify the primitive (change propagates everywhere).
   - If the change is iteration-specific → edit the variation file in `iterations/v<N>/`.

3. **Use CSS custom properties** for all visual values:
   - Colors → `var(--accent)`, `var(--text-primary)`, etc.
   - Spacing → `var(--space-4)`, `var(--space-2)`, etc.
   - Radius → `var(--radius-md)`, `var(--radius-sm)`, etc.
   - Never hardcode OKLCH, hex, or px values that have a token equivalent.
   - Reference `primitives/tokens.css` for available tokens.

4. **Log the change** to `CHANGELOG.md` under the current iteration heading.

This applies to chat-based changes, annotation-based changes, and any other edit.

## Context reading protocol

To minimize context consumption, follow this reading order:

1. **Read `manifest.ts`** — understand project structure, iterations, frozen status
2. **Read `primitives/index.ts`** — see what shared components exist
3. **Read the active iteration's `index.ts`** — see what variations exist
4. **Read `CHANGELOG.md`** — understand recent changes
5. **Only then** read specific component files as needed

Never read the entire project folder. The index files and CHANGELOG provide enough context to navigate.

## Feature inventory

This is a hard constraint. Before rendering any component or feature, check this inventory. If it's not listed here, it doesn't exist.

### Runtime components

| Component | What it does |
|---|---|
| `Canvas` | Infinite pannable/zoomable surface. Renders Frame children at absolute positions. |
| `Frame` | Draggable card on the canvas. Title bar + content area. Wraps a single component instance. |
| `TopBar` | Top navigation bar. Shows project picker, sidebar toggle, watch mode pill, pending annotation count. |
| `ProjectPicker` | Dropdown to switch between design projects. Orange letter avatar + chevron trigger. |
| `IterationSidebar` | Collapsible left sidebar listing iterations and their pages. Click to navigate. |
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
2. Map the `componentName` and `selector` to the relevant component file and element
3. Apply the requested changes to the component code
4. Call `resolve_annotation` with the annotation ID
5. **Log the change** to `src/projects/<project-name>/CHANGELOG.md` (create if it doesn't exist)

### Change history

Every annotation fix must be logged in the project's `CHANGELOG.md`. This provides a running record of all design iterations. Format:

```markdown
# Changelog

## V1 — Initial

- **button > span**: Changed font size from 14px to 16px (annotation #1)
- **card > h2**: Updated color to #1F2937 (annotation #2)

## V2 — Refined

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
- **`/canvai-update`** — Update canvai to the latest version
