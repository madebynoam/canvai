import { useState, useRef, useEffect, useCallback } from 'react'
import { SPRING, useSpring } from './spring'

export function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  const thumbRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const toggle = useCallback(() => {
    const next = !on
    setOn(next)
    spring.set(next ? 1 : 0, (v) => {
      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(${v * 20}px)`
      }
    })
  }, [on, spring])

  useEffect(() => {
    if (thumbRef.current) {
      thumbRef.current.style.transform = `translateX(${on ? 20 : 0}px)`
    }
  }, [])

  return (
    <div
      onClick={toggle}
      style={{
        width: 40, height: 20, borderRadius: 'var(--radius-md)',
        cursor: 'default',
        backgroundColor: on ? 'var(--accent)' : 'var(--border)',
        padding: 2, display: 'flex', alignItems: 'center',
      }}
    >
      <div
        ref={thumbRef}
        style={{
          width: 16, height: 16, borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--surface)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      />
    </div>
  )
}
