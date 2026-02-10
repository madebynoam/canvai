import { useRef, useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useCanvas } from './Canvas'

interface FrameProps {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  children: ReactNode
  onMove?: (id: string, x: number, y: number) => void
  onResize?: (id: string, height: number) => void
}

export function Frame({ id, title, x, y, width, height, children, onMove, onResize }: FrameProps) {
  const { zoom } = useCanvas()
  const frameRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const frameStartRef = useRef({ x: 0, y: 0 })
  const onMoveRef = useRef(onMove)
  const zoomRef = useRef(zoom)
  const idRef = useRef(id)

  onMoveRef.current = onMove
  zoomRef.current = zoom
  idRef.current = id
  const onResizeRef = useRef(onResize)
  onResizeRef.current = onResize

  // ResizeObserver to report actual rendered height
  useEffect(() => {
    const el = frameRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
        onResizeRef.current?.(idRef.current, h)
        window.dispatchEvent(new CustomEvent('canvai:frame-resize', {
          detail: { id: idRef.current, height: h },
        }))
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (!target.dataset.frameHandle) return

    e.stopPropagation()
    e.preventDefault()
    isDraggingRef.current = true
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    frameStartRef.current = { x, y }

    function handleWindowMove(ev: PointerEvent) {
      if (!isDraggingRef.current) return
      const dx = (ev.clientX - dragStartRef.current.x) / zoomRef.current
      const dy = (ev.clientY - dragStartRef.current.y) / zoomRef.current
      onMoveRef.current?.(idRef.current, frameStartRef.current.x + dx, frameStartRef.current.y + dy)
    }

    function handleWindowUp() {
      isDraggingRef.current = false
      window.removeEventListener('pointermove', handleWindowMove)
      window.removeEventListener('pointerup', handleWindowUp)
    }

    window.addEventListener('pointermove', handleWindowMove)
    window.addEventListener('pointerup', handleWindowUp)
  }, [x, y])

  return (
    <div
      ref={frameRef}
      style={{
        position: 'absolute',
        left: x,
        top: y,
      }}
    >
      <div
        data-frame-handle="true"
        onPointerDown={handlePointerDown}
        style={{
          fontSize: 12 / zoom,
          color: '#999',
          marginBottom: 8 / zoom,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {title}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}
