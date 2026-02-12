const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const radii = [
  { value: 4, usage: 'Toggles, small elements' },
  { value: 6, usage: 'Dropdown items, sidebar items' },
  { value: 8, usage: 'Buttons, inputs, dropdowns' },
  { value: 10, usage: 'Cards, comment panel' },
  { value: 12, usage: 'Mode pills' },
  { value: 16, usage: 'Large cards' },
  { value: 20, usage: 'Pill buttons, toasts' },
  { value: 99, usage: 'Full pill / badge' },
]

export function RadiusScale() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Border Radius
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {radii.map(r => (
          <div key={r.value} style={{ textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: r.value,
              border: '2px solid #E8590C',
              backgroundColor: 'rgba(232, 89, 12, 0.06)',
              margin: '0 auto 10px',
            }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>{r.value}px</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{r.usage}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
