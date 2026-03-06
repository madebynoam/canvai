import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'
import pulseDashboard from '../../screenshots/pulse-dashboard.png'

// ── Tract — Alternating bands ─────────────────────────────────────────────
// Alternating full-width sections: text on light → product screenshot →
// text on dark → screenshot → repeat. Vertical rhythm. Each section is
// its own world but they flow together.

const Light = {
  bg: 'oklch(0.988 0.003 80)',
  text: 'oklch(0.130 0.005 80)',
  textSec: 'oklch(0.380 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
  border: 'oklch(0.890 0.005 80)',
}

const Dark = {
  bg: 'oklch(0.130 0.005 80)',
  text: 'oklch(0.930 0.003 80)',
  textSec: 'oklch(0.640 0.005 80)',
  textTer: 'oklch(0.480 0.005 80)',
  border: 'oklch(0.240 0.005 80)',
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

function Band({ dark, children }: { dark?: boolean, children: React.ReactNode }) {
  const t = dark ? Dark : Light
  return (
    <section style={{
      background: t.bg, padding: '80px 64px',
    }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  )
}

export function Tract() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [h1, h1B] = useHover()
  const [h2, h2B] = useHover()
  const [h3, h3B] = useHover()
  const [bh2, bh2B] = useHover()
  const [ba2, ba2B] = usePress()

  return (
    <div style={{ minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Band 1 — Light hero */}
      <Band>
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 80,
        }}>
          <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: Light.text }}>canvai</span>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Features', 'Docs', 'GitHub'].map(l => (
              <span key={l} style={{ fontFamily: font, fontSize: 13, color: Light.textTer, cursor: 'default' }}>{l}</span>
            ))}
          </div>
        </nav>
        <h1 style={{
          fontFamily: font, fontSize: 44, fontWeight: 500, color: Light.text,
          lineHeight: 1.12, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty', maxWidth: 600,
        }}>
          What if your first design session produced five portfolios?
        </h1>
        <p style={{
          fontFamily: font, fontSize: 17, fontWeight: 400, color: Light.textSec,
          marginTop: 20, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 480,
        }}>
          One prompt to Claude Code. Five complete design directions on an infinite canvas. Compare, annotate, iterate — all at once.
        </p>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 28px',
          background: Light.text, color: Light.bg,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </Band>

      {/* Band 2 — Full-bleed product */}
      <Band>
        <div {...h1B} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${Light.border}`,
          transform: h1 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </Band>

      {/* Band 3 — Dark features */}
      <Band dark>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 64 }}>
          {[
            { title: 'Compare directions', desc: 'Five layouts. One canvas. See every option without switching context.' },
            { title: 'Annotate and iterate', desc: 'Click anywhere on a frame. Describe the change. Watch the code update.' },
            { title: 'Preserve everything', desc: 'Every iteration frozen. Every direction accessible. Nothing overwritten.' },
          ].map(f => (
            <div key={f.title}>
              <h3 style={{
                fontFamily: font, fontSize: 16, fontWeight: 500, color: Dark.text,
                margin: '0 0 12px', textWrap: 'pretty',
              }}>{f.title}</h3>
              <p style={{
                fontFamily: font, fontSize: 14, fontWeight: 400, color: Dark.textSec,
                margin: 0, lineHeight: 1.65, textWrap: 'pretty',
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* Band 4 — Light screenshots */}
      <Band>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div {...h2B} style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${Light.border}`,
            transform: h2 ? 'translateY(-2px)' : 'translateY(0)',
            transition: `transform 0.3s ${spring}`,
          }}>
            <img src={productDirections} alt="Directions" style={{ width: '100%', display: 'block' }} />
          </div>
          <div {...h3B} style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${Light.border}`,
            transform: h3 ? 'translateY(-2px)' : 'translateY(0)',
            transition: `transform 0.3s ${spring}`,
          }}>
            <img src={pulseDashboard} alt="Dashboard" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </Band>

      {/* Band 5 — Dark CTA */}
      <Band dark>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: font, fontSize: 32, fontWeight: 500, color: Dark.text,
            margin: '0 0 24px', letterSpacing: '-0.02em', textWrap: 'pretty',
          }}>
            Your design history, not chat history.
          </h2>
          <button {...bh2B} {...ba2B} style={{
            border: `1px solid ${Dark.border}`, cursor: 'default', fontFamily: font, fontWeight: 500,
            fontSize: 14, borderRadius: 4, padding: '12px 28px',
            background: 'transparent', color: Dark.text,
            transform: ba2 ? 'scale(0.94)' : bh2 ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Start designing</button>
        </div>
      </Band>

      {/* Footer */}
      <footer style={{
        background: Light.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 64px', borderTop: `1px solid ${Light.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 12, color: Light.textTer }}>canvai — 2025</span>
      </footer>
    </div>
  )
}
