import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from './useReducedMotion'
import { N, S, R, T, ICON, FONT } from './tokens'

/**
 * IterationPills — Pill strip with draggable highlight.
 *
 * Click a pill -> highlight springs to it.
 * Drag -> highlight slides continuously with the finger.
 * When it crosses into the next pill slot, the active item
 * updates (and the strip slides if there are 5+ items).
 * On release, highlight springs to snap on the active pill.
 *
 * 1 item: single pill, no interaction.
 * 2-4 items: all visible, draggable highlight, no scrolling.
 * 5+ items: viewport clips, arrows + counter + scrolling.
 */

const PILL_W = 32
const GAP = S.xs
const STEP = PILL_W + GAP
const VIEWPORT_W = 140
const PAD = S.xs
const DRAG_THRESHOLD = 3

/* ── Inline spring (no dependency on project spring.ts) ── */

interface SpringState {
  value: number
  velocity: number
  target: number
  raf: number
  onUpdate: ((v: number) => void) | null
}

function useSpring(config: { tension: number; friction: number }) {
  const ref = useRef<SpringState>({
    value: 0, velocity: 0, target: 0, raf: 0, onUpdate: null,
  })
  const reducedMotion = useReducedMotion()

  const set = useCallback((target: number, onUpdate: (v: number) => void) => {
    const s = ref.current
    s.target = target
    s.onUpdate = onUpdate
    cancelAnimationFrame(s.raf)

    if (reducedMotion) {
      s.value = target
      s.velocity = 0
      s.onUpdate?.(s.value)
      return
    }

    const DT = 1 / 120
    let lastTime = 0
    let accum = 0

    function tick(now: number) {
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.064) : 0
      lastTime = now
      accum += delta

      const { tension, friction } = config
      while (accum >= DT) {
        const force = -tension * (s.value - s.target) - friction * s.velocity
        s.velocity += force * DT
        s.value += s.velocity * DT
        accum -= DT
      }

      s.onUpdate?.(s.value)

      if (Math.abs(s.velocity) < 0.01 && Math.abs(s.value - s.target) < 0.001) {
        s.value = s.target
        s.velocity = 0
        s.onUpdate?.(s.value)
        return
      }

      s.raf = requestAnimationFrame(tick)
    }

    s.raf = requestAnimationFrame(tick)
  }, [config, reducedMotion])

  useEffect(() => () => cancelAnimationFrame(ref.current.raf), [])

  return { set, state: ref.current }
}

const SPRING_SNAPPY = { tension: 233, friction: 19 }

interface IterationPillsProps {
  items: string[]
  activeIndex: number
  onSelect: (index: number) => void
}

export function IterationPills({ items, activeIndex, onSelect }: IterationPillsProps) {
  const [active, setActive] = useState(activeIndex)
  const stripRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING_SNAPPY)
  const hlSpring = useSpring(SPRING_SNAPPY)
  const isDraggingRef = useRef(false)

  // Sync active state with external prop
  useEffect(() => {
    setActive(activeIndex)
  }, [activeIndex])

  const stripW = items.length * STEP - GAP
  const contentW = VIEWPORT_W - PAD * 2
  const needsSlide = stripW > contentW
  const canDrag = items.length > 1

  const getStripX = useCallback((i: number) => {
    if (!needsSlide) return 0
    const center = contentW / 2 - (i * STEP + PILL_W / 2)
    const minX = -(stripW - contentW)
    return Math.max(minX, Math.min(0, center))
  }, [needsSlide, contentW, stripW])

  const getHighlightX = (i: number) => i * STEP

  // Seed spring values to match initial position (avoids animate-from-zero on first click)
  const seededRef = useRef(false)
  if (!seededRef.current) {
    hlSpring.state.value = getHighlightX(activeIndex)
    hlSpring.state.target = hlSpring.state.value
    spring.state.value = getStripX(activeIndex)
    spring.state.target = spring.state.value
    seededRef.current = true
  }

  const springTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    setActive(clamped)
    onSelect(clamped)
    if (canDrag) {
      hlSpring.set(getHighlightX(clamped), (v) => {
        if (highlightRef.current) highlightRef.current.style.transform = `translateX(${v}px)`
      })
    }
    if (!needsSlide) return
    const target = getStripX(clamped)
    spring.set(target, (v) => {
      if (stripRef.current) stripRef.current.style.transform = `translateX(${v}px)`
    })
  }, [items.length, onSelect, canDrag, needsSlide, getStripX, spring, hlSpring])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!canDrag) return
    e.preventDefault()
    const startPointerX = e.clientX
    const startHlX = getHighlightX(active)
    isDraggingRef.current = false
    let currentActive = active

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startPointerX
      if (!isDraggingRef.current && Math.abs(delta) > DRAG_THRESHOLD) {
        isDraggingRef.current = true
        hlSpring.state.velocity = 0
      }
      if (!isDraggingRef.current) return

      const maxHlX = (items.length - 1) * STEP
      const hlX = Math.max(0, Math.min(maxHlX, startHlX + delta))
      if (highlightRef.current) highlightRef.current.style.transform = `translateX(${hlX}px)`
      hlSpring.state.value = hlX
      hlSpring.state.velocity = 0

      const nearest = Math.max(0, Math.min(items.length - 1, Math.round(hlX / STEP)))

      if (nearest !== currentActive) {
        currentActive = nearest
        setActive(nearest)
        onSelect(nearest)
        if (needsSlide) {
          const target = getStripX(nearest)
          spring.set(target, (v) => {
            if (stripRef.current) stripRef.current.style.transform = `translateX(${v}px)`
          })
        }
      }
    }

    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      if (isDraggingRef.current) {
        hlSpring.set(getHighlightX(currentActive), (v) => {
          if (highlightRef.current) highlightRef.current.style.transform = `translateX(${v}px)`
        })
      }
      setTimeout(() => { isDraggingRef.current = false }, 50)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [canDrag, needsSlide, active, items.length, getStripX, spring, hlSpring, onSelect])

  const onPillClick = useCallback((i: number) => {
    if (isDraggingRef.current) return
    springTo(i)
  }, [springTo])

  if (items.length === 0) return null

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: S.xs, cursor: 'default', fontFamily: FONT }}>
      {needsSlide && (
        <button onClick={() => springTo(active - 1)} style={{
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          color: active > 0 ? N.txtSec : N.border,
          display: 'flex', alignItems: 'center',
          opacity: active > 0 ? 1 : 0.4,
        }}>
          <ChevronLeft size={ICON.sm} strokeWidth={1.5} />
        </button>
      )}

      {/* Viewport */}
      <div
        onPointerDown={onPointerDown}
        style={{
          width: needsSlide ? VIEWPORT_W : 'auto',
          overflow: 'hidden',
          borderRadius: R.pill,
          backgroundColor: N.chromeSub,
          padding: PAD,
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <div
          ref={stripRef}
          style={{
            display: 'flex', gap: GAP,
            transform: needsSlide ? `translateX(${getStripX(active)}px)` : undefined,
            width: 'max-content',
            willChange: needsSlide ? 'transform' : undefined,
            position: 'relative',
          }}
        >
          {/* Floating highlight — draggable handle for 2+ items */}
          {canDrag && (
            <div
              ref={highlightRef}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: PILL_W, height: '100%',
                borderRadius: R.pill,
                backgroundColor: N.card,
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                transform: `translateX(${getHighlightX(active)}px)`,
                willChange: 'transform',
                pointerEvents: 'none',
              }}
            />
          )}

          {items.map((name, i) => {
            const isActive = i === active
            return (
              <button key={i} onClick={() => onPillClick(i)} style={{
                width: PILL_W,
                flexShrink: 0,
                border: 'none', cursor: 'default',
                padding: `${S.xs}px ${S.sm}px`, borderRadius: R.pill,
                fontSize: T.pill, fontWeight: isActive ? 600 : 400,
                fontFamily: FONT,
                backgroundColor: !canDrag && isActive ? N.card : 'transparent',
                color: isActive ? N.txtPri : N.txtFaint,
                boxShadow: !canDrag && isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                whiteSpace: 'nowrap', textAlign: 'center',
                userSelect: 'none',
                position: 'relative', zIndex: 1,
              }}>{name}</button>
            )
          })}
        </div>
      </div>

      {needsSlide && (
        <button onClick={() => springTo(active + 1)} style={{
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          color: active < items.length - 1 ? N.txtSec : N.border,
          display: 'flex', alignItems: 'center',
          opacity: active < items.length - 1 ? 1 : 0.4,
        }}>
          <ChevronRight size={ICON.sm} strokeWidth={1.5} />
        </button>
      )}

      {needsSlide && (
        <span style={{
          fontSize: T.label, color: N.txtFaint,
          fontVariantNumeric: 'tabular-nums',
          userSelect: 'none',
        }}>{active + 1}/{items.length}</span>
      )}
    </div>
  )
}
