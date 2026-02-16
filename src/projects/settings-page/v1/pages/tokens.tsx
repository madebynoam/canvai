import { Badge } from '../components'

const MONO = 'SF Mono, Monaco, Inconsolata, monospace'

function Swatch({ color, name }: { color: string; name: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius-md)',
        backgroundColor: color, border: '1px solid rgba(0,0,0,0.06)',
      }} />
      <span style={{ fontSize: 9, color: 'var(--text-secondary)', fontFamily: MONO }}>{name}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 9, fontWeight: 600, color: 'var(--text-faint)',
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8,
      }}>{title}</div>
      {children}
    </div>
  )
}

export function Tokens() {
  return (
    <div style={{ padding: 32, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
        V1 Tokens — Warm Neutrals + Signal Red
      </h2>

      <Section title="Surfaces">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Swatch color="var(--surface)" name="--surface" />
          <Swatch color="var(--chrome)" name="--chrome" />
          <Swatch color="var(--chrome-active)" name="--active" />
          <Swatch color="var(--canvas-bg)" name="--canvas" />
          <Swatch color="var(--border)" name="--border" />
          <Swatch color="var(--border-soft)" name="--soft" />
        </div>
      </Section>

      <Section title="Text">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Swatch color="var(--text-primary)" name="--primary" />
          <Swatch color="var(--text-secondary)" name="--secondary" />
          <Swatch color="var(--text-tertiary)" name="--tertiary" />
          <Swatch color="var(--text-faint)" name="--faint" />
        </div>
      </Section>

      <Section title="Accent">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Swatch color="var(--accent)" name="--accent" />
          <Swatch color="var(--accent-hover)" name="--hover" />
          <Swatch color="var(--accent-muted)" name="--muted" />
          <Swatch color="var(--accent-strong)" name="--strong" />
        </div>
      </Section>

      <Section title="Semantic">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Swatch color="var(--success)" name="--success" />
          <Swatch color="var(--success-muted)" name="--s-muted" />
          <Swatch color="var(--danger)" name="--danger" />
          <Swatch color="var(--danger-muted)" name="--d-muted" />
        </div>
      </Section>

      <Section title="Badges">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge>Member</Badge>
          <Badge variant="accent">Owner</Badge>
          <Badge variant="success">Admin</Badge>
          <Badge variant="danger">Removed</Badge>
        </div>
      </Section>
    </div>
  )
}
