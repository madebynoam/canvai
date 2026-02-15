const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const shadows = [
  { name: 'Subtle', value: '0 1px 4px rgba(0, 0, 0, 0.04)', usage: 'Card borders' },
  { name: 'Elevation 1', value: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)', usage: 'Dropdowns' },
  { name: 'Elevation 2', value: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)', usage: 'Comment card' },
  { name: 'Accent', value: '0 2px 8px rgba(232, 89, 12, 0.25)', usage: 'Annotate button' },
  { name: 'Accent Hover', value: '0 4px 16px rgba(232, 89, 12, 0.25)', usage: 'Button hover' },
  { name: 'Toast', value: '0 2px 12px rgba(0, 0, 0, 0.12)', usage: 'Toast notification' },
]

export function ShadowScale() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Shadows
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {shadows.map(s => (
          <div key={s.name}>
            <div style={{
              width: '100%',
              height: 72,
              borderRadius: 12,
              backgroundColor: '#FFFFFF',
              boxShadow: s.value,
              border: '1px solid #F3F4F6',
              marginBottom: 10,
            }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1F2937' }}>{s.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.usage}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
