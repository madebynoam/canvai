/* ══════════════════════════════════════════════════════
   OKLCH Token System — V8 Cerulean 400

   Every color is derived from two sources:
   1. Achromatic neutrals (c=0) — the shell material
   2. Cerulean accent scale (h=235) — the one color

   No hex. No rgb. No random values.
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Achromatic neutrals — c=0, zero hue */
export const N = {
  chrome:     oklch(0.875, 0, 0),
  chromeSub:  oklch(0.850, 0, 0),
  canvas:     oklch(0.905, 0, 0),
  card:       oklch(0.965, 0, 0),
  border:     oklch(0.820, 0, 0),
  borderSoft: oklch(0.860, 0, 0),
  txtPri:     oklch(0.200, 0, 0),
  txtSec:     oklch(0.400, 0, 0),
  txtTer:     oklch(0.560, 0, 0),
  txtFaint:   oklch(0.680, 0, 0),
}

/* Cerulean accent scale — h=235 */
export const A = {
  50:  oklch(0.97, 0.02, 235),
  100: oklch(0.93, 0.05, 235),
  200: oklch(0.87, 0.10, 235),
  300: oklch(0.78, 0.14, 235),
  400: oklch(0.68, 0.18, 235),
  500: oklch(0.58, 0.20, 235),
  600: oklch(0.52, 0.19, 235),
  700: oklch(0.44, 0.17, 235),
  800: oklch(0.36, 0.14, 235),
  900: oklch(0.28, 0.10, 235),
}

/* Functional */
export const F = {
  comment:  oklch(0.260, 0, 0),
  resolved: oklch(0.700, 0, 0),
  success:  oklch(0.55, 0.14, 155),
  danger:   oklch(0.52, 0.20, 28),
}

/* Watch mode colors — green functional tints */
export const W = {
  bg:   oklch(0.93, 0.05, 155),
  dot:  oklch(0.55, 0.14, 155),
  glow: oklch(0.55, 0.10, 155),
  text: oklch(0.40, 0.12, 155),
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
