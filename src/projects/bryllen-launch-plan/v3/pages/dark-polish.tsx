/**
 * V3 Dark Editorial — Polish Checklist
 * Categorized priorities
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
  yellow: '#c4a84a',
}

export function V3DarkPolish() {
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

  const priorityColor = (p: string) => p === 'must' ? C.accent : C.yellow

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', padding: 48, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
        07 — Polish
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 16 }}>
        What makes it "wow".
      </h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 10 }}>
        <span style={{ color: C.accent }}>● Must — ship blocker</span>
        <span style={{ color: C.yellow }}>● Should — important</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, flex: 1 }}>
        {categories.map((cat, i) => (
          <div key={i}>
            <div style={{ fontSize: 10, color: C.textSec, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{cat.title}</div>
            {cat.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: `1px solid ${C.textMuted}` }}>
                <span style={{ fontSize: 12, color: C.text }}>{item.task}</span>
                <span style={{ fontSize: 9, color: priorityColor(item.priority), textTransform: 'uppercase' }}>{item.priority}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 16, fontStyle: 'italic' }}>
        "Every interaction must feel inevitable."
      </div>
    </div>
  )
}
