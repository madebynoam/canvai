import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'
import pulseDashboard from '../../screenshots/pulse-dashboard.png'

// ── Module — True Brockmann modular grid ──────────────────────────────────
// 6-column grid with content placed in varying spans. Visible column structure.
// Mathematical proportions throughout. The grid is the architecture.

const C = {
  bg: 'oklch(0.990 0.002 80)',
  text: 'oklch(0.110 0.005 80)',
  textSec: 'oklch(0.360 0.005 80)',
  textTer: 'oklch(0.580 0.005 80)',
  border: 'oklch(0.885 0.005 80)',
  accent: 'oklch(0.240 0.005 80)',
  onDark: 'oklch(0.970 0.003 80)',
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

export function Module() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [h1, h1B] = useHover()
  const [h2, h2B] = useHover()
  const [h3, h3B] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav — spans full 6-col */}
      <nav style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
        <span />
        <span />
        <span />
        <span />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
          {['Docs', 'GitHub'].map(l => (
            <span key={l} style={{ fontFamily: font, fontSize: 13, color: C.textTer, cursor: 'default' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Hero — cols 1-3 text, 4-6 empty */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
        padding: '100px 64px 60px', maxWidth: 1440, margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <div style={{ gridColumn: '1 / 4' }}>
          <p style={{
            fontFamily: mono, fontSize: 11, color: C.textTer,
            letterSpacing: '0.08em', textTransform: 'uppercase' as const,
            margin: '0 0 20px',
          }}>Col 1—3 / Row 1</p>
          <h1 style={{
            fontFamily: font, fontSize: 40, fontWeight: 500, color: C.text,
            lineHeight: 1.12, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty',
          }}>
            Describe what you need. See what's possible.
          </h1>
          <p style={{
            fontFamily: font, fontSize: 16, fontWeight: 400, color: C.textSec,
            marginTop: 20, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty',
          }}>
            Five design directions from one prompt. An infinite canvas for comparison. Production code, not mockups.
          </p>
          <button {...bhB} {...baB} style={{
            border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
            fontSize: 14, borderRadius: 4, padding: '12px 28px',
            background: C.accent, color: C.onDark,
            transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Start designing</button>
        </div>
        {/* Cols 4-6 left intentionally empty — Brockmann's negative space */}
      </div>

      {/* Product — spans full 6-col */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
        padding: '0 64px 60px', maxWidth: 1440, margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <div style={{ gridColumn: '1 / 7' }}>
          <div {...h1B} style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
            transform: h1 ? 'translateY(-2px)' : 'translateY(0)',
            transition: `transform 0.3s ${spring}`,
          }}>
            <img src={canvasWide} alt="Canvas overview" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </div>

      {/* Features — varying spans */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
        padding: '0 64px', maxWidth: 1440, margin: '0 auto',
        boxSizing: 'border-box', borderTop: `1px solid ${C.border}`, paddingTop: 48,
      }}>
        {/* Feature 1 — cols 1-2 */}
        <div style={{ gridColumn: '1 / 3', paddingBottom: 48 }}>
          <p style={{ fontFamily: mono, fontSize: 11, color: C.textTer, letterSpacing: '0.06em', margin: '0 0 12px' }}>01</p>
          <h3 style={{ fontFamily: font, fontSize: 16, fontWeight: 500, color: C.text, margin: '0 0 8px', textWrap: 'pretty' }}>
            Five directions per prompt
          </h3>
          <p style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec, margin: 0, lineHeight: 1.6, textWrap: 'pretty' }}>
            See every option on one surface. Compare the way your brain works — all at once.
          </p>
        </div>
        {/* Feature 2 — cols 3-4 */}
        <div style={{ gridColumn: '3 / 5', paddingBottom: 48 }}>
          <p style={{ fontFamily: mono, fontSize: 11, color: C.textTer, letterSpacing: '0.06em', margin: '0 0 12px' }}>02</p>
          <h3 style={{ fontFamily: font, fontSize: 16, fontWeight: 500, color: C.text, margin: '0 0 8px', textWrap: 'pretty' }}>
            Annotate on the canvas
          </h3>
          <p style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec, margin: 0, lineHeight: 1.6, textWrap: 'pretty' }}>
            Click anywhere. Describe the change. The code updates while you watch.
          </p>
        </div>
        {/* Feature 3 — cols 5-6 */}
        <div style={{ gridColumn: '5 / 7', paddingBottom: 48 }}>
          <p style={{ fontFamily: mono, fontSize: 11, color: C.textTer, letterSpacing: '0.06em', margin: '0 0 12px' }}>03</p>
          <h3 style={{ fontFamily: font, fontSize: 16, fontWeight: 500, color: C.text, margin: '0 0 8px', textWrap: 'pretty' }}>
            Every version preserved
          </h3>
          <p style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec, margin: 0, lineHeight: 1.6, textWrap: 'pretty' }}>
            Nothing overwritten. Go back to any iteration. Branch from any direction.
          </p>
        </div>
      </div>

      {/* Two-up screenshots — 4-col + 2-col */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
        padding: '0 64px 60px', maxWidth: 1440, margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        <div style={{ gridColumn: '1 / 5' }}>
          <div {...h2B} style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
            transform: h2 ? 'translateY(-2px)' : 'translateY(0)',
            transition: `transform 0.3s ${spring}`,
          }}>
            <img src={productDirections} alt="Directions" style={{ width: '100%', display: 'block' }} />
          </div>
          <p style={{ fontFamily: mono, fontSize: 10, color: C.textTer, marginTop: 8 }}>Col 1—4 / Row 4</p>
        </div>
        <div style={{ gridColumn: '5 / 7' }}>
          <div {...h3B} style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
            transform: h3 ? 'translateY(-2px)' : 'translateY(0)',
            transition: `transform 0.3s ${spring}`,
          }}>
            <img src={pulseDashboard} alt="Dashboard" style={{ width: '100%', display: 'block' }} />
          </div>
          <p style={{ fontFamily: mono, fontSize: 10, color: C.textTer, marginTop: 8 }}>Col 5—6 / Row 4</p>
        </div>
      </div>

      {/* Footer — full 6-col */}
      <footer style={{
        display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 24,
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
        <span /><span /><span /><span />
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer, textAlign: 'right' }}>6-col grid</span>
      </footer>
    </div>
  )
}
