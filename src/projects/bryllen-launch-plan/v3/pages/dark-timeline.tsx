/**
 * V3 Dark Editorial — Timeline
 * 7-day plan with tasks
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
}

export function V3DarkTimeline() {
  const days = [
    { num: 1, title: 'Core Loop', tasks: 'Fix annotation, test watch mode' },
    { num: 2, title: 'Polish', tasks: 'Error states, loading, perf' },
    { num: 3, title: 'Simplify', tasks: 'Share button, remove commands' },
    { num: 4, title: 'LP Select', tasks: 'Pick 3 best, polish winner' },
    { num: 5, title: 'Homepage', tasks: 'modaio.dev, demo GIF' },
    { num: 6, title: 'Docs', tasks: 'README, 60s quickstart' },
    { num: 7, title: 'Ship', tasks: 'Final QA, soft launch' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', display: 'flex' }}>
      {/* Image column */}
      <div style={{ width: 240 }}>
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&q=80"
          alt="Planning"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 48, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          05 — Timeline
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 24 }}>
          7 days to ship.
        </h1>

        <div style={{ flex: 1 }}>
          {days.map((day, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '10px 0',
              borderBottom: `1px solid ${C.textMuted}`,
              backgroundColor: day.num === 7 ? C.accent : 'transparent',
              margin: day.num === 7 ? '8px -16px 0' : 0,
              padding: day.num === 7 ? '10px 16px' : '10px 0',
            }}>
              <div style={{ fontSize: 12, fontFamily: 'monospace', width: 28, color: day.num === 7 ? '#000' : C.textMuted }}>D{day.num}</div>
              <div style={{ fontSize: 14, fontWeight: 500, width: 90, color: day.num === 7 ? '#000' : C.text }}>{day.title}</div>
              <div style={{ fontSize: 13, color: day.num === 7 ? '#333' : C.textSec }}>{day.tasks}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: C.textSec, marginTop: 16 }}>
          One outcome per day. No scope creep.
        </div>
      </div>
    </div>
  )
}
