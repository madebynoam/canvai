/**
 * Slide 9: Master Board
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
  green: '#4ADE80',
  red: '#F87171',
}

export function MasterBoard() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>09 — Overview</div>
          <div style={{ fontSize: 32, color: C.text, fontWeight: 300 }}>Canvai</div>
        </div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Ship in 7 days</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48, flex: 1 }}>
        {/* Vision */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Vision</div>
          <div style={{ fontSize: 16, color: C.text, lineHeight: 1.5 }}>
            See every direction at once. Infinite canvas for Claude Code.
          </div>
        </div>

        {/* Ship */}
        <div>
          <div style={{ fontSize: 11, color: C.green, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Ship</div>
          {['Core loop', 'canvai new', 'canvai design', 'Share button', 'Docs'].map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: C.text, padding: '6px 0' }}>{item}</div>
          ))}
        </div>

        {/* Cut */}
        <div>
          <div style={{ fontSize: 11, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Cut</div>
          {['GH comments', '/close', '/update', '/share', '50+ LPs'].map((item, i) => (
            <div key={i} style={{ fontSize: 14, color: C.textMuted, padding: '6px 0', textDecoration: 'line-through' }}>{item}</div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Timeline</div>
          {[
            { d: '1-2', t: 'Core loop' },
            { d: '3', t: 'Simplify' },
            { d: '4', t: 'LP select' },
            { d: '5', t: 'Homepage' },
            { d: '6', t: 'Docs' },
            { d: '7', t: 'Ship' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, fontSize: 14, color: row.d === '7' ? C.text : C.textSec, padding: '6px 0' }}>
              <span style={{ color: C.textMuted, fontFamily: 'monospace', width: 32 }}>D{row.d}</span>
              <span>{row.t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 14, color: C.textSec, marginTop: 32, borderTop: `1px solid ${C.textMuted}40`, paddingTop: 24 }}>
        Goal: npx canvai new → shareable URL in under 5 minutes
      </div>
    </div>
  )
}
