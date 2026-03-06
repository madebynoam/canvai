import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'

// ── Verso — Hard dark/light split ─────────────────────────────────────────
// Top 60% is near-black with white text and product shot. Bottom 40% is
// near-white with dark text features. No gradient. Hard cut. Bold contrast.

const D = {
  bg: 'oklch(0.120 0.005 80)',
  text: 'oklch(0.940 0.003 80)',
  textSec: 'oklch(0.660 0.005 80)',
  textTer: 'oklch(0.480 0.005 80)',
  border: 'oklch(0.230 0.005 80)',
}

const L = {
  bg: 'oklch(0.990 0.002 80)',
  text: 'oklch(0.120 0.005 80)',
  textSec: 'oklch(0.380 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
  border: 'oklch(0.890 0.005 80)',
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

export function Verso() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()
  const [sh, shB] = useHover()
  const [bh2, bh2B] = useHover()
  const [ba2, ba2B] = usePress()

  return (
    <div style={{ minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* ── DARK HALF ── */}
      <div style={{ background: D.bg }}>
        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
          width: '100%', boxSizing: 'border-box',
        }}>
          <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: D.text }}>canvai</span>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Features', 'Docs', 'GitHub'].map(l => (
              <span key={l} style={{ fontFamily: font, fontSize: 13, color: D.textTer, cursor: 'default' }}>{l}</span>
            ))}
          </div>
        </nav>

        {/* Hero */}
        <section style={{
          padding: '80px 64px 48px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
        }}>
          <h1 style={{
            fontFamily: font, fontSize: 48, fontWeight: 500, color: D.text,
            lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty', maxWidth: 600,
          }}>
            The fastest path from idea to interface.
          </h1>
          <p style={{
            fontFamily: font, fontSize: 17, fontWeight: 400, color: D.textSec,
            marginTop: 20, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 480,
          }}>
            One prompt. Five directions. An infinite canvas. Compare side by side, annotate directly, ship production code.
          </p>
          <button {...bhB} {...baB} style={{
            border: `1px solid ${D.border}`, cursor: 'default', fontFamily: font, fontWeight: 500,
            fontSize: 14, borderRadius: 4, padding: '12px 28px',
            background: 'transparent', color: D.text,
            transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Start designing</button>
        </section>

        {/* Product on dark */}
        <section style={{
          maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box',
        }}>
          <div {...phB} style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${D.border}`,
            transform: ph ? 'translateY(-2px)' : 'translateY(0)',
            transition: `transform 0.3s ${spring}`,
          }}>
            <img src={canvasWide} alt="Bryllen canvas on dark" style={{ width: '100%', display: 'block' }} />
          </div>
        </section>
      </div>

      {/* ── HARD CUT ── */}

      {/* ── LIGHT HALF ── */}
      <div style={{ background: L.bg }}>
        {/* Features */}
        <section style={{
          padding: '80px 64px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            <div>
              {[
                { title: 'Five directions, one prompt', desc: 'See every option on a single canvas. No regenerating, no tab-switching. Compare the way your brain works.' },
                { title: 'Annotate where you see it', desc: 'Click anywhere on a frame. Describe the change. The code updates while you watch.' },
                { title: 'Nothing is ever lost', desc: 'Every iteration frozen. Every direction preserved. Branch from any point. Your creative history stays intact.' },
              ].map((f, i) => (
                <div key={f.title} style={{ marginBottom: i < 2 ? 40 : 0 }}>
                  <h3 style={{
                    fontFamily: font, fontSize: 17, fontWeight: 500, color: L.text,
                    margin: '0 0 8px', textWrap: 'pretty',
                  }}>{f.title}</h3>
                  <p style={{
                    fontFamily: font, fontSize: 14, fontWeight: 400, color: L.textSec,
                    margin: 0, lineHeight: 1.65, textWrap: 'pretty',
                  }}>{f.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div {...shB} style={{
                borderRadius: 8, overflow: 'hidden', border: `1px solid ${L.border}`,
                transform: sh ? 'translateY(-2px)' : 'translateY(0)',
                transition: `transform 0.3s ${spring}`,
                width: '100%',
              }}>
                <img src={productDirections} alt="Design directions on light" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          textAlign: 'center', padding: '40px 64px 80px',
          maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
        }}>
          <h2 style={{
            fontFamily: font, fontSize: 28, fontWeight: 500, color: L.text,
            margin: '0 0 24px', letterSpacing: '-0.02em', textWrap: 'pretty',
          }}>
            Design exploration shouldn't be a conversation.
          </h2>
          <button {...bh2B} {...ba2B} style={{
            border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
            fontSize: 14, borderRadius: 4, padding: '12px 28px',
            background: L.text, color: L.bg,
            transform: ba2 ? 'scale(0.94)' : bh2 ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Start designing</button>
        </section>

        {/* Footer */}
        <footer style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
          width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${L.border}`,
        }}>
          <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: L.textTer }}>canvai</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: L.textTer }}>Verso — 2025</span>
        </footer>
      </div>
    </div>
  )
}
