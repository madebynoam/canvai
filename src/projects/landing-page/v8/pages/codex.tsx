import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'

// ── Codex — Table of contents / Book layout ───────────────────────────────
// The page reads like a book's TOC. Numbered chapters with dot leaders.
// Each "chapter" section below. Like a Müller-Brockmann publication index.

const C = {
  bg: 'oklch(0.992 0.002 80)',
  text: 'oklch(0.110 0.005 80)',
  textSec: 'oklch(0.360 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
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

function DotLeader() {
  return (
    <span style={{
      flex: 1, borderBottom: `1px dotted ${C.border}`,
      margin: '0 12px', alignSelf: 'baseline',
      position: 'relative', top: -4,
    }} />
  )
}

export function Codex() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [h1, h1B] = useHover()
  const [h2, h2B] = useHover()

  const chapters = [
    { num: '01', title: 'The Canvas', page: '—' },
    { num: '02', title: 'Five Directions', page: '—' },
    { num: '03', title: 'Annotate Directly', page: '—' },
    { num: '04', title: 'Version History', page: '—' },
    { num: '05', title: 'Production Code', page: '—' },
  ]

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1200, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>v1.0 — Reference</span>
      </nav>

      {/* Title page */}
      <section style={{
        padding: '80px 64px 60px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box',
        borderTop: `1px solid ${C.border}`,
      }}>
        <h1 style={{
          fontFamily: font, fontSize: 48, fontWeight: 500, color: C.text,
          lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty',
        }}>
          The canvas for<br />design exploration
        </h1>
        <p style={{
          fontFamily: font, fontSize: 17, fontWeight: 400, color: C.textSec,
          marginTop: 20, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 480,
        }}>
          Describe what you need. See five directions at once. Annotate, iterate, ship. Every version preserved on an infinite canvas.
        </p>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 28px',
          background: C.accent, color: C.onDark,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </section>

      {/* Table of Contents */}
      <section style={{
        padding: '40px 64px 60px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box',
        borderTop: `1px solid ${C.border}`,
      }}>
        <p style={{
          fontFamily: mono, fontSize: 11, color: C.textTer,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          margin: '0 0 24px',
        }}>Contents</p>
        {chapters.map((ch) => (
          <div key={ch.num} style={{
            display: 'flex', alignItems: 'baseline',
            padding: '12px 0',
          }}>
            <span style={{ fontFamily: mono, fontSize: 13, color: C.textTer, width: 32, flexShrink: 0 }}>{ch.num}</span>
            <span style={{ fontFamily: font, fontSize: 16, fontWeight: 400, color: C.text, flexShrink: 0 }}>{ch.title}</span>
            <DotLeader />
            <span style={{ fontFamily: mono, fontSize: 13, color: C.textTer, flexShrink: 0 }}>{ch.page}</span>
          </div>
        ))}
      </section>

      {/* Product screenshot */}
      <section style={{
        padding: '0 64px 60px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <div {...h1B} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: h1 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Chapter sections */}
      {[
        { num: '01', title: 'The Canvas', body: 'An infinite, zoomable surface where every generation lives as a frame. No tabs. No chat history. Everything visible at once — the comparison surface that changes how you design.' },
        { num: '02', title: 'Five Directions', body: 'One prompt generates five complete layouts. Not variations — directions. Each one is a different structural approach to your description. Compare them side by side and pick the one that\'s right.' },
        { num: '03', title: 'Annotate Directly', body: 'Click anywhere on any frame. Describe what you want changed in plain language. The code updates while you watch. No separate feedback tool, no export-annotate-reimport cycle.' },
        { num: '04', title: 'Version History', body: 'Every iteration is frozen and preserved. Go back to yesterday\'s direction. Branch from any point. Your creative history stays intact — nothing is ever overwritten or lost.' },
        { num: '05', title: 'Production Code', body: 'Every frame is working React. Not a mockup, not a screenshot, not a prototype. Ship what you designed. The canvas produces the artifact, not a picture of one.' },
      ].map((ch) => (
        <section key={ch.num} style={{
          padding: '40px 64px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box',
          borderTop: `1px solid ${C.border}`,
        }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <span style={{
              fontFamily: mono, fontSize: 12, color: C.textTer, flexShrink: 0, width: 32,
            }}>{ch.num}</span>
            <div>
              <h3 style={{
                fontFamily: font, fontSize: 18, fontWeight: 500, color: C.text,
                margin: '0 0 12px', textWrap: 'pretty',
              }}>{ch.title}</h3>
              <p style={{
                fontFamily: font, fontSize: 15, fontWeight: 400, color: C.textSec,
                margin: 0, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 560,
              }}>{ch.body}</p>
            </div>
          </div>
        </section>
      ))}

      {/* Secondary screenshot */}
      <section style={{
        padding: '40px 64px 80px', maxWidth: 1200, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <div {...h2B} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: h2 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={productDirections} alt="Design directions" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1200, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>End of codex</span>
      </footer>
    </div>
  )
}
