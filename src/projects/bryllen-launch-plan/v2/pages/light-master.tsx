/**
 * Light Style — Master Board
 * Minimal editorial
 */

const C = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  textSec: '#6B6B6B',
  textMuted: '#999999',
  border: '#E5E5E5',
}

export function LightMaster() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: '64px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
        <div>
          <h1 style={{ fontSize: 48, fontWeight: 300, color: C.text, margin: 0 }}>Modaio</h1>
          <div style={{ fontSize: 13, color: C.textSec, marginTop: 8 }}>See every direction at once</div>
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Summary
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, flex: 1 }}>
        {/* Jobs */}
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Jobs</div>
          {['Explore', 'Iterate', 'Decide', 'Share'].map((j, i) => (
            <div key={i} style={{ fontSize: 14, color: C.text, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>{j}</div>
          ))}
        </div>

        {/* Ship */}
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Ship</div>
          {['Core loop', 'new', 'design', 'Share btn', 'Docs'].map((s, i) => (
            <div key={i} style={{ fontSize: 14, color: C.text, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>{s}</div>
          ))}
        </div>

        {/* Timeline */}
        <div>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>7 Days</div>
          {['D1-2 Core', 'D3 Simplify', 'D4 LP', 'D5-6 Site', 'D7 Ship'].map((d, i) => (
            <div key={i} style={{ fontSize: 14, color: C.textSec, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>{d}</div>
          ))}
        </div>

        {/* Goal */}
        <div style={{ backgroundColor: C.text, padding: 24, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6 }}>Goal</div>
          <div style={{ fontSize: 15, lineHeight: 1.6 }}>
            npx modaio new → shareable URL in under 5 minutes
          </div>
        </div>
      </div>
    </div>
  )
}
