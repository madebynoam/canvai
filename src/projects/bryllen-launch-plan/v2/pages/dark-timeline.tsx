/**
 * Dark Style — Timeline
 * Minimal editorial, dark variant
 */

const C = {
  bg: '#0A0A0A',
  text: '#FAFAFA',
  textSec: '#888888',
  textMuted: '#555555',
  border: '#222222',
}

export function DarkTimeline() {
  const days = [
    { num: 1, title: 'Core Loop', desc: 'Fix annotation flows' },
    { num: 2, title: 'Polish', desc: 'Error states, loading' },
    { num: 3, title: 'Simplify', desc: 'Share button, cut commands' },
    { num: 4, title: 'LP Select', desc: 'Pick best designs' },
    { num: 5, title: 'Homepage', desc: 'modaio.dev + demo' },
    { num: 6, title: 'Docs', desc: '60s quickstart' },
    { num: 7, title: 'Ship', desc: 'Soft launch' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Timeline */}
      <div style={{ flex: 1, padding: '80px 64px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
          Timeline
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 48 }}>
          7 days to ship.
        </h1>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {days.map((day, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'baseline',
              padding: '12px 0',
              borderBottom: i < days.length - 1 ? `1px solid ${C.border}` : 'none',
              backgroundColor: day.num === 7 ? C.text : 'transparent',
              color: day.num === 7 ? C.bg : C.text,
              margin: day.num === 7 ? '8px -16px 0' : 0,
              padding: day.num === 7 ? '12px 16px' : '12px 0',
            }}>
              <span style={{ fontSize: 10, color: day.num === 7 ? 'rgba(10,10,10,0.5)' : C.textMuted, width: 40 }}>D{day.num}</span>
              <span style={{ fontSize: 14, fontWeight: 400, width: 100 }}>{day.title}</span>
              <span style={{ fontSize: 13, color: day.num === 7 ? 'rgba(10,10,10,0.7)' : C.textSec }}>{day.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Full-bleed image */}
      <div style={{ width: '40%' }}>
        <img
          src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80"
          alt="Architectural detail"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
      </div>
    </div>
  )
}
