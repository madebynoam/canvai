/** Section label with optional subtitle. Uppercase, spaced, tertiary. */
export function Label({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginTop: 16, marginBottom: 4 }}>
      <div style={{
        fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{children}</div>
      {sub && (
        <div style={{
          fontSize: 9, color: 'var(--text-faint)', fontStyle: 'italic',
          marginTop: 2, textWrap: 'pretty',
        } as React.CSSProperties}>{sub}</div>
      )}
    </div>
  )
}
