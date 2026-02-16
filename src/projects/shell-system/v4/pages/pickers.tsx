import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSpring, SPRING } from '../spring'

/**
 * 10 iteration picker variations. Each is a self-contained interactive component.
 * Fixed width (160px). Iterations compress within. Spring-animated needle/indicator.
 *
 * All follow the design system: var(--token), 4px grid, oklch, cursor: default.
 */

const W = 160 // fixed width for all pickers

/* ─── Shared needle spring hook ─── */
function useNeedleSpring(count: number, initial: number, onChange?: (i: number) => void) {
  const [active, setActive] = useState(initial)
  const ref = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  const getX = useCallback((i: number) => {
    if (count <= 1) return W / 2
    return (i / (count - 1)) * W
  }, [count])

  const select = useCallback((i: number) => {
    setActive(i)
    onChange?.(i)
    spring.set(getX(i), (v) => {
      if (ref.current) ref.current.style.transform = `translateX(${v}px)`
    })
  }, [spring, getX, onChange])

  return { active, select, ref, getX }
}

/* ════════════════════════════════════════════
   1. Hairline — ultra-thin ruler, 1px ticks, tiny dot needle
   ════════════════════════════════════════════ */
export function PickerHairline({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const { active, select, ref, getX } = useNeedleSpring(items.length, initial, onChange)
  const ticks = 20

  return (
    <div style={{ width: W, position: 'relative', height: 28, cursor: 'default' }}>
      {/* Labels */}
      {items.map((name, i) => (
        <button key={name} onClick={() => select(i)} style={{
          position: 'absolute', top: 0, left: getX(i), transform: 'translateX(-50%)',
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          fontSize: 9, fontWeight: i === active ? 600 : 400,
          color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
        }}>{name}</button>
      ))}
      {/* Ruler line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'var(--border)' }} />
      {/* Fine ticks */}
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const x = (i / ticks) * W
        const major = items.some((_, j) => Math.abs(getX(j) - x) < 3)
        return <div key={i} style={{
          position: 'absolute', bottom: 0, left: x, transform: 'translateX(-0.5px)',
          width: 1, height: major ? 8 : 4,
          backgroundColor: major ? 'var(--text-faint)' : 'var(--border)',
        }} />
      })}
      {/* Needle */}
      <div ref={ref} style={{
        position: 'absolute', bottom: -2, left: 0,
        transform: `translateX(${getX(active)}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none',
      }}>
        <div style={{ width: 1, height: 12, backgroundColor: 'var(--text-primary)' }} />
        <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--text-primary)', marginTop: -1 }} />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   2. Dot line — dots at each position, filled = active
   ════════════════════════════════════════════ */
export function PickerDots({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const [active, _setActive] = useState(initial)
  const setActive = (i: number) => { _setActive(i); onChange?.(i) }

  return (
    <div style={{ width: W, display: 'flex', alignItems: 'center', gap: 0, position: 'relative', height: 28, cursor: 'default' }}>
      {/* Line */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'var(--border)' }} />
      {/* Dots + labels */}
      {items.map((name, i) => {
        const x = items.length <= 1 ? W / 2 : (i / (items.length - 1)) * W
        const isActive = i === active
        return (
          <button key={name} onClick={() => setActive(i)} style={{
            position: 'absolute', left: x, transform: 'translateX(-50%)',
            border: 'none', background: 'none', cursor: 'default', padding: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{
              fontSize: 9, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--text-primary)' : 'var(--text-faint)',
            }}>{name}</span>
            <div style={{
              width: isActive ? 8 : 5, height: isActive ? 8 : 5, borderRadius: '50%',
              backgroundColor: isActive ? 'var(--text-primary)' : 'var(--border)',
              transition: 'width 120ms, height 120ms, background-color 120ms',
            }} />
          </button>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════════
   3. Segmented bar — thin bar divided into segments
   ════════════════════════════════════════════ */
export function PickerSegments({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const [active, _setActive] = useState(initial)
  const setActive = (i: number) => { _setActive(i); onChange?.(i) }

  return (
    <div style={{ width: W, cursor: 'default' }}>
      <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
        {items.map((name, i) => (
          <button key={name} onClick={() => setActive(i)} style={{
            flex: 1, height: 4, borderRadius: 4, border: 'none', cursor: 'default',
            backgroundColor: i <= active ? 'var(--text-primary)' : 'var(--border)',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {items.map((name, i) => (
          <button key={name} onClick={() => setActive(i)} style={{
            border: 'none', background: 'none', cursor: 'default', padding: 0,
            fontSize: 9, fontWeight: i === active ? 600 : 400,
            color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
          }}>{name}</button>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   4. Pill tabs — small rounded pills
   ════════════════════════════════════════════ */
export function PickerPills({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const [active, _setActive] = useState(initial)
  const setActive = (i: number) => { _setActive(i); onChange?.(i) }

  return (
    <div style={{
      display: 'inline-flex', gap: 2, padding: 2,
      borderRadius: 8, backgroundColor: 'var(--chrome-active)',
      cursor: 'default',
    }}>
      {items.map((name, i) => (
        <button key={name} onClick={() => setActive(i)} style={{
          border: 'none', cursor: 'default',
          padding: '4px 12px', borderRadius: 8,
          fontSize: 10, fontWeight: i === active ? 600 : 400,
          backgroundColor: i === active ? 'var(--surface)' : 'transparent',
          color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
          boxShadow: i === active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
        }}>{name}</button>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════
   5. Notch — thin line with triangle notch indicator below
   ════════════════════════════════════════════ */
export function PickerNotch({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const { active, select, ref, getX } = useNeedleSpring(items.length, initial, onChange)

  return (
    <div style={{ width: W, position: 'relative', height: 24, cursor: 'default' }}>
      {/* Labels */}
      {items.map((name, i) => (
        <button key={name} onClick={() => select(i)} style={{
          position: 'absolute', top: 0, left: getX(i), transform: 'translateX(-50%)',
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          fontSize: 9, fontWeight: i === active ? 600 : 400,
          color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
        }}>{name}</button>
      ))}
      {/* Line */}
      <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, height: 1, backgroundColor: 'var(--border)' }} />
      {/* Triangle notch */}
      <div ref={ref} style={{
        position: 'absolute', bottom: 0, left: 0,
        transform: `translateX(${getX(active)}px)`,
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 0, height: 0, marginLeft: -4,
          borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
          borderBottom: '4px solid var(--text-primary)',
        }} />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   6. Stepper — arrows + label, no timeline
   ════════════════════════════════════════════ */
export function PickerStepper({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const [active, _setActive] = useState(initial)
  const setActive = (i: number) => { _setActive(i); onChange?.(i) }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      cursor: 'default',
    }}>
      <button
        onClick={() => setActive(Math.max(0, active - 1))}
        style={{
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          color: active > 0 ? 'var(--text-secondary)' : 'var(--text-faint)',
          display: 'flex', alignItems: 'center',
        }}
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
      </button>
      <span style={{
        fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
        minWidth: 24, textAlign: 'center',
      }}>{items[active]}</span>
      <span style={{ fontSize: 9, color: 'var(--text-faint)' }}>
        {active + 1}/{items.length}
      </span>
      <button
        onClick={() => setActive(Math.min(items.length - 1, active + 1))}
        style={{
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          color: active < items.length - 1 ? 'var(--text-secondary)' : 'var(--text-faint)',
          display: 'flex', alignItems: 'center',
        }}
      >
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   7. Radio needle — red line like FM tuning, labels as frequency
   ════════════════════════════════════════════ */
export function PickerRadio({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const { active, select, ref, getX } = useNeedleSpring(items.length, initial, onChange)

  return (
    <div style={{ width: W, position: 'relative', height: 24, cursor: 'default' }}>
      {/* Labels */}
      {items.map((name, i) => (
        <button key={name} onClick={() => select(i)} style={{
          position: 'absolute', top: 0, left: getX(i), transform: 'translateX(-50%)',
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          fontSize: 9, fontWeight: i === active ? 600 : 400,
          color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
        }}>{name}</button>
      ))}
      {/* Baseline + tick marks */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'var(--border)' }} />
      {items.map((_, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: 0, left: getX(i), transform: 'translateX(-0.5px)',
          width: 1, height: 6, backgroundColor: 'var(--text-faint)',
        }} />
      ))}
      {/* Red needle line */}
      <div ref={ref} style={{
        position: 'absolute', top: 12, left: 0,
        transform: `translateX(${getX(active)}px)`,
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 2, height: 12, marginLeft: -1,
          backgroundColor: 'var(--accent)',
          borderRadius: 4,
        }} />
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   8. Underline — labels only, active gets accent underline
   ════════════════════════════════════════════ */
export function PickerUnderline({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const [active, _setActive] = useState(initial)
  const setActive = (i: number) => { _setActive(i); onChange?.(i) }

  return (
    <div style={{ display: 'inline-flex', gap: 16, cursor: 'default' }}>
      {items.map((name, i) => (
        <button key={name} onClick={() => setActive(i)} style={{
          border: 'none', background: 'none', cursor: 'default',
          padding: '0 0 4px', position: 'relative',
          fontSize: 10, fontWeight: i === active ? 600 : 400,
          color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
        }}>
          {name}
          {i === active && <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 2, borderRadius: 4, backgroundColor: 'var(--accent)',
          }} />}
        </button>
      ))}
    </div>
  )
}

/* ════════════════════════════════════════════
   9. Gauge — small semicircle with needle, like a speedometer
   ════════════════════════════════════════════ */
export function PickerGauge({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const [active, _setActive] = useState(initial)
  const setActive = (i: number) => { _setActive(i); onChange?.(i) }
  const angle = -90 + (active / Math.max(1, items.length - 1)) * 180

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'default' }}>
      {/* Arc + needle */}
      <div style={{
        width: 48, height: 24, position: 'relative', overflow: 'hidden',
      }}>
        {/* Arc */}
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '2px solid var(--border)', borderBottomColor: 'transparent', borderRightColor: 'transparent',
          transform: 'rotate(-45deg)',
          position: 'absolute', top: 0, left: 0,
        }} />
        {/* Needle */}
        <div style={{
          position: 'absolute', bottom: 0, left: 24,
          width: 2, height: 20, marginLeft: -1,
          backgroundColor: 'var(--text-primary)',
          borderRadius: 4,
          transformOrigin: 'bottom center',
          transform: `rotate(${angle}deg)`,
          transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
        {/* Center dot */}
        <div style={{
          position: 'absolute', bottom: -2, left: 22,
          width: 4, height: 4, borderRadius: '50%',
          backgroundColor: 'var(--text-primary)',
        }} />
      </div>
      {/* Labels row */}
      <div style={{ display: 'flex', gap: 8 }}>
        {items.map((name, i) => (
          <button key={name} onClick={() => setActive(i)} style={{
            border: 'none', background: 'none', cursor: 'default', padding: 0,
            fontSize: 9, fontWeight: i === active ? 600 : 400,
            color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
          }}>{name}</button>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   10. Hash marks — vertical hash marks like a film strip edge
   ════════════════════════════════════════════ */
export function PickerHash({ items = ['V1', 'V2', 'V3'], initial = 2, onChange }: { items?: string[]; initial?: number; onChange?: (i: number) => void }) {
  const { active, select, ref, getX } = useNeedleSpring(items.length, initial, onChange)
  const totalTicks = items.length * 4

  return (
    <div style={{ width: W, position: 'relative', height: 28, cursor: 'default' }}>
      {/* Top border */}
      <div style={{ position: 'absolute', top: 12, left: 0, right: 0, height: 1, backgroundColor: 'var(--border)' }} />
      <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 1, backgroundColor: 'var(--border)' }} />
      {/* Hash ticks between the two lines */}
      {Array.from({ length: totalTicks + 1 }).map((_, i) => {
        const x = (i / totalTicks) * W
        return <div key={i} style={{
          position: 'absolute', top: 12, left: x, transform: 'translateX(-0.5px)',
          width: 1, height: 8,
          backgroundColor: 'var(--border)',
        }} />
      })}
      {/* Labels above */}
      {items.map((name, i) => (
        <button key={name} onClick={() => select(i)} style={{
          position: 'absolute', top: 0, left: getX(i), transform: 'translateX(-50%)',
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          fontSize: 9, fontWeight: i === active ? 600 : 400,
          color: i === active ? 'var(--text-primary)' : 'var(--text-faint)',
        }}>{name}</button>
      ))}
      {/* Indicator — accent line through the hash strip */}
      <div ref={ref} style={{
        position: 'absolute', top: 8, left: 0,
        transform: `translateX(${getX(active)}px)`,
        pointerEvents: 'none',
      }}>
        <div style={{
          width: 2, height: 20, marginLeft: -1,
          backgroundColor: 'var(--accent)',
          borderRadius: 4,
        }} />
      </div>
    </div>
  )
}
