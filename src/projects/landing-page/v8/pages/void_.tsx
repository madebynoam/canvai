import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'

// ── Void — Radical negative space ─────────────────────────────────────────
// 5-word headline. One button. One screenshot. 90% empty space.
// The emptiness IS the design. Rams: "as little design as possible."

const C = {
  bg: 'oklch(0.992 0.002 80)',
  text: 'oklch(0.100 0.005 80)',
  textSec: 'oklch(0.400 0.005 80)',
  textTer: 'oklch(0.600 0.005 80)',
  border: 'oklch(0.900 0.005 80)',
  accent: 'oklch(0.220 0.005 80)',
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

export function Void() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()

  return (
    <div style={{
      background: C.bg, minHeight: '100%', overflow: 'auto',
      fontFamily: font, WebkitFontSmoothing: 'antialiased',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav — barely there */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text }}>canvai</span>
        <span style={{ fontFamily: font, fontSize: 13, color: C.textTer, cursor: 'default' }}>Docs</span>
      </nav>

      {/* Vast empty space before headline */}
      <div style={{ height: 160 }} />

      {/* Hero — nothing but words */}
      <section style={{
        textAlign: 'center', padding: '0 64px',
        maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <h1 style={{
          fontFamily: font, fontSize: 52, fontWeight: 500, color: C.text,
          lineHeight: 1.1, letterSpacing: '-0.035em', margin: 0,
        }}>
          Describe. Compare. Decide.
        </h1>
        <div style={{ height: 32 }} />
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 32px',
          background: C.accent, color: C.onDark,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </section>

      {/* Empty space */}
      <div style={{ height: 120 }} />

      {/* One screenshot. That's it. */}
      <section style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 64px',
        boxSizing: 'border-box', width: '100%',
      }}>
        <div {...phB} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          boxShadow: ph
            ? '0 16px 64px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)'
            : '0 4px 24px rgba(0,0,0,0.03)',
          transform: ph ? 'translateY(-4px)' : 'translateY(0)',
          transition: `transform 0.4s ${spring}, box-shadow 0.4s ease`,
        }}>
          <img src={canvasWide} alt="Bryllen" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* More empty space */}
      <div style={{ height: 160 }} />

      {/* One line. */}
      <p style={{
        textAlign: 'center', fontFamily: font, fontSize: 14, color: C.textTer,
        margin: 0, padding: '0 64px',
      }}>
        Five directions. One prompt. Nothing lost.
      </p>

      {/* Empty space to footer */}
      <div style={{ flex: 1, minHeight: 120 }} />

      {/* Footer — minimal */}
      <footer style={{
        textAlign: 'center', padding: '20px 64px',
      }}>
        <span style={{ fontFamily: font, fontSize: 12, color: C.textTer }}>canvai</span>
      </footer>
    </div>
  )
}
