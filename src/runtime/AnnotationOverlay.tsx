import { useState, useRef, useCallback, useEffect } from 'react'
import { SquareMousePointer, Trash2, Pencil, Lightbulb, Minus, Plus, X } from 'lucide-react'
import { A, F, D, S, R, T, ICON, FONT, V } from './tokens'
import { DialogCard, DialogActions, ActionButton } from './Menu'
import type { CanvasFrame, CanvasComponentFrame, Connection } from './types'
import { isCanvasImageFrame } from './types'
import { ConnectionLine, ConnectionsSvgLayer } from './ConnectionLine'

type Mode = 'idle' | 'targeting' | 'commenting'

interface DragState {
  fromFrameId: string
  fromPoint: { x: number; y: number }  // Center of the frame (for line drawing)
  startPoint: { x: number; y: number } // Initial mouse position (for click detection)
  currentPoint: { x: number; y: number }
  // Multi-select: locked targets (Shift+hover locks a target, continue to add more)
  lockedTargets: Array<{ frameId: string; point: { x: number; y: number } }>
}

interface MarqueeState {
  startPoint: { x: number; y: number }   // Canvas-space
  currentPoint: { x: number; y: number } // Canvas-space
  screenStart: { x: number; y: number }  // Screen-space for rendering
  screenCurrent: { x: number; y: number }
}

interface TargetInfo {
  frameId: string
  frameIds?: string[]  // For multi-select
  componentName: string
  props: Record<string, unknown>
  selector: string
  elementTag: string
  elementClasses: string
  elementText: string
  computedStyles: Record<string, string>
  rect: DOMRect
  frames?: Array<{ frameId: string; title: string; isImage: boolean }>  // For multi-select
}

interface AnnotationOverlayProps {
  endpoint: string
  frames: CanvasFrame[]
  showToast?: (msg: string) => void
  project?: string
  /** UUID of the project (from manifest.id) — used for per-project annotation storage */
  projectId?: string
}

/* ── Mode toggle (Refine / Ideate) — icon chips with tooltips ── */
type AnnotationMode = 'refine' | 'ideate'

interface ModeOption {
  mode: AnnotationMode
  icon: typeof Pencil
  label: string
  description: string
}

const MODES: ModeOption[] = [
  { mode: 'refine', icon: Pencil, label: 'Refine', description: 'Adjust this element' },
  { mode: 'ideate', icon: Lightbulb, label: 'Ideate', description: 'Generate new ideas' },
]

function ModeChip({ option, active, onClick }: {
  option: ModeOption
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (hovered && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.bottom + 6 })
    } else {
      setTooltipPos(null)
    }
  }, [hovered])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 28,
          height: 28,
          border: 'none',
          cursor: 'default',
          borderRadius: R.ui,
          background: active ? V.active : hovered ? V.chrome : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? V.txtPri : V.txtSec,
          transition: 'background 0.1s ease-out',
        }}
      >
        <option.icon size={ICON.md} strokeWidth={active ? 2 : 1.5} />
      </button>
      {tooltipPos && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x,
          top: tooltipPos.y,
          transform: 'translateX(-50%)',
          background: 'oklch(0.18 0.005 250)',
          color: D.text,
          fontSize: 11,
          fontFamily: FONT,
          padding: '6px 10px',
          borderRadius: R.ui,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}>
          <div style={{ fontWeight: 500 }}>{option.label}</div>
          <div style={{ color: 'oklch(0.6 0 0)', marginTop: 2, fontSize: 10 }}>{option.description}</div>
        </div>
      )}
    </>
  )
}

/* ── Variation stepper for ideate mode ── */
function VariationStepper({ count, onChange }: { count: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setTooltipPos({ x: rect.left + rect.width / 2, y: rect.bottom + 6 })
    } else {
      setTooltipPos(null)
    }
  }, [hovered])

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: V.active,
          borderRadius: R.ui,
          padding: 2,
        }}
      >
        <button
          onClick={() => onChange(Math.max(1, count - 1))}
          style={{
            width: 22,
            height: 22,
            border: 'none',
            borderRadius: R.ui,
            background: count <= 1 ? 'transparent' : V.card,
            color: count <= 1 ? V.txtTer : V.txtSec,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
          }}
          disabled={count <= 1}
        >
          <Minus size={12} strokeWidth={2} />
        </button>
        <span style={{
          minWidth: 20,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: FONT,
          color: V.txtPri,
        }}>
          {count}
        </span>
        <button
          onClick={() => onChange(Math.min(10, count + 1))}
          style={{
            width: 22,
            height: 22,
            border: 'none',
            borderRadius: R.ui,
            background: count >= 10 ? 'transparent' : V.card,
            color: count >= 10 ? V.txtTer : V.txtSec,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
          }}
          disabled={count >= 10}
        >
          <Plus size={12} strokeWidth={2} />
        </button>
      </div>
      {tooltipPos && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x,
          top: tooltipPos.y,
          transform: 'translateX(-50%)',
          background: 'oklch(0.18 0.005 250)',
          color: D.text,
          fontSize: 11,
          fontFamily: FONT,
          padding: '6px 10px',
          borderRadius: R.ui,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}>
          <div style={{ fontWeight: 500 }}>Variations</div>
          <div style={{ color: 'oklch(0.6 0 0)', marginTop: 2, fontSize: 10 }}>How many directions to explore</div>
        </div>
      )}
    </>
  )
}

function ModeToggle({ value, onChange, variationCount, onVariationChange }: {
  value: AnnotationMode
  onChange: (mode: AnnotationMode) => void
  variationCount?: number
  onVariationChange?: (n: number) => void
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
      <div style={{
        display: 'flex',
        gap: 2,
        background: V.card,
        borderRadius: R.ui,
        padding: 2,
      }}>
        {MODES.map(opt => (
          <ModeChip
            key={opt.mode}
            option={opt}
            active={value === opt.mode}
            onClick={() => onChange(opt.mode)}
          />
        ))}
      </div>
      {value === 'ideate' && variationCount !== undefined && onVariationChange && (
        <VariationStepper count={variationCount} onChange={onVariationChange} />
      )}
    </div>
  )
}

/* ── Marker dot ── */
function MarkerDot({ displayIndex, comment, rect, onClick, progress }: {
  displayIndex: number
  comment: string
  rect: DOMRect
  onClick: () => void
  progress?: string
}) {
  return (
    <div style={{ position: 'fixed', left: rect.left - S.sm, top: rect.top - S.sm, zIndex: 99997, display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        title={comment}
        onClick={onClick}
        style={{
          width: S.lg,
          height: S.lg,
          borderRadius: '50%',
          background: F.marker,
          color: D.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          fontFamily: FONT,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06)',
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        {displayIndex}
      </div>
      {progress && (
        <div style={{
          background: 'oklch(0.18 0.005 240 / 0.9)',
          color: D.text,
          fontSize: 11,
          fontFamily: FONT,
          padding: '4px 8px',
          borderRadius: R.ui, cornerShape: 'squircle',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          {progress}
        </div>
      )}
    </div>
  )
}

/* ── Marquee selection rectangle ── */
function MarqueeRect({ screenStart, screenCurrent }: {
  screenStart: { x: number; y: number }
  screenCurrent: { x: number; y: number }
}) {
  const left = Math.min(screenStart.x, screenCurrent.x)
  const top = Math.min(screenStart.y, screenCurrent.y)
  const width = Math.abs(screenCurrent.x - screenStart.x)
  const height = Math.abs(screenCurrent.y - screenStart.y)

  return (
    <div
      style={{
        position: 'fixed',
        left,
        top,
        width,
        height,
        border: `2px dashed ${F.marker}`,
        borderRadius: R.ui,
        background: `oklch(from ${F.marker} l c h / 0.1)`,
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  )
}

/* ── Hover button wrapper ── */
function HoverButton({ children, onClick, baseStyle, hoverBg, title }: {
  children: React.ReactNode
  onClick?: () => void
  baseStyle: React.CSSProperties
  hoverBg: string
  title?: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      style={{
        ...baseStyle,
        backgroundColor: hovered ? hoverBg : (baseStyle.backgroundColor ?? baseStyle.background as string ?? 'transparent'),
      }}
    >
      {children}
    </button>
  )
}

import { buildSelector } from './selector'

// Extract key computed styles
function getStyleSubset(el: Element): Record<string, string> {
  const computed = window.getComputedStyle(el)
  const keys = [
    'color', 'backgroundColor', 'fontSize', 'fontWeight', 'fontFamily',
    'padding', 'margin', 'border', 'borderRadius', 'boxShadow',
    'width', 'height', 'display', 'gap', 'lineHeight',
  ]
  const styles: Record<string, string> = {}
  for (const k of keys) {
    const v = computed.getPropertyValue(
      k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
    )
    if (v && v !== 'none' && v !== 'normal' && v !== '0px') {
      styles[k] = v
    }
  }
  return styles
}

/** Convert screen coords → canvas-space coords (accounts for pan/zoom) */
function screenToCanvas(sx: number, sy: number): { x: number; y: number } | null {
  const el = document.querySelector('[data-canvas-content]') as HTMLElement | null
  if (!el?.parentElement) return null
  const container = el.parentElement.getBoundingClientRect()
  const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
  // Validate matrix scale — if invalid, fall back to unscaled coords
  if (matrix.a === 0 || !Number.isFinite(matrix.a)) {
    return {
      x: sx - container.left,
      y: sy - container.top,
    }
  }
  return {
    x: (sx - container.left - matrix.e) / matrix.a,
    y: (sy - container.top - matrix.f) / matrix.a,
  }
}

/** Convert canvas-space coords → screen coords */
function canvasToScreen(cx: number, cy: number): { x: number; y: number } | null {
  const el = document.querySelector('[data-canvas-content]') as HTMLElement | null
  if (!el?.parentElement) return null
  const container = el.parentElement.getBoundingClientRect()
  const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform)
  return {
    x: cx * matrix.a + matrix.e + container.left,
    y: cy * matrix.a + matrix.f + container.top,
  }
}

/** Find frames whose bounds intersect the given canvas-space rectangle */
function findFramesInRect(
  frames: CanvasFrame[],
  rect: { x1: number; y1: number; x2: number; y2: number }
): CanvasFrame[] {
  // Normalize rect (ensure x1 < x2, y1 < y2)
  const minX = Math.min(rect.x1, rect.x2)
  const maxX = Math.max(rect.x1, rect.x2)
  const minY = Math.min(rect.y1, rect.y2)
  const maxY = Math.max(rect.y1, rect.y2)

  return frames.filter(frame => {
    // Frame bounds in canvas-space
    const frameMinX = frame.x
    const frameMaxX = frame.x + frame.width
    const frameMinY = frame.y
    const frameMaxY = frame.y + frame.height

    // Check for intersection (not just containment)
    const intersectsX = frameMinX < maxX && frameMaxX > minX
    const intersectsY = frameMinY < maxY && frameMaxY > minY

    return intersectsX && intersectsY
  })
}

interface AnnotationMarker {
  id: number
  serverId: string
  frameId: string
  selector: string
  comment: string
  /** Canvas-space coords for notes not tied to a frame element */
  canvasPoint?: { x: number; y: number }
  /** Progress message from agent (shown while processing) */
  progress?: string
}

export function AnnotationOverlay({ endpoint, frames, showToast: externalToast, project = '', projectId }: AnnotationOverlayProps) {
  // Use projectId if available, otherwise fall back to project name
  const projectParam = projectId || project
  const [mode, setMode] = useState<Mode>('idle')
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [comment, setComment] = useState('')
  const [pastedImage, setPastedImage] = useState<string | null>(null)
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('refine')
  const [variationCount, setVariationCount] = useState(5)
  const [buttonState, setButtonState] = useState<'idle' | 'hover' | 'pressed'>('idle')
  const [markers, setMarkers] = useState<AnnotationMarker[]>([])
  const [markerRects, setMarkerRects] = useState<Map<number, DOMRect>>(new Map())
  const [editingMarkerId, setEditingMarkerId] = useState<number | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const nextMarkerId = useRef(1)

  // Connection drag state
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [connections, setConnections] = useState<Connection[]>([])
  // Marquee selection state
  const [marqueeState, setMarqueeState] = useState<MarqueeState | null>(null)
  const [marqueeSelectedIds, setMarqueeSelectedIds] = useState<Set<string>>(new Set())
  const [connectionRects, setConnectionRects] = useState<Map<string, { from: { x: number; y: number }; to: { x: number; y: number } }>>(new Map())
  const [hoveredConnectionId, setHoveredConnectionId] = useState<string | null>(null)
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null)
  const nextConnectionId = useRef(1)

  const toast = useCallback((msg: string) => {
    if (externalToast) externalToast(msg)
  }, [externalToast])

  // Focus textarea when entering commenting mode
  useEffect(() => {
    if (mode === 'commenting' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [mode])

  // Load persisted annotations on mount (survive page refresh)
  useEffect(() => {
    const params = new URLSearchParams()
    if (projectParam) params.set('projectId', projectParam)
    fetch(`${endpoint}/annotations?${params}`)
      .then(r => r.json())
      .then((all: { id: string; type?: string; frameId: string; selector: string; comment: string; status: string }[]) => {
        const active = all.filter(a =>
          (a.status === 'draft' || a.status === 'pending') && a.type !== 'iteration' && a.type !== 'project'
        )
        if (active.length === 0) return
        setMarkers(active.map(a => ({
          id: nextMarkerId.current++,
          serverId: a.id,
          frameId: a.frameId,
          selector: a.selector,
          comment: a.comment,
        })))
      })
      .catch(() => {})
  }, [endpoint, projectParam])

  // Subscribe to SSE for resolved annotations and progress updates
  useEffect(() => {
    const params = new URLSearchParams()
    if (projectParam) params.set('projectId', projectParam)
    const source = new EventSource(`${endpoint}/annotations/events?${params}`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if ((data.type === 'resolved' || data.type === 'deleted') && data.id) {
          setMarkers(prev => prev.filter(m => m.serverId !== data.id))
        } else if (data.type === 'progress' && data.id && data.message) {
          setMarkers(prev => prev.map(m =>
            m.serverId === data.id ? { ...m, progress: data.message } : m
          ))
        }
      } catch { /* ignore parse errors */ }
    }
    return () => source.close()
  }, [endpoint, projectParam])

  // Recompute marker positions every frame via rAF — keeps markers in sync during pan/zoom
  useEffect(() => {
    if (markers.length === 0) return
    let rafId = 0
    function updateRects() {
      const rects = new Map<number, DOMRect>()
      for (const marker of markers) {
        // Canvas-level note — convert canvas-space to current screen position
        if (marker.canvasPoint) {
          const sp = canvasToScreen(marker.canvasPoint.x, marker.canvasPoint.y)
          if (sp) rects.set(marker.id, new DOMRect(sp.x, sp.y, 0, 0))
          continue
        }
        const frameEl = document.querySelector(`[data-frame-id="${marker.frameId}"]`)
        if (!frameEl) continue
        const contentEl = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
        if (!contentEl) continue
        try {
          const el = contentEl.querySelector(marker.selector) ?? contentEl
          rects.set(marker.id, el.getBoundingClientRect())
        } catch { /* selector may not match */ }
      }
      setMarkerRects(rects)
      rafId = requestAnimationFrame(updateRects)
    }
    rafId = requestAnimationFrame(updateRects)
    return () => cancelAnimationFrame(rafId)
  }, [markers])

  // Recompute connection endpoints every frame via rAF
  useEffect(() => {
    if (connections.length === 0) return
    let rafId = 0
    function updateConnectionRects() {
      const rects = new Map<string, { from: { x: number; y: number }; to: { x: number; y: number } }>()
      for (const conn of connections) {
        const fromEl = document.querySelector(`[data-frame-id="${conn.fromFrameId}"]`)
        const toEl = document.querySelector(`[data-frame-id="${conn.toFrameId}"]`)
        if (!fromEl || !toEl) continue
        const fromRect = fromEl.getBoundingClientRect()
        const toRect = toEl.getBoundingClientRect()
        // Connect from center of each frame
        rects.set(conn.id, {
          from: { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 },
          to: { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 },
        })
      }
      setConnectionRects(rects)
      rafId = requestAnimationFrame(updateConnectionRects)
    }
    rafId = requestAnimationFrame(updateConnectionRects)
    return () => cancelAnimationFrame(rafId)
  }, [connections])

  /** Check if a frame is a context image */
  const isContextImageFrame = useCallback((frameId: string): boolean => {
    const frame = frames.find(f => f.id === frameId)
    return frame ? isCanvasImageFrame(frame) : false
  }, [frames])

  /** Get center point of a frame element */
  const getFrameCenter = useCallback((frameId: string): { x: number; y: number } | null => {
    const el = document.querySelector(`[data-frame-id="${frameId}"]`)
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    // Update marquee state if marquee is active
    if (marqueeState) {
      // Use screenToCanvas if possible, otherwise fall back to screen coords
      const cp = screenToCanvas(e.clientX, e.clientY) ?? { x: e.clientX, y: e.clientY }
      setMarqueeState(prev => prev ? {
        ...prev,
        currentPoint: cp,
        screenCurrent: { x: e.clientX, y: e.clientY },
      } : null)
      // Update live selection preview
      const selectedFrames = findFramesInRect(frames, {
        x1: marqueeState.startPoint.x,
        y1: marqueeState.startPoint.y,
        x2: cp.x,
        y2: cp.y,
      })
      setMarqueeSelectedIds(new Set(selectedFrames.map(f => f.id)))
      return
    }

    // Update drag state if dragging
    if (dragState) {
      const overlay = overlayRef.current
      let hoveredFrameId: string | null = null
      let hoveredFrameRect: DOMRect | null = null

      // Check if hovering over another frame (image or component)
      if (overlay) {
        overlay.style.pointerEvents = 'none'
        const el = document.elementFromPoint(e.clientX, e.clientY)
        overlay.style.pointerEvents = 'auto'
        if (el) {
          const frameEl = el.closest('[data-frame-id]')
          if (frameEl) {
            const frameId = frameEl.getAttribute('data-frame-id') ?? ''
            const alreadyLocked = dragState.lockedTargets.some(t => t.frameId === frameId)
            if (frameId !== dragState.fromFrameId && !alreadyLocked) {
              hoveredFrameId = frameId
              hoveredFrameRect = frameEl.getBoundingClientRect()
            }
          }
        }
      }

      // Shift+hover locks the target
      if (e.shiftKey && hoveredFrameId) {
        const center = getFrameCenter(hoveredFrameId)
        if (center) {
          setDragState(prev => prev ? {
            ...prev,
            currentPoint: { x: e.clientX, y: e.clientY },
            lockedTargets: [...prev.lockedTargets, { frameId: hoveredFrameId!, point: center }],
          } : null)
          setHighlight(null)
          return
        }
      }

      setDragState(prev => prev ? { ...prev, currentPoint: { x: e.clientX, y: e.clientY } } : null)
      setHighlight(hoveredFrameRect)
      return
    }

    if (mode !== 'targeting') return
    const overlay = overlayRef.current
    if (!overlay) return

    // Temporarily disable overlay to hit-test the element beneath
    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'

    if (!el) {
      setHighlight(null)
      return
    }

    // Inside a frame → highlight the element
    const frameEl = el.closest('[data-frame-id]')
    if (frameEl) {
      setHighlight(el.getBoundingClientRect())
      return
    }

    // Empty canvas → show a small dot at cursor for "click to add note"
    const sz = 8
    setHighlight(new DOMRect(e.clientX - sz / 2, e.clientY - sz / 2, sz, sz))
  }, [mode, dragState, marqueeState, frames, isContextImageFrame])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'targeting') return
    const overlay = overlayRef.current
    if (!overlay) return

    // Stop native event from reaching document-level click-outside listener
    e.nativeEvent.stopImmediatePropagation()

    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'

    if (!el) {
      // No element found, start marquee anyway
      const cp = screenToCanvas(e.clientX, e.clientY) ?? { x: e.clientX, y: e.clientY }
      setMarqueeState({
        startPoint: cp,
        currentPoint: cp,
        screenStart: { x: e.clientX, y: e.clientY },
        screenCurrent: { x: e.clientX, y: e.clientY },
      })
      setHighlight(null)
      return
    }

    const frameEl = el.closest('[data-frame-id]')

    if (frameEl) {
      const frameId = frameEl.getAttribute('data-frame-id') ?? ''
      const frame = frames.find(f => f.id === frameId)

      // Start drag for ALL frames (not just images) — enables multi-select
      const center = getFrameCenter(frameId)
      if (center) {
        setDragState({
          fromFrameId: frameId,
          fromPoint: center,
          startPoint: { x: e.clientX, y: e.clientY },
          currentPoint: { x: e.clientX, y: e.clientY },
          lockedTargets: [],
        })
        setHighlight(null)
        return
      }
    } else {
      // Clicked on empty canvas — start marquee selection
      // Use screenToCanvas if possible, otherwise fall back to screen coords
      const cp = screenToCanvas(e.clientX, e.clientY) ?? { x: e.clientX, y: e.clientY }
      setMarqueeState({
        startPoint: cp,
        currentPoint: cp,
        screenStart: { x: e.clientX, y: e.clientY },
        screenCurrent: { x: e.clientX, y: e.clientY },
      })
      setHighlight(null)
    }
  }, [mode, frames, getFrameCenter])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    // Handle marquee selection release
    if (marqueeState) {
      const dx = e.clientX - marqueeState.screenStart.x
      const dy = e.clientY - marqueeState.screenStart.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 10) {
        // It was just a click, not a drag — create a canvas note
        const cp = marqueeState.startPoint
        setTarget({
          frameId: '',
          componentName: 'Canvas',
          props: { __canvasPoint: cp },
          selector: '',
          elementTag: 'canvas',
          elementClasses: '',
          elementText: '',
          computedStyles: {},
          rect: new DOMRect(e.clientX, e.clientY, 0, 0),
        })
        setHighlight(null)
        setComment('')
        setMarqueeState(null)
        setMarqueeSelectedIds(new Set())
        setMode('commenting')
        return
      }

      // Find all frames in the marquee rectangle
      const selectedFrames = findFramesInRect(frames, {
        x1: marqueeState.startPoint.x,
        y1: marqueeState.startPoint.y,
        x2: marqueeState.currentPoint.x,
        y2: marqueeState.currentPoint.y,
      })

      setMarqueeState(null)
      setMarqueeSelectedIds(new Set())

      if (selectedFrames.length === 0) {
        // No frames selected — treat as canvas note at center of marquee
        const cp = {
          x: (marqueeState.startPoint.x + marqueeState.currentPoint.x) / 2,
          y: (marqueeState.startPoint.y + marqueeState.currentPoint.y) / 2,
        }
        const screenPos = canvasToScreen(cp.x, cp.y)
        setTarget({
          frameId: '',
          componentName: 'Canvas',
          props: { __canvasPoint: cp },
          selector: '',
          elementTag: 'canvas',
          elementClasses: '',
          elementText: '',
          computedStyles: {},
          rect: new DOMRect(screenPos?.x ?? e.clientX, screenPos?.y ?? e.clientY, 0, 0),
        })
        setHighlight(null)
        setComment('')
        setMode('commenting')
        return
      }

      if (selectedFrames.length === 1) {
        // Single frame — existing single-target behavior
        const frame = selectedFrames[0]
        const frameEl = document.querySelector(`[data-frame-id="${frame.id}"]`)
        const isImage = isCanvasImageFrame(frame)
        const componentName = isImage
          ? 'Context Image'
          : (frame as CanvasComponentFrame)?.component?.displayName ?? (frame as CanvasComponentFrame)?.component?.name ?? 'Unknown'
        const props = isImage
          ? { src: frame.src }
          : (frame as CanvasComponentFrame)?.props ?? {}

        setTarget({
          frameId: frame.id,
          componentName,
          props,
          selector: isImage ? 'img' : '',
          elementTag: isImage ? 'img' : 'div',
          elementClasses: '',
          elementText: '',
          computedStyles: {},
          rect: frameEl?.getBoundingClientRect() ?? new DOMRect(e.clientX, e.clientY, 0, 0),
        })
        setComment('')
        setHighlight(null)
        setMode('commenting')
        return
      }

      // Multiple frames — multi-select pick
      const frameIds = selectedFrames.map(f => f.id)
      const frameInfos = selectedFrames.map(f => ({
        frameId: f.id,
        title: f.title,
        isImage: isCanvasImageFrame(f),
      }))

      // Calculate center of all selected frames for dialog positioning
      const avgX = selectedFrames.reduce((sum, f) => sum + f.x + f.width / 2, 0) / selectedFrames.length
      const avgY = selectedFrames.reduce((sum, f) => sum + f.y + f.height / 2, 0) / selectedFrames.length
      const screenPos = canvasToScreen(avgX, avgY)

      setTarget({
        frameId: frameIds.join('+'),
        frameIds,
        componentName: 'Multi-Select',
        props: { frameIds },
        selector: '',
        elementTag: 'multi-select',
        elementClasses: '',
        elementText: '',
        computedStyles: {},
        rect: new DOMRect(screenPos?.x ?? e.clientX, screenPos?.y ?? e.clientY, 0, 0),
        frames: frameInfos,
      })
      setAnnotationMode('refine')  // Default to refine for multi-select (user can switch to pick/ideate)
      setComment('')
      setHighlight(null)
      setMode('commenting')
      return
    }

    if (!dragState) return

    // Collect all target frames (locked + final hover target)
    let allTargets = [...dragState.lockedTargets]

    const overlay = overlayRef.current
    if (overlay) {
      overlay.style.pointerEvents = 'none'
      const el = document.elementFromPoint(e.clientX, e.clientY)
      overlay.style.pointerEvents = 'auto'

      if (el) {
        const frameEl = el.closest('[data-frame-id]')
        if (frameEl) {
          const toFrameId = frameEl.getAttribute('data-frame-id') ?? ''
          const alreadyIncluded = toFrameId === dragState.fromFrameId || allTargets.some(t => t.frameId === toFrameId)

          // Add final hover target if it's a valid frame
          if (!alreadyIncluded) {
            const center = getFrameCenter(toFrameId)
            if (center) {
              allTargets.push({ frameId: toFrameId, point: center })
            }
          }
        }
      }
    }

    // If we have targets, create connection(s)
    if (allTargets.length > 0) {
      const connectionId = `conn-${nextConnectionId.current++}`
      const allFrameIds = [dragState.fromFrameId, ...allTargets.map(t => t.frameId)]

      // For now, store as a single connection with multiple targets
      // The Connection type will need to support this (or we create multiple connections)
      const newConnection: Connection = {
        id: connectionId,
        fromFrameId: dragState.fromFrameId,
        toFrameId: allTargets.length === 1 ? allTargets[0].frameId : allFrameIds.join('+'),
      }
      setConnections(prev => [...prev, newConnection])
      setEditingConnectionId(connectionId)

      // Build titles for all images
      const allTitles = allFrameIds.map(id => {
        const frame = frames.find(f => f.id === id)
        return frame?.title?.split('/').pop() ?? id.replace('context-', '')
      })

      // Calculate center point for dialog positioning
      const allPoints = [dragState.fromPoint, ...allTargets.map(t => t.point)]
      const midPoint = {
        x: allPoints.reduce((sum, p) => sum + p.x, 0) / allPoints.length,
        y: allPoints.reduce((sum, p) => sum + p.y, 0) / allPoints.length,
      }

      setTarget({
        frameId: allFrameIds.join('+'),
        componentName: 'Connection',
        props: {
          __connectionId: connectionId,
          frameIds: allFrameIds,
          titles: allTitles,
        },
        selector: '',
        elementTag: 'connection',
        elementClasses: '',
        elementText: '',
        computedStyles: {},
        rect: new DOMRect(midPoint.x, midPoint.y, 0, 0),
      })
      setComment('')
      setHighlight(null)
      setDragState(null)
      setMode('commenting')
      return
    }

    // If no valid connection target, check if it was just a click (no significant drag)
    const dx = e.clientX - dragState.startPoint.x
    const dy = e.clientY - dragState.startPoint.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 10) {
      // It was a click, not a drag — open annotation dialog for this frame
      const frame = frames.find(f => f.id === dragState.fromFrameId)
      const frameEl = document.querySelector(`[data-frame-id="${dragState.fromFrameId}"]`)

      if (frame) {
        const isImage = isCanvasImageFrame(frame)
        const componentName = isImage
          ? 'Context Image'
          : (frame as CanvasComponentFrame)?.component?.displayName ?? (frame as CanvasComponentFrame)?.component?.name ?? 'Unknown'
        const props = isImage
          ? { src: frame.src }
          : (frame as CanvasComponentFrame)?.props ?? {}

        // For component frames, try to get the clicked element for selector
        const contentEl = frameEl?.querySelector('[data-frame-content]') ?? frameEl
        // Disable overlay to hit-test the actual element beneath
        const overlay = overlayRef.current
        if (overlay) overlay.style.pointerEvents = 'none'
        const clickedEl = document.elementFromPoint(dragState.startPoint.x, dragState.startPoint.y)
        if (overlay) overlay.style.pointerEvents = 'auto'
        const targetEl = clickedEl?.closest('[data-frame-id]') === frameEl ? clickedEl : contentEl
        const selector = contentEl && targetEl ? buildSelector(targetEl as Element, contentEl as Element) : ''

        setTarget({
          frameId: dragState.fromFrameId,
          componentName,
          props,
          selector: isImage ? 'img' : selector,
          elementTag: isImage ? 'img' : (targetEl?.tagName.toLowerCase() ?? 'div'),
          elementClasses: '',
          elementText: (targetEl?.textContent ?? '').trim().slice(0, 100),
          computedStyles: targetEl ? getStyleSubset(targetEl as Element) : {},
          rect: frameEl?.getBoundingClientRect() ?? new DOMRect(e.clientX, e.clientY, 0, 0),
        })
        setComment('')
        setHighlight(null)
        setDragState(null)
        setMode('commenting')
        return
      }
    }

    // Cancel drag
    setDragState(null)
    setHighlight(null)
  }, [dragState, marqueeState, frames, isContextImageFrame, getFrameCenter])

  const handleApply = useCallback(async () => {
    // Multi-select pick allows empty comment; others require it
    const isMultiSelect = target?.elementTag === 'multi-select'
    if (!target || (!isMultiSelect && !comment.trim())) return

    // Check if this is a connection annotation
    const isConnection = target.elementTag === 'connection'
    const connectionId = (target.props as any)?.__connectionId as string | undefined

    // Strip internal props before sending to server
    const { __canvasPoint: _cp, __connectionId: _connId, frameIds: _fids, ...serverProps } = target.props as any

    // Append ideate instruction so agent sees it clearly
    const finalComment = annotationMode === 'ideate'
      ? `${comment.trim()}\n\n---\n[IDEATE MODE: You MUST generate exactly ${variationCount} genuinely different variations. Each must be a distinct design direction — different layout, hierarchy, or approach. Not 1, not 2 — exactly ${variationCount}.]`
      : comment.trim()

    const body = {
      project: projectParam,
      type: isConnection ? 'connection' : undefined,
      frameId: target.frameId,
      frameIds: target.frameIds,  // Include frameIds array for multi-select
      componentName: target.componentName,
      props: serverProps,
      selector: target.selector,
      elementTag: target.elementTag,
      elementClasses: target.elementClasses,
      elementText: target.elementText,
      computedStyles: target.computedStyles,
      comment: finalComment,
      image: pastedImage ?? undefined,
      mode: annotationMode,
    }

    try {
      const params = new URLSearchParams()
      if (projectParam) params.set('projectId', projectParam)
      const res = await fetch(`${endpoint}/annotations?${params}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const annotation = await res.json()
      const serverId = annotation.id as string

      if (isConnection && connectionId) {
        // Update connection with annotation ID
        setConnections(prev => prev.map(c =>
          c.id === connectionId ? { ...c, annotationId: serverId } : c
        ))
        setEditingConnectionId(null)
      } else {
        const canvasPoint = (target.props as any)?.__canvasPoint as { x: number; y: number } | undefined
        if (editingMarkerId !== null) {
          // Update existing marker
          setMarkers(prev => prev.map(m =>
            m.id === editingMarkerId
              ? { ...m, serverId, frameId: target.frameId, selector: target.selector, comment: comment.trim(), canvasPoint }
              : m
          ))
        } else {
          // Add new annotation marker
          const id = nextMarkerId.current++
          setMarkers(prev => [...prev, {
            id,
            serverId,
            frameId: target.frameId,
            selector: target.selector,
            comment: comment.trim(),
            canvasPoint,
          }])
        }
      }
      toast('Saved')
    } catch {
      toast('Failed to save')
    }

    setMode('idle')
    setTarget(null)
    setComment('')
    setPastedImage(null)
    setEditingMarkerId(null)
  }, [target, comment, endpoint, editingMarkerId, toast, projectParam, annotationMode, variationCount, pastedImage])

  const handleCancel = useCallback(() => {
    // If canceling a new connection, remove it
    if (editingConnectionId) {
      const conn = connections.find(c => c.id === editingConnectionId)
      if (conn && !conn.annotationId) {
        // Connection was never saved, remove it
        setConnections(prev => prev.filter(c => c.id !== editingConnectionId))
      }
    }
    setMode('idle')
    setTarget(null)
    setHighlight(null)
    setComment('')
    setPastedImage(null)
    setEditingMarkerId(null)
    setEditingConnectionId(null)
    setDragState(null)
    setMarqueeState(null)
    setMarqueeSelectedIds(new Set())
  }, [editingConnectionId, connections])

  const handleDelete = useCallback(() => {
    if (editingMarkerId === null) return
    const marker = markers.find(m => m.id === editingMarkerId)
    if (marker?.serverId) {
      const params = new URLSearchParams()
      if (projectParam) params.set('projectId', projectParam)
      fetch(`${endpoint}/annotations/${marker.serverId}?${params}`, { method: 'DELETE' }).catch(() => {})
    }
    setMarkers(prev => prev.filter(m => m.id !== editingMarkerId))
    setMode('idle')
    setTarget(null)
    setComment('')
    setEditingMarkerId(null)
    toast('Annotation deleted')
  }, [editingMarkerId, markers, endpoint, toast, projectParam])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && mode === 'commenting') {
      handleApply()
    }
  }, [handleApply, mode])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        e.stopPropagation()
        const file = item.getAsFile()
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
          setPastedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
        return
      }
    }
  }, [])

  // Global Escape to dismiss targeting/commenting mode
  useEffect(() => {
    if (mode === 'idle') return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mode, handleCancel])

  // Click-outside to dismiss comment card (skip first frame to avoid race with originating click)
  useEffect(() => {
    if (mode !== 'commenting') return
    let armed = false
    const rafId = requestAnimationFrame(() => { armed = true })
    function handlePointerDown(e: MouseEvent) {
      if (!armed) return
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleCancel()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [mode, handleCancel])

  const cardVisible = mode === 'commenting' && target !== null

  return (
    <>
      {/* Targeting overlay — captures all pointer events */}
      {(mode === 'targeting' || dragState || marqueeState) && (
        <div
          ref={overlayRef}
          data-bryllen-targeting
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            pointerEvents: 'auto',
            cursor: marqueeState ? 'crosshair' : dragState ? 'grabbing' : 'crosshair',
          }}
        />
      )}

      {/* Highlight box */}
      {highlight && (mode === 'targeting' || dragState) && !marqueeState && (
        <div
          style={{
            position: 'fixed',
            left: highlight.left - 2,
            top: highlight.top - 2,
            width: highlight.width + 4,
            height: highlight.height + 4,
            border: `2px solid ${F.marker}`,
            borderRadius: R.ui, cornerShape: 'squircle',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      )}

      {/* Selection highlights for multi-select frames while dialog is open */}
      {mode === 'commenting' && target?.frameIds && target.frameIds.map(frameId => {
        const frameEl = document.querySelector(`[data-frame-id="${frameId}"]`)
        if (!frameEl) return null
        const rect = frameEl.getBoundingClientRect()
        return (
          <div
            key={frameId}
            style={{
              position: 'fixed',
              left: rect.left - 2,
              top: rect.top - 2,
              width: rect.width + 4,
              height: rect.height + 4,
              border: `2px solid ${F.marker}`,
              borderRadius: R.ui,
              pointerEvents: 'none',
              zIndex: 99997,
            }}
          />
        )
      })}

      {/* Live selection highlights during marquee drag */}
      {marqueeState && Array.from(marqueeSelectedIds).map(frameId => {
        const frameEl = document.querySelector(`[data-frame-id="${frameId}"]`)
        if (!frameEl) return null
        const rect = frameEl.getBoundingClientRect()
        return (
          <div
            key={frameId}
            style={{
              position: 'fixed',
              left: rect.left - 2,
              top: rect.top - 2,
              width: rect.width + 4,
              height: rect.height + 4,
              border: `2px solid ${F.marker}`,
              borderRadius: R.ui,
              pointerEvents: 'none',
              zIndex: 99997,
            }}
          />
        )
      })}

      {/* Marquee selection rectangle */}
      {marqueeState && (
        <MarqueeRect
          screenStart={marqueeState.screenStart}
          screenCurrent={marqueeState.screenCurrent}
        />
      )}

      {/* Connection lines layer */}
      <ConnectionsSvgLayer>
        {/* Provisional drag lines — hub + spokes for multi-select */}
        {dragState && (() => {
          const dx = dragState.currentPoint.x - dragState.startPoint.x
          const dy = dragState.currentPoint.y - dragState.startPoint.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 10 && dragState.lockedTargets.length === 0) return null

          const hasLockedTargets = dragState.lockedTargets.length > 0

          if (!hasLockedTargets) {
            // Simple two-point line
            return (
              <ConnectionLine
                from={dragState.fromPoint}
                to={dragState.currentPoint}
                provisional
              />
            )
          }

          // Multi-target: hub at source, spokes to each target + cursor
          const allPoints = [
            ...dragState.lockedTargets.map(t => t.point),
            dragState.currentPoint,
          ]

          return (
            <>
              {/* Lines from source to each locked target */}
              {dragState.lockedTargets.map((target, i) => (
                <ConnectionLine
                  key={target.frameId}
                  from={dragState.fromPoint}
                  to={target.point}
                  provisional
                />
              ))}
              {/* Line from source to current cursor */}
              <ConnectionLine
                from={dragState.fromPoint}
                to={dragState.currentPoint}
                provisional
              />
              {/* Hub circle at source */}
              <circle
                cx={dragState.fromPoint.x}
                cy={dragState.fromPoint.y}
                r={8}
                fill={F.marker}
                fillOpacity={0.8}
              />
            </>
          )
        })()}

        {/* Persisted connections */}
        {connections.map(conn => {
          const points = connectionRects.get(conn.id)
          if (!points) return null
          return (
            <ConnectionLine
              key={conn.id}
              from={points.from}
              to={points.to}
              hovered={hoveredConnectionId === conn.id}
              onClick={() => {
                // Open annotation dialog for this connection
                const fromFrame = frames.find(f => f.id === conn.fromFrameId)
                const toFrame = frames.find(f => f.id === conn.toFrameId)
                setTarget({
                  frameId: `${conn.fromFrameId}+${conn.toFrameId}`,
                  componentName: 'Connection',
                  props: {
                    __connectionId: conn.id,
                    fromFrameId: conn.fromFrameId,
                    toFrameId: conn.toFrameId,
                    fromTitle: fromFrame?.title ?? conn.fromFrameId,
                    toTitle: toFrame?.title ?? conn.toFrameId,
                  },
                  selector: '',
                  elementTag: 'connection',
                  elementClasses: '',
                  elementText: '',
                  computedStyles: {},
                  rect: new DOMRect(
                    (points.from.x + points.to.x) / 2,
                    (points.from.y + points.to.y) / 2,
                    0, 0
                  ),
                })
                setEditingConnectionId(conn.id)
                setComment('')
                setMode('commenting')
              }}
              onMouseEnter={() => setHoveredConnectionId(conn.id)}
              onMouseLeave={() => setHoveredConnectionId(null)}
            />
          )
        })}
      </ConnectionsSvgLayer>

      {/* Comment card — positioned near target element */}
      {cardVisible && target && (() => {
        const cardWidth = 380
        const cardHeight = 220
        let top = target.rect.bottom + S.sm
        let left = target.rect.left
        if (top + cardHeight > window.innerHeight) {
          top = target.rect.top - cardHeight - S.sm
        }
        if (left + cardWidth > window.innerWidth - S.lg) {
          left = window.innerWidth - cardWidth - S.lg
        }
        if (left < S.lg) left = S.lg
        if (top < S.lg) top = S.lg
        return (
        <div ref={cardRef} onKeyDown={handleKeyDown}>
          <DialogCard width={cardWidth} style={{ position: 'fixed', top, left, zIndex: 99999, padding: S.lg }}>
            {/* Header: component·tag + delete icon (when re-editing) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.sm }}>
              <div style={{ fontSize: T.ui, color: V.txtSec, letterSpacing: '0.02em' }}>
                {target.elementTag === 'multi-select'
                  ? <>Pick {target.frames?.length ?? 0} frames: {target.frames?.map(f => f.title.split('/').pop()).join(', ')}</>
                  : target.elementTag === 'connection'
                    ? <>Combine: {((target.props as any).titles as string[] | undefined)?.join(' + ') ?? `${(target.props as any).fromTitle?.split('/').pop()} + ${(target.props as any).toTitle?.split('/').pop()}`}</>
                    : target.frameId
                      ? <>{target.componentName} &middot; {target.elementTag}</>
                      : 'Canvas note'}
              </div>
              {editingMarkerId !== null && (
                <HoverButton
                  onClick={handleDelete}
                  hoverBg={V.active}
                  title="Delete annotation"
                  baseStyle={{
                    width: S.xxl, height: S.xxl, border: 'none', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: R.ui, cornerShape: 'squircle', color: V.txtSec,
                  }}
                >
                  <Trash2 size={ICON.md} strokeWidth={1.5} style={{ color: V.txtSec }} />
                </HoverButton>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={e => setComment(e.target.value)}
              onPaste={handlePaste}
              placeholder={
                target.elementTag === 'multi-select'
                  ? 'Describe the change for these frames...'
                  : target.elementTag === 'connection'
                    ? 'How should these be combined?'
                    : target.frameId
                      ? 'Describe the change...'
                      : 'Add a note...'
              }
              style={{
                width: '100%',
                minHeight: 72,
                background: V.canvas,
                color: V.txtPri,
                border: `1px solid ${V.border}`,
                borderRadius: R.ui, cornerShape: 'squircle',
                padding: S.md,
                fontSize: T.ui,
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            {/* Pasted image preview */}
            {pastedImage && (
              <div style={{ position: 'relative', marginTop: S.sm }}>
                <img
                  src={pastedImage}
                  alt="Pasted"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 120,
                    borderRadius: R.ui,
                    border: `1px solid ${V.border}`,
                  }}
                />
                <button
                  onClick={() => setPastedImage(null)}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </div>
            )}
            <DialogActions>
              <ModeToggle
                value={annotationMode}
                onChange={setAnnotationMode}
                variationCount={variationCount}
                onVariationChange={setVariationCount}
              />
              <div style={{ flex: 1 }} />
              <ActionButton variant="ghost" onClick={handleCancel}>Cancel</ActionButton>
              <ActionButton variant="primary" disabled={target?.elementTag !== 'multi-select' && !comment.trim()} onClick={handleApply}>Save</ActionButton>
            </DialogActions>
          </DialogCard>
        </div>
        )
      })()}

      {/* FAB */}
      {mode === 'idle' && (
        <div
          data-tour-id="annotation-fab"
          style={{
            position: 'fixed',
            bottom: S.lg + S.md,
            right: S.lg + S.md,
            zIndex: 99999,
          }}
        >
          <button
            onClick={() => setMode('targeting')}
            onPointerEnter={() => setButtonState('hover')}
            onPointerLeave={() => setButtonState('idle')}
            onPointerDown={() => setButtonState('pressed')}
            onPointerUp={() => setButtonState('hover')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: buttonState === 'pressed'
                ? A.strong
                : buttonState === 'hover' ? A.hover : A.accent,
              color: D.text,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: buttonState === 'pressed'
                ? 'inset 0 1px 2px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)'
                : buttonState === 'hover'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.06)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
            }}
          >
            <SquareMousePointer size={S.xl} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Annotation markers */}
      {markers.map((marker, index) => {
        const rect = markerRects.get(marker.id)
        if (!rect) return null
        return (
          <MarkerDot
            key={marker.id}
            displayIndex={index + 1}
            comment={marker.comment}
            rect={rect}
            progress={marker.progress}
            onClick={() => {
              // Canvas-level note — no frame to look up
              if (marker.canvasPoint) {
                const sp = canvasToScreen(marker.canvasPoint.x, marker.canvasPoint.y)
                setTarget({
                  frameId: '',
                  componentName: 'Canvas',
                  props: { __canvasPoint: marker.canvasPoint },
                  selector: '',
                  elementTag: 'canvas',
                  elementClasses: '',
                  elementText: '',
                  computedStyles: {},
                  rect: new DOMRect(sp?.x ?? 0, sp?.y ?? 0, 0, 0),
                })
                setComment(marker.comment)
                setEditingMarkerId(marker.id)
                setMode('commenting')
                return
              }
              const frameEl = document.querySelector(`[data-frame-id="${marker.frameId}"]`)
              if (!frameEl) return
              const contentEl = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
              if (!contentEl) return
              let el: Element
              try {
                el = contentEl.querySelector(marker.selector) ?? contentEl
              } catch {
                el = contentEl
              }
              const frame = frames.find(f => f.id === marker.frameId)
              const isImage = frame && isCanvasImageFrame(frame)
              const componentName = isImage
                ? 'Context Image'
                : (frame as CanvasComponentFrame)?.component?.displayName ?? (frame as CanvasComponentFrame)?.component?.name ?? 'Unknown'
              setTarget({
                frameId: marker.frameId,
                componentName,
                props: isImage ? { src: frame.src } : (frame as CanvasComponentFrame)?.props ?? {},
                selector: marker.selector,
                elementTag: el.tagName.toLowerCase(),
                elementClasses: (el as HTMLElement).className?.toString() ?? '',
                elementText: (el.textContent ?? '').trim().slice(0, 100),
                computedStyles: getStyleSubset(el),
                rect: el.getBoundingClientRect(),
              })
              setComment(marker.comment)
              setEditingMarkerId(marker.id)
              setMode('commenting')
            }}
          />
        )
      })}

    </>
  )
}
