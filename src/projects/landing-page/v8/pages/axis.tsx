import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'

// ── Axis — Center-divided ─────────────────────────────────────────────────
// Strict vertical center line. Left side = text. Right side = images.
// Never crossing. Like a Brockmann poster with mathematical balance.

const C = {
  bg: 'oklch(0.990 0.002 80)',
  text: 'oklch(0.120 0.005 80)',
  textSec: 'oklch(0.360 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
  border: 'oklch(0.885 0.005 80)',
  accent: 'oklch(0.230 0.005 80)',
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

export function Axis() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [h1, h1B] = useHover()
  const [h2, h2B] = useHover()
  const [bh2, bh2B] = useHover()
  const [ba2, ba2B] = usePress()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
        <div style={{ display: 'flex', gap: 28 }}>
          {['Features', 'Docs', 'GitHub'].map(l => (
            <span key={l} style={{ fontFamily: font, fontSize: 13, color: C.textTer, cursor: 'default' }}>{l}</span>
          ))}
        </div>
      </nav>

      {/* Center axis layout */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px', boxSizing: 'border-box' }}>
        {/* Hero row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          minHeight: 480, borderTop: `1px solid ${C.border}`,
        }}>
          {/* Left — text */}
          <div style={{
            padding: '80px 48px 80px 0',
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <p style={{
              fontFamily: mono, fontSize: 11, color: C.textTer,
              letterSpacing: '0.08em', textTransform: 'uppercase' as const,
              margin: '0 0 20px',
            }}>01 — Overview</p>
            <h1 style={{
              fontFamily: font, fontSize: 40, fontWeight: 500, color: C.text,
              lineHeight: 1.12, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty',
            }}>
              Compare directions the way your brain works — side by side.
            </h1>
            <p style={{
              fontFamily: font, fontSize: 16, fontWeight: 400, color: C.textSec,
              marginTop: 20, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty',
            }}>
              Describe a UI to Claude Code. Five directions appear on an infinite canvas. Pick one, annotate it, iterate — or start over. Nothing is lost.
            </p>
            <div>
              <button {...bhB} {...baB} style={{
                border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
                fontSize: 14, borderRadius: 4, padding: '12px 28px',
                background: C.accent, color: C.onDark,
                transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
                transition: `transform 0.15s ${spring}`,
              }}>Start designing</button>
            </div>
          </div>
          {/* Right — image */}
          <div style={{
            padding: '80px 0 80px 48px',
            display: 'flex', alignItems: 'center',
          }}>
            <div {...h1B} style={{
              borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
              transform: h1 ? 'translateY(-2px)' : 'translateY(0)',
              transition: `transform 0.3s ${spring}`,
              width: '100%',
            }}>
              <img src={canvasWide} alt="Canvas overview" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>

        {/* Features row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          borderTop: `1px solid ${C.border}`,
        }}>
          {/* Left — features */}
          <div style={{
            padding: '64px 48px 64px 0',
            borderRight: `1px solid ${C.border}`,
          }}>
            {[
              { num: '02', title: 'Five directions per prompt', desc: 'See every option on one surface. No tabs, no chat scrolling, no context switching.' },
              { num: '03', title: 'Annotate on the canvas', desc: 'Click a frame. Describe what you want changed. The code updates live.' },
              { num: '04', title: 'Every version frozen', desc: 'Your creative history is preserved. Branch from any point. Go back to any iteration.' },
            ].map((f, i) => (
              <div key={f.num} style={{ marginBottom: i < 2 ? 40 : 0 }}>
                <p style={{
                  fontFamily: mono, fontSize: 11, color: C.textTer,
                  letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                  margin: '0 0 8px',
                }}>{f.num}</p>
                <h3 style={{
                  fontFamily: font, fontSize: 16, fontWeight: 500, color: C.text,
                  margin: '0 0 8px', textWrap: 'pretty',
                }}>{f.title}</h3>
                <p style={{
                  fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec,
                  margin: 0, lineHeight: 1.6, textWrap: 'pretty',
                }}>{f.desc}</p>
              </div>
            ))}
          </div>
          {/* Right — second image */}
          <div style={{
            padding: '64px 0 64px 48px',
            display: 'flex', alignItems: 'center',
          }}>
            <div {...h2B} style={{
              borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
              transform: h2 ? 'translateY(-2px)' : 'translateY(0)',
              transition: `transform 0.3s ${spring}`,
              width: '100%',
            }}>
              <img src={productDirections} alt="Direction comparison" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{
            padding: '64px 48px 64px 0',
            borderRight: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center',
          }}>
            <div>
              <h2 style={{
                fontFamily: font, fontSize: 28, fontWeight: 500, color: C.text,
                margin: '0 0 20px', letterSpacing: '-0.02em', textWrap: 'pretty',
              }}>
                Prompt once. Decide from five.
              </h2>
              <button {...bh2B} {...ba2B} style={{
                border: `1px solid ${C.border}`, cursor: 'default', fontFamily: font, fontWeight: 500,
                fontSize: 14, borderRadius: 4, padding: '12px 28px',
                background: 'transparent', color: C.text,
                transform: ba2 ? 'scale(0.94)' : bh2 ? 'scale(1.01)' : 'scale(1)',
                transition: `transform 0.15s ${spring}`,
              }}>Get started</button>
            </div>
          </div>
          <div style={{ padding: '64px 0 64px 48px' }} />
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>Axis — 2025</span>
      </footer>
    </div>
  )
}
