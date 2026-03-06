import { useState } from 'react'
import canvasLatest from '../../screenshots/canvas-latest.png'

// ── Block — Playful Geometric ───────────────────────────────────────────────
// Colorful geometric blocks, rounded corners, chunky shapes. Fun and
// approachable without being childish. Fully interactive.

const C = {
  bg: 'oklch(0.985 0.010 280)',
  bgYellow: 'oklch(0.920 0.120 95)',
  bgBlue: 'oklch(0.850 0.120 250)',
  bgPink: 'oklch(0.900 0.100 350)',
  bgGreen: 'oklch(0.880 0.120 155)',
  text: 'oklch(0.150 0.020 280)',
  textSec: 'oklch(0.400 0.015 280)',
  white: 'oklch(1.000 0 0)',
}

const font = '"Inter", -apple-system, system-ui, sans-serif'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}

export function Block() {
  const [activeBlock, setActiveBlock] = useState(0)
  const [bh, bhB] = useHover()

  const blocks = [
    { bg: C.bgYellow, title: 'Canvas', desc: 'Infinite surface for all your designs' },
    { bg: C.bgBlue, title: 'Generate', desc: 'AI creates multiple directions' },
    { bg: C.bgPink, title: 'Annotate', desc: 'Click and describe changes' },
    { bg: C.bgGreen, title: 'Ship', desc: 'Export production React code' },
  ]

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 48px',
      }}>
        <div style={{
          background: C.text, color: C.white, padding: '8px 16px',
          borderRadius: 12, fontSize: 16, fontWeight: 700,
        }}>bryllen</div>
        <button {...bhB} style={{
          border: 'none', background: C.text, color: C.white,
          padding: '12px 28px', borderRadius: 100, fontSize: 14, fontWeight: 600,
          cursor: 'default',
          transform: bh ? 'scale(1.05) rotate(-2deg)' : 'scale(1)',
          transition: `transform 0.2s ${spring}`,
        }}>Get started ✦</button>
      </nav>

      {/* Hero with blocks */}
      <section style={{ padding: '60px 48px 40px' }}>
        <div style={{ display: 'flex', gap: 20, maxWidth: 1200, margin: '0 auto' }}>
          {/* Main hero block */}
          <div style={{
            flex: '0 0 55%', background: C.bgYellow, borderRadius: 24, padding: 48,
          }}>
            <h1 style={{
              fontSize: 48, fontWeight: 700, color: C.text,
              lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 20px',
            }}>
              Design with AI ✨
            </h1>
            <p style={{
              fontSize: 18, color: C.text, opacity: 0.7, maxWidth: 400,
              lineHeight: 1.5, margin: 0, textWrap: 'pretty' as const,
            }}>
              An infinite canvas where you see every direction at once. Like Figma, but AI does the work.
            </p>
          </div>

          {/* Side blocks */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{
              flex: 1, background: C.bgBlue, borderRadius: 24, padding: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 48 }}>🎨</span>
            </div>
            <div style={{
              flex: 1, background: C.bgPink, borderRadius: 24, padding: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 48 }}>⚡</span>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot */}
      <section style={{ padding: '20px 48px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          borderRadius: 24, overflow: 'hidden', border: `4px solid ${C.text}`,
        }}>
          <img src={canvasLatest} alt="Canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Interactive feature blocks */}
      <section style={{ padding: '40px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {blocks.map((b, i) => (
            <div
              key={i}
              onClick={() => setActiveBlock(i)}
              style={{
                background: b.bg, borderRadius: 20, padding: 24,
                cursor: 'default',
                transform: activeBlock === i ? 'scale(1.02) rotate(-1deg)' : 'scale(1)',
                boxShadow: activeBlock === i ? '0 8px 24px oklch(0.2 0.02 0 / 0.15)' : 'none',
                transition: `all 0.2s ${spring}`,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: '0 0 8px' }}>{b.title}</h3>
              <p style={{ fontSize: 13, color: C.text, opacity: 0.7, margin: 0, lineHeight: 1.4 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        padding: '60px 48px', background: C.text, borderRadius: '32px 32px 0 0',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' as const }}>
          <h2 style={{
            fontSize: 36, fontWeight: 700, color: C.white,
            margin: '0 0 16px',
          }}>Ready to design?</h2>
          <p style={{
            fontSize: 16, color: C.white, opacity: 0.7, margin: '0 0 32px',
          }}>Start building with Bryllen today</p>
          <button style={{
            border: 'none', background: C.bgYellow, color: C.text,
            padding: '16px 40px', borderRadius: 100, fontSize: 16, fontWeight: 700,
            cursor: 'default',
          }}>Let's go →</button>
        </div>
      </section>
    </div>
  )
}
