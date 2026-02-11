import { useState, useRef, useCallback, useEffect } from 'react'
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

interface AnnotationOverlayProps {
  endpoint: string
  frames: CanvasFrame[]
}

// Design tokens — Braun/Ive aesthetic with orange accent
const ACCENT = '#E8590C'
const ACCENT_MUTED = 'rgba(232, 89, 12, 0.15)'
const ACCENT_SHADOW = 'rgba(232, 89, 12, 0.25)'
const SURFACE = '#FFFFFF'
const SURFACE_ALT = '#F9FAFB'
const BORDER = '#E5E7EB'
const TEXT_PRIMARY = '#1F2937'
const TEXT_SECONDARY = '#6B7280'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const RADIUS = 10

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

export function AnnotationOverlay({ endpoint, frames }: AnnotationOverlayProps) {
  const [mode, setMode] = useState<Mode>('idle')
  const [highlight, setHighlight] = useState<DOMRect | null>(null)
  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [comment, setComment] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
      await fetch(`${endpoint}/annotations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setToast('Sent to agent')
    } catch {
      setToast('Failed to send')
    }

    setMode('idle')
    setTarget(null)
    setComment('')
  }, [target, comment, endpoint])

  const handleCancel = useCallback(() => {
    setMode('idle')
    setTarget(null)
    setHighlight(null)
    setComment('')
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && mode === 'commenting') {
      handleApply()
    }
  }, [handleCancel, handleApply, mode])

  return (
    <>
      {/* Targeting overlay — captures all pointer events */}
      {mode === 'targeting' && (
        <div
          ref={overlayRef}
          onPointerMove={handlePointerMove}
          onPointerDown={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
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
            transition: 'all 0.05s ease-out',
          }}
        />
      )}

      {/* Comment popup */}
      {mode === 'commenting' && target && (
        <div
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            left: Math.min(target.rect.left, window.innerWidth - 340),
            top: Math.min(target.rect.bottom + 8, window.innerHeight - 200),
            zIndex: 99999,
            background: SURFACE,
            borderRadius: RADIUS,
            padding: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
            border: `1px solid ${BORDER}`,
            width: 320,
            fontFamily: FONT,
          }}
        >
          <div style={{ fontSize: 11, color: TEXT_TERTIARY, marginBottom: 8, letterSpacing: '0.02em' }}>
            {target.componentName} &middot; {target.elementTag}
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
            <button
              onClick={handleCancel}
              style={{
                padding: '7px 14px',
                background: 'transparent',
                color: TEXT_SECONDARY,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: FONT,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!comment.trim()}
              style={{
                padding: '7px 14px',
                background: comment.trim() ? ACCENT : ACCENT_MUTED,
                color: comment.trim() ? '#fff' : TEXT_TERTIARY,
                border: 'none',
                borderRadius: 8,
                cursor: comment.trim() ? 'pointer' : 'default',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: FONT,
              }}
            >
              Apply
            </button>
          </div>
          <div style={{ fontSize: 10, color: TEXT_TERTIARY, marginTop: 8 }}>
            Cmd+Enter to apply &middot; Esc to cancel
          </div>
        </div>
      )}

      {/* Annotate button */}
      {mode === 'idle' && (
        <button
          onClick={() => setMode('targeting')}
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            padding: '8px 24px',
            background: ACCENT,
            color: '#fff',
            border: 'none',
            borderRadius: 20,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: '0.01em',
            fontFamily: FONT,
            boxShadow: `0 2px 12px ${ACCENT_SHADOW}`,
          }}
        >
          Annotate
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            padding: '8px 24px',
            background: TEXT_PRIMARY,
            color: '#fff',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: FONT,
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
          }}
        >
          {toast}
        </div>
      )}
    </>
  )
}
