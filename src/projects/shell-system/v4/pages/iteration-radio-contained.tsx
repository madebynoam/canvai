import { useState, useRef, useCallback } from 'react'
import { useSpring, SPRING } from '../spring'

/**
 * IterationRadioContained — Radio picker in a rounded container.
 *
 * Layout: [V1] ═══════▲═══════ [V20]
 *         label  ruler strip   label
 *
 * First and last labels sit to the SIDES of the ruler, not above.
 * The entire ruler strip is one clickable area — click anywhere to
 * select the nearest iteration. Much better hit targets than individual ticks.
 * Accent needle springs between positions.
 */

const RULER_W = 120 // ruler strip width (labels sit outside)

export function IterationRadioContained({ items, initial = 0, onChange }: {
  items: string[]
  initial?: number
  onChange?: (i: number) => void
}) {
  const [active, setActive] = useState(initial)
  const needleRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const getX = useCallback((i: number) => {
    if (items.length <= 1) return RULER_W / 2
    return (i / (items.length - 1)) * RULER_W
  }, [items.length])

  const select = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    setActive(clamped)
    onChange?.(clamped)
    spring.set(getX(clamped), (v) => {
      if (needleRef.current) needleRef.current.style.transform = `translateX(${v}px)`
    })
  }, [spring, getX, onChange, items.length])

  // Click anywhere on the ruler → select nearest item
  const onRulerClick = useCallback((e: React.MouseEvent) => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const fraction = Math.max(0, Math.min(1, x / RULER_W))
    const nearest = Math.round(fraction * (items.length - 1))
    select(nearest)
  }, [items.length, select])

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '4px 12px',
      borderRadius: 12, backgroundColor: 'var(--chrome-active)',
      cursor: 'default',
    }}>
      {/* First label */}
      <span style={{
        fontSize: 9, fontWeight: active === 0 ? 600 : 400,
        color: active === 0 ? 'var(--text-primary)' : 'var(--text-faint)',
        whiteSpace: 'nowrap', minWidth: 16, textAlign: 'center',
        userSelect: 'none',
      }}>{items[0]}</span>

      {/* Ruler strip — full-width clickable */}
      <div
        ref={rulerRef}
        onClick={onRulerClick}
        style={{
          width: RULER_W, height: 16, position: 'relative',
          cursor: 'default',
        }}
      >
        {/* Baseline */}
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          height: 1, backgroundColor: 'var(--border)',
        }} />

        {/* Tick marks */}
        {items.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: getX(i),
            transform: 'translate(-0.5px, -50%)',
            width: 1, height: i === active ? 8 : 4,
            backgroundColor: i === active ? 'var(--text-secondary)' : 'var(--border)',
          }} />
        ))}

        {/* Accent needle — spring-animated */}
        <div ref={needleRef} style={{
          position: 'absolute', top: 0, left: 0,
          transform: `translateX(${getX(active)}px)`,
          pointerEvents: 'none', zIndex: 1,
        }}>
          <div style={{
            width: 2, height: 16, marginLeft: -1,
            backgroundColor: 'var(--accent)',
            borderRadius: 4,
          }} />
        </div>
      </div>

      {/* Last label */}
      <span style={{
        fontSize: 9, fontWeight: active === items.length - 1 ? 600 : 400,
        color: active === items.length - 1 ? 'var(--text-primary)' : 'var(--text-faint)',
        whiteSpace: 'nowrap', minWidth: 16, textAlign: 'center',
        userSelect: 'none',
      }}>{items[items.length - 1]}</span>

      {/* Active label — shown when it's not the first or last */}
      {items.length > 2 && active > 0 && active < items.length - 1 && (
        <span style={{
          fontSize: 9, fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>{items[active]}</span>
      )}
    </div>
  )
}
