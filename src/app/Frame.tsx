import { useRef, useState, useCallback } from 'react'
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
}

export function Frame({ id, title, x, y, width, height, children, onMove }: FrameProps) {
  const { zoom } = useCanvas()
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const frameStart = useRef({ x: 0, y: 0 })

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only drag from the title bar area
    const target = e.target as HTMLElement
    if (!target.dataset.frameHandle) return

    e.stopPropagation()
    e.preventDefault()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    frameStart.current = { x, y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [x, y])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    e.stopPropagation()
    const dx = (e.clientX - dragStart.current.x) / zoom
    const dy = (e.clientY - dragStart.current.y) / zoom
    onMove?.(id, frameStart.current.x + dx, frameStart.current.y + dy)
  }, [dragging, zoom, id, onMove])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    e.stopPropagation()
    setDragging(false)
  }, [dragging])

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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
          cursor: dragging ? 'grabbing' : 'grab',
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
