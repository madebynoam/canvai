export function Badge({ children, variant = 'default' }: {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'danger'
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    default: { bg: 'var(--chrome)', text: 'var(--text-secondary)' },
    accent:  { bg: 'var(--accent-muted)', text: 'var(--accent-strong)' },
    success: { bg: 'var(--success-muted)', text: 'var(--success)' },
    danger:  { bg: 'var(--danger-muted)', text: 'var(--danger)' },
  }
  const c = colors[variant] ?? colors.default

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 'var(--radius-full)',
      fontSize: 10, fontWeight: 500,
      backgroundColor: c.bg, color: c.text,
    }}>
      {children}
    </span>
  )
}
