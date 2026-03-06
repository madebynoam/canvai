import { useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { S, R, ICON, FONT } from '../tokens'

export type ThemeMode = 'system' | 'light' | 'dark'

interface ThemeToggleProps {
  mode?: ThemeMode
  onChange?: (mode: ThemeMode) => void
}

const modes: { value: ThemeMode; Icon: typeof Sun }[] = [
  { value: 'system', Icon: Monitor },
  { value: 'light',  Icon: Sun },
  { value: 'dark',   Icon: Moon },
]

export function ThemeToggle({ mode = 'system', onChange }: ThemeToggleProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div style={{
      display: 'inline-flex', gap: 2,
      padding: 2,
      borderRadius: R.pill,
      backgroundColor: 'var(--chrome-sub)',
      fontFamily: FONT,
    }}>
      {modes.map((m, i) => {
        const active = m.value === mode
        const hovered = hoveredIdx === i && !active

        return (
          <button
            key={m.value}
            onClick={() => onChange?.(m.value)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            title={m.value.charAt(0).toUpperCase() + m.value.slice(1)}
            style={{
              width: 28,
              height: 24,
              border: 'none',
              borderRadius: R.pill,
              backgroundColor: active
                ? 'var(--card)'
                : hovered
                  ? 'var(--hover-subtle)'
                  : 'transparent',
              color: active ? 'var(--txt-pri)' : 'var(--txt-faint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              padding: 0,
              boxShadow: active ? '0 1px 2px rgba(0,0,0,0.20)' : 'none',
              transition: 'background-color 120ms ease, color 120ms ease',
            }}
          >
            <m.Icon size={ICON.sm} strokeWidth={1.5} />
          </button>
        )
      })}
    </div>
  )
}
