import { useRef, useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react'
import { S, R, T } from './tokens'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5
const ENDPOINT = `http://localhost:${typeof __BRYLLEN_HTTP_PORT__ !== 'undefined' ? __BRYLLEN_HTTP_PORT__ : 4748}`

// Viewport and canvas background are stored in SQLite via HTTP server
// These are async but we provide sync wrappers for backward compat

export async function saveCanvasBgAsync(project: string, color: string): Promise<void> {
  try {
    await fetch(`${ENDPOINT}/preferences/canvas-bg:${encodeURIComponent(project)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: color }),
    })
  } catch {}
}

export async function loadCanvasBgAsync(project: string): Promise<string | null> {
  try {
    const res = await fetch(`${ENDPOINT}/preferences/canvas-bg:${encodeURIComponent(project)}`)
    const data = await res.json()
    return data.value || null
  } catch {
    return null
  }
}

// Sync wrappers that fire-and-forget (for backward compat)
export function saveCanvasBg(project: string, color: string) {
  saveCanvasBgAsync(project, color)
}

export function loadCanvasBg(project: string): string | null {
  // Can't do async in sync function - return null and let effect handle it
  return null
}

function saveViewport(key: string, x: number, y: number, zoom: number) {
  // Fire and forget to server
  fetch(`${ENDPOINT}/preferences/viewport:${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: { x, y, zoom } }),
  }).catch(() => {})
}

async function loadViewportAsync(key: string): Promise<{ x: number; y: number; zoom: number } | null> {
  try {
    const res = await fetch(`${ENDPOINT}/preferences/viewport:${encodeURIComponent(key)}`)
    const data = await res.json()
    return data.value || null
  } catch {
    return null
  }
}

interface CanvasContextValue {
  zoom: number
  pan: { x: number; y: number }
  zoomIn: () => void
  zoomOut: () => void
  fitToView: () => void
}

const CanvasContext = createContext<CanvasContextValue>({
  zoom: 1,
  pan: { x: 0, y: 0 },
  zoomIn: () => {},
  zoomOut: () => {},
  fitToView: () => {},
})

export function useCanvas() {
  return useContext(CanvasContext)
}

// Pending annotation data stored at Canvas level (survives page switches)
export interface PendingAnnotation {
  id: string
  // Color tokens
  color?: string
  lch?: { l: number; c: number; h: number }
  // Numeric tokens (spacing, radius, font)
  value?: number
  unit?: string
}

// Token override context — lets TokenSwatch propagate live edits via CSS custom properties
interface TokenOverrideAPI {
  setOverride: (token: string, value: string) => void
  clearOverride: (token: string) => void
  setPending: (token: string, pending: PendingAnnotation) => void
  clearPending: (token: string) => void
  pending: Record<string, PendingAnnotation>
}

const noop: TokenOverrideAPI = {
  setOverride: () => {},
  clearOverride: () => {},
  setPending: () => {},
  clearPending: () => {},
  pending: {},
}
const TokenOverrideContext = createContext<TokenOverrideAPI>(noop)

export function useTokenOverride() {
  return useContext(TokenOverrideContext)
}

interface CanvasProps {
  children?: React.ReactNode
  pageKey?: string
  hud?: React.ReactNode
  /** Called when user pastes an image — receives base64 dataUrl, filename, and viewport center position */
  onImagePaste?: (dataUrl: string, filename: string, viewportCenter: { x: number; y: number }) => void
  /** Called when user clicks on the canvas background (not on a frame) */
  onCanvasClick?: () => void
}

export function Canvas({ children, pageKey, hud, onImagePaste, onCanvasClick }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  // Token override state — CSS custom property overrides for live preview
  const [tokenOverrides, setTokenOverrides] = useState<Record<string, string>>({})

  // Pending annotations — keyed by token path, survives page switches
  const [pendingAnnotations, setPendingAnnotations] = useState<Record<string, PendingAnnotation>>({})
  const pendingRef = useRef(pendingAnnotations)
  pendingRef.current = pendingAnnotations

  const stableAPI = useMemo(() => ({
    setOverride: (token: string, value: string) => {
      setTokenOverrides(prev => ({ ...prev, [token]: value }))
    },
    clearOverride: (token: string) => {
      setTokenOverrides(prev => {
        const next = { ...prev }
        delete next[token]
        return next
      })
    },
    setPending: (token: string, pending: PendingAnnotation) => {
      setPendingAnnotations(prev => ({ ...prev, [token]: pending }))
    },
    clearPending: (token: string) => {
      setPendingAnnotations(prev => {
        const next = { ...prev }
        delete next[token]
        return next
      })
    },
  }), [])

  const overrideAPI = useMemo<TokenOverrideAPI>(() => ({
    ...stableAPI,
    pending: pendingAnnotations,
  }), [stableAPI, pendingAnnotations])

  // Global SSE — one connection for all pending annotations
  const hasPending = Object.keys(pendingAnnotations).length > 0
  useEffect(() => {
    if (!hasPending) return
    const source = new EventSource(`${ENDPOINT}/annotations/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'resolved') {
          const resolvedId = String(data.id)
          const token = Object.entries(pendingRef.current).find(
            ([, p]) => String(p.id) === resolvedId
          )?.[0]
          if (token) {
            stableAPI.clearPending(token)
            stableAPI.clearOverride(token)
          }
        }
      } catch { /* ignore parse errors */ }
    }
    return () => source.close()
  }, [hasPending, stableAPI])

  // All gesture state lives in refs — no React renders during gestures
  const panRef = useRef(pan)
  const zoomRef = useRef(zoom)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const commitRafRef = useRef<number>(0)
  const prevPageKeyRef = useRef<string | undefined>(undefined)

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
  // Viewport is saved at gesture end (pointerup, wheel idle) + on page switch + beforeunload
  const wheelIdleRef = useRef<ReturnType<typeof setTimeout>>()
  const pageKeyRef = useRef(pageKey)
  pageKeyRef.current = pageKey
  const onCanvasClickRef = useRef(onCanvasClick)
  onCanvasClickRef.current = onCanvasClick
  const dragDistanceRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Save viewport after wheel gesture settles
    function saveAfterWheel() {
      clearTimeout(wheelIdleRef.current)
      wheelIdleRef.current = setTimeout(() => {
        if (pageKeyRef.current) {
          saveViewport(pageKeyRef.current, panRef.current.x, panRef.current.y, zoomRef.current)
        }
      }, 300)
    }

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
      saveAfterWheel()
    }

    // --- Pointer: drag to pan ---
    function handlePointerDown(e: PointerEvent) {
      if (e.target !== container) return
      // Don't pan if annotation targeting overlay is active
      if (document.querySelector('[data-bryllen-targeting]')) return
      e.preventDefault()
      isDraggingRef.current = true
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      panStartRef.current = { x: panRef.current.x, y: panRef.current.y }
      dragDistanceRef.current = 0
      container!.setPointerCapture(e.pointerId)
      container!.style.cursor = 'default'
    }

    function handlePointerMove(e: PointerEvent) {
      if (!isDraggingRef.current) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      dragDistanceRef.current = Math.sqrt(dx * dx + dy * dy)
      const newPan = {
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      }
      panRef.current = newPan
      applyTransform(newPan, zoomRef.current)
    }

    function handlePointerUp() {
      if (!isDraggingRef.current) return
      const wasClick = dragDistanceRef.current < 5 // Less than 5px = click, not drag
      isDraggingRef.current = false
      container!.style.cursor = 'default'
      commitState(panRef.current, zoomRef.current)
      // Save viewport at end of drag
      if (pageKeyRef.current) {
        saveViewport(pageKeyRef.current, panRef.current.x, panRef.current.y, zoomRef.current)
      }
      // If it was a click (not a drag), notify parent to clear selection
      if (wasClick && onCanvasClickRef.current) {
        onCanvasClickRef.current()
      }
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

  // Persist viewport per page + restore on page switch
  useEffect(() => {
    if (prevPageKeyRef.current === pageKey) return

    // Save viewport for the page we're leaving
    if (prevPageKeyRef.current) {
      saveViewport(prevPageKeyRef.current, panRef.current.x, panRef.current.y, zoomRef.current)
    }
    prevPageKeyRef.current = pageKey

    // Load saved viewport or default to origin (first visit)
    async function loadAndApply() {
      const saved = pageKey ? await loadViewportAsync(pageKey) : null
      const newPan = { x: saved?.x ?? 0, y: saved?.y ?? 0 }
      const newZoom = saved?.zoom ?? zoomRef.current

      panRef.current = newPan
      zoomRef.current = newZoom
      applyTransform(newPan, newZoom)
      commitState(newPan, newZoom)
    }
    loadAndApply()
  }, [pageKey])

  // Save viewport on tab close
  useEffect(() => {
    function onUnload() {
      if (pageKey) saveViewport(pageKey, panRef.current.x, panRef.current.y, zoomRef.current)
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [pageKey])

  // Shared zoom helpers exposed via context
  function doZoomIn() {
    const newZoom = Math.min(MAX_ZOOM, zoomRef.current * 1.2)
    zoomRef.current = newZoom
    applyTransform(panRef.current, newZoom)
    commitState(panRef.current, newZoom)
  }

  function doZoomOut() {
    const newZoom = Math.max(MIN_ZOOM, zoomRef.current * 0.8)
    zoomRef.current = newZoom
    applyTransform(panRef.current, newZoom)
    commitState(panRef.current, newZoom)
  }

  function doFitToView() {
    const container = containerRef.current
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

  // Expose canvas API for Playwright visual review (merge with existing API from BryllenShell)
  useEffect(() => {
    const existing = (window as any).__bryllen || {}
    ;(window as any).__bryllen = {
      ...existing,
      fitToView: () => doFitToView(),
      getFrameBounds: (frameId: string) => {
        const el = document.querySelector(`[data-frame-id="${frameId}"]`)
        return el?.getBoundingClientRect()
      },
      getCanvasElement: () => document.querySelector('[data-canvas-content]'),
    }
    // Don't delete on cleanup - BryllenShell owns the object
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey

      if (isMod && (e.key === '=' || e.key === '+')) {
        e.preventDefault()
        doZoomIn()
      } else if (isMod && e.key === '-') {
        e.preventDefault()
        doZoomOut()
      } else if (isMod && e.key === '0') {
        e.preventDefault()
        doFitToView()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Image paste handler — Cmd+V with image on clipboard
  useEffect(() => {
    if (!onImagePaste) {
      console.log('[bryllen] Paste handler not attached - no onImagePaste callback')
      return
    }

    const container = containerRef.current

    console.log('[bryllen] Paste handler attached')

    function handlePaste(e: ClipboardEvent) {
      console.log('[bryllen] Paste event received', e.clipboardData?.items.length, 'items')
      if (!e.clipboardData) return

      for (const item of e.clipboardData.items) {
        console.log('[bryllen] Clipboard item:', item.type)
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const blob = item.getAsFile()
          if (!blob) {
            console.log('[bryllen] No blob from clipboard item')
            continue
          }

          // Calculate viewport center in canvas coordinates
          let viewportCenter = { x: 50, y: 50 }
          if (container) {
            const rect = container.getBoundingClientRect()
            viewportCenter = {
              x: (rect.width / 2 - panRef.current.x) / zoomRef.current,
              y: (rect.height / 2 - panRef.current.y) / zoomRef.current,
            }
          }

          console.log('[bryllen] Reading image blob:', blob.size, 'bytes')
          const reader = new FileReader()
          reader.onload = () => {
            const dataUrl = reader.result as string
            // Generate filename from timestamp and mime type
            const ext = item.type.split('/')[1] || 'png'
            const filename = `context-${Date.now()}.${ext}`
            console.log('[bryllen] Calling onImagePaste:', filename, 'at', viewportCenter)
            onImagePaste(dataUrl, filename, viewportCenter)
          }
          reader.readAsDataURL(blob)
          return // Only handle the first image
        }
      }
      // text/* types — let normal paste behavior happen
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [onImagePaste])

  return (
    <div
      ref={containerRef}
      data-tour-id="canvas"
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'default',
      }}
    >
      <CanvasContext.Provider value={{ zoom, pan, zoomIn: doZoomIn, zoomOut: doZoomOut, fitToView: doFitToView }}>
        <TokenOverrideContext.Provider value={overrideAPI}>
          <div
            ref={contentRef}
            data-canvas-content
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
              transformOrigin: '0 0',
              willChange: 'transform',
              position: 'absolute',
              top: 0,
              left: 0,
              // Default spacing CSS variables
              '--spacing-xs': `${S.xs}px`,
              '--spacing-sm': `${S.sm}px`,
              '--spacing-md': `${S.md}px`,
              '--spacing-lg': `${S.lg}px`,
              '--spacing-xl': `${S.xl}px`,
              '--spacing-xxl': `${S.xxl}px`,
              // Default radius CSS variables (all variations)
              '--radius-control': '4px',
              '--radius-card': '8px',
              '--radius-panel': '12px',
              '--radius-pill': '20px',
              '--radius-ui': `${R.ui}px`,
              // Default font size CSS variables (all variations)
              '--font-label': '9px',
              '--font-pill': '10px',
              '--font-caption': '11px',
              '--font-body': '12px',
              '--font-title': '13px',
              '--font-ui': `${T.ui}px`,
              // Overrides take precedence
              ...tokenOverrides,
            } as React.CSSProperties}
          >
            {children}
          </div>
        </TokenOverrideContext.Provider>
        {hud}
      </CanvasContext.Provider>
    </div>
  )
}
