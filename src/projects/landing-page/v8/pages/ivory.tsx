import { useState } from 'react'
import canvasLatest from '../../screenshots/canvas-latest.png'

// ── Ivory — Warm Editorial ──────────────────────────────────────────────────
// Warm cream background, beautiful serif typography, magazine-like layout.
// Elegant and refined. Fully interactive sections.

const C = {
  bg: 'oklch(0.975 0.012 70)',
  bgCard: 'oklch(1.000 0 0)',
  text: 'oklch(0.180 0.015 50)',
  textSec: 'oklch(0.420 0.012 50)',
  textTer: 'oklch(0.580 0.008 50)',
  border: 'oklch(0.900 0.015 70)',
  accent: 'oklch(0.450 0.080 30)',
}

const serif = 'Georgia, "Times New Roman", serif'
const sans = '"Inter", -apple-system, system-ui, sans-serif'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}

const sections = [
  { id: 'about', label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'workflow', label: 'Workflow' },
]

export function Ivory() {
  const [activeSection, setActiveSection] = useState('about')
  const [bh, bhB] = useHover()
  const [ih, ihB] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: sans, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '28px 80px', maxWidth: 1100, margin: '0 auto',
      }}>
        <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 400, color: C.text, fontStyle: 'italic' }}>Bryllen</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {sections.map(s => (
            <span
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                fontSize: 14, color: activeSection === s.id ? C.text : C.textSec,
                cursor: 'default', borderBottom: activeSection === s.id ? `1px solid ${C.text}` : 'none',
                paddingBottom: 2,
              }}
            >{s.label}</span>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 80px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ maxWidth: 700 }}>
          <p style={{
            fontFamily: sans, fontSize: 12, color: C.accent, letterSpacing: '0.15em',
            textTransform: 'uppercase' as const, margin: '0 0 20px',
          }}>For Claude Code</p>
          <h1 style={{
            fontFamily: serif, fontSize: 60, fontWeight: 400, color: C.text,
            lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 28px',
          }}>
            The canvas for<br />design exploration
          </h1>
          <p style={{
            fontSize: 18, color: C.textSec, lineHeight: 1.7, margin: '0 0 36px',
            textWrap: 'pretty' as const,
          }}>
            An infinite surface where AI generates real React components. See multiple directions at once, click to refine, ship what you designed.
          </p>
          <button {...bhB} style={{
            border: `1px solid ${C.text}`, background: bh ? C.text : 'transparent',
            color: bh ? C.bg : C.text,
            padding: '14px 32px', borderRadius: 0, fontSize: 14, fontWeight: 500,
            cursor: 'default', letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
          }}>Begin designing</button>
        </div>
      </section>

      {/* Editorial image */}
      <section style={{ padding: '0 80px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div {...ihB} style={{
          overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: ih ? 'scale(1.005)' : 'scale(1)',
          transition: `transform 0.4s ${spring}`,
        }}>
          <img src={canvasLatest} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
        <p style={{
          fontFamily: serif, fontStyle: 'italic', fontSize: 14, color: C.textTer,
          textAlign: 'center' as const, marginTop: 16,
        }}>
          Multiple design directions, visible at once
        </p>
      </section>

      {/* Pull quote */}
      <section style={{
        padding: '80px 80px', maxWidth: 900, margin: '0 auto',
        borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      }}>
        <blockquote style={{
          fontFamily: serif, fontSize: 32, fontWeight: 400, color: C.text,
          lineHeight: 1.4, margin: 0, textAlign: 'center' as const,
          textWrap: 'balance' as const,
        }}>
          "Design by describing. Compare by seeing. Ship by exporting."
        </blockquote>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 80px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
          {[
            { num: 'I', title: 'Infinite Canvas', desc: 'Every design lives as a frame. Pan, zoom, compare. Everything visible at once.' },
            { num: 'II', title: 'AI Generation', desc: 'Describe what you want. Get multiple genuinely different directions, not variations.' },
            { num: 'III', title: 'Direct Annotation', desc: 'Click any element. Describe the change. Watch it happen. No export required.' },
          ].map(item => (
            <div key={item.num}>
              <span style={{
                fontFamily: serif, fontSize: 14, color: C.accent, display: 'block', marginBottom: 12,
              }}>{item.num}</span>
              <h4 style={{
                fontFamily: serif, fontSize: 20, fontWeight: 400, color: C.text, margin: '0 0 12px',
              }}>{item.title}</h4>
              <p style={{
                fontSize: 14, color: C.textSec, margin: 0, lineHeight: 1.65,
                textWrap: 'pretty' as const,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
