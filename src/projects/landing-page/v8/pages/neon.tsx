import { useState } from 'react'
import canvasLatest from '../../screenshots/canvas-latest.png'

// ── Neon — Extreme Minimal ──────────────────────────────────────────────────
// Pure white, single bold accent color, extreme negative space. Almost nothing
// there — what exists pops hard. Fully interactive.

const C = {
  bg: 'oklch(1.000 0 0)',
  text: 'oklch(0.100 0.005 0)',
  textSec: 'oklch(0.500 0.005 0)',
  border: 'oklch(0.930 0.005 0)',
  accent: 'oklch(0.600 0.280 330)',
}

const font = '"Inter", -apple-system, system-ui, sans-serif'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}

export function Neon() {
  const [bh, bhB] = useHover()
  const [ih, ihB] = useHover()
  const [expanded, setExpanded] = useState<string | null>(null)

  const features = [
    { id: 'canvas', title: 'Canvas', desc: 'Infinite, zoomable surface' },
    { id: 'ai', title: 'AI', desc: 'Multiple directions from one prompt' },
    { id: 'code', title: 'Code', desc: 'Production React output' },
  ]

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav — ultra minimal */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '32px 80px', maxWidth: 1200, margin: '0 auto',
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>bryllen</span>
        <button {...bhB} style={{
          border: 'none', background: C.accent, color: 'white',
          padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 600,
          cursor: 'default',
          transform: bh ? 'scale(1.05)' : 'scale(1)',
          transition: `transform 0.2s ${spring}`,
        }}>Start</button>
      </nav>

      {/* Hero — extreme whitespace */}
      <section style={{ padding: '160px 80px 120px', maxWidth: 800, margin: '0 auto', textAlign: 'center' as const }}>
        <h1 style={{
          fontSize: 72, fontWeight: 600, color: C.text,
          lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 24px',
        }}>
          See everything<br />at once
        </h1>
        <p style={{
          fontSize: 18, color: C.textSec, maxWidth: 400, margin: '0 auto',
          lineHeight: 1.5, textWrap: 'pretty' as const,
        }}>
          AI canvas for Claude Code
        </p>
      </section>

      {/* Single image */}
      <section style={{ padding: '0 80px 120px', maxWidth: 1000, margin: '0 auto' }}>
        <div {...ihB} style={{
          borderRadius: 16, overflow: 'hidden',
          boxShadow: ih ? '0 32px 80px oklch(0.2 0.02 0 / 0.15)' : '0 16px 48px oklch(0.2 0.01 0 / 0.08)',
          transform: ih ? 'translateY(-8px)' : 'translateY(0)',
          transition: `all 0.4s ${spring}`,
        }}>
          <img src={canvasLatest} alt="Canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Expandable features */}
      <section style={{ padding: '0 80px 160px', maxWidth: 800, margin: '0 auto' }}>
        {features.map((f, i) => (
          <div
            key={f.id}
            onClick={() => setExpanded(expanded === f.id ? null : f.id)}
            style={{
              padding: '24px 0',
              borderTop: i === 0 ? `1px solid ${C.border}` : 'none',
              borderBottom: `1px solid ${C.border}`,
              cursor: 'default',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{f.title}</span>
              <span style={{
                fontSize: 24, color: C.accent,
                transform: expanded === f.id ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}>+</span>
            </div>
            {expanded === f.id && (
              <p style={{
                fontSize: 15, color: C.textSec, margin: '16px 0 0', lineHeight: 1.5,
              }}>{f.desc}</p>
            )}
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 80px', maxWidth: 800, margin: '0 auto', textAlign: 'center' as const,
        borderTop: `1px solid ${C.border}`,
      }}>
        <p style={{ fontSize: 14, color: C.textSec, margin: '0 0 24px' }}>Ready?</p>
        <span style={{ fontSize: 48, fontWeight: 600, color: C.accent }}>→</span>
      </section>
    </div>
  )
}
