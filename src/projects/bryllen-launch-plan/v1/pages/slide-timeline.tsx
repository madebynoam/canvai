/**
 * Slide 5: 7-Day Timeline
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
}

export function SlideTimeline() {
  const days = [
    { num: 1, title: 'Core Loop', tasks: 'Fix annotation, test watch mode' },
    { num: 2, title: 'Polish', tasks: 'Error states, loading, perf' },
    { num: 3, title: 'Simplify', tasks: 'Share button, remove commands' },
    { num: 4, title: 'LP Select', tasks: 'Pick 3 best, polish winner' },
    { num: 5, title: 'Homepage', tasks: 'canvai.dev, demo GIF' },
    { num: 6, title: 'Docs', tasks: 'README, 60s quickstart' },
    { num: 7, title: 'Ship', tasks: 'Final QA, soft launch' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        05 — Timeline
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3, marginBottom: 48 }}>
        7 days to ship.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {days.map((day, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '12px 0', borderBottom: i < 6 ? `1px solid ${C.textMuted}20` : 'none' }}>
            <div style={{ fontSize: 13, color: day.num === 7 ? C.text : C.textMuted, fontFamily: 'monospace', width: 32 }}>D{day.num}</div>
            <div style={{ fontSize: 16, color: day.num === 7 ? C.text : C.textSec, fontWeight: day.num === 7 ? 500 : 400, width: 120 }}>{day.title}</div>
            <div style={{ fontSize: 14, color: C.textMuted }}>{day.tasks}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, color: C.textSec, marginTop: 32 }}>
        One outcome per day. No scope creep.
      </div>
    </div>
  )
}
