import { useRef, useState, useEffect, createContext, useContext } from 'react'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5
const VP_KEY = 'canvai:vp:'

function saveViewport(key: string, x: number, y: number, zoom: number) {
  try { localStorage.setItem(VP_KEY + key, JSON.stringify({ x, y, zoom })) } catch {}
}

function loadViewport(key: string): { x: number; y: number; zoom: number } | null {
  try {
    const raw = localStorage.getItem(VP_KEY + key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

const CanvasContext = createContext({ zoom: 1, pan: { x: 0, y: 0 } })

export function useCanvas() {
  return useContext(CanvasContext)
}

interface CanvasProps {
  children?: React.ReactNode
  pageKey?: string
}

export function Canvas({ children, pageKey }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // All gesture state lives in refs — no React renders during gestures
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const commitRafRef = useRef<number>(0)
  const prevPageKeyRef = useRef<string | undefined>(pageKey)

  panRef.current = pan
  zoomRef.current = zoom

  // Write transform directly to the DOM — no React involved
  function applyTransform(p: { x: number; y: number }, z: number) {
    const el = contentRef.current
    if (el) {
      el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${z})`
    }
  }

  // Debounced commit to React state (for context consumers like Frame zoom)
  function commitState(p: { x: number; y: number }, z: number) {
    cancelAnimationFrame(commitRafRef.current)
    commitRafRef.current = requestAnimationFrame(() => {
      setPan(p)
      setZoom(z)
    })
  }

  // All pointer + wheel handlers as native listeners — bypasses React synthetic events
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // --- Wheel: zoom + pan ---
    function handleWheel(e: WheelEvent) {
      e.preventDefault()

      if (e.ctrlKey || e.metaKey) {
        const rect = container!.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const contentX = (mouseX - panRef.current.x) / zoomRef.current
        const contentY = (mouseY - panRef.current.y) / zoomRef.current

        const factor = Math.pow(2, -e.deltaY * 0.005)
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomRef.current * factor))

        const newPan = {
          x: mouseX - contentX * newZoom,
          y: mouseY - contentY * newZoom,
        }

        panRef.current = newPan
        zoomRef.current = newZoom
        applyTransform(newPan, newZoom)
        commitState(newPan, newZoom)
      } else {
        const newPan = {
          x: panRef.current.x - e.deltaX,
          y: panRef.current.y - e.deltaY,
        }
        panRef.current = newPan
        applyTransform(newPan, zoomRef.current)
        commitState(newPan, zoomRef.current)
      }
    }

    // --- Pointer: drag to pan ---
    function handlePointerDown(e: PointerEvent) {
      if (e.target !== container) return
      e.preventDefault()
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      panStartRef.current = { x: panRef.current.x, y: panRef.current.y }
      container!.setPointerCapture(e.pointerId)
      container!.style.cursor = 'default'
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDraggingRef.current) return
      const newPan = {
        x: panStartRef.current.x + (e.clientX - dragStartRef.current.x),
        y: panStartRef.current.y + (e.clientY - dragStartRef.current.y),
      }
      panRef.current = newPan
      applyTransform(newPan, zoomRef.current)
    }

    function handlePointerUp() {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      container!.style.cursor = 'default'
      commitState(panRef.current, zoomRef.current)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('pointerdown', handlePointerDown)
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerup', handlePointerUp)

    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('pointerdown', handlePointerDown)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  // Persist viewport per page + spring-restore on page switch
  useEffect(() => {
    if (prevPageKeyRef.current === pageKey) return

    // Save viewport for the page we're leaving
    if (prevPageKeyRef.current) {
      saveViewport(prevPageKeyRef.current, panRef.current.x, panRef.current.y, zoomRef.current)
    }
    prevPageKeyRef.current = pageKey

    // Load saved viewport or default to origin (first visit)
    const saved = pageKey ? loadViewport(pageKey) : null
    const newPan = { x: saved?.x ?? 0, y: saved?.y ?? 0 }
    const newZoom = saved?.zoom ?? zoomRef.current

    panRef.current = newPan
    zoomRef.current = newZoom
    applyTransform(newPan, newZoom)
    commitState(newPan, newZoom)
  }, [pageKey])

  // Save viewport on tab close
  useEffect(() => {
    function onUnload() {
      if (pageKey) saveViewport(pageKey, panRef.current.x, panRef.current.y, zoomRef.current)
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [pageKey])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey

      if (isMod && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        const newZoom = Math.min(MAX_ZOOM, zoomRef.current * 1.2)
        zoomRef.current = newZoom
        applyTransform(panRef.current, newZoom)
        commitState(panRef.current, newZoom)
      } else if (isMod && e.key === '-') {
        e.preventDefault()
        const newZoom = Math.max(MIN_ZOOM, zoomRef.current * 0.8)
        zoomRef.current = newZoom
        applyTransform(panRef.current, newZoom)
        commitState(panRef.current, newZoom)
      } else if (isMod && e.key === '0') {
        e.preventDefault()
        const content = contentRef.current
        if (!container || !content || content.children.length === 0) {
          zoomRef.current = 1
          panRef.current = { x: 0, y: 0 }
          applyTransform(panRef.current, 1)
          commitState(panRef.current, 1)
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
        const newPan = {
          x: containerRect.width / 2 - centerX * fitZoom,
          y: containerRect.height / 2 - centerY * fitZoom,
        }

        zoomRef.current = fitZoom
        panRef.current = newPan
        applyTransform(newPan, fitZoom)
        commitState(newPan, fitZoom)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
      }}
    >
      <CanvasContext.Provider value={{ zoom, pan }}>
        <div
          ref={contentRef}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
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
