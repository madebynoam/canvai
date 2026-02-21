import { useState, useRef, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { N, S, R, T, ICON, FONT } from './tokens'

/**
 * IterationPills — Pill strip with draggable highlight.
 *
 * Click a pill -> highlight snaps to it.
 * Drag -> highlight slides continuously with the finger.
 * When it crosses into the next pill slot, the active item
 * updates (and the strip slides if there are 5+ items).
 * On release, highlight snaps to the active pill.
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

interface IterationPillsProps {
  items: string[]
  activeIndex: number
  onSelect: (index: number) => void
}

/** @deprecated Use PickerDropdown instead. IterationPills will be removed in a future version. */
export function IterationPills({ items, activeIndex, onSelect }: IterationPillsProps) {
  if (typeof console !== 'undefined') {
    console.warn('[canvai] IterationPills is deprecated, use PickerDropdown instead')
  }
  const [active, setActive] = useState(activeIndex)
  const stripRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
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

  const snapTo = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, i))
    setActive(clamped)
    onSelect(clamped)
    if (canDrag && highlightRef.current) {
      highlightRef.current.style.transform = `translateX(${getHighlightX(clamped)}px)`
    }
    if (needsSlide && stripRef.current) {
      stripRef.current.style.transform = `translateX(${getStripX(clamped)}px)`
    }
  }, [items.length, onSelect, canDrag, needsSlide, getStripX])

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
      }
      if (!isDraggingRef.current) return

      const maxHlX = (items.length - 1) * STEP
      const hlX = Math.max(0, Math.min(maxHlX, startHlX + delta))
      if (highlightRef.current) highlightRef.current.style.transform = `translateX(${hlX}px)`

      const nearest = Math.max(0, Math.min(items.length - 1, Math.round(hlX / STEP)))

      if (nearest !== currentActive) {
        currentActive = nearest
        setActive(nearest)
        onSelect(nearest)
        if (needsSlide && stripRef.current) {
          stripRef.current.style.transform = `translateX(${getStripX(nearest)}px)`
        }
      }
    }

    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      if (isDraggingRef.current && highlightRef.current) {
        highlightRef.current.style.transform = `translateX(${getHighlightX(currentActive)}px)`
      }
      setTimeout(() => { isDraggingRef.current = false }, 50)
    }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [canDrag, needsSlide, active, items.length, getStripX, onSelect])

  const onPillClick = useCallback((i: number) => {
    if (isDraggingRef.current) return
    snapTo(i)
  }, [snapTo])

  if (items.length === 0) return null

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: S.xs, cursor: 'default', fontFamily: FONT }}>
      {needsSlide && (
        <button onClick={() => snapTo(active - 1)} style={{
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
        <button onClick={() => snapTo(active + 1)} style={{
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
