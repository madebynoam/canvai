/**
 * V3 Dark Editorial — Master Board
 * Complete overview with bold typography
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
  red: '#b54a4a',
}

export function V3DarkMaster() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', padding: 40, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>09 — Overview</div>
          <div style={{ fontSize: 32, color: C.text, fontWeight: 400 }}>Modaio</div>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Ship in 7 days</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, flex: 1 }}>
        {/* Vision */}
        <div style={{ padding: '16px 0', borderTop: `2px solid ${C.accent}` }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Vision</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
            See every direction at once. Infinite canvas for Claude Code.
          </div>
        </div>

        {/* Ship */}
        <div style={{ padding: '16px 0', borderTop: `2px solid ${C.accent}` }}>
          <div style={{ fontSize: 10, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Ship</div>
          {['Core loop', 'modaio new', 'modaio design', 'Share button', 'Docs'].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: C.text, padding: '4px 0', borderBottom: `1px solid ${C.textMuted}` }}>{item}</div>
          ))}
        </div>

        {/* Cut */}
        <div style={{ padding: '16px 0', borderTop: `2px solid ${C.red}` }}>
          <div style={{ fontSize: 10, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Cut</div>
          {['GH comments', '/close', '/update', '/share', '50+ LPs'].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: C.textMuted, padding: '4px 0', borderBottom: `1px solid ${C.textMuted}`, textDecoration: 'line-through' }}>{item}</div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ padding: '16px 0', borderTop: `2px solid ${C.textMuted}` }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Timeline</div>
          {[
            { d: '1-2', t: 'Core loop' },
            { d: '3', t: 'Simplify' },
            { d: '4', t: 'LP select' },
            { d: '5', t: 'Homepage' },
            { d: '6', t: 'Docs' },
            { d: '7', t: 'Ship' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, color: row.d === '7' ? C.text : C.textSec, padding: '4px 0', borderBottom: `1px solid ${C.textMuted}` }}>
              <span style={{ color: C.textMuted, fontFamily: 'monospace', width: 24 }}>D{row.d}</span>
              <span>{row.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 16, borderTop: `1px solid ${C.textMuted}`, paddingTop: 12 }}>
        Goal: npx modaio new → shareable URL in under 5 minutes
      </div>
    </div>
  )
}
