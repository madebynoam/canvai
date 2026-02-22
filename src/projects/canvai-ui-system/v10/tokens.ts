/* ══════════════════════════════════════════════════════
   V10 Live App Token System

   Matches the actual runtime tokens from src/runtime/tokens.ts
   Light mode — white chrome, cool canvas, charcoal accent
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Neutrals — white chrome, cool canvas */
export const N = {
  chrome:     oklch(0.985, 0.000, 90),
  chromeSub:  oklch(0.955, 0.003, 80),
  canvas:     oklch(0.972, 0.001, 197),
  card:       oklch(0.993, 0.003, 80),
  border:     oklch(0.895, 0.005, 80),
  borderSoft: oklch(0.925, 0.003, 80),
  txtPri:     oklch(0.180, 0.005, 80),
  txtSec:     oklch(0.380, 0.005, 80),
  txtTer:     oklch(0.540, 0.005, 80),
  txtFaint:   oklch(0.660, 0.003, 80),
}

/* Charcoal accent — h=80, low chroma */
export const A = {
  accent:  oklch(0.300, 0.005, 80),
  hover:   oklch(0.400, 0.005, 80),
  muted:   oklch(0.920, 0.003, 80),
  strong:  oklch(0.220, 0.005, 80),
  border:  oklch(0.700, 0.005, 80),
}

/* Canvas elevation */
export const E = {
  insetTop: 1,
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
  marker:   oklch(0.55, 0.18, 250),
}

/* Watch mode */
export const W = {
  bg:   oklch(0.92, 0.04, 155),
  dot:  oklch(0.52, 0.14, 155),
  glow: oklch(0.52, 0.10, 155),
  text: oklch(0.40, 0.12, 155),
}

/* Shell spacing — 4px grid */
export const S = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
}

/* Shell radii */
export const R = {
  control:  4,
  card:     8,
  panel:   12,
  pill:    20,
}

/* Shell typography */
export const T = {
  label:   9,
  pill:   10,
  caption: 11,
  body:   12,
  title:  13,
}

/* Shell icon sizes */
export const ICON = {
  sm:  12,
  md:  14,
  lg:  16,
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
