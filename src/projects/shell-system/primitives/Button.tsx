import { useRef, useCallback, useState } from 'react'
import { SPRING, useSpring } from './spring'

/** Button with primary, outline, and ghost variants. Spring press feedback. */
export function Button({ children, variant = 'primary', ...props }: {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const spring = useSpring(SPRING.snappy)
  const [hovered, setHovered] = useState(false)

  const handlePress = useCallback(() => {
    spring.state.value = 0.92
    spring.state.velocity = -2
    spring.set(1, (v) => {
      if (btnRef.current) btnRef.current.style.transform = `scale(${v})`
    })
  }, [spring])

  const base: React.CSSProperties = {
    padding: 'var(--space-2) var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    cursor: 'default',
    outline: 'none',
    border: 'none',
  }

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: hovered ? 'var(--accent-hover)' : 'var(--accent)',
      color: 'oklch(1 0 0)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
      color: 'var(--text-secondary)',
    },
  }

  return (
    <button
      ref={btnRef}
      onPointerDown={handlePress}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...variants[variant] }}
      {...props}
    >
      {children}
    </button>
  )
}
