# Runtime Shell Design Reference

Loaded on demand when working on `src/runtime/` components. Not needed for engineering tasks.

## Aesthetic: Dieter Rams / Jony Ive

> "Good design is as little design as possible."

1. **Honest** — No decoration. Every element earns its place.
2. **Unobtrusive** — The shell disappears; the designer's work is the hero.
3. **Thorough** — Every detail matters: spacing, alignment, color, cursor.
4. **As little as possible** — Remove until it breaks, then add one thing back.

## Proportions (Rams / Modulor inspired)

Shell dimensions derived from human-scale design:
- **TopBar**: 44px (Apple HIG minimum touch target)
- **Sidebar**: 180px (generous for page names)
- **Row height**: 32px (comfortable click target)
- **Control**: 28px (icon buttons)
- **Canvas inset**: 12px

**Base unit: 8px.** Spacing multiples: 4, 8, 12, 16, 24, 32.

## Palette (OKLCH-native, no hex in runtime)

All grays use **h=240** (cool blue-gray) for visual consistency.

| Token | OKLCH | Use |
|---|---|---|
| Chrome | `oklch(0.980 0.002 240)` | Shell surface (off-white) |
| Chrome subtle | `oklch(0.950 0.004 240)` | Active rows, controls |
| Canvas | `oklch(0.965 0.003 240)` | Canvas background |
| Text primary | `oklch(0.200 0.005 240)` | Primary text (off-black) |
| Text secondary | `oklch(0.400 0.004 240)` | Secondary text |
| On-dark | `oklch(0.950 0.002 240)` | Text on dark surfaces |

**Rules:**
- **No pure white or pure black.** All values off the extremes.
- **h=240 for all grays.** Cool, consistent, professional.
- Border-radius tiers: 6px controls, 8px cards, 12px panels, 20px pills.
- Hover: `rgba(0,0,0,0.03)`. Active: `rgba(0,0,0,0.06)`.
- `cursor: default` for all shell UI.
- Typography: 10px labels, 11px captions, 13px body, 14px titles.
- Icons: Lucide React, `strokeWidth={1.5}`. Sizes: 14/16/18px.

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
