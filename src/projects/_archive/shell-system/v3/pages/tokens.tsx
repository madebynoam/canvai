import { Label, Swatch } from '../components'

/** V3 Token overview — Signal red accent + elevated canvas */
export function Tokens() {
  const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

  const neutrals = [
    { name: '--surface',        value: 'oklch(0.993 0.003 80)' },
    { name: '--chrome',         value: 'oklch(0.952 0.003 80)' },
    { name: '--chrome-active',  value: 'oklch(0.935 0.003 80)' },
    { name: '--canvas-bg',      value: 'oklch(0.972 0.003 80)' },
    { name: '--border',         value: 'oklch(0.895 0.005 80)' },
    { name: '--border-soft',    value: 'oklch(0.915 0.003 80)' },
  ]

  const text = [
    { name: '--text-primary',   value: 'oklch(0.180 0.005 80)' },
    { name: '--text-secondary', value: 'oklch(0.380 0.005 80)' },
    { name: '--text-tertiary',  value: 'oklch(0.540 0.005 80)' },
    { name: '--text-faint',     value: 'oklch(0.660 0.003 80)' },
  ]

  const accent = [
    { name: '--accent',         value: 'oklch(0.52 0.20 28)' },
    { name: '--accent-hover',   value: 'oklch(0.62 0.18 28)' },
    { name: '--accent-muted',   value: 'oklch(0.92 0.05 28)' },
    { name: '--accent-strong',  value: 'oklch(0.46 0.18 28)' },
    { name: '--accent-border',  value: 'oklch(0.85 0.08 28)' },
  ]

  const elevation = [
    { name: '--canvas-radius', value: '12px' },
    { name: '--canvas-inset',  value: '12px' },
  ]

  return (
    <div style={{ padding: 32, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
        V3 Tokens — Signal Red + Elevated Canvas
      </h2>

      <Label sub="Warm stone h=80, c=0.003 (same as V2)">Neutrals</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {neutrals.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <Label sub="Warm neutral text scale">Text</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {text.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <Label sub="Signal red h=28 (TG 60 record button)">Accent</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {accent.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <Label sub="Canvas inset, radius, shadow">Elevation</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {elevation.map(t => (
          <div key={t.name} style={{ padding: '8px 12px', backgroundColor: 'var(--chrome)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontFamily: MONO, color: 'var(--text-secondary)' }}>{t.name}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginTop: 4 }}>{t.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, backgroundColor: 'var(--chrome)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <code style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-secondary)' }}>
          v3/tokens.css — .iter-v3 scope
        </code>
      </div>
    </div>
  )
}
