import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'
import productDirections from '../../screenshots/product-directions.png'

// ── Plank — Full-bleed horizontal bands ───────────────────────────────────
// No max-width container. Each feature is a full-width band stretching
// edge-to-edge. Alternating subtle background shades. Bold horizontal rhythm.

const C = {
  bg1: 'oklch(0.988 0.003 80)',
  bg2: 'oklch(0.965 0.003 80)',
  bg3: 'oklch(0.948 0.003 80)',
  text: 'oklch(0.120 0.005 80)',
  textSec: 'oklch(0.360 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
  border: 'oklch(0.890 0.005 80)',
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

export function Plank() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [h1, h1B] = useHover()
  const [h2, h2B] = useHover()

  return (
    <div style={{ minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav band */}
      <div style={{ background: C.bg1, borderBottom: `1px solid ${C.border}` }}>
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 80px',
        }}>
          <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
          <div style={{ display: 'flex', gap: 28 }}>
            {['Features', 'Docs', 'GitHub'].map(l => (
              <span key={l} style={{ fontFamily: font, fontSize: 13, color: C.textTer, cursor: 'default' }}>{l}</span>
            ))}
          </div>
        </nav>
      </div>

      {/* Hero band */}
      <div style={{ background: C.bg1, padding: '100px 80px 80px' }}>
        <h1 style={{
          fontFamily: font, fontSize: 52, fontWeight: 500, color: C.text,
          lineHeight: 1.1, letterSpacing: '-0.035em', margin: 0, textWrap: 'pretty',
          maxWidth: 700,
        }}>
          Your first design session should produce five portfolios.
        </h1>
        <p style={{
          fontFamily: font, fontSize: 17, fontWeight: 400, color: C.textSec,
          marginTop: 24, marginBottom: 40, lineHeight: 1.65, textWrap: 'pretty', maxWidth: 520,
        }}>
          One prompt to Claude Code. Five directions on an infinite canvas. The comparison surface that changes how you design.
        </p>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 28px',
          background: C.accent, color: C.onDark,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </div>

      {/* Product band — full bleed */}
      <div style={{ background: C.bg2, padding: '64px 80px' }}>
        <div {...h1B} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: h1 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>

      {/* Feature bands */}
      {[
        { bg: C.bg1, num: '01', title: 'Compare, don\'t regenerate', desc: 'Five directions from one prompt. See every option on a single surface. No tab-switching, no "try again," no scrolling through chat.' },
        { bg: C.bg2, num: '02', title: 'Annotate where you see the problem', desc: 'Click directly on the frame. Say what needs to change. The code updates while you watch — no export, no separate feedback tool.' },
        { bg: C.bg3, num: '03', title: 'Your creative history, preserved', desc: 'Every iteration is frozen. Every direction accessible. Branch from any point, go back to any version. Nothing is ever overwritten.' },
        { bg: C.bg1, num: '04', title: 'Ship the actual code', desc: 'Every frame on the canvas is production React. Not a mockup, not a prototype. Deploy what you designed.' },
      ].map((f) => (
        <div key={f.num} style={{ background: f.bg, padding: '64px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 48 }}>
            <span style={{
              fontFamily: mono, fontSize: 13, color: C.textTer, flexShrink: 0, paddingTop: 2,
            }}>{f.num}</span>
            <div style={{ maxWidth: 600 }}>
              <h3 style={{
                fontFamily: font, fontSize: 20, fontWeight: 500, color: C.text,
                margin: '0 0 12px', textWrap: 'pretty',
              }}>{f.title}</h3>
              <p style={{
                fontFamily: font, fontSize: 15, fontWeight: 400, color: C.textSec,
                margin: 0, lineHeight: 1.65, textWrap: 'pretty',
              }}>{f.desc}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Second product band */}
      <div style={{ background: C.bg2, padding: '64px 80px' }}>
        <div {...h2B} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: h2 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={productDirections} alt="Design directions" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>

      {/* Footer band */}
      <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}`, padding: '20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>Plank — 2025</span>
        </div>
      </div>
    </div>
  )
}
