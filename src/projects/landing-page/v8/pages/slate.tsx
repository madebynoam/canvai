import { useState } from 'react'
import canvasLatest from '../../screenshots/canvas-latest.png'

// ── Slate — Dark Industrial ─────────────────────────────────────────────────
// Deep charcoal, sharp cyan accent, industrial precision. For developers who
// appreciate clean, no-nonsense interfaces. Fully interactive.

const C = {
  bg: 'oklch(0.130 0.010 250)',
  bgCard: 'oklch(0.170 0.012 250)',
  bgHover: 'oklch(0.200 0.015 250)',
  text: 'oklch(0.950 0.005 250)',
  textSec: 'oklch(0.700 0.010 250)',
  textTer: 'oklch(0.500 0.008 250)',
  border: 'oklch(0.250 0.015 250)',
  accent: 'oklch(0.750 0.180 195)',
  accentDim: 'oklch(0.550 0.120 195)',
}

const font = '"Inter", -apple-system, system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", monospace'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
]

export function Slate() {
  const [activeTab, setActiveTab] = useState('overview')
  const [bh, bhB] = useHover()
  const [sh, shB] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>bryllen</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  border: 'none', background: activeTab === t.id ? C.bgCard : 'transparent',
                  color: activeTab === t.id ? C.text : C.textSec,
                  padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                  cursor: 'default', transition: 'all 0.15s ease',
                }}
              >{t.label}</button>
            ))}
          </div>
        </div>
        <button {...bhB} style={{
          border: `1px solid ${C.accent}`, background: bh ? C.accent : 'transparent',
          color: bh ? C.bg : C.accent,
          padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 500,
          cursor: 'default', transition: 'all 0.2s ease',
        }}>Start building</button>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 48px 80px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{
            fontFamily: mono, fontSize: 12, color: C.accent,
            background: 'oklch(0.750 0.180 195 / 0.15)', padding: '4px 10px', borderRadius: 4,
          }}>for Claude Code</span>
        </div>
        <h1 style={{
          fontSize: 52, fontWeight: 600, color: C.text,
          lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px',
        }}>
          Design with AI.<br />
          <span style={{ color: C.accent }}>Ship real code.</span>
        </h1>
        <p style={{
          fontSize: 17, color: C.textSec, maxWidth: 480, lineHeight: 1.6, margin: '0 0 32px',
          textWrap: 'pretty' as const,
        }}>
          An infinite canvas where you see every design direction at once. Click to refine. Export production React.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button {...shB} style={{
            border: 'none', background: C.accent, color: C.bg,
            padding: '12px 24px', borderRadius: 6, fontSize: 14, fontWeight: 500,
            cursor: 'default',
            transform: sh ? 'scale(1.02)' : 'scale(1)',
            transition: `transform 0.15s ${spring}`,
          }}>Get started free</button>
          <button style={{
            border: `1px solid ${C.border}`, background: 'transparent', color: C.textSec,
            padding: '12px 24px', borderRadius: 6, fontSize: 14, fontWeight: 500,
            cursor: 'default',
          }}>Watch demo</button>
        </div>
      </section>

      {/* Screenshot */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`,
          background: C.bgCard,
        }}>
          <div style={{
            padding: '8px 12px', borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.65 0.2 25)' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.75 0.18 90)' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'oklch(0.65 0.18 145)' }} />
            <span style={{ marginLeft: 8, fontSize: 11, color: C.textTer, fontFamily: mono }}>bryllen — canvas</span>
          </div>
          <img src={canvasLatest} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 48px 100px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: C.border, borderRadius: 8, overflow: 'hidden' }}>
          {[
            { num: '01', title: 'Infinite canvas', desc: 'See every direction at once' },
            { num: '02', title: 'AI generation', desc: 'Multiple layouts from one prompt' },
            { num: '03', title: 'Direct annotation', desc: 'Click to request changes' },
          ].map(item => (
            <div key={item.num} style={{ background: C.bgCard, padding: 28 }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.accentDim }}>{item.num}</span>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: '8px 0' }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: C.textSec, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
