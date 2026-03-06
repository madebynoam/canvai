/**
 * Slide 8: Polish Checklist
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
  green: '#4ADE80',
  yellow: '#FACC15',
}

export function SlidePolish() {
  const categories = [
    {
      title: 'First 30 Seconds',
      items: [
        { task: 'Instant scaffold (<5s)', priority: 'must' },
        { task: 'Multiple directions shown', priority: 'must' },
        { task: 'Zero config', priority: 'must' },
      ],
    },
    {
      title: 'Core Interaction',
      items: [
        { task: 'Click → marker instantly', priority: 'must' },
        { task: 'Clear loading state', priority: 'must' },
        { task: 'Error has retry', priority: 'should' },
      ],
    },
    {
      title: 'Share Flow',
      items: [
        { task: 'Button in topbar', priority: 'must' },
        { task: 'URL copied immediately', priority: 'must' },
        { task: 'No dev UI on shared', priority: 'should' },
      ],
    },
    {
      title: 'Visual',
      items: [
        { task: 'OKLCH colors', priority: 'must' },
        { task: 'Pan/zoom 60fps', priority: 'must' },
        { task: 'Consistent radii', priority: 'should' },
      ],
    },
  ]

  const priorityColor = (p: string) => p === 'must' ? C.green : p === 'should' ? C.yellow : C.textMuted

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        08 — Polish
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3, marginBottom: 32 }}>
        What makes it "wow".
      </h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 40, fontSize: 11 }}>
        <span style={{ color: C.green }}>Must — ship blocker</span>
        <span style={{ color: C.yellow }}>Should — important</span>
        <span style={{ color: C.textMuted }}>Nice — if time</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40, flex: 1 }}>
        {categories.map((cat, i) => (
          <div key={i}>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 16 }}>{cat.title}</div>
            {cat.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: `1px solid ${C.textMuted}20` }}>
                <span style={{ fontSize: 14, color: C.text }}>{item.task}</span>
                <span style={{ fontSize: 10, color: priorityColor(item.priority), textTransform: 'uppercase' }}>{item.priority}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, color: C.textSec, marginTop: 32 }}>
        "Every interaction must feel inevitable."
      </div>
    </div>
  )
}
