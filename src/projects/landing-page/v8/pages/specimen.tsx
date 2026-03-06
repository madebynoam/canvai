import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'

// ── Specimen — Swiss type specimen sheet ──────────────────────────────────
// Brockmann catalog feel. Giant display numerals. Ruled horizontal lines.
// Catalog-entry features. The page reads like a product specification sheet.

const C = {
  bg: 'oklch(0.985 0.003 80)',
  text: 'oklch(0.130 0.005 80)',
  textSec: 'oklch(0.380 0.005 80)',
  textTer: 'oklch(0.580 0.005 80)',
  border: 'oklch(0.880 0.005 80)',
  accent: 'oklch(0.250 0.005 80)',
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

function Rule() {
  return <div style={{ height: 1, background: C.border, width: '100%' }} />
}

function Nav() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
      width: '100%', boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
        Bryllen
      </span>
      <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>
        Design tool — 2025
      </span>
    </nav>
  )
}

function Hero() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  return (
    <section style={{ padding: '80px 64px 60px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 64 }}>
        <span style={{
          fontFamily: font, fontSize: 160, fontWeight: 200, color: C.border,
          lineHeight: 0.85, letterSpacing: '-0.04em', userSelect: 'none',
          flexShrink: 0,
        }}>01</span>
        <div style={{ paddingTop: 24 }}>
          <h1 style={{
            fontFamily: font, fontSize: 36, fontWeight: 500, color: C.text,
            lineHeight: 1.15, letterSpacing: '-0.025em', margin: 0, textWrap: 'pretty',
          }}>
            Stop scrolling through chat.<br />Start comparing.
          </h1>
          <p style={{
            fontFamily: font, fontSize: 16, fontWeight: 400, color: C.textSec,
            marginTop: 20, marginBottom: 36, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 480,
          }}>
            Describe what you need. See five directions on one canvas. Pick the one that's right — or annotate it until it is.
          </p>
          <button {...bhB} {...baB} style={{
            border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
            fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase' as const,
            borderRadius: 4, padding: '12px 28px',
            background: C.accent, color: C.onDark,
            transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Start designing</button>
        </div>
      </div>
    </section>
  )
}

function Product() {
  const [h, hB] = useHover()
  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box' }}>
      <Rule />
      <div {...hB} style={{
        marginTop: 40, borderRadius: 8, overflow: 'hidden',
        border: `1px solid ${C.border}`,
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform 0.3s ${spring}`,
      }}>
        <img src={canvasWide} alt="The Bryllen canvas with five design directions" style={{ width: '100%', display: 'block' }} />
      </div>
    </section>
  )
}

const catalog = [
  { num: '02', title: 'Compare directions', desc: 'One prompt produces five layouts on a single canvas. See them side by side, not one after another.' },
  { num: '03', title: 'Annotate directly', desc: 'Click anywhere on a frame. Describe the change in words. The code updates while you watch.' },
  { num: '04', title: 'Preserve every version', desc: 'Nothing is overwritten. Every direction, every iteration, every idea — frozen and accessible.' },
  { num: '05', title: 'Ship what you chose', desc: 'The final design is production React. Not a mockup. Not a screenshot. Working code you deploy.' },
]

function Catalog() {
  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box' }}>
      {catalog.map((item) => (
        <div key={item.num}>
          <Rule />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 48, padding: '28px 0' }}>
            <span style={{
              fontFamily: mono, fontSize: 12, color: C.textTer, flexShrink: 0, width: 32,
            }}>{item.num}</span>
            <div>
              <h3 style={{
                fontFamily: font, fontSize: 16, fontWeight: 500, color: C.text,
                margin: '0 0 8px', textWrap: 'pretty',
              }}>{item.title}</h3>
              <p style={{
                fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec,
                margin: 0, lineHeight: 1.6, textWrap: 'pretty', maxWidth: 440,
              }}>{item.desc}</p>
            </div>
          </div>
        </div>
      ))}
      <Rule />
    </section>
  )
}

function Secondary() {
  const [h, hB] = useHover()
  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box' }}>
      <div {...hB} style={{
        borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform 0.3s ${spring}`,
      }}>
        <img src={productDirections} alt="Design directions on the canvas" style={{ width: '100%', display: 'block' }} />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
      width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
    }}>
      <span style={{ fontFamily: font, fontSize: 12, color: C.textTer, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
        Bryllen — 2025
      </span>
      <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>
        Specimen 01
      </span>
    </footer>
  )
}

export function Specimen() {
  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      <Nav />
      <Hero />
      <Product />
      <Catalog />
      <Secondary />
      <Footer />
    </div>
  )
}
