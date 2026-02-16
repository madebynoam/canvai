import { useState, useRef, useCallback } from 'react'
import { Check } from 'lucide-react'
import { SPRING, useSpring } from '../spring'

export function Checkbox({ defaultChecked = false, label }: { defaultChecked?: boolean; label: string }) {
  const [checked, setChecked] = useState(defaultChecked)
  const boxRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const toggle = useCallback(() => {
    const next = !checked
    setChecked(next)
    spring.state.value = next ? 0.6 : 1.2
    spring.state.velocity = next ? 4 : -4
    spring.set(1, (v) => {
      if (boxRef.current) {
        boxRef.current.style.transform = `scale(${v})`
      }
    })
  }, [checked, spring])

  return (
    <div onClick={toggle} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
      <div
        ref={boxRef}
        style={{
          width: 16, height: 16, borderRadius: 'var(--radius-sm)', flexShrink: 0,
          border: checked ? 'none' : '1.5px solid var(--border)',
          backgroundColor: checked ? 'var(--accent)' : 'var(--surface)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {checked && <Check size={11} color="#fff" strokeWidth={2.5} />}
      </div>
      <span style={{ fontSize: 12, color: 'var(--text-primary)', textWrap: 'pretty' } as React.CSSProperties}>{label}</span>
    </div>
  )
}
