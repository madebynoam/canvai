import { useState, useRef, useEffect, useCallback } from 'react'
import { N, A, S, R, T, ICON, FONT, F, W } from '../tokens'
import { useSpring, SPRING } from '../spring'
import { CircleDot, Play, ChevronRight, X, Navigation } from 'lucide-react'

/* ─── Mock data ────────────────────────────────────────────── */

interface MockAnnotation {
  id: string
  comment: string
  componentName: string
  elementTag: string
  status: 'draft' | 'pending' | 'resolved'
}

const MOCK_ANNOTATIONS: MockAnnotation[] = [
  { id: '1', comment: 'Make the font size larger', componentName: 'Button', elementTag: 'button', status: 'draft' },
  { id: '2', comment: 'Add more padding around the icon', componentName: 'Card', elementTag: 'div', status: 'draft' },
  { id: '3', comment: 'Change the border color to match tokens', componentName: 'Input', elementTag: 'input', status: 'draft' },
  { id: '4', comment: 'Reduce the gap between label and value', componentName: 'TokenSwatch', elementTag: 'span', status: 'resolved' },
]

/* ─── AnnotationBadge — the clickable count in the TopBar ── */

function AnnotationBadge({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.sm,
        padding: `${S.xs}px ${S.md}px`,
        border: `1px solid ${count > 0 ? A.border : N.border}`,
        borderRadius: R.card,
        background: count > 0 ? A.muted : N.chromeSub,
        fontFamily: FONT,
        fontSize: T.caption,
        fontWeight: 500,
        color: count > 0 ? A.accent : N.txtTer,
        cursor: 'default',
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
      annotations
    </button>
  )
}

/* ─── AnnotationRow — single annotation in the dropdown ──── */

function AnnotationRow({
  annotation,
  onApply,
  onNavigate,
  showApply,
}: {
  annotation: MockAnnotation
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
        alignItems: 'center',
        gap: S.sm,
        padding: `${S.sm}px ${S.md}px`,
        borderRadius: R.control,
        background: hovered && !isResolved ? 'rgba(0,0,0,0.03)' : 'transparent',
        opacity: isResolved ? 0.4 : 1,
        cursor: 'default',
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
          textWrap: 'pretty',
        }}>
          {annotation.comment}
        </div>
        <div style={{
          fontSize: T.label,
          color: N.txtTer,
          marginTop: 2,
        }}>
          {annotation.componentName} &middot; {annotation.elementTag}
        </div>
      </div>

      {/* Actions — show on hover */}
      {hovered && !isResolved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, flexShrink: 0 }}>
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
            <Navigation size={ICON.sm} strokeWidth={1.5} />
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
              <Play size={ICON.sm} strokeWidth={1.5} fill="oklch(1 0 0)" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── AnnotationPanel — the dropdown ──────────────────────── */

function AnnotationPanel({
  annotations,
  open,
  onClose,
  onApplyAll,
  onApplyOne,
  onNavigate,
}: {
  annotations: MockAnnotation[]
  open: boolean
  onClose: () => void
  onApplyAll: () => void
  onApplyOne: (id: string) => void
  onNavigate: (id: string) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const spring = useSpring(SPRING.snappy)

  useEffect(() => {
    if (!panelRef.current) return
    const el = panelRef.current
    if (open) {
      el.style.display = 'block'
      spring.state.value = 0.96
      spring.state.velocity = 0
      spring.set(1, (v) => {
        el.style.transform = `scaleY(${v})`
        el.style.opacity = `${Math.max(0, (v - 0.96) / 0.04)}`
      })
    } else {
      spring.state.value = 1
      spring.state.velocity = 0
      spring.set(0.96, (v) => {
        el.style.transform = `scaleY(${v})`
        el.style.opacity = `${Math.max(0, (v - 0.96) / 0.04)}`
        if (v <= 0.961) el.style.display = 'none'
      })
    }
  }, [open])

  const drafts = annotations.filter(a => a.status === 'draft')
  const resolved = annotations.filter(a => a.status === 'resolved')

  return (
    <div
      ref={panelRef}
      style={{
        marginTop: S.xs,
        width: 320,
        marginLeft: 'auto',
        backgroundColor: N.chrome,
        border: `1px solid ${N.border}`,
        borderRadius: R.card,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        fontFamily: FONT,
        transformOrigin: 'top right',
        display: 'none',
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
        <button
          onClick={onClose}
          style={{
            width: S.xl,
            height: S.xl,
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
          <X size={ICON.md} strokeWidth={1.5} />
        </button>
      </div>

      {/* Draft annotations */}
      <div style={{ padding: S.xs, maxHeight: 280, overflowY: 'auto' }}>
        {drafts.length === 0 && resolved.length === 0 && (
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
            onApply={onApplyOne}
            onNavigate={onNavigate}
            showApply={true}
          />
        ))}

        {/* Resolved section */}
        {resolved.length > 0 && (
          <>
            <div style={{
              fontSize: T.label,
              color: N.txtTer,
              fontWeight: 500,
              padding: `${S.sm}px ${S.md}px`,
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
                onApply={onApplyOne}
                onNavigate={onNavigate}
                showApply={false}
              />
            ))}
          </>
        )}
      </div>

      {/* Footer — Apply All */}
      {drafts.length > 0 && (
        <div style={{
          padding: `${S.sm}px ${S.md}px`,
          borderTop: `1px solid ${N.borderSoft}`,
        }}>
          <button
            onClick={onApplyAll}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: S.sm,
              padding: `${S.sm}px ${S.md}px`,
              border: 'none',
              borderRadius: R.control,
              background: A.accent,
              color: 'oklch(1 0 0)',
              fontFamily: FONT,
              fontSize: T.body,
              fontWeight: 600,
              cursor: 'default',
            }}
          >
            <Play size={ICON.sm} strokeWidth={1.5} fill="oklch(1 0 0)" />
            Apply all ({drafts.length})
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── TopBar with Annotation Panel — assembled preview ────── */

function TopBarWithPanel() {
  const [open, setOpen] = useState(false)
  const [annotations, setAnnotations] = useState<MockAnnotation[]>(MOCK_ANNOTATIONS)
  const containerRef = useRef<HTMLDivElement>(null)

  const drafts = annotations.filter(a => a.status === 'draft')

  const handleApplyAll = useCallback(() => {
    setAnnotations(prev =>
      prev.map(a => a.status === 'draft' ? { ...a, status: 'pending' as const } : a)
    )
    // Simulate resolution after a beat
    setTimeout(() => {
      setAnnotations(prev =>
        prev.map(a => a.status === 'pending' ? { ...a, status: 'resolved' as const } : a)
      )
    }, 1500)
  }, [])

  const handleApplyOne = useCallback((id: string) => {
    setAnnotations(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'pending' as const } : a)
    )
    setTimeout(() => {
      setAnnotations(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a)
      )
    }, 1000)
  }, [])

  const handleNavigate = useCallback((id: string) => {
    // In real implementation: pan canvas to the annotated element
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} style={{ fontFamily: FONT }}>
      {/* Simulated TopBar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
      }}>
        <AnnotationBadge count={drafts.length} onClick={() => setOpen(!open)} />
      </div>
      {/* Panel below TopBar — in normal flow so it's not clipped */}
      <AnnotationPanel
        annotations={annotations}
        open={open}
        onClose={() => setOpen(false)}
        onApplyAll={handleApplyAll}
        onApplyOne={handleApplyOne}
        onNavigate={handleNavigate}
      />
    </div>
  )
}

/* ─── States showcase ──────────────────────────────────────── */

function EmptyState() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} style={{ fontFamily: FONT }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
      }}>
        <AnnotationBadge count={0} onClick={() => setOpen(!open)} />
      </div>
      <AnnotationPanel
        annotations={[]}
        open={open}
        onClose={() => setOpen(false)}
        onApplyAll={() => {}}
        onApplyOne={() => {}}
        onNavigate={() => {}}
      />
    </div>
  )
}

function AllResolvedState() {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const resolvedAnnotations: MockAnnotation[] = MOCK_ANNOTATIONS.map(a => ({ ...a, status: 'resolved' as const }))

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} style={{ fontFamily: FONT }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
      }}>
        <AnnotationBadge count={0} onClick={() => setOpen(!open)} />
      </div>
      <AnnotationPanel
        annotations={resolvedAnnotations}
        open={open}
        onClose={() => setOpen(false)}
        onApplyAll={() => {}}
        onApplyOne={() => {}}
        onNavigate={() => {}}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── Exports ──────────────────────────────────────────────── */

export function AnnotationPanelInteractive() {
  return <TopBarWithPanel />
}

export function AnnotationPanelEmpty() {
  return <EmptyState />
}

export function AnnotationPanelResolved() {
  return <AllResolvedState />
}
