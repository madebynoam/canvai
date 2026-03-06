import { useState } from 'react'
import canvasLatest from '../../screenshots/canvas-latest.png'

// ── Pulse — Soft Blue Floating Cards ────────────────────────────────────────
// Inspired by context image. Soft blue tint, floating cards with gentle shadows,
// feature tabs that actually work. No dynamic gradients, simple and clean.

const C = {
  bg: 'oklch(0.980 0.015 250)',
  bgCard: 'oklch(1.000 0 0)',
  text: 'oklch(0.150 0.020 250)',
  textSec: 'oklch(0.450 0.015 250)',
  textTer: 'oklch(0.600 0.010 250)',
  border: 'oklch(0.920 0.015 250)',
  accent: 'oklch(0.550 0.200 250)',
  accentSoft: 'oklch(0.940 0.050 250)',
}

const font = '"Inter", -apple-system, system-ui, sans-serif'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}

const features = [
  { id: 'canvas', label: 'Canvas', title: 'Infinite canvas', desc: 'See every design direction at once. Pan, zoom, compare side by side.' },
  { id: 'generate', label: 'Generate', title: 'AI-powered', desc: 'Describe what you want. Get multiple genuinely different directions.' },
  { id: 'annotate', label: 'Annotate', title: 'Click to refine', desc: 'Click any element, describe the change. Watch it update.' },
]

export function Pulse() {
  const [activeTab, setActiveTab] = useState('canvas')
  const [bh, bhB] = useHover()
  const [ch, chB] = useHover()

  const activeFeature = features.find(f => f.id === activeTab) || features[0]

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 64px', maxWidth: 1200, margin: '0 auto',
      }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: C.text }}>bryllen</span>
        <button {...bhB} style={{
          border: 'none', background: C.accent, color: 'white',
          padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
          cursor: 'default',
          transform: bh ? 'scale(1.02)' : 'scale(1)',
          transition: `transform 0.2s ${spring}`,
        }}>Get started</button>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 64px 60px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' as const }}>
        <h1 style={{
          fontSize: 56, fontWeight: 600, color: C.text,
          lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px',
          textWrap: 'balance' as const,
        }}>
          The AI canvas for<br />design exploration
        </h1>
        <p style={{
          fontSize: 18, color: C.textSec, maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.6, textWrap: 'pretty' as const,
        }}>
          Like Figma, but AI does the work. Describe what you want, see multiple directions at once.
        </p>
      </section>

      {/* Feature Tabs */}
      <section style={{ padding: '0 64px 80px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40,
        }}>
          {features.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              style={{
                border: 'none',
                background: activeTab === f.id ? C.accent : C.bgCard,
                color: activeTab === f.id ? 'white' : C.textSec,
                padding: '10px 24px', borderRadius: 20, fontSize: 14, fontWeight: 500,
                cursor: 'default',
                boxShadow: activeTab === f.id ? 'none' : '0 2px 8px oklch(0.2 0.02 250 / 0.08)',
                transition: 'all 0.2s ease',
              }}
            >{f.label}</button>
          ))}
        </div>

        {/* Feature content */}
        <div {...chB} style={{
          background: C.bgCard, borderRadius: 16, padding: 40,
          boxShadow: ch
            ? '0 20px 60px oklch(0.2 0.02 250 / 0.15)'
            : '0 8px 32px oklch(0.2 0.02 250 / 0.08)',
          transform: ch ? 'translateY(-4px)' : 'translateY(0)',
          transition: `all 0.3s ${spring}`,
        }}>
          <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
            <div style={{ flex: '0 0 45%' }}>
              <h3 style={{ fontSize: 28, fontWeight: 600, color: C.text, margin: '0 0 12px' }}>
                {activeFeature.title}
              </h3>
              <p style={{ fontSize: 16, color: C.textSec, lineHeight: 1.6, margin: 0, textWrap: 'pretty' as const }}>
                {activeFeature.desc}
              </p>
            </div>
            <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <img src={canvasLatest} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section style={{ padding: '60px 64px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, color: C.text, textAlign: 'center' as const, marginBottom: 48 }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '◎', title: 'Describe', desc: 'Tell Bryllen what you want in plain English' },
            { icon: '◇', title: 'Compare', desc: 'See multiple directions on the canvas' },
            { icon: '◈', title: 'Ship', desc: 'Export production-ready React code' },
          ].map(item => (
            <div key={item.title} style={{
              background: C.bgCard, borderRadius: 12, padding: 28,
              boxShadow: '0 4px 16px oklch(0.2 0.02 250 / 0.06)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: C.accentSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: C.accent, marginBottom: 16,
              }}>{item.icon}</div>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: C.text, margin: '0 0 8px' }}>{item.title}</h4>
              <p style={{ fontSize: 14, color: C.textSec, margin: 0, lineHeight: 1.5, textWrap: 'pretty' as const }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
