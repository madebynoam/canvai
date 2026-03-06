import { useState } from 'react'
import canvasLatest from '../../screenshots/canvas-latest.png'

// ── Pulse — Blue Gradient Codex Style (V8 Context) ────────────────────────────
// Based on Codex context image: soft blue gradients, tabbed navigation,
// card-based features, centered hero. Simple, no dynamic gradients.

const C = {
  bg: 'oklch(0.985 0.008 250)',
  bgGradient1: 'oklch(0.920 0.080 250)',
  bgGradient2: 'oklch(0.880 0.100 280)',
  bgCard: 'oklch(1.000 0 0)',
  text: 'oklch(0.150 0.020 250)',
  textSec: 'oklch(0.450 0.015 250)',
  textOnGradient: 'oklch(0.200 0.030 250)',
  border: 'oklch(0.920 0.015 250)',
  accent: 'oklch(0.500 0.200 250)',
}

const font = '"Inter", -apple-system, system-ui, sans-serif'
const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

function useHover() {
  const [h, setH] = useState(false)
  return [h, { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false) }] as const
}

type Tab = 'canvas' | 'generate' | 'iterate'
const tabs: { id: Tab; label: string }[] = [
  { id: 'canvas', label: 'Canvas' },
  { id: 'generate', label: 'Generate' },
  { id: 'iterate', label: 'Iterate' },
]

const tabContent: Record<Tab, { title: string; desc: string }> = {
  canvas: { title: 'Infinite canvas', desc: 'See every design direction at once. Pan, zoom, compare side by side. Everything visible in one place.' },
  generate: { title: 'AI-powered generation', desc: 'Describe what you want. Get multiple genuinely different directions — not variations, real alternatives.' },
  iterate: { title: 'Click to refine', desc: 'Click any element, describe the change. Watch it update live. No export-import cycle.' },
}

export function Pulse() {
  const [activeTab, setActiveTab] = useState<Tab>('canvas')
  const [bh, bhB] = useHover()
  const [ih, ihB] = useHover()

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Hero with gradient */}
      <div style={{
        background: `linear-gradient(180deg, ${C.bgGradient1} 0%, ${C.bgGradient2} 50%, ${C.bg} 100%)`,
        paddingBottom: 80,
      }}>
        {/* Nav */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 64px', maxWidth: 1100, margin: '0 auto',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 14,
          }}>B</div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Product', 'Docs', 'Pricing'].map(item => (
              <span key={item} style={{ fontSize: 14, color: C.textOnGradient, cursor: 'default' }}>{item}</span>
            ))}
          </div>
          <button {...bhB} style={{
            border: 'none', background: C.bgCard, color: C.text,
            padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            cursor: 'default', boxShadow: '0 2px 8px oklch(0.2 0.02 250 / 0.1)',
            transform: bh ? 'scale(1.02)' : 'scale(1)',
            transition: `transform 0.2s ${spring}`,
          }}>Get started</button>
        </nav>

        {/* Hero text */}
        <section style={{ padding: '80px 64px 60px', maxWidth: 800, margin: '0 auto', textAlign: 'center' as const }}>
          <h1 style={{
            fontSize: 52, fontWeight: 600, color: C.textOnGradient,
            lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px',
            textWrap: 'balance' as const,
          }}>
            The best way to design with AI
          </h1>
          <p style={{
            fontSize: 18, color: C.textOnGradient, opacity: 0.8, maxWidth: 500, margin: '0 auto',
            lineHeight: 1.6, textWrap: 'pretty' as const,
          }}>
            An infinite canvas for Claude Code. Describe what you want, see every direction at once.
          </p>
        </section>

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                border: 'none',
                background: activeTab === t.id ? C.bgCard : 'oklch(1 0 0 / 0.5)',
                color: activeTab === t.id ? C.text : C.textOnGradient,
                padding: '10px 24px', borderRadius: 20, fontSize: 14, fontWeight: 500,
                cursor: 'default',
                boxShadow: activeTab === t.id ? '0 4px 12px oklch(0.2 0.02 250 / 0.15)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >{t.label}</button>
          ))}
        </div>
      </div>

      {/* Tab content card */}
      <section style={{ padding: '0 64px', maxWidth: 1000, margin: '-40px auto 0' }}>
        <div {...ihB} style={{
          background: C.bgCard, borderRadius: 16, padding: 40,
          boxShadow: ih
            ? '0 24px 64px oklch(0.2 0.02 250 / 0.18)'
            : '0 12px 40px oklch(0.2 0.02 250 / 0.1)',
          transform: ih ? 'translateY(-4px)' : 'translateY(0)',
          transition: `all 0.3s ${spring}`,
        }}>
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ flex: '0 0 40%' }}>
              <h3 style={{ fontSize: 24, fontWeight: 600, color: C.text, margin: '0 0 12px' }}>
                {tabContent[activeTab].title}
              </h3>
              <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.6, margin: 0, textWrap: 'pretty' as const }}>
                {tabContent[activeTab].desc}
              </p>
            </div>
            <div style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
              <img src={canvasLatest} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 64px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, color: C.text, textAlign: 'center' as const, marginBottom: 48 }}>
          Design the way you think
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { icon: '◎', title: 'Describe', desc: 'Tell Bryllen what you want in plain words' },
            { icon: '◇', title: 'Compare', desc: 'See multiple directions on the infinite canvas' },
            { icon: '→', title: 'Ship', desc: 'Export production-ready React code' },
          ].map(item => (
            <div key={item.title} style={{
              background: C.bgCard, borderRadius: 12, padding: 24,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, ${C.bgGradient1}, ${C.bgGradient2})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, color: C.textOnGradient, marginBottom: 16,
              }}>{item.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: C.text, margin: '0 0 8px' }}>{item.title}</h4>
              <p style={{ fontSize: 14, color: C.textSec, margin: 0, lineHeight: 1.5, textWrap: 'pretty' as const }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 64px 64px', borderRadius: 16, padding: '48px 64px',
        background: `linear-gradient(135deg, ${C.bgGradient1}, ${C.bgGradient2})`,
        textAlign: 'center' as const,
      }}>
        <h3 style={{ fontSize: 24, fontWeight: 600, color: C.textOnGradient, margin: '0 0 12px' }}>
          Try Bryllen today
        </h3>
        <p style={{ fontSize: 15, color: C.textOnGradient, opacity: 0.8, margin: '0 0 24px' }}>
          Start designing with AI in minutes
        </p>
        <button style={{
          border: 'none', background: C.bgCard, color: C.text,
          padding: '12px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: 'default', boxShadow: '0 4px 12px oklch(0.2 0.02 250 / 0.2)',
        }}>Get started free</button>
      </section>
    </div>
  )
}
