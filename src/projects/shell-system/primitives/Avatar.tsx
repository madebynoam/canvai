/** Circular avatar with letter fallback. */
export function Avatar({ letter, size = 28, bg, color = 'oklch(1 0 0)' }: {
  letter: string; size?: number; bg?: string; color?: string
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      backgroundColor: bg ?? 'var(--accent)',
      color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: Math.round(size * 0.4), fontWeight: 600,
    }}>
      {letter}
    </div>
  )
}
