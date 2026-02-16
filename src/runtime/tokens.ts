/* ══════════════════════════════════════════════════════
   OKLCH Token System — V2 Rams Palette

   Every color is derived from two sources:
   1. Warm neutrals (h=80, c=0.003) — the shell material
   2. Signal red accent (h=28) — functional indicator only

   Inspired by Braun TG 60 record button, RT 20 dial — color
   communicates function and nothing else.

   No hex. No rgb. No random values.
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Warm neutrals — h=80 (warm stone), c=0.003 */
export const N = {
  chrome:     oklch(0.952, 0.003, 80),
  chromeSub:  oklch(0.935, 0.003, 80),
  canvas:     oklch(0.972, 0.003, 80),
  card:       oklch(0.993, 0.003, 80),
  border:     oklch(0.895, 0.005, 80),
  borderSoft: oklch(0.915, 0.003, 80),
  txtPri:     oklch(0.180, 0.005, 80),
  txtSec:     oklch(0.380, 0.005, 80),
  txtTer:     oklch(0.540, 0.005, 80),
  txtFaint:   oklch(0.660, 0.003, 80),
}

/* Signal red accent — h=28 (TG 60 record button) */
export const A = {
  accent:  oklch(0.52, 0.20, 28),
  hover:   oklch(0.62, 0.18, 28),
  muted:   oklch(0.92, 0.05, 28),
  strong:  oklch(0.46, 0.18, 28),
  border:  oklch(0.85, 0.08, 28),
}

/* Canvas elevation — inset from chrome, rounded, subtle shadow */
export const E = {
  inset:  12,
  radius: 12,
  shadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px ${oklch(0.915, 0.003, 80)}`,
}

/* Functional */
export const F = {
  comment:  oklch(0.260, 0.005, 80),
  resolved: oklch(0.700, 0.003, 80),
  success:  oklch(0.55, 0.14, 155),
  danger:   oklch(0.52, 0.20, 28),
}

/* Watch mode — same green as accent (functional indicator) */
export const W = {
  bg:   oklch(0.92, 0.04, 155),
  dot:  oklch(0.52, 0.14, 155),
  glow: oklch(0.52, 0.10, 155),
  text: oklch(0.40, 0.12, 155),
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

/* Shell radii — tiered (all 4px multiples) */
export const R = {
  control:  4,  // buttons, active rows, toggles
  card:     8,  // cards, dropdowns, iteration pills
  panel:   12,  // canvas, modals, large surfaces
  pill:    20,  // toast pills, full-round elements
}

/* Shell typography — font sizes (exempt from 4px grid) */
export const T = {
  label:   9,   // section headers, badge counts
  pill:   10,   // watch pill, small indicators
  caption: 11,  // captions, secondary inline labels
  body:   12,   // sidebar rows, primary shell text
  title:  13,   // project picker, emphasis
}

/* Shell icon sizes — tiered per CLAUDE.md */
export const ICON = {
  sm:  12,  // decorative: chevrons, sidebar icons
  md:  14,  // secondary: close, trash, checks, sidebar toggle
  lg:  16,  // primary: menu items, topbar actions, FAB
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
