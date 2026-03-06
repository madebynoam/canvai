/**
 * V3 — Master Board
 * Minimal style with complete overview
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
  green: '#16a34a',
  red: '#dc2626',
}

export function V3Master() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 48, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>09 — Overview</div>
          <div style={{ fontSize: 28, color: C.text, fontWeight: 300 }}>Modaio</div>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted }}>Ship in 7 days</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, flex: 1 }}>
        {/* Vision */}
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Vision</div>
          <div style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>
            See every direction at once. Infinite canvas for Claude Code.
          </div>
        </div>

        {/* Ship */}
        <div>
          <div style={{ fontSize: 9, color: C.green, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Ship</div>
          {['Core loop', 'modaio new', 'modaio design', 'Share button', 'Docs'].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: C.text, padding: '5px 0', borderBottom: '1px solid #eee' }}>{item}</div>
          ))}
        </div>

        {/* Cut */}
        <div>
          <div style={{ fontSize: 9, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Cut</div>
          {['GH comments', '/close', '/update', '/share', '50+ LPs'].map((item, i) => (
            <div key={i} style={{ fontSize: 12, color: C.textMuted, padding: '5px 0', borderBottom: '1px solid #eee', textDecoration: 'line-through' }}>{item}</div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Timeline</div>
          {[
            { d: '1-2', t: 'Core loop' },
            { d: '3', t: 'Simplify' },
            { d: '4', t: 'LP select' },
            { d: '5', t: 'Homepage' },
            { d: '6', t: 'Docs' },
            { d: '7', t: 'Ship' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: row.d === '7' ? C.text : C.textSec, padding: '5px 0', borderBottom: '1px solid #eee' }}>
              <span style={{ color: C.textMuted, fontFamily: 'monospace', width: 28 }}>D{row.d}</span>
              <span>{row.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
        Goal: npx modaio new → shareable URL in under 5 minutes
      </div>
    </div>
  )
}
