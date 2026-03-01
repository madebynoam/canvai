/* ══════════════════════════════════════════════════════
   OKLCH Token System — V7 Rams / Modulor

   Proportions inspired by:
   - Dieter Rams (Snow White) — minimal but substantial
   - Le Corbusier (Modulor) — human-scale, golden ratio

   Base unit: 8px. Everything derives from 8 × n.
   Touch targets: 44px minimum (Apple HIG).
   Cool gray only (h=240), no pure white/black.
   ══════════════════════════════════════════════════════ */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* Neutrals — cool gray (h=240) */
export const N = {
  chrome:     oklch(0.980, 0.002, 240),  // shell surface (off-white)
  chromeSub:  oklch(0.950, 0.004, 240),  // active rows, hover
  canvas:     oklch(0.965, 0.003, 240),  // canvas background
  card:       oklch(0.985, 0.002, 240),  // cards, dropdowns
  border:     oklch(0.890, 0.004, 240),  // borders
  borderSoft: oklch(0.920, 0.003, 240),  // soft borders
  txtPri:     oklch(0.200, 0.005, 240),  // primary text
  txtSec:     oklch(0.400, 0.004, 240),  // secondary text
  txtTer:     oklch(0.550, 0.003, 240),  // tertiary text
  txtFaint:   oklch(0.680, 0.002, 240),  // faint text
}

/* Accent — cool charcoal */
export const A = {
  accent:  oklch(0.320, 0.005, 240),
  hover:   oklch(0.420, 0.004, 240),
  muted:   oklch(0.910, 0.003, 240),
  strong:  oklch(0.240, 0.005, 240),
  border:  oklch(0.700, 0.004, 240),
}

/* Functional */
export const F = {
  comment:  oklch(0.280, 0.005, 240),
  resolved: oklch(0.700, 0.003, 240),
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

/* On-dark text */
export const D = {
  text:    oklch(0.950, 0.002, 240),
  textSec: oklch(0.800, 0.003, 240),
}

/* ─── Spacing: 8px Base Unit ──────────────────────────
   Simple multiples of 8. No complex ratios.
   Generous, breathable, human-scale.
   ───────────────────────────────────────────────────── */
export const S = {
  xs:   4,   // hairline gaps, borders
  sm:   8,   // tight gaps, icon padding
  md:  12,   // standard gaps, row padding
  lg:  16,   // comfortable gaps, section padding
  xl:  24,   // major spacing, panel padding
  xxl: 32,   // large spacing, between sections
}

/* ─── Shell Dimensions ────────────────────────────────
   Rams: controls substantial but not dominant.
   The canvas (work surface) is the hero.
   ───────────────────────────────────────────────────── */
export const DIM = {
  topbar:   44,   // comfortable height (Apple HIG minimum)
  sidebar: 180,   // generous for page names
  row:      32,   // comfortable click target
  control:  28,   // icon button size
}

/* Canvas elevation */
export const E = {
  insetTop: 0,
  inset:   12,    // visible but not chunky
  radius:  12,    // soft corners
  shadow: `0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px ${oklch(0.905, 0.003, 240)}`,
}

/* Radii — generous, modern */
export const R = {
  control:  6,   // buttons, active rows
  card:     8,   // cards, dropdowns
  panel:   12,   // canvas, modals
  pill:    20,   // toast pills
}

/* Typography — clear hierarchy */
export const T = {
  label:   10,   // section headers, badges (was 9, too small)
  caption: 11,   // captions, meta
  body:    13,   // primary shell text (was 12, bump for readability)
  title:   14,   // emphasis, pickers
}

/* Icon sizes */
export const ICON = {
  sm:  14,   // secondary icons (was 12)
  md:  16,   // standard icons (was 14)
  lg:  18,   // primary actions (was 16)
}

export const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
