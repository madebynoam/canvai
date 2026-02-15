import { useState } from 'react'
import { MessageSquare, Pencil, Check } from 'lucide-react'
import { FONT, BORDER, TEXT, TEXT_SEC, TEXT_TER } from './tokens'
import { PanelLeft, ChevronDown, ChevronRight } from 'lucide-react'

/* ── OKLCH Helpers ────────────────────────────── */

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l} ${c} ${h})`
}

/* ════════════════════════════════════════════════════
   FIXED NEUTRAL SCALE — Achromatic, Layered Surfaces

   Modern tool aesthetic (Linear, Figma, Braun):
   Chrome (sidebar/topbar) is a distinct neutral layer.
   Canvas (workspace) is lighter — the user's work is hero.
   Cards on canvas are white. Three depth levels.
   Chroma = 0 everywhere. Pure achromatic.
   ════════════════════════════════════════════════════ */

const SHELL = {
  // Surfaces — three depth levels
  chrome:     oklch(0.955, 0.000, 0),    // sidebar + topbar (aluminum)
  chromeSub:  oklch(0.940, 0.000, 0),    // active/hover on chrome
  canvas:     oklch(0.975, 0.000, 0),    // workspace — lighter than chrome
  card:       oklch(0.995, 0.000, 0),    // cards on canvas — near-white
  // Edges
  border:     oklch(0.900, 0.000, 0),    // chrome borders
  borderSoft: oklch(0.920, 0.000, 0),    // card borders (softer)
  // Text
  txtPri:     oklch(0.200, 0.000, 0),    // primary
  txtSec:     oklch(0.400, 0.000, 0),    // secondary
  txtTer:     oklch(0.560, 0.000, 0),    // tertiary
  txtFaint:   oklch(0.680, 0.000, 0),    // ghost / placeholder
  // Functional
  comment:    oklch(0.260, 0.000, 0),    // comment FAB — near-black
  resolved:   oklch(0.700, 0.000, 0),    // resolved pin — dimmed
}

/* ── Components ────────────────────────────── */

function Swatch({ color, label, sublabel, size = 40, dark }: {
  color: string; label?: string; sublabel?: string; size?: number; dark?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: size, height: size, borderRadius: 8, backgroundColor: color,
          border: `1px solid rgba(0,0,0,0.06)`,
          cursor: 'default',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.1s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        {dark !== undefined && (
          <span style={{ fontSize: 8, fontWeight: 600, color: dark ? '#fff' : TEXT, fontFamily: FONT }}>
            Aa
          </span>
        )}
      </div>
      {label && <span style={{ fontSize: 8, color: TEXT_SEC, fontFamily: FONT, fontWeight: 500 }}>{label}</span>}
      {sublabel && <span style={{ fontSize: 7, color: TEXT_TER, fontFamily: FONT }}>{sublabel}</span>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 600, color: TEXT_TER,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      fontFamily: FONT, marginBottom: 4,
    }}>
      {children}
    </div>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, color: TEXT_TER, fontStyle: 'italic',
      padding: '4px 8px', borderLeft: `2px solid ${BORDER}`,
      textWrap: 'pretty', fontFamily: FONT,
    } as React.CSSProperties}>
      {children}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    comment: { bg: 'oklch(0.93 0.05 270)', fg: 'oklch(0.45 0.15 270)' },
    annotation: { bg: 'oklch(0.93 0.05 55)', fg: 'oklch(0.50 0.15 55)' },
    either: { bg: 'oklch(0.93 0.01 0)', fg: TEXT_SEC },
  }
  const c = colors[role] || colors.either
  return (
    <span style={{
      fontSize: 8, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
      backgroundColor: c.bg, color: c.fg, fontFamily: FONT,
      textTransform: 'uppercase', letterSpacing: '0.04em',
    }}>
      {role}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════
   Section 1: Neutral Grays — Achromatic
   ═══════════════════════════════════════════════════════ */

/* Rams neutrals: c ≤ 0.003 at every step.
   No hue tinting. Pure perceptual gray. */
const NEUTRALS_ACHROMATIC = [
  { name: '50',  l: 0.985, c: 0.000 },
  { name: '100', l: 0.965, c: 0.001 },
  { name: '200', l: 0.925, c: 0.002 },
  { name: '300', l: 0.870, c: 0.003 },
  { name: '400', l: 0.710, c: 0.003 },
  { name: '500', l: 0.554, c: 0.003 },
  { name: '600', l: 0.446, c: 0.003 },
  { name: '700', l: 0.372, c: 0.003 },
  { name: '800', l: 0.279, c: 0.003 },
  { name: '900', l: 0.208, c: 0.003 },
  { name: '950', l: 0.129, c: 0.002 },
]

/* Compare: barely-tinted grays (c=0.005-0.008) that
   "feel" warmer/cooler without registering as colored */
const NEUTRAL_TEMPS: { name: string; hue: number; chroma: number; note: string }[] = [
  { name: 'Achromatic',  hue: 0,   chroma: 0.000, note: 'Zero chroma — true neutral' },
  { name: 'Cool (sub-JND)', hue: 260, chroma: 0.003, note: 'Below perceptual threshold — reads as neutral but photographs slightly cool' },
  { name: 'Warm (sub-JND)', hue: 80,  chroma: 0.003, note: 'Below perceptual threshold — reads as neutral but feels marginally warmer' },
  { name: 'Cool bias',   hue: 260, chroma: 0.006, note: 'Just barely perceptible blue. Apple/Linear territory.' },
  { name: 'Warm bias',   hue: 80,  chroma: 0.006, note: 'Just barely perceptible warmth. Cream paper feel.' },
]

export function OklchNeutrals() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <SectionTitle>Achromatic Neutrals — Rams Grade</SectionTitle>

      <Note>
        "Good design is as little design as possible." — Dieter Rams. Neutrals must be achromatic (c ≤ 0.003).
        The shell is brushed aluminum and white plastic. No hue. No opinion. The accent is the only color.
      </Note>

      {/* Current hex vs achromatic OKLCH */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: TEXT_SEC }}>Current (hex) → Achromatic OKLCH</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 8, color: TEXT_TER }}>Current hex (has blue tint)</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Swatch color="#F7F7F8" label="Surf.Sub" size={36} />
              <Swatch color="#E5E7EB" label="Border" size={36} />
              <Swatch color="#9CA3AF" label="Txt.Ter" size={36} />
              <Swatch color="#6B7280" label="Txt.Sec" size={36} />
              <Swatch color="#1F2937" label="Txt.Pri" size={36} />
            </div>
          </div>
          <div style={{ fontSize: 10, color: TEXT_TER, padding: '0 8px 12px' }}>→</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 8, color: TEXT_TER }}>Achromatic (c=0, honest gray)</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Swatch color={oklch(0.975, 0.000, 0)} label="Surf.Sub" size={36} />
              <Swatch color={oklch(0.900, 0.000, 0)} label="Border" size={36} />
              <Swatch color={oklch(0.570, 0.000, 0)} label="Txt.Ter" size={36} />
              <Swatch color={oklch(0.420, 0.000, 0)} label="Txt.Sec" size={36} />
              <Swatch color={oklch(0.200, 0.000, 0)} label="Txt.Pri" size={36} />
            </div>
          </div>
        </div>
      </div>

      {/* Achromatic scale */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: TEXT_SEC }}>Full achromatic scale — 50 → 950</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {NEUTRALS_ACHROMATIC.map(step => (
              <Swatch
                key={step.name}
                color={oklch(step.l, step.c, 0)}
                label={step.name}
                size={48}
                dark={step.l < 0.5}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Temperature comparison at sub-JND chroma */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: TEXT_SEC }}>Temperature bias at sub-perceptual chroma</div>
        {NEUTRAL_TEMPS.map(nt => (
          <div key={nt.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 96, textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{nt.name}</div>
              <div style={{ fontSize: 8, color: TEXT_TER }}>c={nt.chroma} h={nt.hue}</div>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {NEUTRALS_ACHROMATIC.map(step => (
                <Swatch
                  key={step.name}
                  color={oklch(step.l, Math.max(step.c, nt.chroma), nt.hue)}
                  size={44}
                  dark={step.l < 0.5}
                />
              ))}
            </div>
            <span style={{ fontSize: 9, color: TEXT_TER, fontStyle: 'italic', maxWidth: 200, textWrap: 'pretty' } as React.CSSProperties}>{nt.note}</span>
          </div>
        ))}
      </div>

      <Note>
        At c ≤ 0.003, hue is below the just-noticeable difference. These all read as the same gray.
        Pick achromatic (c=0) for maximum honesty, or cool bias (c=0.003, h=260) if you want the faintest Apple-like coolness.
      </Note>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Section 2: Hue Families — Accent Candidates
   ═══════════════════════════════════════════════════════ */

interface HueFamily {
  name: string
  hue: number
  note: string
  role: 'comment' | 'annotation' | 'either'
}

const HUE_FAMILIES: HueFamily[] = [
  { name: 'Indigo',   hue: 270, note: 'Deep, trustworthy',         role: 'comment' },
  { name: 'Violet',   hue: 295, note: 'Creative, expressive',      role: 'comment' },
  { name: 'Blue',     hue: 250, note: 'Classic, calm',             role: 'comment' },
  { name: 'Cerulean', hue: 235, note: 'Bright, accessible',        role: 'comment' },
  { name: 'Teal',     hue: 185, note: 'Fresh, modern',             role: 'either' },
  { name: 'Orange',   hue: 55,  note: 'Current accent',            role: 'annotation' },
  { name: 'Coral',    hue: 30,  note: 'Warmer, less aggressive',   role: 'annotation' },
  { name: 'Amber',    hue: 75,  note: 'Golden, approachable',      role: 'annotation' },
  { name: 'Red',      hue: 25,  note: 'Urgent, action',            role: 'annotation' },
  { name: 'Rose',     hue: 10,  note: 'Warm pink, friendly',       role: 'either' },
]

const TINT_STEPS = [
  { name: '50',  l: 0.97, c: 0.02 },
  { name: '100', l: 0.93, c: 0.05 },
  { name: '200', l: 0.87, c: 0.10 },
  { name: '300', l: 0.78, c: 0.14 },
  { name: '400', l: 0.68, c: 0.18 },
  { name: '500', l: 0.58, c: 0.20 },
  { name: '600', l: 0.52, c: 0.19 },
  { name: '700', l: 0.44, c: 0.17 },
  { name: '800', l: 0.36, c: 0.14 },
  { name: '900', l: 0.28, c: 0.10 },
]

export function OklchHueFamilies() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <SectionTitle>Hue Families — Accent Candidates</SectionTitle>

      <Note>
        Each family shows 10 steps from light (50) to dark (900). Chroma peaks at 500.
        The accent will be ONE of these at ONE lightness. Everything else is achromatic.
      </Note>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {HUE_FAMILIES.map(fam => (
          <div key={fam.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 72, textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: TEXT }}>{fam.name}</div>
              <div style={{ fontSize: 8, color: TEXT_TER, marginBottom: 2 }}>h={fam.hue}</div>
              <RoleBadge role={fam.role} />
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {TINT_STEPS.map(step => (
                <Swatch
                  key={step.name}
                  color={oklch(step.l, step.c, fam.hue)}
                  label={step.name}
                  size={44}
                  dark={step.l < 0.5}
                />
              ))}
            </div>
            <span style={{ fontSize: 9, color: TEXT_TER, fontStyle: 'italic', maxWidth: 140, textWrap: 'pretty' } as React.CSSProperties}>
              {fam.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Section 3: 32 Accent Options — Fixed Achromatic Shell

   Rams rule: the shell is achromatic aluminum.
   The accent is the ONLY color. Like an indicator light
   on a Braun radio — functional, not decorative.

   Comment FAB = near-black achromatic (l=0.28, c=0.003).
   Annotation FAB = the one accent.
   Pins, buttons, logo mark — all derive from the accent.
   Neutrals are IDENTICAL across all 32 options.
   ═══════════════════════════════════════════════════════ */

interface AccentOption {
  name: string
  group: string
  accent: { l: number; c: number; h: number }
  commentOverride?: { l: number; c: number; h: number } // override the near-black comment FAB
  note: string
}

const ACCENTS: AccentOption[] = [
  /* ── A: Braun Reference ─────────────────────────
     Colors sampled from actual Braun/Rams products.
     These are the "right answers" for this aesthetic. */
  {
    name: '1 / Braun Orange',
    group: 'Braun Reference',
    accent: { l: 0.62, c: 0.20, h: 55 },
    note: 'SK4 record player, TP1 radio knob. The canonical Rams accent. Warm, functional, unmistakable.',
  },
  {
    name: '2 / Braun Orange (darker)',
    group: 'Braun Reference',
    accent: { l: 0.55, c: 0.18, h: 52 },
    note: 'Same hue, lower lightness. Like the darker knobs on the T1000 radio. More gravitas.',
  },
  {
    name: '3 / Braun Red',
    group: 'Braun Reference',
    accent: { l: 0.52, c: 0.20, h: 28 },
    note: 'ET66 calculator minus key. Not alarm-red — a controlled, warm red. Decisive.',
  },
  {
    name: '4 / Braun Yellow',
    group: 'Braun Reference',
    accent: { l: 0.82, c: 0.16, h: 95 },
    note: 'ET66 calculator top row. Bright but not acid — OKLCH keeps it honest at high lightness.',
  },
  {
    name: '5 / Braun Green',
    group: 'Braun Reference',
    accent: { l: 0.55, c: 0.14, h: 155 },
    note: 'Power-on indicator. Functional green — not minty, not forest. Exactly "this is working."',
  },
  {
    name: '6 / Braun Cream',
    group: 'Braun Reference',
    accent: { l: 0.90, c: 0.04, h: 85 },
    note: 'The warm cream of 1960s Braun casings. Barely-there warmth. Accent by absence of gray.',
  },
  {
    name: '7 / Braun Aluminum',
    group: 'Braun Reference',
    accent: { l: 0.68, c: 0.005, h: 260 },
    note: 'Brushed metal dials. The "accent" is just a lighter gray. Total material honesty.',
  },
  {
    name: '8 / Braun Charcoal',
    group: 'Braun Reference',
    accent: { l: 0.35, c: 0.005, h: 0 },
    note: 'T3 radio display surround. Dark, matte, achromatic. The accent is darker, not colored.',
  },

  /* ── B: Orange Refined ──────────────────────────
     Our current accent (h≈55) explored at different
     chroma and lightness levels. How much orange? */
  {
    name: '9 / Orange — Full Chroma',
    group: 'Orange Refined',
    accent: { l: 0.62, c: 0.22, h: 55 },
    note: 'Maximum saturation at this hue. Closest to current #E8590C. The accent demands attention.',
  },
  {
    name: '10 / Orange — Medium Chroma',
    group: 'Orange Refined',
    accent: { l: 0.62, c: 0.16, h: 55 },
    note: 'Chroma pulled to 0.16. Still reads as orange but less aggressive. Calmer.',
  },
  {
    name: '11 / Orange — Low Chroma',
    group: 'Orange Refined',
    accent: { l: 0.60, c: 0.10, h: 55 },
    note: 'c=0.10 — is this still orange? Barely. More like a warm gray that remembers being orange. Maximum restraint.',
  },
  {
    name: '12 / Orange — Whisper',
    group: 'Orange Refined',
    accent: { l: 0.58, c: 0.06, h: 55 },
    note: 'c=0.06 — perceptually a warm medium gray. The brand color as a ghost. You feel it more than see it.',
  },
  {
    name: '13 / Orange — Light',
    group: 'Orange Refined',
    accent: { l: 0.72, c: 0.18, h: 55 },
    note: 'Higher lightness (0.72). Lighter, more airy. Note: white text needs l < 0.65 for WCAG AA.',
  },
  {
    name: '14 / Orange — Dark',
    group: 'Orange Refined',
    accent: { l: 0.48, c: 0.16, h: 55 },
    note: 'Significantly darker (l=0.48). Feels heavier, more serious. Like a dark leather strap.',
  },
  {
    name: '15 / Burnt Orange',
    group: 'Orange Refined',
    accent: { l: 0.55, c: 0.18, h: 45 },
    note: 'Hue rotated 10° toward red. Earthier, less playful. Terracotta adjacent.',
  },
  {
    name: '16 / Warm Coral',
    group: 'Orange Refined',
    accent: { l: 0.60, c: 0.17, h: 35 },
    note: 'h=35 splits red and orange. Softer warmth. Less industrial than pure orange.',
  },

  /* ── C: Cool Precision ──────────────────────────
     Blues, indigos, violets. These must feel like
     precision instruments, not decorative. */
  {
    name: '17 / Steel Blue',
    group: 'Cool Precision',
    accent: { l: 0.55, c: 0.10, h: 255 },
    note: 'Low-chroma blue (c=0.10). Like anodized steel. Reads as "this is a serious tool."',
  },
  {
    name: '18 / Linear Blue',
    group: 'Cool Precision',
    accent: { l: 0.56, c: 0.14, h: 250 },
    note: 'Linear\'s signature feel. Enough blue to be identifiable, not enough to feel playful.',
  },
  {
    name: '19 / Indigo',
    group: 'Cool Precision',
    accent: { l: 0.52, c: 0.18, h: 275 },
    note: 'Deep indigo. Rich without being loud. The "intellectual" blue. Trustworthy.',
  },
  {
    name: '20 / Indigo — Muted',
    group: 'Cool Precision',
    accent: { l: 0.50, c: 0.10, h: 275 },
    note: 'Same hue, chroma halved. Blue-gray instrument dial. Barely colored.',
  },
  {
    name: '21 / Violet',
    group: 'Cool Precision',
    accent: { l: 0.54, c: 0.16, h: 295 },
    note: 'Controlled violet. Creative but restrained — the Figma influence, pulled back.',
  },
  {
    name: '22 / Violet — Whisper',
    group: 'Cool Precision',
    accent: { l: 0.52, c: 0.08, h: 295 },
    note: 'c=0.08 at violet. Is it purple or gray? The ambiguity is the point.',
  },
  {
    name: '23 / Teal',
    group: 'Cool Precision',
    accent: { l: 0.58, c: 0.10, h: 185 },
    note: 'Low-chroma teal. h=185 is green-blue. Fresh without being decorative. Clinical precision.',
  },
  {
    name: '24 / Cyan',
    group: 'Cool Precision',
    accent: { l: 0.60, c: 0.12, h: 220 },
    note: 'Sky-cyan at low chroma. Like an illuminated readout on a control panel.',
  },

  /* ── D: Achromatic + Edge Cases ─────────────────
     What if the accent is barely a color? Or not a
     color at all? Or the darkest possible? Rams
     pushed restraint further than anyone. */
  {
    name: '25 / Warm Neutral',
    group: 'Edge Cases',
    accent: { l: 0.55, c: 0.04, h: 55 },
    note: 'c=0.04 — below conscious perception as orange. A warm medium gray that technically has a hue. Ghost color.',
  },
  {
    name: '26 / Cool Neutral',
    group: 'Edge Cases',
    accent: { l: 0.50, c: 0.04, h: 260 },
    note: 'Same as #25 but cool-biased. Both read as "gray with an opinion." The opinion is barely audible.',
  },
  {
    name: '27 / Near-Black',
    group: 'Edge Cases',
    accent: { l: 0.35, c: 0.003, h: 0 },
    note: 'The accent FAB is just a slightly lighter black than the comment FAB. Both blend into the shell edge. The UI has no color.',
  },
  {
    name: '28 / Silver',
    group: 'Edge Cases',
    accent: { l: 0.72, c: 0.003, h: 0 },
    note: 'Annotation is a light achromatic circle. Like polished aluminum against matte aluminum. Material contrast only.',
  },
  {
    name: '29 / Amber — Indicator',
    group: 'Edge Cases',
    accent: { l: 0.72, c: 0.14, h: 80 },
    note: 'Like a warm indicator LED. Higher lightness so it glows. Amber reads as "ready" not "warning."',
  },
  {
    name: '30 / Rose — Controlled',
    group: 'Edge Cases',
    accent: { l: 0.56, c: 0.12, h: 10 },
    note: 'h=10 at low chroma. Not pink, not red — a neutral that leans warm-rose. Unexpected, memorable.',
  },
  {
    name: '31 / Emerald — Functional',
    group: 'Edge Cases',
    accent: { l: 0.55, c: 0.12, h: 160 },
    note: 'Green as function, not decoration. This is "active/on." Pairs naturally with achromatic shell.',
  },
  {
    name: '32 / Plum',
    group: 'Edge Cases',
    accent: { l: 0.45, c: 0.10, h: 320 },
    note: 'Dark, low-chroma red-purple. Dusky, sophisticated. Reads almost as a warm dark gray at small sizes.',
  },
  {
    name: '33 / Slate Monochrome',
    group: 'Slate',
    accent: { l: 0.378, c: 0.016, h: 256 },
    commentOverride: { l: 0.645, c: 0.018, h: 256 },
    note: 'Braun SK 4. Both FABs are slate — main is darker, secondary lighter. Controls are part of the surface. No color, just density. Orange only on annotation pins.',
  },
]

/* ── Accent palette (minted tint for inline use) ─── */
function accentTint(a: AccentOption['accent']): string {
  return oklch(Math.min(a.l + 0.32, 0.95), a.c * 0.10, a.h)
}

/* ── Preview Component ─────────────────────────── */

function AccentPreview({ opt }: { opt: AccentOption }) {
  const accent = oklch(opt.accent.l, opt.accent.c, opt.accent.h)
  const commentColor = opt.commentOverride
    ? oklch(opt.commentOverride.l, opt.commentOverride.c, opt.commentOverride.h)
    : SHELL.comment
  // Shadows are neutral — light doesn't change color based on the object.
  const shadow = 'rgba(0,0,0,0.10)'
  const shadowStrong = 'rgba(0,0,0,0.16)'
  const S = SHELL

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, fontFamily: FONT }}>{opt.name}</div>

      {/* Self-contained mini shell — achromatic + one accent */}
      <div style={{
        width: 620, height: 380, borderRadius: 8, overflow: 'hidden',
        border: `1px solid ${S.border}`,
        display: 'flex', flexDirection: 'column', fontFamily: FONT,
      }}>
        {/* ── Topbar — chrome surface ─────────────── */}
        <div style={{
          height: 36, backgroundColor: S.chrome, borderBottom: `1px solid ${S.border}`,
          display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, flexShrink: 0,
        }}>
          <PanelLeft size={14} strokeWidth={1.5} color={S.txtTer} />
          {/* Logo mark — the accent's first appearance */}
          <div style={{
            width: 16, height: 16, borderRadius: 4, backgroundColor: accent,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 700,
          }}>C</div>
          <span style={{ fontSize: 11, fontWeight: 500, color: S.txtPri }}>canvai-ui</span>
          <ChevronDown size={10} strokeWidth={1.5} color={S.txtTer} />
          <div style={{ flex: 1 }} />
          <div style={{
            fontSize: 9, color: S.txtTer, padding: '2px 6px',
            borderRadius: 4, backgroundColor: S.chromeSub,
          }}>3 iterations</div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* ── Sidebar — chrome surface ──────────────── */}
          <div style={{
            width: 148, borderRight: `1px solid ${S.border}`,
            backgroundColor: S.chrome, padding: '8px 0', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <div style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronDown size={8} strokeWidth={1.5} color={S.txtTer} />
              <span style={{ fontSize: 10, fontWeight: 600, color: S.txtPri }}>V7</span>
            </div>
            {['Comments Flow', 'FAB Colors', 'OKLCH Pairs'].map((name, i) => (
              <div key={name} style={{
                padding: '3px 12px 3px 24px', fontSize: 10,
                color: i === 2 ? S.txtPri : S.txtTer,
                fontWeight: i === 2 ? 600 : 400,
                backgroundColor: i === 2 ? S.chromeSub : 'transparent',
                borderRadius: 4, margin: '0 4px',
              }}>{name}</div>
            ))}
            <div style={{
              padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4,
              marginTop: 4,
            }}>
              <ChevronRight size={8} strokeWidth={1.5} color={S.txtFaint} />
              <span style={{ fontSize: 10, color: S.txtTer }}>V6</span>
            </div>
            <div style={{
              padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <ChevronRight size={8} strokeWidth={1.5} color={S.txtFaint} />
              <span style={{ fontSize: 10, color: S.txtTer }}>V5</span>
            </div>
          </div>

          {/* ── Canvas area — lighter than chrome ────── */}
          <div style={{ flex: 1, backgroundColor: S.canvas, position: 'relative' }}>
            {/* Design cards — white on canvas */}
            <div style={{ padding: 20, display: 'flex', gap: 16 }}>
              {/* Card A */}
              <div style={{
                width: 152, borderRadius: 8, backgroundColor: S.card,
                border: `1px solid ${S.borderSoft}`, padding: 12,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: S.txtPri }}>Sign In</div>
                <div style={{ height: 20, borderRadius: 4, backgroundColor: S.canvas, border: `1px solid ${S.borderSoft}` }} />
                <div style={{
                  height: 24, borderRadius: 6, backgroundColor: accent, color: '#fff',
                  fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>Connect GitHub</div>
                <div style={{ fontSize: 8, color: S.txtFaint, textAlign: 'center' }}>OAuth device flow</div>
              </div>
              {/* Card B */}
              <div style={{
                width: 136, borderRadius: 8, backgroundColor: S.card,
                border: `1px solid ${S.borderSoft}`, padding: 12,
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <div style={{ fontSize: 9, fontWeight: 600, color: S.txtPri }}>Thread</div>
                {[
                  { initials: 'NA', text: 'Spacing feels off here', time: '2m' },
                  { initials: 'JK', text: 'Agreed, try 8px', time: '1m' },
                ].map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: i === 0 ? commentColor : S.txtSec,
                      color: '#fff', fontSize: 6, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{msg.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 8, color: S.txtSec, lineHeight: 1.3 }}>{msg.text}</div>
                      <div style={{ fontSize: 7, color: S.txtFaint }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div style={{
                  height: 18, borderRadius: 4, backgroundColor: S.canvas,
                  border: `1px solid ${S.borderSoft}`,
                  display: 'flex', alignItems: 'center', padding: '0 6px',
                }}>
                  <span style={{ fontSize: 7, color: S.txtFaint }}>Reply…</span>
                </div>
              </div>
            </div>

            {/* Comment pin */}
            <div style={{
              position: 'absolute', top: 16, left: 140,
              width: 22, height: 22, borderRadius: '50%',
              backgroundColor: commentColor, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
              boxShadow: `0 1px 4px ${shadow}`,
            }}>N</div>
            <div style={{
              position: 'absolute', top: 12, left: 156,
              width: 13, height: 13, borderRadius: '50%',
              backgroundColor: commentColor, color: '#fff',
              fontSize: 7, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `2px solid ${S.canvas}`,
            }}>2</div>

            {/* Annotation marker — the accent */}
            <div style={{
              position: 'absolute', top: 28, right: 80,
              width: 18, height: 18, borderRadius: '50%',
              backgroundColor: accent, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700,
              boxShadow: `0 1px 4px ${shadow}`,
            }}>1</div>

            {/* Resolved pin */}
            <div style={{
              position: 'absolute', bottom: 48, left: 28, opacity: 0.35,
              width: 16, height: 16, borderRadius: '50%',
              backgroundColor: S.resolved,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={9} strokeWidth={2} color="#fff" />
            </div>

            {/* FABs */}
            <div style={{
              position: 'absolute', bottom: 16, right: 16,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: commentColor, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${shadow}`,
              }}>
                <MessageSquare size={14} strokeWidth={1.5} />
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${shadowStrong}`,
              }}>
                <Pencil size={14} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swatches */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <Swatch color={commentColor} label="Comment" size={20} />
        <Swatch color={accent} label="Accent" size={20} />
        <Swatch color={accentTint(opt.accent)} label="Tint" size={20} />
        <div style={{ width: 1, height: 16, backgroundColor: BORDER, margin: '0 4px' }} />
        <Swatch color={S.canvas} label="Canvas" size={20} />
        <Swatch color={S.border} label="Border" size={20} />
        <Swatch color={S.txtPri} label="Text" size={20} />
        <Swatch color={S.txtTer} label="Muted" size={20} />
      </div>
      <div style={{
        fontSize: 9, color: TEXT_TER, fontStyle: 'italic', lineHeight: 1.4,
        fontFamily: FONT, textWrap: 'pretty', maxWidth: 620,
      } as React.CSSProperties}>
        {opt.note}
      </div>
    </div>
  )
}

/* ── Group header ─────────────────────────────── */

function GroupHeader({ name, description }: { name: string; description: string }) {
  return (
    <div style={{
      gridColumn: '1 / -1', padding: '16px 0 0',
      borderTop: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TEXT, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {name}
      </div>
      <div style={{ fontSize: 9, color: TEXT_TER, fontFamily: FONT, fontStyle: 'italic', textWrap: 'pretty' } as React.CSSProperties}>
        {description}
      </div>
    </div>
  )
}

const GROUPS: { name: string; description: string; range: [number, number] }[] = [
  { name: 'A — Braun Reference', description: 'Colors sampled from actual Braun/Rams products. The canonical answers for this aesthetic.', range: [0, 8] },
  { name: 'B — Orange Refined', description: 'Our current accent (h≈55) at different chroma and lightness levels. How much orange is right?', range: [8, 16] },
  { name: 'C — Cool Precision', description: 'Blues, indigos, violets, teals. Must feel like precision instruments, not decoration.', range: [16, 24] },
  { name: 'D — Edge Cases', description: 'Near-achromatic accents, material contrast, unusual hues at low chroma. How far can restraint go?', range: [24, 32] },
  { name: 'E — Slate', description: 'Both FABs are cool slate — different densities of the same material. No accent color on controls at all. Braun SK 4 energy.', range: [32, 33] },
]

export function OklchPairs() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 20, padding: 8 }}>
      <SectionTitle>33 Accent Options — Fixed Achromatic Shell</SectionTitle>

      <Note>
        Rams rule: the shell is achromatic aluminum. The accent is the ONLY color — like an indicator light on a Braun radio.
        Comment FAB is near-black (achromatic). Annotation FAB carries the accent. Neutrals are IDENTICAL across all 32 options.
        The question is: what color is the one indicator light?
      </Note>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 620px)',
        gap: 32,
      }}>
        {GROUPS.map(group => {
          const items = ACCENTS.slice(group.range[0], group.range[1])
          return [
            <GroupHeader key={`group-${group.name}`} name={group.name} description={group.description} />,
            ...items.map(opt => <AccentPreview key={opt.name} opt={opt} />),
          ]
        })}
      </div>
    </div>
  )
}
