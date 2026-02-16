import { useState } from 'react'

/** Icon button with subtle hover background. Used for toolbar actions. */
export function HoverButton({ children, size = 24, active, ...props }: {
  children: React.ReactNode
  size?: number
  active?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size, height: size,
        borderRadius: 'var(--radius-sm)',
        border: 'none',
        backgroundColor: hovered || active ? 'rgba(0,0,0,0.03)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
        cursor: 'default',
      }}
      {...props}
    >
      {children}
    </button>
  )
}
