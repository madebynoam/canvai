import { useState, useRef, useCallback, useEffect } from 'react'
import { SquareMousePointer, Trash2 } from 'lucide-react'
import { N, A, F, S, R, T, ICON, FONT } from './tokens'
import { DialogCard, DialogActions, ActionButton } from './Menu'
import type { CanvasFrame, CanvasComponentFrame } from './types'
import { isCanvasImageFrame } from './types'

type Mode = 'idle' | 'targeting' | 'commenting'

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

/* ── Marker dot ── */
function MarkerDot({ id, comment, rect, onClick }: {
  id: number
  comment: string
  rect: DOMRect
  onClick: () => void
}) {
  return (
    <div
      title={comment}
      onClick={onClick}
      style={{
        position: 'fixed',
        left: rect.left - S.sm,
        top: rect.top - S.sm,
        width: S.lg,
        height: S.lg,
        borderRadius: '50%',
        background: F.marker,
        color: 'oklch(1 0 0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: T.label,
        fontWeight: 700,
        fontFamily: FONT,
        zIndex: 99997,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {id}
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
}

export function AnnotationOverlay({ endpoint, frames, showToast: externalToast, project = '' }: AnnotationOverlayProps) {
  const [mode, setMode] = useState<Mode>('idle')
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [comment, setComment] = useState('')
  const [buttonState, setButtonState] = useState<'idle' | 'hover' | 'pressed'>('idle')
  const [markers, setMarkers] = useState<AnnotationMarker[]>([])
  const [markerRects, setMarkerRects] = useState<Map<number, DOMRect>>(new Map())
  const [editingMarkerId, setEditingMarkerId] = useState<number | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const nextMarkerId = useRef(1)

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

  // Subscribe to SSE for resolved annotations — remove markers when agent resolves them
  useEffect(() => {
    const source = new EventSource(`${endpoint}/annotations/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if ((data.type === 'resolved' || data.type === 'deleted') && data.id) {
          setMarkers(prev => prev.filter(m => m.serverId !== data.id))
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

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
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
  }, [mode])

  const handleClick = useCallback((e: React.PointerEvent) => {
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
      // Clicked inside a frame — target the specific element
      const frameId = frameEl.getAttribute('data-frame-id') ?? ''
      const frame = frames.find(f => f.id === frameId)

      // Handle image frames differently
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
    } else {
      // Clicked on empty canvas — canvas-level note
      // Store canvas-space coords so the marker tracks pan/zoom
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
    }

    setHighlight(null)
    setComment('')
    setMode('commenting')
  }, [mode, frames])

  const handleApply = useCallback(async () => {
    if (!target || !comment.trim()) return

    // Strip internal __canvasPoint from props before sending to server
    const { __canvasPoint: _cp, ...serverProps } = target.props as any
    const body = {
      project,
      frameId: target.frameId,
      componentName: target.componentName,
      props: serverProps,
      selector: target.selector,
      elementTag: target.elementTag,
      elementClasses: target.elementClasses,
      elementText: target.elementText,
      computedStyles: target.computedStyles,
      comment: comment.trim(),
    }

    try {
      const res = await fetch(`${endpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const annotation = await res.json()
      const serverId = annotation.id as string
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
      toast('Saved')
    } catch {
      toast('Failed to save')
    }

    setMode('idle')
    setTarget(null)
    setComment('')
    setEditingMarkerId(null)
  }, [target, comment, endpoint, editingMarkerId, toast, project])

  const handleCancel = useCallback(() => {
    setMode('idle')
    setTarget(null)
    setHighlight(null)
    setComment('')
    setEditingMarkerId(null)
  }, [])

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
      {mode === 'targeting' && (
        <div
          ref={overlayRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handleClick}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99998,
            cursor: 'crosshair',
          }}
        />
      )}

      {/* Highlight box */}
      {highlight && mode === 'targeting' && (
        <div
          style={{
            position: 'fixed',
            left: highlight.left - 2,
            top: highlight.top - 2,
            width: highlight.width + 4,
            height: highlight.height + 4,
            border: `2px solid ${F.marker}`,
            borderRadius: R.control,
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      )}

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
              <div style={{ fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em' }}>
                {target.frameId ? <>{target.componentName} &middot; {target.elementTag}</> : 'Canvas note'}
              </div>
              {editingMarkerId !== null && (
                <HoverButton
                  onClick={handleDelete}
                  hoverBg="rgba(0,0,0,0.06)"
                  title="Delete annotation"
                  baseStyle={{
                    width: S.xxl, height: S.xxl, border: 'none', background: 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: R.control, color: N.txtTer,
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
              placeholder={target.frameId ? 'Describe the change...' : 'Add a note...'}
              style={{
                width: '100%',
                minHeight: 72,
                background: N.canvas,
                color: N.txtPri,
                border: `1px solid ${N.border}`,
                borderRadius: R.card,
                padding: S.md,
                fontSize: T.title,
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <DialogActions>
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
              color: 'oklch(1 0 0)',
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
      {markers.map((marker) => {
        const rect = markerRects.get(marker.id)
        if (!rect) return null
        return (
          <MarkerDot
            key={marker.id}
            id={marker.id}
            comment={marker.comment}
            rect={rect}
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
