const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const scale = [
  { size: 36, weight: 700, label: 'Display', usage: 'Pricing hero' },
  { size: 22, weight: 600, label: 'Heading 1', usage: 'Page titles' },
  { size: 17, weight: 600, label: 'Heading 2', usage: 'Card titles' },
  { size: 16, weight: 600, label: 'Heading 3', usage: 'Section titles' },
  { size: 14, weight: 500, label: 'Body', usage: 'Buttons, inputs' },
  { size: 13, weight: 400, label: 'Body Small', usage: 'Descriptions, text' },
  { size: 12, weight: 500, label: 'Caption', usage: 'Frame titles' },
  { size: 11, weight: 500, label: 'Overline', usage: 'Labels, counts' },
  { size: 10, weight: 500, label: 'Micro', usage: 'Badges, hints' },
  { size: 9, weight: 700, label: 'Tiny', usage: 'Marker numbers' },
]

export function TypeScale() {
  return (
    <div style={{ fontFamily: FONT, width: 560 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        Type Scale
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {scale.map(s => (
          <div key={s.size + s.label} style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 20,
            padding: '12px 0',
            borderBottom: '1px solid #F3F4F6',
          }}>
            <div style={{ width: 40, fontSize: 11, color: '#9CA3AF', fontFamily: 'SF Mono, Monaco, monospace', flexShrink: 0 }}>
              {s.size}px
            </div>
            <div style={{ flex: 1, fontSize: s.size, fontWeight: s.weight, color: '#1F2937', lineHeight: 1.3 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>
              {s.usage}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
