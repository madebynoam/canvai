import { useRef, useState, useEffect, useCallback, createContext, useContext } from 'react'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5

const CanvasContext = createContext({ zoom: 1, pan: { x: 0, y: 0 } })

export function useCanvas() {
  return useContext(CanvasContext)
}

interface CanvasProps {
  children?: React.ReactNode
}

export function Canvas({ children }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // Refs for direct DOM reads during gestures
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  panRef.current = pan
  zoomRef.current = zoom

  // Drag-to-pan state
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })

  // Wheel: Ctrl/Cmd+scroll = zoom toward cursor, plain scroll = pan
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (e.ctrlKey || e.metaKey) {
        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const contentX = (mouseX - panRef.current.x) / zoomRef.current
        const contentY = (mouseY - panRef.current.y) / zoomRef.current

        const factor = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomRef.current * factor))

        const newPanX = mouseX - contentX * newZoom
        const newPanY = mouseY - contentY * newZoom

        setPan({ x: newPanX, y: newPanY })
        setZoom(newZoom)
        panRef.current = { x: newPanX, y: newPanY }
        zoomRef.current = newZoom
      } else {
        const newPan = {
          x: panRef.current.x - e.deltaX,
          y: panRef.current.y - e.deltaY,
        }
        setPan(newPan)
        panRef.current = newPan
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  // Keyboard: Cmd+Plus/Minus for zoom, Cmd+0 to fit all
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey

      if (isMod && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        setZoom(z => {
          const newZoom = Math.min(MAX_ZOOM, z * 1.2)
          zoomRef.current = newZoom
          return newZoom
        })
      } else if (isMod && e.key === '-') {
        e.preventDefault()
        setZoom(z => {
          const newZoom = Math.max(MIN_ZOOM, z * 0.8)
          zoomRef.current = newZoom
          return newZoom
        })
      } else if (isMod && e.key === '0') {
        e.preventDefault()
        const container = containerRef.current
        if (!container) return
        const content = container.firstElementChild?.firstElementChild as HTMLElement | null
        if (!content || content.children.length === 0) {
          // No frames — just reset
          setZoom(1)
          setPan({ x: 0, y: 0 })
          zoomRef.current = 1
          panRef.current = { x: 0, y: 0 }
          return
        }

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
        for (let i = 0; i < content.children.length; i++) {
          const child = content.children[i] as HTMLElement
          const left = parseFloat(child.style.left) || 0
          const top = parseFloat(child.style.top) || 0
          const w = child.offsetWidth
          const h = child.offsetHeight
          minX = Math.min(minX, left)
          minY = Math.min(minY, top)
          maxX = Math.max(maxX, left + w)
          maxY = Math.max(maxY, top + h)
        }

        if (!isFinite(minX)) return

        const contentWidth = maxX - minX
        const contentHeight = maxY - minY
        const containerRect = container.getBoundingClientRect()
        const padding = 60

        const scaleX = (containerRect.width - padding * 2) / contentWidth
        const scaleY = (containerRect.height - padding * 2) / contentHeight
        const fitZoom = Math.min(Math.max(Math.min(scaleX, scaleY), MIN_ZOOM), MAX_ZOOM)

        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2
        const newPanX = containerRect.width / 2 - centerX * fitZoom
        const newPanY = containerRect.height / 2 - centerY * fitZoom

        setZoom(fitZoom)
        setPan({ x: newPanX, y: newPanY })
        zoomRef.current = fitZoom
        panRef.current = { x: newPanX, y: newPanY }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Drag-to-pan handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target !== containerRef.current) return
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = { ...panRef.current }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const newPan = {
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    }
    setPan(newPan)
    panRef.current = newPan
  }, [isDragging])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <CanvasContext.Provider value={{ zoom, pan }}>
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </CanvasContext.Provider>
    </div>
  )
}
