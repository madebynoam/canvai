/* ══════════════════════════════════════════════════════
   OKLCH Token System — V7 Linear/Notion Minimal

   Rules:
   - ONE text size (12px), hierarchy via weight/color
   - THREE grays only: chrome, canvas, card
   - ONE radius (6px) for most, pill for full-round
   - Sentence case, no uppercase headers
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Neutrals */
export const N = {
  chrome:     oklch(0.980, 0.002, 240),  // shell chrome (topbar, sidebar)
  canvas:     oklch(0.950, 0.003, 240),  // canvas background
  card:       oklch(0.995, 0.001, 240),  // cards, dropdowns (elevated)
  active:     oklch(0.935, 0.004, 240),  // active rows (darker than chrome)
  border:     oklch(0.900, 0.003, 240),  // borders
  txtPri:     oklch(0.200, 0.005, 240),  // primary text
  txtSec:     oklch(0.450, 0.003, 240),  // secondary text
  txtMuted:   oklch(0.600, 0.002, 240),  // muted labels
}

/* Accent — cool charcoal (h=240) */
export const A = {
  accent:  oklch(0.320, 0.005, 240),  // accent
  hover:   oklch(0.420, 0.004, 240),  // hover state
  muted:   oklch(0.910, 0.003, 240),  // muted background
  strong:  oklch(0.240, 0.005, 240),  // strong accent
  border:  oklch(0.700, 0.004, 240),  // accent border
}

/* Canvas elevation — inset from chrome, subtle shadow */
export const E = {
  insetTop: 1,
  inset:  12,
  radius: 0,   // no rounding on large surfaces
  shadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px ${oklch(0.905, 0.003, 240)}`,
}

/* Functional */
export const F = {
  comment:  oklch(0.280, 0.005, 240),  // comment badge (cool)
  resolved: oklch(0.700, 0.003, 240),  // resolved state (cool)
  success:  oklch(0.55, 0.14, 155),    // green (keep)
  danger:   oklch(0.52, 0.20, 28),     // red (keep)
  marker:   oklch(0.55, 0.18, 250),    // blue marker (keep)
}

/* Watch mode — green indicator */
export const W = {
  bg:   oklch(0.92, 0.04, 155),
  dot:  oklch(0.52, 0.14, 155),
  glow: oklch(0.52, 0.10, 155),
  text: oklch(0.40, 0.12, 155),
}

/* On-dark text — off-white for dark backgrounds */
export const D = {
  text:   oklch(0.950, 0.002, 240),  // light text on dark (not pure white)
  textSec: oklch(0.800, 0.003, 240), // secondary on dark
}

/* Shell spacing — 4px grid (every value a multiple of 4) */
export const S = {
  xs:  4,   // row padding-block, control border-radius
  sm:  8,   // gaps, row padding-inline (active), icon inset
  md:  12,  // topbar padding, sidebar block-padding, section gap
  lg:  16,  // section header inline-padding, divider margin, section margin
  xl:  20,  // major section spacing
  xxl: 24,  // panel gaps
}

/* Shell radii — ONE radius for UI consistency */
export const R = {
  ui:   6,    // all UI: rows, buttons, inputs, cards, menus
  pill: 99,   // full-round pills
}

/* Shell dimensions */
export const DIM = {
  topbar:  44,   // topbar height
  sidebar: 200,  // sidebar width (wider for content)
  row:     36,   // sidebar row height (more breathing room)
  control: 28,   // icon button size
}

/* Shell typography — ONE size, hierarchy via weight/color */
export const T = {
  ui: 12,   // THE text size for everything
}

/* Shell icon sizes — tiered per CLAUDE.md */
export const ICON = {
  sm:  12,  // decorative: chevrons, sidebar icons
  md:  14,  // secondary: close, trash, checks, sidebar toggle
  lg:  16,  // primary: menu items, topbar actions, FAB
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
