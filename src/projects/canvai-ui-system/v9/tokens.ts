/* ══════════════════════════════════════════════════════
   V9 Dark Mode Token System

   Changes from V8:
   - Full lightness inversion for dark backgrounds
   - Chrome → dark (L=0.130), canvas → near-black (L=0.100)
   - Text → light on dark (pri L=0.930, sec L=0.720)
   - Accent → light charcoal for contrast on dark surfaces
   - Shadow opacity increased for dark surfaces
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Dark neutrals — h=80, c=0.005 */
export const N = {
  chrome:     oklch(0.130, 0.005, 80),
  chromeSub:  oklch(0.170, 0.005, 80),
  canvas:     oklch(0.100, 0.003, 80),
  card:       oklch(0.160, 0.005, 80),
  border:     oklch(0.240, 0.005, 80),
  borderSoft: oklch(0.200, 0.005, 80),
  txtPri:     oklch(0.930, 0.003, 80),
  txtSec:     oklch(0.720, 0.005, 80),
  txtTer:     oklch(0.540, 0.005, 80),
  txtFaint:   oklch(0.420, 0.003, 80),
}

/* Light charcoal accent for dark surfaces */
export const A = {
  accent:  oklch(0.800, 0.005, 80),
  hover:   oklch(0.700, 0.005, 80),
  muted:   oklch(0.200, 0.005, 80),
  strong:  oklch(0.880, 0.005, 80),
  border:  oklch(0.400, 0.005, 80),
}

/* Canvas elevation — deeper shadow for dark mode */
export const E = {
  insetTop: 6,
  inset:  12,
  radius: 12,
  shadow: `0 1px 3px rgba(0,0,0,0.24), 0 0 0 1px ${oklch(0.200, 0.005, 80)}`,
}

/* Functional — boosted lightness for dark backgrounds */
export const F = {
  comment:  oklch(0.820, 0.005, 80),
  resolved: oklch(0.420, 0.003, 80),
  success:  oklch(0.65, 0.14, 155),
  danger:   oklch(0.62, 0.20, 28),
  marker:   oklch(0.65, 0.18, 250),
}

/* Watch mode — dark variant */
export const W = {
  bg:   oklch(0.18, 0.04, 155),
  dot:  oklch(0.60, 0.14, 155),
  glow: oklch(0.60, 0.10, 155),
  text: oklch(0.68, 0.12, 155),
}

/* Shell spacing — 4px grid (unchanged) */
export const S = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
}

/* Shell radii (unchanged) */
export const R = {
  control:  4,
  card:     8,
  panel:   12,
  pill:    20,
}

/* Shell typography (unchanged) */
export const T = {
  label:   9,
  pill:   10,
  caption: 11,
  body:   12,
  title:  13,
}

/* Shell icon sizes (unchanged) */
export const ICON = {
  sm:  12,
  md:  14,
  lg:  16,
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
