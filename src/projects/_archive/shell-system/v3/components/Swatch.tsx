const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

/** Color preview box with label and optional OKLCH value. */
export function Swatch({ color, label, value, size = 44, dark }: {
  color: string; label: string; value?: string; size?: number; dark?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div style={{
        width: size, height: size, borderRadius: 'var(--radius-md)', backgroundColor: color,
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {dark !== undefined && (
          <span style={{ fontSize: 9, fontWeight: 600, color: dark ? '#fff' : 'var(--text-primary)' }}>Aa</span>
        )}
      </div>
      <span style={{ fontSize: 8, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
      {value && <span style={{ fontSize: 7, color: 'var(--text-faint)', fontFamily: MONO }}>{value}</span>}
    </div>
  )
}
