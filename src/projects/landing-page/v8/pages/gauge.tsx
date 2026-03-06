import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'

// ── Gauge — Instrument panel landing ──────────────────────────────────────
// Live-feeling metrics, progress indicators, status dots. The page looks
// like it's monitoring a design system. Dashboard-as-marketing.

const C = {
  bg: 'oklch(0.130 0.005 80)',
  text: 'oklch(0.930 0.003 80)',
  textSec: 'oklch(0.640 0.005 80)',
  textTer: 'oklch(0.460 0.005 80)',
  border: 'oklch(0.220 0.005 80)',
  surface: 'oklch(0.170 0.005 80)',
  green: 'oklch(0.650 0.150 145)',
  accent: 'oklch(0.930 0.003 80)',
  onAccent: 'oklch(0.130 0.005 80)',
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

function StatusDot({ active }: { active?: boolean }) {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: 4,
      background: active ? C.green : C.textTer,
      display: 'inline-block', flexShrink: 0,
    }} />
  )
}

function ProgressBar({ value, label }: { value: number, label: string }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginBottom: 8,
      }}>
        <span style={{ fontFamily: font, fontSize: 12, color: C.textSec }}>{label}</span>
        <span style={{ fontFamily: mono, fontSize: 12, color: C.textTer }}>{value}%</span>
      </div>
      <div style={{
        height: 4, borderRadius: 2, background: C.border, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 2,
          background: C.text, width: `${value}%`,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}

export function Gauge() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const [ph, phB] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusDot active />
          <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
        </div>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>System operational</span>
      </nav>

      {/* Hero metrics */}
      <section style={{ padding: '60px 64px 40px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <h1 style={{
          fontFamily: font, fontSize: 36, fontWeight: 500, color: C.text,
          lineHeight: 1.15, letterSpacing: '-0.025em', margin: '0 0 48px', textWrap: 'pretty',
        }}>
          Design exploration, instrumented.
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {[
            { label: 'Directions generated', value: '2,847', status: true },
            { label: 'Active projects', value: '156', status: true },
            { label: 'Annotations resolved', value: '9,204', status: true },
            { label: 'Versions preserved', value: '41,338', status: true },
          ].map(m => (
            <div key={m.label} style={{
              padding: 24, borderRadius: 8,
              background: C.surface, border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <StatusDot active={m.status} />
                <span style={{ fontFamily: font, fontSize: 12, color: C.textTer }}>{m.label}</span>
              </div>
              <span style={{
                fontFamily: mono, fontSize: 28, fontWeight: 400, color: C.text,
                letterSpacing: '-0.02em',
              }}>{m.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* System status */}
      <section style={{ padding: '0 64px 40px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{
          padding: 32, borderRadius: 8,
          background: C.surface, border: `1px solid ${C.border}`,
        }}>
          <p style={{
            fontFamily: mono, fontSize: 11, color: C.textTer,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            margin: '0 0 24px',
          }}>System health</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
            <ProgressBar value={100} label="Canvas uptime" />
            <ProgressBar value={98} label="Annotation accuracy" />
            <ProgressBar value={100} label="Version integrity" />
          </div>
        </div>
      </section>

      {/* Product */}
      <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px 40px', boxSizing: 'border-box' }}>
        <div {...phB} style={{
          borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
          transform: ph ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 0.3s ${spring}`,
        }}>
          <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Features as system log */}
      <section style={{ padding: '0 64px 40px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{
          padding: 32, borderRadius: 8,
          background: C.surface, border: `1px solid ${C.border}`,
        }}>
          <p style={{
            fontFamily: mono, fontSize: 11, color: C.textTer,
            letterSpacing: '0.06em', textTransform: 'uppercase' as const,
            margin: '0 0 20px',
          }}>Capabilities</p>
          {[
            { status: 'active', label: 'Multi-direction generation', desc: 'One prompt → five complete layouts on an infinite canvas' },
            { status: 'active', label: 'Direct annotation', desc: 'Click any frame, describe the change, watch the code update' },
            { status: 'active', label: 'Version preservation', desc: 'Every iteration frozen — branch from any point, go back to any version' },
            { status: 'active', label: 'Production output', desc: 'Every frame is working React — ship what you designed' },
          ].map((f, i) => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '16px 0',
              borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
            }}>
              <StatusDot active />
              <div>
                <span style={{
                  fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text,
                  display: 'block', marginBottom: 4,
                }}>{f.label}</span>
                <span style={{
                  fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textSec,
                  lineHeight: 1.5, textWrap: 'pretty',
                }}>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center', padding: '40px 64px 80px',
        maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box',
      }}>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 32px',
          background: C.accent, color: C.onAccent,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </section>

      {/* Footer */}
      <footer style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
        width: '100%', boxSizing: 'border-box', borderTop: `1px solid ${C.border}`,
      }}>
        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusDot active />
          <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>All systems nominal</span>
        </div>
      </footer>
    </div>
  )
}
