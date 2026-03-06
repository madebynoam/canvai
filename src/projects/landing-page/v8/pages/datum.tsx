import { useState } from 'react'
import canvasWide from '../../screenshots/canvas-wide.png'

// ── Datum — Stats-first hero ──────────────────────────────────────────────
// Hero is just numbers. Big monospace metrics. No prose explanation until
// below the fold. Data speaks louder than adjectives.

const C = {
  bg: 'oklch(0.985 0.003 80)',
  text: 'oklch(0.120 0.005 80)',
  textSec: 'oklch(0.370 0.005 80)',
  textTer: 'oklch(0.560 0.005 80)',
  border: 'oklch(0.885 0.005 80)',
  accent: 'oklch(0.240 0.005 80)',
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

function Nav() {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 64px', maxWidth: 1440, margin: '0 auto',
      width: '100%', boxSizing: 'border-box',
    }}>
      <span style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: C.text }}>canvai</span>
      <div style={{ display: 'flex', gap: 28 }}>
        {['Features', 'Docs', 'GitHub'].map(l => (
          <span key={l} style={{ fontFamily: font, fontSize: 13, color: C.textTer, cursor: 'default' }}>{l}</span>
        ))}
      </div>
    </nav>
  )
}

function StatHero() {
  const [bh, bhB] = useHover()
  const [ba, baB] = usePress()
  const stats = [
    { value: '5', unit: 'directions', note: 'per prompt' },
    { value: '1', unit: 'prompt', note: 'to start' },
    { value: '0', unit: 'lost work', note: 'ever' },
    { value: '∞', unit: 'canvas', note: 'to explore' },
  ]
  return (
    <section style={{ padding: '100px 64px 40px', maxWidth: 1440, margin: '0 auto', boxSizing: 'border-box' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
        {stats.map((s, i) => (
          <div key={s.unit} style={{
            padding: '40px 32px',
            borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
            textAlign: 'center',
          }}>
            <span style={{
              fontFamily: mono, fontSize: 72, fontWeight: 300, color: C.text,
              letterSpacing: '-0.04em', display: 'block', lineHeight: 1,
            }}>{s.value}</span>
            <span style={{
              fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text,
              display: 'block', marginTop: 12,
            }}>{s.unit}</span>
            <span style={{
              fontFamily: font, fontSize: 12, fontWeight: 400, color: C.textTer,
              display: 'block', marginTop: 4,
            }}>{s.note}</span>
          </div>
        ))}
      </div>
      <div style={{
        borderTop: `1px solid ${C.border}`,
        marginTop: 40, paddingTop: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{
          fontFamily: font, fontSize: 17, fontWeight: 400, color: C.textSec,
          margin: 0, maxWidth: 480, lineHeight: 1.6, textWrap: 'pretty',
        }}>
          Describe what you need to Claude Code. See five directions at once on an infinite canvas. Pick the right one — or annotate it until it is.
        </p>
        <button {...bhB} {...baB} style={{
          border: 'none', cursor: 'default', fontFamily: font, fontWeight: 500,
          fontSize: 14, borderRadius: 4, padding: '12px 28px',
          background: C.accent, color: C.onDark,
          transform: ba ? 'scale(0.94)' : bh ? 'scale(1.01)' : 'scale(1)',
          transition: `transform 0.15s ${spring}`,
        }}>Start designing</button>
      </div>
    </section>
  )
}

function Product() {
  const [h, hB] = useHover()
  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 64px 80px', boxSizing: 'border-box' }}>
      <div {...hB} style={{
        borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}`,
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform 0.3s ${spring}`,
      }}>
        <img src={canvasWide} alt="Bryllen canvas" style={{ width: '100%', display: 'block' }} />
      </div>
    </section>
  )
}

function DataFeatures() {
  const rows = [
    { metric: '5×', label: 'More directions per session', detail: 'One prompt generates five layouts. No regenerating, no "try again."' },
    { metric: '0', label: 'Versions lost', detail: 'Every iteration is frozen. Go back to yesterday. Branch from any point.' },
    { metric: '<1s', label: 'Annotation to update', detail: 'Click, describe, watch. The canvas updates while you type.' },
    { metric: '100%', label: 'Production code', detail: 'Every frame is working React. Ship what you designed, not a screenshot of it.' },
  ]
  return (
    <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 64px 80px', boxSizing: 'border-box' }}>
      {rows.map((r, i) => (
        <div key={r.label} style={{
          display: 'grid', gridTemplateColumns: '100px 200px 1fr', gap: 32,
          padding: '24px 0', borderTop: `1px solid ${C.border}`,
          alignItems: 'baseline',
          ...(i === rows.length - 1 ? { borderBottom: `1px solid ${C.border}` } : {}),
        }}>
          <span style={{ fontFamily: mono, fontSize: 24, fontWeight: 400, color: C.text, letterSpacing: '-0.02em' }}>{r.metric}</span>
          <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text, textWrap: 'pretty' }}>{r.label}</span>
          <span style={{ fontFamily: font, fontSize: 14, fontWeight: 400, color: C.textSec, textWrap: 'pretty', lineHeight: 1.5 }}>{r.detail}</span>
        </div>
      ))}
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
      <span style={{ fontFamily: font, fontSize: 13, fontWeight: 400, color: C.textTer }}>canvai</span>
      <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>Data — 2025</span>
    </footer>
  )
}

export function Datum() {
  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      <Nav />
      <StatHero />
      <Product />
      <DataFeatures />
      <Footer />
    </div>
  )
}
