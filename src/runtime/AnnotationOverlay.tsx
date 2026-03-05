import { useState, useRef, useCallback, useEffect } from 'react'
import { SquareMousePointer, Trash2, Pencil, Lightbulb, Check } from 'lucide-react'
import { N, A, F, D, S, R, T, ICON, FONT } from './tokens'
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

interface TargetInfo {
  frameId: string
  componentName: string
  props: Record<string, unknown>
  selector: string
  elementTag: string
  elementClasses: string
  elementText: string
  computedStyles: Record<string, string>
  rect: DOMRect
}

interface AnnotationOverlayProps {
  endpoint: string
  frames: CanvasFrame[]
  showToast?: (msg: string) => void
  project?: string
}

/* ── Mode toggle (Refine / Ideate / Pick) — icon chips with tooltips ── */
type AnnotationMode = 'refine' | 'ideate' | 'pick'

interface ModeOption {
  mode: AnnotationMode
  icon: typeof Pencil
  label: string
  description: string
}

const MODES: ModeOption[] = [
  { mode: 'refine', icon: Pencil, label: 'Refine', description: 'Adjust this element' },
  { mode: 'ideate', icon: Lightbulb, label: 'Ideate', description: 'Generate new ideas' },
  { mode: 'pick', icon: Check, label: 'Pick', description: 'Use this version' },
]

function ModeChip({ option, active, onClick }: {
  option: ModeOption
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Green accent for Pick mode
  const pickActiveColor = 'oklch(0.55 0.14 155)'
  const isPick = option.mode === 'pick'

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
          background: active
            ? (isPick ? pickActiveColor : 'oklch(0.92 0.005 250)')
            : hovered ? 'oklch(0.96 0.003 250)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active
            ? (isPick ? '#fff' : N.txtPri)
            : N.txtSec,
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

function ModeToggle({ value, onChange, showPick = true }: {
  value: AnnotationMode
  onChange: (mode: AnnotationMode) => void
  showPick?: boolean
}) {
  const options = showPick ? MODES : MODES.filter(m => m.mode !== 'pick')

  return (
    <div style={{
      display: 'flex',
      gap: 2,
      background: 'oklch(0.97 0.003 250)',
      borderRadius: R.ui,
      padding: 2,
    }}>
      {options.map(opt => (
        <ModeChip
          key={opt.mode}
          option={opt}
          active={value === opt.mode}
          onClick={() => onChange(opt.mode)}
        />
      ))}
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

// Build a CSS selector path from element up to the frame content boundary
function buildSelector(el: Element, boundary: Element): string {
  const parts: string[] = []
  let current: Element | null = el
  while (current && current !== boundary) {
    const tag = current.tagName.toLowerCase()
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        parts.unshift(`${tag}:nth-of-type(${index})`)
      } else {
        parts.unshift(tag)
      }
    } else {
      parts.unshift(tag)
    }
    current = parent
  }
  return parts.join(' > ')
}

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

export function AnnotationOverlay({ endpoint, frames, showToast: externalToast, project = '' }: AnnotationOverlayProps) {
  const [mode, setMode] = useState<Mode>('idle')
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [comment, setComment] = useState('')
  const [annotationMode, setAnnotationMode] = useState<AnnotationMode>('refine')
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
    fetch(`${endpoint}/annotations`)
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
  }, [endpoint])

  // Subscribe to SSE for resolved annotations and progress updates
  useEffect(() => {
    const source = new EventSource(`${endpoint}/annotations/events`)
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
  }, [endpoint])

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
    // Update drag state if dragging
    if (dragState) {
      const overlay = overlayRef.current
      let hoveredFrameId: string | null = null
      let hoveredFrameRect: DOMRect | null = null

      // Check if hovering over another context image
      if (overlay) {
        overlay.style.pointerEvents = 'none'
        const el = document.elementFromPoint(e.clientX, e.clientY)
        overlay.style.pointerEvents = 'auto'
        if (el) {
          const frameEl = el.closest('[data-frame-id]')
          if (frameEl) {
            const frameId = frameEl.getAttribute('data-frame-id') ?? ''
            const alreadyLocked = dragState.lockedTargets.some(t => t.frameId === frameId)
            if (frameId !== dragState.fromFrameId && !alreadyLocked && isContextImageFrame(frameId)) {
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
  }, [mode, dragState, isContextImageFrame])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'targeting') return
    const overlay = overlayRef.current
    if (!overlay) return

    // Stop native event from reaching document-level click-outside listener
    e.nativeEvent.stopImmediatePropagation()

    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'

    if (!el) return

    const frameEl = el.closest('[data-frame-id]')

    if (frameEl) {
      const frameId = frameEl.getAttribute('data-frame-id') ?? ''
      const frame = frames.find(f => f.id === frameId)

      // If it's a context image, start drag for potential connection
      if (frame && isCanvasImageFrame(frame)) {
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
      }

      // Regular frame click — target the specific element
      const isImage = frame && isCanvasImageFrame(frame)
      const componentName = isImage
        ? 'Context Image'
        : (frame as CanvasComponentFrame)?.component?.displayName ?? (frame as CanvasComponentFrame)?.component?.name ?? 'Unknown'
      const props = isImage
        ? { src: frame.src }
        : (frame as CanvasComponentFrame)?.props ?? {}

      const boundary = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
      const selector = boundary ? buildSelector(el, boundary) : el.tagName.toLowerCase()

      const text = (el.textContent ?? '').trim().slice(0, 100)

      setTarget({
        frameId,
        componentName,
        props,
        selector,
        elementTag: el.tagName.toLowerCase(),
        elementClasses: el.className?.toString() ?? '',
        elementText: text,
        computedStyles: getStyleSubset(el),
        rect: el.getBoundingClientRect(),
      })
      setHighlight(null)
      setComment('')
      setMode('commenting')
    } else {
      // Clicked on empty canvas — canvas-level note
      const cp = screenToCanvas(e.clientX, e.clientY)
      setTarget({
        frameId: '',
        componentName: 'Canvas',
        props: cp ? { __canvasPoint: cp } : {},
        selector: '',
        elementTag: 'canvas',
        elementClasses: '',
        elementText: '',
        computedStyles: {},
        rect: new DOMRect(e.clientX, e.clientY, 0, 0),
      })
      setHighlight(null)
      setComment('')
      setMode('commenting')
    }
  }, [mode, frames, getFrameCenter])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
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

          // Add final hover target if it's a valid context image
          if (!alreadyIncluded && isContextImageFrame(toFrameId)) {
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
      // It was a click, not a drag — open single image annotation
      const frame = frames.find(f => f.id === dragState.fromFrameId)
      if (frame && isCanvasImageFrame(frame)) {
        const frameEl = document.querySelector(`[data-frame-id="${dragState.fromFrameId}"]`)
        setTarget({
          frameId: dragState.fromFrameId,
          componentName: 'Context Image',
          props: { src: frame.src },
          selector: 'img',
          elementTag: 'img',
          elementClasses: '',
          elementText: '',
          computedStyles: {},
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
  }, [dragState, frames, isContextImageFrame, getFrameCenter])

  const handleApply = useCallback(async () => {
    if (!target || !comment.trim()) return

    // Check if this is a connection annotation
    const isConnection = target.elementTag === 'connection'
    const connectionId = (target.props as any)?.__connectionId as string | undefined

    // Strip internal props before sending to server
    const { __canvasPoint: _cp, __connectionId: _connId, ...serverProps } = target.props as any

    const body = {
      project,
      type: isConnection ? 'connection' : annotationMode === 'pick' ? 'pick' : undefined,
      frameId: target.frameId,
      componentName: target.componentName,
      props: serverProps,
      selector: target.selector,
      elementTag: target.elementTag,
      elementClasses: target.elementClasses,
      elementText: target.elementText,
      computedStyles: target.computedStyles,
      comment: comment.trim(),
      mode: annotationMode,
    }

    try {
      const res = await fetch(`${endpoint}/annotations`, {
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
    setEditingMarkerId(null)
  }, [target, comment, endpoint, editingMarkerId, toast, project, annotationMode])

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
    setEditingMarkerId(null)
    setEditingConnectionId(null)
    setDragState(null)
  }, [editingConnectionId, connections])

  const handleDelete = useCallback(() => {
    if (editingMarkerId === null) return
    const marker = markers.find(m => m.id === editingMarkerId)
    if (marker?.serverId) {
      fetch(`${endpoint}/annotations/${marker.serverId}`, { method: 'DELETE' }).catch(() => {})
    }
    setMarkers(prev => prev.filter(m => m.id !== editingMarkerId))
    setMode('idle')
    setTarget(null)
    setComment('')
    setEditingMarkerId(null)
    toast('Annotation deleted')
  }, [editingMarkerId, markers, endpoint, toast])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && mode === 'commenting') {
      handleApply()
    }
  }, [handleApply, mode])

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

  // Global shift+click to annotate directly (skip FAB click)
  useEffect(() => {
    if (mode !== 'idle') return

    function handleGlobalClick(e: MouseEvent) {
      if (!e.shiftKey) return

      // Find frame under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return

      const frameEl = el.closest('[data-frame-id]')
      if (!frameEl) {
        // Clicked on empty canvas — canvas-level note
        const cp = screenToCanvas(e.clientX, e.clientY)
        setTarget({
          frameId: '',
          componentName: 'Canvas',
          props: cp ? { __canvasPoint: cp } : {},
          selector: '',
          elementTag: 'canvas',
          elementClasses: '',
          elementText: '',
          computedStyles: {},
          rect: new DOMRect(e.clientX, e.clientY, 0, 0),
        })
        setHighlight(null)
        setComment('')
        setMode('commenting')
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Clicked on a frame — target the specific element
      const frameId = frameEl.getAttribute('data-frame-id') ?? ''
      const frame = frames.find(f => f.id === frameId)
      const isImage = frame && isCanvasImageFrame(frame)
      const componentName = isImage
        ? 'Context Image'
        : (frame as CanvasComponentFrame)?.component?.displayName ?? (frame as CanvasComponentFrame)?.component?.name ?? 'Unknown'
      const props = isImage
        ? { src: frame.src }
        : (frame as CanvasComponentFrame)?.props ?? {}

      const boundary = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
      const selector = boundary ? buildSelector(el, boundary) : el.tagName.toLowerCase()
      const text = (el.textContent ?? '').trim().slice(0, 100)

      setTarget({
        frameId,
        componentName,
        props,
        selector,
        elementTag: el.tagName.toLowerCase(),
        elementClasses: el.className?.toString() ?? '',
        elementText: text,
        computedStyles: getStyleSubset(el),
        rect: el.getBoundingClientRect(),
      })
      setHighlight(null)
      setComment('')
      setMode('commenting')
      e.preventDefault()
      e.stopPropagation()
    }

    document.addEventListener('click', handleGlobalClick, true)
    return () => document.removeEventListener('click', handleGlobalClick, true)
  }, [mode, frames])

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
      {(mode === 'targeting' || dragState) && (
        <div
          ref={overlayRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            cursor: dragState ? 'grabbing' : 'crosshair',
          }}
        />
      )}

      {/* Highlight box */}
      {highlight && (mode === 'targeting' || dragState) && (
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
        const cardWidth = 320
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
              <div style={{ fontSize: T.ui, color: N.txtSec, letterSpacing: '0.02em' }}>
                {target.elementTag === 'connection'
                  ? <>Combine: {((target.props as any).titles as string[] | undefined)?.join(' + ') ?? `${(target.props as any).fromTitle?.split('/').pop()} + ${(target.props as any).toTitle?.split('/').pop()}`}</>
                  : target.frameId
                    ? <>{target.componentName} &middot; {target.elementTag}</>
                    : 'Canvas note'}
              </div>
              {editingMarkerId !== null && (
                <HoverButton
                  onClick={handleDelete}
                  hoverBg="rgba(0,0,0,0.06)"
                  title="Delete annotation"
                  baseStyle={{
                    width: S.xxl, height: S.xxl, border: 'none', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: R.ui, cornerShape: 'squircle', color: N.txtSec,
                  }}
                >
                  <Trash2 size={ICON.md} strokeWidth={1.5} />
                </HoverButton>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                target.elementTag === 'connection'
                  ? 'How should these be combined?'
                  : target.frameId
                    ? 'Describe the change...'
                    : 'Add a note...'
              }
              style={{
                width: '100%',
                minHeight: 72,
                background: N.canvas,
                color: N.txtPri,
                border: `1px solid ${N.border}`,
                borderRadius: R.ui, cornerShape: 'squircle',
                padding: S.md,
                fontSize: T.ui,
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <DialogActions>
              <ModeToggle
                value={annotationMode}
                onChange={setAnnotationMode}
                showPick={!!target.frameId && target.elementTag !== 'connection' && target.elementTag !== 'canvas'}
              />
              <div style={{ flex: 1 }} />
              <ActionButton variant="ghost" onClick={handleCancel}>Cancel</ActionButton>
              <ActionButton variant="primary" disabled={!comment.trim()} onClick={handleApply}>Save</ActionButton>
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
