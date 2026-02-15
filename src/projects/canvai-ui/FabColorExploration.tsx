import { useState } from 'react'
import { MessageSquare, Pencil } from 'lucide-react'
import { ACCENT, TEXT, TEXT_TER, FONT, BORDER } from './tokens'

/* OKLCH shell colors — perceptually uniform grays */
const CANVAS_OK = 'oklch(0.975 0.002 260)'
const SURFACE_OK = 'oklch(0.995 0.001 260)'
const BORDER_OK = 'oklch(0.910 0.004 260)'
const TEXT_TER_OK = 'oklch(0.630 0.010 260)'

/* ── Plastic button helpers ────────────────────────── */

/**
 * Brighten a hex color for the gradient top without killing saturation.
 * Boosts the dominant channel more than others → preserves hue + chroma.
 * Not blending toward white — blending toward a brighter version of itself.
 */
function liftColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const max = Math.max(r, g, b)
  // Scale factor: push toward brighter version of same hue
  const factor = max > 0 ? Math.min(255 / max, 1.2) : 1.2
  const clamp = (c: number) => Math.min(255, Math.round(c * factor))
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`
}

/** Braun plastic: subtle gradient + inset highlight + neutral shadow */
function plasticBg(base: string) {
  return `linear-gradient(180deg, ${liftColor(base)} 0%, ${base} 100%)`
}
const PLASTIC_SHADOW = 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)'
const PLASTIC_SHADOW_SM = 'inset 0 0.5px 0 rgba(255,255,255,0.10), 0 1px 2px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06)'

/* ── FAB Color Concepts ────────────────────────────── */

interface FabStyle {
  bg: string
  gradient?: string // override plasticBg with a direct CSS gradient
}

const CONCEPTS: {
  name: string
  comment: FabStyle
  annotation: FabStyle
  note: string
}[] = [
  {
    name: 'A / Purple + Orange',
    comment: { bg: '#6366F1' },
    annotation: { bg: ACCENT },
    note: 'High contrast between the two. Both saturated.',
  },
  {
    name: 'B / Indigo + Orange',
    comment: { bg: '#4F46E5' },
    annotation: { bg: ACCENT },
    note: 'Deeper blue-purple. More serious, less playful.',
  },
  {
    name: 'C / Slate + Orange',
    comment: { bg: '#475569' },
    annotation: { bg: ACCENT },
    note: 'Comment recedes. Annotation is the hero action.',
  },
  {
    name: 'D / Charcoal + Orange',
    comment: { bg: '#1F2937' },
    annotation: { bg: ACCENT },
    note: 'Comment nearly invisible. Maximum restraint.',
  },
  {
    name: 'E / Teal + Coral',
    comment: { bg: '#0D9488' },
    annotation: { bg: '#F97316' },
    note: 'Complementary pair. Both warm-cool.',
  },
  {
    name: 'F / Blue + Orange',
    comment: { bg: '#2563EB' },
    annotation: { bg: ACCENT },
    note: 'Classic blue/orange split-complementary.',
  },
  {
    name: 'G / Violet + Amber',
    comment: { bg: '#7C3AED' },
    annotation: { bg: '#D97706' },
    note: 'Richer violet. Warmer amber annotation.',
  },
  {
    name: 'H / Rose + Orange',
    comment: { bg: '#E11D48' },
    annotation: { bg: ACCENT },
    note: 'Both warm. Could feel too similar.',
  },
  {
    name: 'I / Mint + Orange',
    comment: { bg: '#059669' },
    annotation: { bg: ACCENT },
    note: 'Green = conversation. Orange = action.',
  },
  {
    name: 'J / Muted purple + Orange',
    comment: { bg: '#818CF8' },
    annotation: { bg: ACCENT },
    note: 'Softer purple. Less competing with accent.',
  },
  {
    name: 'K / Slate monochrome',
    comment: {
      bg: 'oklch(0.645 0.018 256)',
      gradient: 'linear-gradient(180deg, oklch(0.700 0.018 256) 0%, oklch(0.645 0.018 256) 100%)',
    },
    annotation: {
      bg: 'oklch(0.378 0.016 256)',
      gradient: 'linear-gradient(180deg, oklch(0.440 0.016 256) 0%, oklch(0.378 0.016 256) 100%)',
    },
    note: 'Braun SK 4. Controls are part of the surface. No color, just density. Orange only on pins.',
  },
]

/** Resolve background: use gradient override if present, else plasticBg from hex */
function fabBg(style: FabStyle): string {
  return style.gradient ?? plasticBg(style.bg)
}

function FabConcept({ concept }: { concept: typeof CONCEPTS[0] }) {
  const [hoverComment, setHoverComment] = useState(false)
  const [hoverAnnotate, setHoverAnnotate] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Label */}
      <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, fontFamily: FONT }}>
        {concept.name}
      </div>

      {/* Mini canvas with content */}
      <div style={{
        width: 360, height: 240, borderRadius: 10, backgroundColor: CANVAS_OK,
        border: `1px solid ${BORDER_OK}`, position: 'relative', overflow: 'hidden',
      }}>
        {/* Fake topbar */}
        <div style={{
          height: 32, backgroundColor: SURFACE_OK, borderBottom: `1px solid ${BORDER_OK}`,
          display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: 4, backgroundColor: ACCENT,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 7, fontWeight: 700,
          }}>C</div>
          <span style={{ fontSize: 11, fontWeight: 500, color: TEXT, fontFamily: FONT }}>my-project</span>
        </div>

        {/* Fake frames */}
        <div style={{
          position: 'absolute', top: 52, left: 20,
          width: 120, height: 72, borderRadius: 6, backgroundColor: SURFACE_OK,
          border: `1px solid ${BORDER_OK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 9, color: TEXT_TER_OK }}>Card A</div>
        </div>
        <div style={{
          position: 'absolute', top: 64, left: 160,
          width: 100, height: 80, borderRadius: 6, backgroundColor: SURFACE_OK,
          border: `1px solid ${BORDER_OK}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 9, color: TEXT_TER_OK }}>Card B</div>
        </div>

        {/* Comment pin — plastic treatment */}
        <div style={{
          position: 'absolute', top: 44, left: 118,
          width: 20, height: 20, borderRadius: '50%',
          background: fabBg(concept.comment), color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8, fontWeight: 700, fontFamily: FONT,
          boxShadow: PLASTIC_SHADOW_SM,
        }}>
          N
        </div>

        {/* Annotation marker — plastic treatment */}
        <div style={{
          position: 'absolute', top: 58, left: 240,
          width: 18, height: 18, borderRadius: '50%',
          background: fabBg(concept.annotation), color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, fontFamily: FONT,
          boxShadow: PLASTIC_SHADOW_SM,
        }}>
          1
        </div>

        {/* FABs — Braun plastic buttons */}
        <div style={{
          position: 'absolute', bottom: 12, right: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <button
            onMouseEnter={() => setHoverComment(true)}
            onMouseLeave={() => setHoverComment(false)}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: fabBg(concept.comment), color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: hoverComment
                ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.06)'
                : PLASTIC_SHADOW,
              cursor: 'default',
              transform: hoverComment ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.1s ease, box-shadow 0.15s ease',
            }}>
            <MessageSquare size={14} strokeWidth={1.5} />
          </button>
          <button
            onMouseEnter={() => setHoverAnnotate(true)}
            onMouseLeave={() => setHoverAnnotate(false)}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: fabBg(concept.annotation), color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: hoverAnnotate
                ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.06)'
                : PLASTIC_SHADOW,
              cursor: 'default',
              transform: hoverAnnotate ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.1s ease, box-shadow 0.15s ease',
            }}>
            <Pencil size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Note */}
      <div style={{
        fontSize: 10, color: TEXT_TER, fontStyle: 'italic', lineHeight: 1.4,
        fontFamily: FONT, textWrap: 'pretty', maxWidth: 360,
      } as React.CSSProperties}>
        {concept.note}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */

export function FabColorGrid() {
  return (
    <div style={{ fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 24, padding: 8 }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: TEXT_TER,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        FAB Color Exploration — 11 Concepts, Braun Plastic
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 360px)',
        gap: 24,
      }}>
        {CONCEPTS.map(c => (
          <FabConcept key={c.name} concept={c} />
        ))}
      </div>

      <div style={{
        fontSize: 10, color: TEXT_TER, fontStyle: 'italic',
        padding: '4px 8px', borderLeft: `2px solid ${BORDER}`, textWrap: 'pretty',
      } as React.CSSProperties}>
        All concepts use neutral shadows + subtle gradient + inset highlight. K is full monochrome — FABs are just different densities of the same slate. OKLCH for perceptual uniformity.
      </div>
    </div>
  )
}
