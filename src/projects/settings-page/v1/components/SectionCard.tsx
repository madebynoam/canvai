export function SectionCard({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border-soft)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{
          fontSize: 14, fontWeight: 600, color: 'var(--text-primary)',
          margin: 0,
        }}>{title}</h3>
        {description && (
          <p style={{
            fontSize: 12, color: 'var(--text-tertiary)', margin: '4px 0 0',
            textWrap: 'pretty',
          } as React.CSSProperties}>{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
