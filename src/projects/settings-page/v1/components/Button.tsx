import { useRef, useCallback, useState } from 'react'
import { SPRING, useSpring } from '../spring'

export function Button({ children, variant = 'primary', size = 'md', ...props }: {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
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

  const pad = size === 'sm' ? 'var(--space-1) var(--space-3)' : 'var(--space-2) var(--space-4)'
  const fs = size === 'sm' ? 11 : 13

  const base: React.CSSProperties = {
    padding: pad,
    fontSize: fs,
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    cursor: 'default',
    outline: 'none',
    border: 'none',
    fontFamily: 'inherit',
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
    danger: {
      background: hovered ? 'var(--danger)' : 'var(--danger-muted)',
      color: hovered ? 'oklch(1 0 0)' : 'var(--danger)',
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
