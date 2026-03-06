/**
 * V3 — Polish Checklist
 * Minimal style with categorized priorities
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
  green: '#16a34a',
  yellow: '#ca8a04',
}

export function V3Polish() {
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

  const priorityColor = (p: string) => p === 'must' ? C.green : C.yellow

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        07 — Polish
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25, marginBottom: 20 }}>
        What makes it "wow".
      </h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24, fontSize: 10 }}>
        <span style={{ color: C.green }}>● Must — ship blocker</span>
        <span style={{ color: C.yellow }}>● Should — important</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32, flex: 1 }}>
        {categories.map((cat, i) => (
          <div key={i}>
            <div style={{ fontSize: 10, color: C.textSec, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{cat.title}</div>
            {cat.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <span style={{ fontSize: 12, color: C.text }}>{item.task}</span>
                <span style={{ fontSize: 9, color: priorityColor(item.priority), textTransform: 'uppercase' }}>{item.priority}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 20 }}>
        "Every interaction must feel inevitable."
      </div>
    </div>
  )
}
