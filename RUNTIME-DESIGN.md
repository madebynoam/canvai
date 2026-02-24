# Runtime Shell Design Reference

Loaded on demand when working on `src/runtime/` components. Not needed for engineering tasks.

## Aesthetic: Dieter Rams / Jony Ive

> "Good design is as little design as possible."

1. **Honest** — No decoration. Every element earns its place.
2. **Unobtrusive** — The shell disappears; the designer's work is the hero.
3. **Thorough** — Every detail matters: spacing, alignment, color, cursor.
4. **As little as possible** — Remove until it breaks, then add one thing back.

## Palette (OKLCH-native, no hex in runtime)

| Token | OKLCH | Use |
|---|---|---|
| Chrome | `oklch(0.985 0 90)` | Shell surface |
| Chrome subtle | `oklch(0.955 0.003 80)` | Active rows, controls |
| Canvas | `oklch(0.972 0.001 197)` | Canvas background |
| Card | `oklch(0.993 0.003 80)` | Cards, dropdowns |
| Border | `oklch(0.895 0.005 80)` | Borders |
| Text primary | `oklch(0.180 0.005 80)` | Primary text |
| Text secondary | `oklch(0.380 0.005 80)` | Secondary text |
| Text tertiary | `oklch(0.540 0.005 80)` | Tertiary text |
| On-dark | `oklch(0.97 0.003 80)` | Text/icons on dark surfaces |
| Accent | `oklch(0.300 0.005 80)` | Accent (h=80, low chroma) |

**Rules:**
- No pure white or pure black. Always off-values from palette. Shadows (`rgba(0,0,0,0.04)`) exempt.
- One accent system (charcoal h=80). Everything else is grayscale.
- 4px spacing grid. Allowed: 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 64…
- Border-radius tiers: 4px controls, 8px cards/dropdowns, 12-20px pills.
- Hover: `rgba(0,0,0,0.03)`. Active: `rgba(0,0,0,0.06)`.
- `cursor: default` for all shell UI. Never `cursor: pointer`.
- `text-wrap: pretty` on all text. No widows.
- Icons: Lucide React, `strokeWidth={1.5}`. Sizes: 16px primary, 14px secondary, 12px decorative.

## Motion language (Rams restraint + Matas physics)

Every transition uses spring physics — no CSS durations, no `ease-in-out`.

**Spring presets (golden ratio derived, damping ~1/phi):**

| Preset | Tension | Friction | Use for |
|---|---|---|---|
| `snappy` | 233 | 19 | Buttons, toggles, micro-feedback |
| `gentle` | 144 | 15 | Cards, panels, sidebars, menus |
| `soft` | 89 | 12 | Tooltips, toasts, page transitions |

**Motion rules:**
- Reveals: scale 0.8→1 + translateY with spring overshoot. Opacity fades in parallel.
- Dismissals: reverse reveal with higher friction.
- Button press: spring squish (scale 0.92) then bounce-back.
- Dropdowns: scaleY from transform-origin top, snappy preset.
- Panels: translateX slide, gentle preset.
- Toasts: translateY spring up from bottom, auto-dismiss 2-3s.
- CSS `cubic-bezier(0.34, 1.56, 0.64, 1)` approximates spring overshoot for prototyping.
