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
  accent: oklch(0.52, 0.20, 28),
  hover:  oklch(0.62, 0.18, 28),
  muted:  oklch(0.92, 0.05, 28),
  strong: oklch(0.46, 0.18, 28),
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

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
