import { useState, useRef, useCallback } from 'react'
import { useSpring, SPRING } from '../spring'

/**
 * IterationRadio — FM tuning picker.
 *
 * Fixed 160px. Accent needle springs between positions.
 * Labels above, ruler below. Click ANYWHERE on the ruler to select
 * the nearest iteration — no fiddly individual tick targets.
 *
 * Scales from 1 to 20+:
 *   - ≤6 items: all labels visible
 *   - 7+ items: only active + first + last labels
 */

const W = 160

export function IterationRadio({ items, initial = 0, onChange }: {
  items: string[]
  initial?: number
  onChange?: (i: number) => void
}) {
  const [active, setActive] = useState(initial)
  const needleRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const getX = useCallback((i: number) => {
    if (items.length <= 1) return W / 2
    return 4 + (i / (items.length - 1)) * (W - 8)
  }, [items.length])

  const select = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    setActive(clamped)
    onChange?.(clamped)
    spring.set(getX(clamped), (v) => {
      if (needleRef.current) needleRef.current.style.transform = `translateX(${v}px)`
    })
  }, [spring, getX, onChange, items.length])

  // Click anywhere on ruler → select nearest item
  const onRulerClick = useCallback((e: React.MouseEvent) => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - 4 // account for 4px inset
    const fraction = Math.max(0, Math.min(1, x / (W - 8)))
    const nearest = Math.round(fraction * (items.length - 1))
    select(nearest)
  }, [items.length, select])

  const showAllLabels = items.length <= 6
  const showLabel = (i: number) => {
    if (showAllLabels) return true
    if (i === active) return true
    if (i === 0 || i === items.length - 1) return true
    return false
  }

  return (
    <div style={{ width: W, position: 'relative', height: 20, cursor: 'default' }}>
      {/* Labels */}
      <div style={{ position: 'relative', height: 10 }}>
        {items.map((name, i) => showLabel(i) ? (
          <button key={i} onClick={() => select(i)} style={{
            position: 'absolute', top: 0, left: getX(i), transform: 'translateX(-50%)',
            border: 'none', background: 'none', cursor: 'default', padding: 0,
            fontSize: 9, fontWeight: i === active ? 600 : 400,
            color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
            whiteSpace: 'nowrap', lineHeight: '10px',
          }}>{name}</button>
        ) : null)}
      </div>

      {/* Ruler — one big clickable area */}
      <div
        ref={rulerRef}
        onClick={onRulerClick}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10 }}
      >
        {/* Baseline */}
        <div style={{
          position: 'absolute', bottom: 4, left: 4, right: 4,
          height: 1, backgroundColor: 'var(--border)',
        }} />

        {/* Tick marks (visual only — ruler handles clicks) */}
        {items.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: 2, left: getX(i),
            transform: 'translateX(-0.5px)',
            width: 1, height: i === active ? 6 : 4,
            backgroundColor: i === active ? 'var(--text-secondary)' : 'var(--border)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Accent needle */}
        <div ref={needleRef} style={{
          position: 'absolute', top: -2, left: 0,
          transform: `translateX(${getX(active)}px)`,
          pointerEvents: 'none', zIndex: 1,
        }}>
          <div style={{
            width: 2, height: 12, marginLeft: -1,
            backgroundColor: 'var(--accent)',
            borderRadius: 4,
          }} />
        </div>
      </div>
    </div>
  )
}
