import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'

// ── Plinth — Product shrine ───────────────────────────────────────────────
// The screenshot IS the page. Full-viewport product image with a thin strip
// of text at top and bottom. 80%+ is product. The work speaks for itself.

const C = {
  bg: 'oklch(0.985 0.003 80)',
  text: 'oklch(0.130 0.005 80)',
  textSec: 'oklch(0.380 0.005 80)',
  textTer: 'oklch(0.580 0.005 80)',
  border: 'oklch(0.890 0.005 80)',
  accent: 'oklch(0.250 0.005 80)',
  onDark: 'oklch(0.970 0.003 80)',
}

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}
function usePress() {
  const [p, setP] = useState(false)
  return [p, { onMouseDown: () => setP(true), onMouseUp: () => setP(false), onMouseLeave: () => setP(false) }] as const
}

export function Plinth() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Thin header strip */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text }}>canvai</span>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 12, borderRadius: 4, padding: '8px 20px',
          background: C.accent, color: C.onDark,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </nav>

      {/* Tiny headline */}
      <section style={{
        padding: '40px 64px 32px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: font, fontSize: 20, fontWeight: 500, color: C.text,
          letterSpacing: '-0.01em', margin: 0, textWrap: 'pretty',
        }}>
          Five directions. One prompt. Your entire team's worth of exploration.
        </h1>
      </section>

      {/* Product — dominates the page */}
      <section style={{
        padding: '0 32px 32px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <div {...phB} style={{
          borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`,
          boxShadow: ph
            ? '0 24px 80px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)'
            : '0 8px 40px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02)',
          transform: ph ? 'translateY(-4px)' : 'translateY(0)',
          transition: `transform 0.4s ${spring}, box-shadow 0.4s ease`,
        }}>
          <img src={canvasWide} alt="The Bryllen canvas — five design directions at once" style={{
            width: '100%', display: 'block',
          }} />
        </div>
      </section>

      {/* Feature strip — single words */}
      <section style={{
        padding: '40px 64px 40px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 48,
          borderTop: `1px solid ${C.border}`, paddingTop: 32,
        }}>
          {[
            { word: 'Compare', sub: 'five at once' },
            { word: 'Annotate', sub: 'click and describe' },
            { word: 'Preserve', sub: 'every version' },
            { word: 'Ship', sub: 'production code' },
          ].map(f => (
            <div key={f.word} style={{ textAlign: 'center' }}>
              <span style={{
                fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text,
                display: 'block', marginBottom: 4,
              }}>{f.word}</span>
              <span style={{
                fontFamily: font, fontSize: 12, fontWeight: 400, color: C.textTer,
              }}>{f.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        textAlign: 'center', padding: '40px 64px 80px',
        maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <p style={{
          fontFamily: font, fontSize: 15, fontWeight: 400, color: C.textSec,
          margin: '0 0 24px', textWrap: 'pretty',
        }}>
          The product speaks for itself.
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 12, color: C.textTer }}>canvai — 2025</span>
      </footer>
    </div>
  )
}
