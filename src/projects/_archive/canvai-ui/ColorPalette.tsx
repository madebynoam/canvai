const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const colors = [
  { name: 'Accent', value: '#E8590C', token: 'ACCENT' },
  { name: 'Accent Hover', value: '#CF4F0B', token: 'ACCENT_HOVER' },
  { name: 'Accent Pressed', value: '#D4520A', token: 'ACCENT_PRESSED' },
  { name: 'Accent Muted', value: 'rgba(232, 89, 12, 0.15)', token: 'ACCENT_MUTED', light: true },
  { name: 'Surface', value: '#FFFFFF', token: 'SURFACE', light: true },
  { name: 'Surface Alt', value: '#F9FAFB', token: 'SURFACE_ALT', light: true },
  { name: 'Border', value: '#E5E7EB', token: 'BORDER', light: true },
  { name: 'Text Primary', value: '#1F2937', token: 'TEXT_PRIMARY' },
  { name: 'Text Secondary', value: '#6B7280', token: 'TEXT_SECONDARY' },
  { name: 'Text Tertiary', value: '#9CA3AF', token: 'TEXT_TERTIARY', light: true },
  { name: 'Watch Green', value: '#10B981', token: '—' },
  { name: 'Watch Text', value: '#059669', token: '—' },
]

export function ColorPalette() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Colors
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {colors.map(c => (
          <div key={c.token + c.name}>
            <div style={{
              width: '100%',
              height: 56,
              borderRadius: 10,
              backgroundColor: c.value,
              border: c.light ? '1px solid #E5E7EB' : 'none',
              marginBottom: 8,
            }} />
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1F2937' }}>{c.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'SF Mono, Monaco, monospace' }}>
              {c.value.length > 20 ? 'rgba(…)' : c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
