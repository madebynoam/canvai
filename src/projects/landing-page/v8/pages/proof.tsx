import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'

// ── Proof — Typography IS the design ──────────────────────────────────────
// Massive letterforms. "CANVAI" fills the hero. Each letter is a different
// shade. Small text in the gaps. The type does all the work.

const C = {
  bg: 'oklch(0.990 0.002 80)',
  text: 'oklch(0.100 0.005 80)',
  textSec: 'oklch(0.360 0.005 80)',
  textTer: 'oklch(0.580 0.005 80)',
  border: 'oklch(0.885 0.005 80)',
  accent: 'oklch(0.230 0.005 80)',
  onDark: 'oklch(0.970 0.003 80)',
  // Letter shades — from light to dark
  l1: 'oklch(0.900 0.003 80)',
  l2: 'oklch(0.800 0.003 80)',
  l3: 'oklch(0.650 0.003 80)',
  l4: 'oklch(0.450 0.003 80)',
  l5: 'oklch(0.300 0.003 80)',
  l6: 'oklch(0.150 0.005 80)',
}

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}
function usePress() {
  const [p, setP] = useState(false)
  return [p, { onMouseDown: () => setP(true), onMouseUp: () => setP(false), onMouseLeave: () => setP(false) }] as const
}

export function Proof() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()

  const letters = [
    { char: 'C', color: C.l1 },
    { char: 'A', color: C.l2 },
    { char: 'N', color: C.l3 },
    { char: 'V', color: C.l4 },
    { char: 'A', color: C.l5 },
    { char: 'I', color: C.l6 },
  ]

  return (
    <div style={{
      background: C.bg, minHeight: '100%', overflow: 'auto',
      fontFamily: font, WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Docs', 'GitHub'].map(l => (
            <span key={l} style={{ fontFamily: font, fontSize: 13, color: C.textTer, cursor: 'default' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Giant letterforms */}
      <section style={{
        padding: '40px 64px 0', maxWidth: 1440, margin: '0 auto',
        boxSizing: 'border-box', overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 0,
          lineHeight: 0.85, userSelect: 'none',
        }}>
          {letters.map((l, i) => (
            <span key={i} style={{
              fontFamily: font, fontSize: 200, fontWeight: 700,
              color: l.color, letterSpacing: '-0.04em',
            }}>{l.char}</span>
          ))}
        </div>
      </section>

      {/* Tagline in the space below the letters */}
      <section style={{
        padding: '32px 64px 60px', maxWidth: 1440, margin: '0 auto',
        boxSizing: 'border-box', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: font, fontSize: 20, fontWeight: 400, color: C.textSec,
          margin: '0 0 32px', textWrap: 'pretty', lineHeight: 1.5,
        }}>
          The canvas for design exploration.
        </p>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 28px',
          background: C.accent, color: C.onDark,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </section>

      {/* Product */}
      <section style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box',
      }}>
        <div {...phB} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          boxShadow: ph
            ? '0 16px 64px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)'
            : '0 4px 24px rgba(0,0,0,0.03)',
          transform: ph ? 'translateY(-4px)' : 'translateY(0)',
          transition: `transform 0.4s ${spring}, box-shadow 0.4s ease`,
        }}>
          <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Features as typographic blocks */}
      <section style={{
        padding: '0 64px 80px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 48 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 48 }}>
            {[
              { big: 'Compare', desc: 'Five directions from one prompt. See every option on a single surface.' },
              { big: 'Annotate', desc: 'Click anywhere on the canvas. Describe what you want changed. Watch it happen.' },
              { big: 'Preserve', desc: 'Every version frozen. Every direction accessible. Nothing overwritten.' },
            ].map(f => (
              <div key={f.big}>
                <span style={{
                  fontFamily: font, fontSize: 48, fontWeight: 700, color: C.l3,
                  letterSpacing: '-0.03em', display: 'block', marginBottom: 12, lineHeight: 1,
                }}>{f.big}</span>
                <p style={{
                  fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec,
                  margin: 0, lineHeight: 1.6, textWrap: 'pretty',
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1200, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>Proof — 2025</span>
      </footer>
    </div>
  )
}
