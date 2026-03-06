/**
 * V3 — Timeline
 * Minimal style with specific tasks per day
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
}

export function V3Timeline() {
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
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        05 — Timeline
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25, marginBottom: 32 }}>
        7 days to ship.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {days.map((day, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 20,
            padding: '12px 0',
            borderBottom: '1px solid #eee',
            backgroundColor: day.num === 7 ? C.text : 'transparent',
            color: day.num === 7 ? '#fff' : C.text,
            margin: day.num === 7 ? '8px -16px 0' : 0,
            padding: day.num === 7 ? '12px 16px' : '12px 0',
          }}>
            <div style={{ fontSize: 11, fontFamily: 'monospace', width: 28, color: day.num === 7 ? '#888' : C.textMuted }}>D{day.num}</div>
            <div style={{ fontSize: 14, fontWeight: day.num === 7 ? 500 : 400, width: 100 }}>{day.title}</div>
            <div style={{ fontSize: 13, color: day.num === 7 ? '#ccc' : C.textMuted }}>{day.tasks}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 24 }}>
        One outcome per day. No scope creep.
      </div>
    </div>
  )
}
