import { useState, useRef, useEffect, useCallback } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { N, A, F, S, R, T, ICON, FONT } from './tokens'
import { Wand2, Crosshair, Loader2 } from 'lucide-react'

/* ─── Types ───────────────────────────────────────────── */

interface Annotation {
  id: string
  comment: string
  componentName: string
  elementTag: string
  frameId: string
  selector: string
  status: 'draft' | 'pending' | 'resolved'
}

/* ─── useDropdownSpring ───────────────────────────────── */

function useDropdownSpring(open: boolean, reducedMotion: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef({ value: 0, velocity: 0 })

  const animate = useCallback((target: number) => {
    cancelAnimationFrame(animRef.current)

    if (reducedMotion) {
      stateRef.current = { value: target, velocity: 0 }
      if (ref.current) {
        ref.current.style.transform = target === 1 ? 'scale(1) translateY(0)' : `scale(0.92) translateY(-${S.xs}px)`
        ref.current.style.opacity = `${target}`
      }
      return
    }

    const tension = 233
    const friction = 21
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      const s = stateRef.current
      while (accum >= DT) {
        const spring = -tension * (s.value - target)
        const damp = -friction * s.velocity
        s.velocity += (spring + damp) * DT
        s.value += s.velocity * DT
        accum -= DT
      }
      if (ref.current) {
        const v = Math.max(0, Math.min(1, s.value))
        const scale = 0.92 + 0.08 * v
        const ty = (1 - v) * -S.xs
        ref.current.style.transform = `scale(${scale}) translateY(${ty}px)`
        ref.current.style.opacity = `${v}`
      }
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        animRef.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        if (ref.current) {
          const scale = 0.92 + 0.08 * target
          ref.current.style.transform = `scale(${scale}) translateY(${target === 1 ? 0 : -S.xs}px)`
          ref.current.style.opacity = `${target}`
        }
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [reducedMotion])

  useEffect(() => {
    animate(open ? 1 : 0)
    return () => cancelAnimationFrame(animRef.current)
  }, [open, animate])

  return ref
}

/* ─── AnnotationBadge ─────────────────────────────────── */

function AnnotationBadge({ count, onClick }: { count: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.sm,
        padding: `${S.xs}px ${S.sm}px`,
        border: 'none',
        borderRadius: R.control,
        background: hovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        fontFamily: FONT,
        fontSize: T.caption,
        fontWeight: 500,
        color: count > 0 ? A.accent : N.txtTer,
        cursor: 'default',
        transition: 'background-color 0.1s ease',
      }}
    >
      <div
        style={{
          width: S.lg,
          height: S.lg,
          borderRadius: '50%',
          backgroundColor: count > 0 ? A.accent : N.txtFaint,
          color: 'oklch(1 0 0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: T.label,
          fontWeight: 600,
        }}
      >
        {count}
      </div>
      <span style={{ fontSize: T.caption, color: count > 0 ? A.accent : N.txtTer }}>
        annotations
      </span>
    </button>
  )
}

/* ─── AnnotationRow ───────────────────────────────────── */

function AnnotationRow({
  annotation,
  onApply,
  onNavigate,
  showApply,
}: {
  annotation: Annotation
  onApply: (id: string) => void
  onNavigate: (id: string) => void
  showApply: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const isResolved = annotation.status === 'resolved'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S.sm,
        padding: `${S.sm}px ${S.sm}px`,
        borderRadius: R.control,
        backgroundColor: hovered && !isResolved ? 'rgba(0,0,0,0.03)' : 'transparent',
        opacity: isResolved ? 0.4 : 1,
        cursor: 'default',
        transition: 'background-color 0.1s ease',
      }}
    >
      {/* Marker dot */}
      <div
        style={{
          width: S.lg,
          height: S.lg,
          borderRadius: '50%',
          backgroundColor: isResolved ? N.txtFaint : F.marker,
          color: 'oklch(1 0 0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: T.label,
          fontWeight: 600,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {annotation.id}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: T.body,
          color: N.txtPri,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {annotation.comment}
        </div>
        <div style={{ fontSize: T.label, color: N.txtTer, marginTop: 2 }}>
          {annotation.componentName} &middot; {annotation.elementTag}
        </div>
      </div>

      {/* Actions — show on hover */}
      {hovered && !isResolved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, flexShrink: 0, marginTop: 2 }}>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate(annotation.id) }}
            title="Navigate to element"
            style={{
              width: S.xxl,
              height: S.xxl,
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: N.txtTer,
              borderRadius: R.control,
              cursor: 'default',
            }}
          >
            <Crosshair size={ICON.sm} strokeWidth={1.5} />
          </button>
          {showApply && (
            <button
              onClick={(e) => { e.stopPropagation(); onApply(annotation.id) }}
              title="Apply this annotation"
              style={{
                width: S.xxl,
                height: S.xxl,
                border: 'none',
                background: A.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'oklch(1 0 0)',
                borderRadius: R.control,
                cursor: 'default',
              }}
            >
              <Wand2 size={ICON.sm} strokeWidth={1.5} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── PendingRow ─────────────────────────────────────── */

function PendingRow({ annotation }: { annotation: Annotation }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: S.sm,
        padding: `${S.sm}px ${S.sm}px`,
        borderRadius: R.control,
        opacity: 0.6,
        cursor: 'default',
      }}
    >
      {/* Spinner replacing the marker dot */}
      <div
        style={{
          width: S.lg,
          height: S.lg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: 2,
          color: F.marker,
          animation: 'canvai-spin 1s linear infinite',
        }}
      >
        <Loader2 size={ICON.sm} strokeWidth={2} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: T.body,
          color: N.txtSec,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {annotation.comment}
        </div>
        <div style={{ fontSize: T.label, color: N.txtTer, marginTop: 2 }}>
          Applying&hellip;
        </div>
      </div>
    </div>
  )
}

/* ─── useAnnotationPanel hook ─────────────────────────── */

function useAnnotationPanel(endpoint: string) {
  const [open, setOpen] = useState(false)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const drafts = annotations.filter(a => a.status === 'draft')
  const pending = annotations.filter(a => a.status === 'pending')

  // Fetch annotations on mount + poll every 3s
  useEffect(() => {
    let active = true
    function fetchAnnotations() {
      fetch(`${endpoint}/annotations`)
        .then(r => r.json())
        .then((data: Annotation[]) => { if (active) setAnnotations(data) })
        .catch(() => {})
    }
    fetchAnnotations()
    const interval = setInterval(fetchAnnotations, 3000)
    return () => { active = false; clearInterval(interval) }
  }, [endpoint])

  // Subscribe to SSE for resolved + applied events
  useEffect(() => {
    const source = new EventSource(`${endpoint}/annotations/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'resolved' && data.id) {
          setAnnotations(prev => prev.map(a =>
            a.id === data.id ? { ...a, status: 'resolved' as const } : a
          ))
        }
        if (data.type === 'applied' && data.id) {
          setAnnotations(prev => prev.map(a =>
            a.id === data.id ? { ...a, status: 'pending' as const } : a
          ))
        }
        if (data.type === 'applied-all' && data.ids) {
          const ids = new Set(data.ids)
          setAnnotations(prev => prev.map(a =>
            ids.has(a.id) ? { ...a, status: 'pending' as const } : a
          ))
        }
      } catch { /* ignore */ }
    }
    return () => source.close()
  }, [endpoint])

  const handleApplyAll = useCallback(() => {
    fetch(`${endpoint}/annotations/apply`, { method: 'POST' }).catch(() => {})
  }, [endpoint])

  const handleApplyOne = useCallback((id: string) => {
    fetch(`${endpoint}/annotations/${id}/apply`, { method: 'POST' }).catch(() => {})
  }, [endpoint])

  const handleNavigate = useCallback((id: string) => {
    const annotation = annotations.find(a => a.id === id)
    if (!annotation) return
    const frameEl = document.querySelector(`[data-frame-id="${annotation.frameId}"]`)
    if (!frameEl) return
    const contentEl = frameEl.hasAttribute('data-frame-content') ? frameEl : frameEl.querySelector('[data-frame-content]')
    if (!contentEl) return
    try {
      const el = contentEl.querySelector(annotation.selector) ?? contentEl
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } catch { /* selector may not match */ }
  }, [annotations])

  // Click-outside + Escape to close
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return { open, setOpen, annotations, drafts, pending, containerRef, handleApplyAll, handleApplyOne, handleNavigate }
}

/* ─── AnnotationPanelWidget ───────────────────────────── */

export function AnnotationPanelWidget({ endpoint }: { endpoint: string }) {
  const reducedMotion = useReducedMotion()
  const { open, setOpen, annotations, drafts, pending, containerRef, handleApplyAll, handleApplyOne, handleNavigate } = useAnnotationPanel(endpoint)
  const dropdownRef = useDropdownSpring(open, reducedMotion)

  const resolved = annotations.filter(a => a.status === 'resolved')

  return (
    <div ref={containerRef} style={{ position: 'relative', fontFamily: FONT }}>
      <style>{`@keyframes canvai-spin { to { transform: rotate(360deg) } }`}</style>
      <AnnotationBadge count={drafts.length + pending.length} onClick={() => setOpen(o => !o)} />

      {/* Dropdown — always rendered, spring drives visibility */}
      <div
        ref={dropdownRef}
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: S.xs,
          width: 280,
          background: N.card,
          borderRadius: R.card,
          border: `1px solid ${N.border}`,
          boxShadow: `0 ${S.xs}px ${S.lg}px rgba(0, 0, 0, 0.08), 0 1px ${S.xs}px rgba(0, 0, 0, 0.04)`,
          padding: 0,
          zIndex: 100,
          transformOrigin: 'top right',
          transform: `scale(0.92) translateY(-${S.xs}px)`,
          opacity: 0,
          pointerEvents: open ? 'auto' : 'none',
          fontFamily: FONT,
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${S.sm}px ${S.md}px`,
          borderBottom: `1px solid ${N.borderSoft}`,
        }}>
          <span style={{ fontSize: T.body, fontWeight: 600, color: N.txtPri }}>
            Annotations
          </span>
        </div>

        {/* List */}
        <div style={{ padding: S.xs, maxHeight: 240, overflowY: 'auto' }}>
          {drafts.length === 0 && pending.length === 0 && resolved.length === 0 && (
            <div style={{
              padding: `${S.xl}px ${S.md}px`,
              textAlign: 'center',
              fontSize: T.caption,
              color: N.txtTer,
              textWrap: 'pretty',
            }}>
              No annotations yet. Use the annotation tool to mark up elements.
            </div>
          )}

          {drafts.map(a => (
            <AnnotationRow
              key={a.id}
              annotation={a}
              onApply={handleApplyOne}
              onNavigate={handleNavigate}
              showApply={true}
            />
          ))}

          {pending.map(a => (
            <PendingRow key={a.id} annotation={a} />
          ))}

          {resolved.length > 0 && (
            <>
              <div style={{
                fontSize: T.label,
                color: N.txtTer,
                fontWeight: 500,
                padding: `${S.sm}px ${S.sm}px`,
                marginTop: drafts.length > 0 ? S.xs : 0,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
                Resolved
              </div>
              {resolved.map(a => (
                <AnnotationRow
                  key={a.id}
                  annotation={a}
                  onApply={handleApplyOne}
                  onNavigate={handleNavigate}
                  showApply={false}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer — Apply All */}
        {drafts.length > 0 && (
          <div style={{
            padding: `${S.sm}px ${S.sm}px`,
            borderTop: `1px solid ${N.borderSoft}`,
          }}>
            <button
              onClick={handleApplyAll}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: S.sm,
                padding: `${S.sm}px ${S.md}px`,
                border: 'none',
                borderRadius: R.card,
                background: A.accent,
                color: 'oklch(1 0 0)',
                fontFamily: FONT,
                fontSize: T.body,
                fontWeight: 600,
                cursor: 'default',
              }}
            >
              <Wand2 size={ICON.sm} strokeWidth={1.5} />
              Apply all ({drafts.length})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
