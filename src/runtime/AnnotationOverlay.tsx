import { useState, useRef, useCallback, useEffect } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { useReducedMotion } from './useReducedMotion'
import type { CanvasFrame } from './types'

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

type AnnotateMode = 'manual' | 'watch'

interface AnnotationOverlayProps {
  endpoint: string
  frames: CanvasFrame[]
  annotateMode?: AnnotateMode
  onPendingChange?: (count: number) => void
}

// Design tokens — Braun/Ive aesthetic with orange accent
const ACCENT = '#E8590C'
const ACCENT_HOVER = '#CF4F0B'
const ACCENT_PRESSED = '#D4520A'
const ACCENT_MUTED = 'rgba(232, 89, 12, 0.15)'
const ACCENT_LIFT = '#F46D12' // saturated bright orange — light hitting the mold, not desaturated
const SURFACE = '#FFFFFF'
const SURFACE_ALT = '#F9FAFB'
const BORDER = '#E5E7EB'
const TEXT_PRIMARY = '#1F2937'
const TEXT_SECONDARY = '#6B7280'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const RADIUS = 10

/* ── Spring presence hook ──
 * Manages mount/unmount lifecycle with spring enter/exit.
 * Consumer provides an `apply` callback to map spring value (0→1) to styles.
 * Returns { ref, render, dismiss } — dismiss() skips exit animation (keyboard shortcut path).
 */
function useSpringMount(
  visible: boolean,
  apply: (el: HTMLElement, v: number) => void,
  reducedMotion: boolean,
) {
  const ref = useRef<HTMLElement | null>(null)
  const [render, setRender] = useState(visible)
  const animRef = useRef(0)
  const stRef = useRef({ value: visible ? 1 : 0, velocity: 0 })
  const applyRef = useRef(apply)
  applyRef.current = apply
  const instantRef = useRef(false)

  const dismiss = useCallback(() => { instantRef.current = true }, [])

  useEffect(() => {
    if (visible) {
      setRender(true)
      instantRef.current = false
    }

    // Reduced motion: snap immediately
    if (reducedMotion) {
      cancelAnimationFrame(animRef.current)
      stRef.current.value = visible ? 1 : 0
      stRef.current.velocity = 0
      if (ref.current) applyRef.current(ref.current, visible ? 1 : 0)
      if (!visible) setRender(false)
      return
    }

    // Instant dismiss (keyboard shortcut path — Emil: keyboard = no animation)
    if (!visible && instantRef.current) {
      cancelAnimationFrame(animRef.current)
      stRef.current.value = 0
      stRef.current.velocity = 0
      if (ref.current) applyRef.current(ref.current, 0)
      setRender(false)
      return
    }

    cancelAnimationFrame(animRef.current)
    const target = visible ? 1 : 0
    const tension = 233
    const friction = 21
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      const s = stRef.current
      while (accum >= DT) {
        s.velocity += (-tension * (s.value - target) - friction * s.velocity) * DT
        s.value += s.velocity * DT
        accum -= DT
      }
      if (ref.current) applyRef.current(ref.current, Math.max(0, Math.min(1, s.value)))
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        animRef.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        if (ref.current) applyRef.current(ref.current, target)
        if (!visible) setRender(false)
      }
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [visible, reducedMotion])

  return { ref, render, dismiss }
}

/* ── Marker dot with spring-in on mount ── */
function MarkerDot({ id, comment, rect, onClick, reducedMotion }: {
  id: number
  comment: string
  rect: DOMRect
  onClick: () => void
  reducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || reducedMotion) return
    const el = ref.current
    let value = 0.5
    let velocity = 0
    const tension = 233
    const friction = 19
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()
    let raf = 0

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      while (accum >= DT) {
        velocity += (-tension * (value - 1) - friction * velocity) * DT
        value += velocity * DT
        accum -= DT
      }
      el.style.transform = `scale(${value})`
      if (Math.abs(value - 1) > 0.001 || Math.abs(velocity) > 0.001) {
        raf = requestAnimationFrame(step)
      } else {
        el.style.transform = 'scale(1)'
      }
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  return (
    <div
      ref={ref}
      title={comment}
      onClick={onClick}
      style={{
        position: 'fixed',
        left: rect.left - 6,
        top: rect.top - 6,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: `linear-gradient(180deg, ${ACCENT_LIFT} 0%, ${ACCENT} 100%)`,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 9,
        fontWeight: 700,
        fontFamily: FONT,
        zIndex: 99997,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06)',
        cursor: 'default',
        userSelect: 'none',
        transform: reducedMotion ? 'scale(1)' : 'scale(0.5)',
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
        transition: 'background-color 150ms ease',
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

interface AnnotationMarker {
  id: number
  serverId: string
  frameId: string
  selector: string
  comment: string
}

export function AnnotationOverlay({ endpoint, frames, annotateMode = 'manual', onPendingChange }: AnnotationOverlayProps) {
  const reducedMotion = useReducedMotion()
  const [mode, setMode] = useState<Mode>('idle')
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [comment, setComment] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [buttonState, setButtonState] = useState<'idle' | 'hover' | 'pressed'>('idle')
  const [markers, setMarkers] = useState<AnnotationMarker[]>([])
  const [markerRects, setMarkerRects] = useState<Map<number, DOMRect>>(new Map())
  const [editingMarkerId, setEditingMarkerId] = useState<number | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const nextMarkerId = useRef(1)

  // Keep last target/toast around for exit animation content
  const lastTargetRef = useRef<TargetInfo | null>(null)
  const lastToastRef = useRef<string | null>(null)
  if (target) lastTargetRef.current = target
  if (toast) lastToastRef.current = toast

  // Spring presence for comment card, toast, FAB
  const cardVisible = mode === 'commenting' && target !== null
  const card = useSpringMount(
    cardVisible,
    (el, v) => {
      el.style.opacity = `${v}`
      el.style.transform = `translateY(${(1 - v) * 8}px) scale(${0.96 + 0.04 * v})`
    },
    reducedMotion,
  )

  const toastSpring = useSpringMount(
    toast !== null,
    (el, v) => {
      el.style.opacity = `${v}`
      el.style.transform = `translateX(-50%) translateY(${(1 - v) * 16}px)`
    },
    reducedMotion,
  )

  const fab = useSpringMount(
    mode === 'idle',
    (el, v) => {
      el.style.opacity = `${v}`
      el.style.transform = `scale(${0.8 + 0.2 * v})`
    },
    reducedMotion,
  )

  // Focus textarea when entering commenting mode
  useEffect(() => {
    if (mode === 'commenting' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [mode])

  // Clear toast after 2s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(t)
  }, [toast])

  // Notify parent of pending annotation count
  useEffect(() => {
    onPendingChange?.(markers.length)
  }, [markers.length, onPendingChange])

  // Subscribe to SSE for resolved annotations — remove markers when agent resolves them
  useEffect(() => {
    const source = new EventSource(`${endpoint}/annotations/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'resolved' && data.id) {
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

    // Must be inside a frame
    const frameEl = el.closest('[data-frame-id]')
    if (!frameEl) {
      setHighlight(null)
      return
    }

    setHighlight(el.getBoundingClientRect())
  }, [mode])

  const handleClick = useCallback((e: React.PointerEvent) => {
    if (mode !== 'targeting') return
    const overlay = overlayRef.current
    if (!overlay) return

    overlay.style.pointerEvents = 'none'
    const el = document.elementFromPoint(e.clientX, e.clientY)
    overlay.style.pointerEvents = 'auto'

    if (!el) return

    const frameEl = el.closest('[data-frame-id]')
    if (!frameEl) return

    const frameId = frameEl.getAttribute('data-frame-id') ?? ''
    const frame = frames.find(f => f.id === frameId)
    const componentName = frame?.component?.displayName ?? frame?.component?.name ?? 'Unknown'
    const props = frame?.props ?? {}

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
  }, [mode, frames])

  const handleApply = useCallback(async () => {
    if (!target || !comment.trim()) return

    const body = {
      frameId: target.frameId,
      componentName: target.componentName,
      props: target.props,
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
      if (editingMarkerId !== null) {
        // Update existing marker
        setMarkers(prev => prev.map(m =>
          m.id === editingMarkerId
            ? { ...m, serverId, frameId: target.frameId, selector: target.selector, comment: comment.trim() }
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
        }])
      }
      if (annotateMode === 'watch') {
        setToast('Sent to agent')
      }
    } catch {
      setToast('Failed to send')
    }

    setMode('idle')
    setTarget(null)
    setComment('')
    setEditingMarkerId(null)
  }, [target, comment, endpoint, editingMarkerId, annotateMode])

  const handleCancel = useCallback(() => {
    setMode('idle')
    setTarget(null)
    setHighlight(null)
    setComment('')
    setEditingMarkerId(null)
  }, [])

  const handleDelete = useCallback(() => {
    if (editingMarkerId === null) return
    setMarkers(prev => prev.filter(m => m.id !== editingMarkerId))
    setMode('idle')
    setTarget(null)
    setComment('')
    setEditingMarkerId(null)
    setToast('Annotation deleted')
  }, [editingMarkerId])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && mode === 'commenting') {
      // Keyboard-initiated: instant dismiss (Emil: keyboard = no animation)
      card.dismiss()
      handleApply()
    }
  }, [handleApply, mode, card])

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

  // Click-outside to dismiss comment card
  useEffect(() => {
    if (mode !== 'commenting') return
    function handlePointerDown(e: MouseEvent) {
      const cardEl = card.ref.current
      if (cardEl && !cardEl.contains(e.target as Node)) {
        handleCancel()
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [mode, handleCancel, card.ref])

  // Use last-known target/toast for exit animation content
  const displayTarget = target || lastTargetRef.current
  const displayToast = toast || lastToastRef.current

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
            border: `2px solid ${ACCENT}`,
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 99999,
            transition: 'left 0.05s ease-out, top 0.05s ease-out, width 0.05s ease-out, height 0.05s ease-out',
          }}
        />
      )}

      {/* Comment card — spring enter/exit, positioned near target element */}
      {card.render && displayTarget && (() => {
        const cardWidth = 320
        const cardHeight = 220
        const gap = 8
        let top = displayTarget.rect.bottom + gap
        let left = displayTarget.rect.left
        if (top + cardHeight > window.innerHeight) {
          top = displayTarget.rect.top - cardHeight - gap
        }
        if (left + cardWidth > window.innerWidth - 16) {
          left = window.innerWidth - cardWidth - 16
        }
        if (left < 16) left = 16
        if (top < 16) top = 16
        return (
        <div
          ref={card.ref as React.RefObject<HTMLDivElement>}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            top,
            left,
            zIndex: 99999,
            background: SURFACE,
            borderRadius: RADIUS,
            padding: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
            border: `1px solid ${BORDER}`,
            width: 320,
            fontFamily: FONT,
            opacity: 0,
            transform: 'translateY(8px) scale(0.96)',
            willChange: 'opacity, transform',
          }}
        >
          {/* Header: component·tag + delete icon (when re-editing) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: TEXT_TERTIARY, letterSpacing: '0.02em' }}>
              {displayTarget.componentName} &middot; {displayTarget.elementTag}
            </div>
            {editingMarkerId !== null && (
              <HoverButton
                onClick={handleDelete}
                hoverBg="rgba(0,0,0,0.06)"
                title="Delete annotation"
                baseStyle={{
                  width: 24, height: 24, border: 'none', background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 4, color: TEXT_TERTIARY,
                }}
              >
                <Trash2 size={14} strokeWidth={1.5} />
              </HoverButton>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Describe the change..."
            style={{
              width: '100%',
              minHeight: 72,
              background: SURFACE_ALT,
              color: TEXT_PRIMARY,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              padding: 10,
              fontSize: 13,
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
            <HoverButton
              onClick={handleCancel}
              hoverBg="rgba(0,0,0,0.03)"
              baseStyle={{
                padding: '7px 14px',
                background: 'transparent',
                color: TEXT_SECONDARY,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: FONT,
              }}
            >
              Cancel
            </HoverButton>
            <HoverButton
              onClick={handleApply}
              hoverBg={comment.trim() ? ACCENT_HOVER : ''}
              baseStyle={{
                padding: '7px 14px',
                background: comment.trim() ? ACCENT : ACCENT_MUTED,
                color: comment.trim() ? '#fff' : TEXT_TERTIARY,
                border: 'none',
                borderRadius: 8,
                cursor: 'default',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: FONT,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {annotateMode === 'watch' ? (
                <>
                  Send
                  <Check size={14} strokeWidth={2} />
                </>
              ) : 'Apply'}
            </HoverButton>
          </div>
        </div>
        )
      })()}

      {/* FAB — spring enter/exit on mode change */}
      {fab.render && (
        <div
          ref={fab.ref as React.RefObject<HTMLDivElement>}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 99999,
            opacity: 0,
            transform: 'scale(0.8)',
            willChange: 'opacity, transform',
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
                ? ACCENT_PRESSED
                : `linear-gradient(180deg, ${ACCENT_LIFT} 0%, ${buttonState === 'hover' ? ACCENT_HOVER : ACCENT} 100%)`,
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: buttonState === 'pressed'
                ? 'inset 0 1px 2px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)'
                : buttonState === 'hover'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.06)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
              transform: buttonState === 'pressed' ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.1s ease, box-shadow 0.15s ease, background 0.1s ease',
            }}
          >
            <Pencil size={16} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Annotation markers — spring scale on placement */}
      {markers.map((marker) => {
        const rect = markerRects.get(marker.id)
        if (!rect) return null
        return (
          <MarkerDot
            key={marker.id}
            id={marker.id}
            comment={marker.comment}
            rect={rect}
            reducedMotion={reducedMotion}
            onClick={() => {
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
              const componentName = frame?.component?.displayName ?? frame?.component?.name ?? 'Unknown'
              setTarget({
                frameId: marker.frameId,
                componentName,
                props: frame?.props ?? {},
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

      {/* Toast — spring enter from below, fade exit */}
      {toastSpring.render && displayToast && (
        <div
          ref={toastSpring.ref as React.RefObject<HTMLDivElement>}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%) translateY(16px)',
            zIndex: 99999,
            padding: '8px 24px',
            background: TEXT_PRIMARY,
            color: '#fff',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FONT,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
            opacity: 0,
            willChange: 'opacity, transform',
          }}
        >
          {displayToast}
        </div>
      )}
    </>
  )
}
