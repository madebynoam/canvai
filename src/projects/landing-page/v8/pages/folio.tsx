import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'
import pulseDashboard from '../../screenshots/pulse-dashboard.png'

// ── Folio — Editorial magazine layout ─────────────────────────────────────
// Asymmetric two-column: narrow left sidebar (captions, nav), wide right
// (hero text, product shots). Like a Vignelli-designed editorial spread.

const C = {
  bg: 'oklch(0.990 0.002 80)',
  text: 'oklch(0.120 0.005 80)',
  textSec: 'oklch(0.360 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
  border: 'oklch(0.890 0.005 80)',
  accent: 'oklch(0.230 0.005 80)',
  onDark: 'oklch(0.970 0.003 80)',
  sidebar: 'oklch(0.960 0.003 80)',
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

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 200, flexShrink: 0, padding: '0 32px 0 0',
      borderRight: `1px solid ${C.border}`,
    }}>
      {children}
    </div>
  )
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, paddingLeft: 48 }}>
      {children}
    </div>
  )
}

export function Folio() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()
  const [sh1, sh1B] = useHover()
  const [sh2, sh2B] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>Issue 07 — 2025</span>
      </nav>

      {/* Main layout */}
      <div style={{
        display: 'flex', maxWidth: 1440, margin: '0 auto',
        padding: '80px 64px', boxSizing: 'border-box',
      }}>
        <Sidebar>
          <p style={{
            fontFamily: mono, fontSize: 10, fontWeight: 400, color: C.textTer,
            letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            margin: '0 0 40px', lineHeight: 1.8,
          }}>
            Contents<br />
            ——<br />
            01 Overview<br />
            02 Canvas<br />
            03 Features<br />
            04 Gallery
          </p>
          <p style={{
            fontFamily: font, fontSize: 12, fontWeight: 400, color: C.textTer,
            lineHeight: 1.7, textWrap: 'pretty', margin: '0 0 40px',
          }}>
            Bryllen adds a spatial layer to AI design. Instead of one result at a time in a chat, you get an infinite, zoomable canvas where every generation lives as a frame.
          </p>
          <p style={{
            fontFamily: mono, fontSize: 10, color: C.textTer,
            letterSpacing: '0.06em',
          }}>
            Fig. 1 — Canvas overview<br />
            Fig. 2 — Direction grid<br />
            Fig. 3 — Dashboard
          </p>
        </Sidebar>

        <Main>
          {/* Hero */}
          <section style={{ marginBottom: 80 }}>
            <h1 style={{
              fontFamily: font, fontSize: 48, fontWeight: 500, color: C.text,
              lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty',
            }}>
              Design exploration<br />shouldn't be a conversation.<br />It should be a canvas.
            </h1>
            <p style={{
              fontFamily: font, fontSize: 17, fontWeight: 400, color: C.textSec,
              marginTop: 24, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 520,
            }}>
              You describe. Five directions appear. You compare, annotate, iterate. Every version preserved. The result is production code, not a mockup.
            </p>
            <button {...bhB} {...baB} style={{
              border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
              fontSize: 14, borderRadius: 4, padding: '12px 28px',
              background: C.accent, color: C.onDark,
              transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
              transition: `transform 0.15s ${spring}`,
            }}>Start designing</button>
          </section>

          {/* Product hero */}
          <section style={{ marginBottom: 80 }}>
            <div {...phB} style={{
              borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
              transform: ph ? 'translateY(-2px)' : 'translateY(0)',
              transition: `transform 0.3s ${spring}`,
            }}>
              <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
            </div>
            <p style={{
              fontFamily: mono, fontSize: 10, color: C.textTer, marginTop: 12,
              letterSpacing: '0.04em',
            }}>Fig. 1 — Five design directions on the Bryllen canvas, viewed simultaneously</p>
          </section>

          {/* Features as pull quotes */}
          <section style={{ marginBottom: 80 }}>
            {[
              { q: '"The fastest path from idea to interface isn\'t one design at a time."', note: 'Compare five directions from a single prompt.' },
              { q: '"Your design history, not chat history."', note: 'Every iteration frozen and accessible. Nothing overwritten.' },
              { q: '"Click anywhere. Describe the change. Watch it happen."', note: 'Annotate directly on the canvas. No separate feedback tool.' },
            ].map((item, i) => (
              <div key={i} style={{
                borderLeft: `2px solid ${C.border}`,
                paddingLeft: 24, marginBottom: i < 2 ? 48 : 0,
              }}>
                <p style={{
                  fontFamily: font, fontSize: 20, fontWeight: 400, color: C.text,
                  lineHeight: 1.5, margin: '0 0 8px', textWrap: 'pretty', fontStyle: 'italic',
                }}>{item.q}</p>
                <p style={{
                  fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer,
                  margin: 0, textWrap: 'pretty',
                }}>{item.note}</p>
              </div>
            ))}
          </section>

          {/* Two-up screenshots */}
          <section style={{ marginBottom: 80 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div {...sh1B} style={{
                  borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
                  transform: sh1 ? 'translateY(-2px)' : 'translateY(0)',
                  transition: `transform 0.3s ${spring}`,
                }}>
                  <img src={productDirections} alt="Direction grid" style={{ width: '100%', display: 'block' }} />
                </div>
                <p style={{ fontFamily: mono, fontSize: 10, color: C.textTer, marginTop: 8, letterSpacing: '0.04em' }}>Fig. 2 — Comparing four directions</p>
              </div>
              <div>
                <div {...sh2B} style={{
                  borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
                  transform: sh2 ? 'translateY(-2px)' : 'translateY(0)',
                  transition: `transform 0.3s ${spring}`,
                }}>
                  <img src={pulseDashboard} alt="Dashboard iteration" style={{ width: '100%', display: 'block' }} />
                </div>
                <p style={{ fontFamily: mono, fontSize: 10, color: C.textTer, marginTop: 8, letterSpacing: '0.04em' }}>Fig. 3 — Dashboard design iteration</p>
              </div>
            </div>
          </section>
        </Main>
      </div>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>End of issue</span>
      </footer>
    </div>
  )
}
