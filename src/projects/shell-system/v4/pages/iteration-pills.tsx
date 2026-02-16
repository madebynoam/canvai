import { useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSpring, SPRING } from '../spring'

/**
 * IterationPills — Pill strip with draggable highlight.
 *
 * Click a pill → highlight springs to it.
 * Drag → highlight slides continuously with the finger.
 * When it crosses into the next pill slot, the active item
 * updates (and the strip slides if there are 5+ items).
 * On release, highlight springs to snap on the active pill.
 *
 * 1 item: single pill, no interaction.
 * 2-4 items: all visible, draggable highlight, no scrolling.
 * 5+ items: viewport clips, arrows + counter + scrolling.
 */

const PILL_W = 32
const GAP = 2
const STEP = PILL_W + GAP
const VIEWPORT_W = 140
const PAD = 2
const DRAG_THRESHOLD = 3

export function IterationPills({ items, initial = 0, onChange }: {
  items: string[]
  initial?: number
  onChange?: (i: number) => void
}) {
  const [active, setActive] = useState(initial)
  const stripRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)
  const hlSpring = useSpring(SPRING.snappy)
  const isDraggingRef = useRef(false)

  const stripW = items.length * STEP - GAP
  const contentW = VIEWPORT_W - PAD * 2
  const needsSlide = stripW > contentW
  const canDrag = items.length > 1

  // Clamped strip translateX to center item i
  const getStripX = useCallback((i: number) => {
    if (!needsSlide) return 0
    const center = contentW / 2 - (i * STEP + PILL_W / 2)
    const minX = -(stripW - contentW)
    return Math.max(minX, Math.min(0, center))
  }, [needsSlide, contentW, stripW])

  // Highlight translateX within the strip (pill i's left edge)
  const getHighlightX = (i: number) => i * STEP

  // Spring the strip to center item i + snap highlight
  const springTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    setActive(clamped)
    onChange?.(clamped)
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
  }, [items.length, onChange, canDrag, needsSlide, getStripX, spring, hlSpring])

  // Drag: highlight tracks finger, strip snaps at boundaries
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

      // Highlight follows finger 1:1 (clamped to strip bounds)
      const maxHlX = (items.length - 1) * STEP
      const hlX = Math.max(0, Math.min(maxHlX, startHlX + delta))
      if (highlightRef.current) highlightRef.current.style.transform = `translateX(${hlX}px)`
      // Keep spring state in sync so release animates from the right spot
      hlSpring.state.value = hlX
      hlSpring.state.velocity = 0

      // Which pill slot is the highlight centered on?
      const nearest = Math.max(0, Math.min(items.length - 1,
        Math.round(hlX / STEP)
      ))

      if (nearest !== currentActive) {
        currentActive = nearest
        setActive(nearest)
        onChange?.(nearest)
        if (needsSlide) {
          // Strip springs to center the new item
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
        // Spring highlight to snap onto the active pill
        hlSpring.set(getHighlightX(currentActive), (v) => {
          if (highlightRef.current) highlightRef.current.style.transform = `translateX(${v}px)`
        })
      }
      setTimeout(() => { isDraggingRef.current = false }, 50)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [canDrag, needsSlide, active, items.length, getStripX, spring, hlSpring, onChange])

  const onPillClick = useCallback((i: number) => {
    if (isDraggingRef.current) return
    springTo(i)
  }, [springTo])

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'default' }}>
      {needsSlide && (
        <button onClick={() => springTo(active - 1)} style={{
          border: 'none', background: 'none', cursor: 'default', padding: 0,
          color: active > 0 ? 'var(--text-secondary)' : 'var(--border)',
          display: 'flex', alignItems: 'center',
          opacity: active > 0 ? 1 : 0.4,
        }}>
          <ChevronLeft size={12} strokeWidth={1.5} />
        </button>
      )}

      {/* Viewport */}
      <div
        onPointerDown={onPointerDown}
        style={{
          width: needsSlide ? VIEWPORT_W : 'auto',
          overflow: 'hidden',
          borderRadius: 8,
          backgroundColor: 'var(--chrome-active)',
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
                borderRadius: 8,
                backgroundColor: 'var(--surface)',
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
                padding: '4px 8px', borderRadius: 8,
                fontSize: 10, fontWeight: isActive ? 600 : 400,
                backgroundColor: !canDrag && isActive ? 'var(--surface)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-faint)',
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
          color: active < items.length - 1 ? 'var(--text-secondary)' : 'var(--border)',
          display: 'flex', alignItems: 'center',
          opacity: active < items.length - 1 ? 1 : 0.4,
        }}>
          <ChevronRight size={12} strokeWidth={1.5} />
        </button>
      )}

      {needsSlide && (
        <span style={{
          fontSize: 9, color: 'var(--text-faint)',
          fontVariantNumeric: 'tabular-nums',
          userSelect: 'none',
        }}>{active + 1}/{items.length}</span>
      )}
    </div>
  )
}
