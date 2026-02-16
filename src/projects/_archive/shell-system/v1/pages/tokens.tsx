import { Label, Swatch } from '../components'

/** V1 Token overview — displays all CSS custom properties from tokens.css */
export function Tokens() {
  const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

  const neutrals = [
    { name: '--surface',        value: 'oklch(0.995 0 0)' },
    { name: '--chrome',         value: 'oklch(0.955 0 0)' },
    { name: '--chrome-active',  value: 'oklch(0.940 0 0)' },
    { name: '--canvas-bg',      value: 'oklch(0.975 0 0)' },
    { name: '--border',         value: 'oklch(0.900 0 0)' },
    { name: '--border-soft',    value: 'oklch(0.920 0 0)' },
  ]

  const text = [
    { name: '--text-primary',   value: 'oklch(0.200 0 0)' },
    { name: '--text-secondary', value: 'oklch(0.400 0 0)' },
    { name: '--text-tertiary',  value: 'oklch(0.560 0 0)' },
    { name: '--text-faint',     value: 'oklch(0.680 0 0)' },
  ]

  const accent = [
    { name: '--accent',         value: 'oklch(0.68 0.18 235)' },
    { name: '--accent-hover',   value: 'oklch(0.78 0.14 235)' },
    { name: '--accent-muted',   value: 'oklch(0.93 0.05 235)' },
    { name: '--accent-strong',  value: 'oklch(0.58 0.20 235)' },
  ]

  return (
    <div style={{ padding: 32, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
        V1 Tokens — Cerulean Accent
      </h2>

      <Label sub="Cool grays, no hue">Neutrals</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {neutrals.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <Label sub="Lightness scale">Text</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {text.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <Label sub="Cerulean h=235">Accent</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24, marginTop: 8 }}>
        {accent.map(t => (
          <Swatch key={t.name} color={t.value} label={t.name} value={t.value} />
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 12, backgroundColor: 'var(--chrome)', borderRadius: 8, border: '1px solid var(--border)' }}>
        <code style={{ fontFamily: MONO, fontSize: 11, color: 'var(--text-secondary)' }}>
          v1/tokens.css — .iter-v1 scope + :root fallback
        </code>
      </div>
    </div>
  )
}
