/* OKLCH ↔ sRGB ↔ Hex/HSL color conversion
   Based on Björn Ottosson's OKLab formulas */

// --- Linearize / delinearize sRGB ---

function linearize(x: number): number {
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
}

function delinearize(x: number): number {
  return x <= 0.0031308 ? x * 12.92 : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
}

// --- sRGB ↔ OKLab ---

function srgbToOklab(r: number, g: number, b: number): [number, number, number] {
  const lr = linearize(r), lg = linearize(g), lb = linearize(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ]
}

function oklabToSrgb(L: number, a: number, b: number): [number, number, number] {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  return [delinearize(r), delinearize(g), delinearize(bl)]
}

// --- OKLCH ↔ OKLab ---

export function oklchToSrgb(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180
  const a = c * Math.cos(hRad)
  const b = c * Math.sin(hRad)
  return oklabToSrgb(l, a, b)
}

export function srgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const [L, a, bVal] = srgbToOklab(r, g, b)
  const C = Math.sqrt(a * a + bVal * bVal)
  let H = (Math.atan2(bVal, a) * 180) / Math.PI
  if (H < 0) H += 360
  return [L, C, H]
}

// --- Hex ↔ sRGB ---

export function hexToSrgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ]
}

export function srgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v * 255)))
  return '#' + [r, g, b].map(v => clamp(v).toString(16).padStart(2, '0')).join('')
}

// --- HSL ↔ sRGB ---

export function hslToSrgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [f(0), f(8), f(4)]
}

export function srgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s * 100, l * 100]
}

// --- High-level converters ---

export function oklchToHex(l: number, c: number, h: number): string {
  const [r, g, b] = oklchToSrgb(l, c, h)
  return srgbToHex(r, g, b)
}

export function hexToOklch(hex: string): [number, number, number] {
  const [r, g, b] = hexToSrgb(hex)
  return srgbToOklch(r, g, b)
}

export function oklchToHsl(l: number, c: number, h: number): [number, number, number] {
  const [r, g, b] = oklchToSrgb(l, c, h)
  return srgbToHsl(r, g, b)
}

export function hslToOklch(h: number, s: number, l: number): [number, number, number] {
  const [r, g, b] = hslToSrgb(h, s, l)
  return srgbToOklch(r, g, b)
}

/** Check if an OKLCH color is within sRGB gamut */
export function isInGamut(l: number, c: number, h: number): boolean {
  const [r, g, b] = oklchToSrgb(l, c, h)
  return r >= -0.001 && r <= 1.001 && g >= -0.001 && g <= 1.001 && b >= -0.001 && b <= 1.001
}

/** Clamp sRGB values to [0, 1] */
export function clampSrgb(r: number, g: number, b: number): [number, number, number] {
  return [Math.max(0, Math.min(1, r)), Math.max(0, Math.min(1, g)), Math.max(0, Math.min(1, b))]
}

/** Convert OKLCH to a CSS-safe hex string (gamut clamped) */
export function oklchToDisplayHex(l: number, c: number, h: number): string {
  const [r, g, b] = oklchToSrgb(l, c, h)
  const [cr, cg, cb] = clampSrgb(r, g, b)
  return srgbToHex(cr, cg, cb)
}
