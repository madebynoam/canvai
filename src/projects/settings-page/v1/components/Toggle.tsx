import { useState, useRef, useEffect } from 'react'
import { SPRING, useSpring } from '../spring'

export function Toggle({ defaultOn = false, onChange }: {
  defaultOn?: boolean
  onChange?: (on: boolean) => void
}) {
  const [on, setOn] = useState(defaultOn)
  const thumbRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const toggle = () => {
    const next = !on
    setOn(next)
    onChange?.(next)
    spring.set(next ? 1 : 0, (v) => {
      if (thumbRef.current) thumbRef.current.style.transform = `translateX(${v * 16}px)`
    })
  }

  useEffect(() => {
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateX(${on ? 16 : 0}px)`
    }
  }, [])

  return (
    <div onClick={toggle} style={{
      width: 36, height: 20, borderRadius: 'var(--radius-full)',
      cursor: 'default',
      backgroundColor: on ? 'var(--accent)' : 'var(--border)',
      padding: 2, display: 'flex', alignItems: 'center',
    }}>
      <div ref={thumbRef} style={{
        width: 16, height: 16, borderRadius: '50%',
        backgroundColor: 'var(--surface)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }} />
    </div>
  )
}
