import { Label, Swatch } from '../components'

/** V2 Token overview — Rams palette: warm neutrals + Braun green */
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
    { name: '--accent',         value: 'oklch(0.52 0.14 155)' },
    { name: '--accent-hover',   value: 'oklch(0.58 0.12 155)' },
    { name: '--accent-muted',   value: 'oklch(0.92 0.04 155)' },
    { name: '--accent-strong',  value: 'oklch(0.46 0.16 155)' },
  ]

  return (
    <div style={{ padding: 32, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
        V2 Tokens — Warm Neutrals + Braun Green
      </h2>

      <Label sub="Warm stone h=80, c=0.003">Neutrals</Label>
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

      <Label sub="Braun indicator green h=155">Accent</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {accent.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, backgroundColor: 'var(--chrome)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <code style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-secondary)' }}>
          v2/tokens.css — .iter-v2 scope
        </code>
      </div>
    </div>
  )
}
