import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'

// ── Raster — Visible modular grid ─────────────────────────────────────────
// The grid IS the design. Faint grid lines visible across the entire page.
// Content snaps to grid intersections. Brockmann's grid made literal.

const C = {
  bg: 'oklch(0.988 0.002 80)',
  text: 'oklch(0.140 0.005 80)',
  textSec: 'oklch(0.400 0.005 80)',
  textTer: 'oklch(0.600 0.005 80)',
  border: 'oklch(0.920 0.003 80)',
  gridLine: 'oklch(0.940 0.002 80)',
  accent: 'oklch(0.260 0.005 80)',
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

function GridBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `
        linear-gradient(to right, ${C.gridLine} 1px, transparent 1px),
        linear-gradient(to bottom, ${C.gridLine} 1px, transparent 1px)
      `,
      backgroundSize: '80px 80px',
      opacity: 0.7,
    }} />
  )
}

function Nav() {
  const [hl, setHL] = useState<string | null>(null)
  return (
    <nav style={{
      position: 'relative', zIndex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '24px 64px', maxWidth: 1440, margin: '0 auto',
      width: '100%', boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text, letterSpacing: '-0.01em' }}>canvai</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {['Features', 'Docs', 'GitHub'].map(link => (
          <span key={link}
            onMouseEnter={() => setHL(link)} onMouseLeave={() => setHL(null)}
            style={{
              fontFamily: font, fontSize: 13, fontWeight: 400,
              color: hl === link ? C.text : C.textTer,
              transition: `color 0.15s ${spring}`, cursor: 'default', textWrap: 'pretty',
            }}>{link}</span>
        ))}
      </div>
    </nav>
  )
}

function Hero() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  return (
    <section style={{
      position: 'relative', zIndex: 1,
      padding: '120px 64px 80px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
    }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start',
      }}>
        <div>
          <p style={{
            fontFamily: mono, fontSize: 11, fontWeight: 400, color: C.textTer,
            margin: '0 0 20px', letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          }}>Design exploration tool</p>
          <h1 style={{
            fontFamily: font, fontSize: 44, fontWeight: 500, color: C.text,
            lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0, textWrap: 'pretty',
          }}>
            Describe once.<br />Decide from five.
          </h1>
          <p style={{
            fontFamily: font, fontSize: 16, fontWeight: 400, color: C.textSec,
            marginTop: 24, marginBottom: 40, lineHeight: 1.65, textWrap: 'pretty',
          }}>
            One prompt. Five design directions on an infinite canvas. Compare them the way your brain works — all at once, not one at a time.
          </p>
          <button {...bhB} {...baB} style={{
            border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
            fontSize: 14, borderRadius: 8, padding: '12px 28px',
            background: C.accent, color: C.onDark,
            transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Start designing</button>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
        }}>
          {[
            { label: 'Directions', value: '5' },
            { label: 'Prompts needed', value: '1' },
            { label: 'Lost work', value: '0' },
            { label: 'Canvas', value: '∞' },
          ].map(s => (
            <div key={s.label} style={{
              padding: 24, borderRadius: 8,
              border: `1px solid ${C.border}`,
              background: 'oklch(0.993 0.002 80)',
            }}>
              <span style={{
                fontFamily: font, fontSize: 36, fontWeight: 300, color: C.text,
                letterSpacing: '-0.03em', display: 'block', marginBottom: 4,
              }}>{s.value}</span>
              <span style={{
                fontFamily: font, fontSize: 12, fontWeight: 400, color: C.textTer,
              }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductShot() {
  const [h, hB] = useHover()
  return (
    <section style={{
      position: 'relative', zIndex: 1,
      maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box',
    }}>
      <div {...hB} style={{
        borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform 0.3s ${spring}`,
      }}>
        <img src={canvasWide} alt="Bryllen canvas with five directions side by side" style={{ width: '100%', display: 'block' }} />
      </div>
    </section>
  )
}

const features = [
  { title: 'Compare, don\'t scroll', desc: 'Five layouts on one canvas. See every option without switching tabs or scrolling chat history.' },
  { title: 'Point and refine', desc: 'Click anywhere on a frame. Describe the change. The code updates while you watch.' },
  { title: 'Your history, preserved', desc: 'Every direction, every iteration, every idea. Frozen and accessible. Nothing overwritten.' },
]

function Features() {
  return (
    <section style={{
      position: 'relative', zIndex: 1,
      maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40 }}>
        {features.map((f) => (
          <div key={f.title} style={{
            padding: 32, borderRadius: 8, border: `1px solid ${C.border}`,
            background: 'oklch(0.993 0.002 80)',
          }}>
            <h3 style={{
              fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text,
              margin: '0 0 8px', textWrap: 'pretty',
            }}>{f.title}</h3>
            <p style={{
              fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec,
              margin: 0, lineHeight: 1.6, textWrap: 'pretty',
            }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SecondaryShot() {
  const [h, hB] = useHover()
  return (
    <section style={{
      position: 'relative', zIndex: 1,
      maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box',
    }}>
      <div {...hB} style={{
        borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform 0.3s ${spring}`,
      }}>
        <img src={productDirections} alt="Multiple design directions" style={{ width: '100%', display: 'block' }} />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      position: 'relative', zIndex: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
      width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
    }}>
      <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
      <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>Grid 80 × 80</span>
    </footer>
  )
}

export function Raster() {
  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased', position: 'relative' }}>
      <GridBg />
      <Nav />
      <Hero />
      <ProductShot />
      <Features />
      <SecondaryShot />
      <Footer />
    </div>
  )
}
