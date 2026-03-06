# Canvai Design System Reference

Loaded on demand. Contains palette tables, typography, spacing, motion, and feature inventory.

## Rams' 10 Principles

1. **Innovative** — Technology enables new interaction, not decoration.
2. **Useful** — Every element serves a purpose.
3. **Aesthetic** — Visual quality is integral to usefulness.
4. **Understandable** — UI explains itself. No redundant labels.
5. **Unobtrusive** — Tools, not personalities.
6. **Honest** — No fake depth or gratuitous shadows.
7. **Long-lasting** — System fonts, not branded typefaces. Grayscale + one accent.
8. **Thorough** — Every state matters: hover, focus, empty, loading, error.
9. **Environmentally friendly** — Minimal bundle.
10. **As little design as possible** — Less, but better.

## OKLCH Palette

### Warm neutrals (h=80, c=0.003 — shell material)

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

### Accent — signal red h=28 (Braun TG 60 record button)

| Token | OKLCH | Role |
|---|---|---|
| `accent` | `oklch(0.52 0.20 28)` | Primary action |
| `hover` | `oklch(0.62 0.18 28)` | Hover state |
| `muted` | `oklch(0.92 0.05 28)` | Subtle backgrounds |
| `strong` | `oklch(0.46 0.18 28)` | High contrast accent text |
| `border` | `oklch(0.85 0.08 28)` | Accent borders |

### Watch mode — indicator green h=155

| Token | OKLCH | Role |
|---|---|---|
| `bg` | `oklch(0.92 0.04 155)` | Watch pill background |
| `dot` | `oklch(0.52 0.14 155)` | Watch dot |
| `text` | `oklch(0.40 0.12 155)` | Watch text |

### Functional

| Token | OKLCH | Role |
|---|---|---|
| `success` | `oklch(0.55 0.14 155)` | Success states |
| `danger` | `oklch(0.52 0.20 28)` | Destructive actions |

Interaction states: Hover `rgba(0,0,0,0.03)`, Active `rgba(0,0,0,0.06)`.

## Typography

- **Font:** `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif`
- **Mono:** `SF Mono, Monaco, Inconsolata, monospace`
- **Scale:** `label: 9px`, `pill: 10px`, `caption: 11px`, `body: 12px`, `title: 13px`
- **Weights:** 400 regular, 500 medium, 600 semibold
- **Uppercase headers:** `fontSize: 9px, fontWeight: 600, color: txtFaint, textTransform: 'uppercase', letterSpacing: '0.08em'`

## Spacing (4px grid)

Token names: `xs: 4`, `sm: 8`, `md: 12`, `lg: 16`, `xl: 20`, `xxl: 24`. Only `1px`/`2px` borders exempt.

## Border radius

| Token | Value | Usage |
|---|---|---|
| `control` | `4px` | Buttons, toggles |
| `card` | `8px` | Cards, dropdowns |
| `panel` | `12px` | Canvas, modals |
| `pill` | `20px` | Toast pills |

## Elevation

Canvas inset: `12px` padding, `12px` border-radius, shadow `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px oklch(0.915 0.003 80)`.

## Icons (Lucide React)

| Size | px | Usage |
|---|---|---|
| `sm` | `12` | Chevrons, sidebar icons |
| `md` | `14` | Close, trash, checks |
| `lg` | `16` | Menu items, FAB, topbar |

Always `strokeWidth={1.5}`. Always `lucide-react`.

## Spring presets (golden ratio derived)

Tensions from Fibonacci (89, 144, 233). Damping ~1/phi (0.618).

| Preset | Tension | Friction | Use for |
|---|---|---|---|
| `snappy` | 233 | 19 | Buttons, toggles, checkboxes |
| `gentle` | 144 | 15 | Cards, panels, sidebars, menus |
| `soft` | 89 | 12 | Tooltips, toasts, page transitions |

**When to use:** Springs for position/size/visibility changes. CSS transitions for hover color changes (~120ms). Never `ease-in-out` on animated elements.

**Implementation:** `useSpring` hook from `v<N>/spring.ts`. Drives `ref.style.transform` via rAF with 120Hz fixed-timestep physics.

```ts
import { SPRING, useSpring } from '../spring'
const spring = useSpring(SPRING.gentle)
spring.set(1, (v) => { ref.current.style.transform = `scale(${v})` })
```

## Feature inventory

### Runtime components

| Component | What it does |
|---|---|
| `Canvas` | Infinite pannable/zoomable surface |
| `Frame` | Draggable card with title bar + content |
| `TopBar` | Breadcrumb: sidebar toggle → ProjectPicker → iteration picker |
| `ProjectPicker` | Dropdown to switch projects |
| `PickerDropdown` | Shared dropdown (project + iteration picker) |
| `IterationSidebar` | Collapsible left sidebar with page list |
| `AnnotationOverlay` | FAB, crosshair, highlight, comment card, markers, toasts |

### Does NOT exist (never render or reference)

Dark mode, user auth/login/avatars, search/command palette, notifications, settings panel, keyboard shortcuts overlay, version history/undo-redo, export/download/share dialog, comment threads/reactions, real-time collaboration/cursors, generic component library, password inputs, file upload/drag-and-drop.
