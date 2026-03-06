import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { N, A, S, R, T, ICON, FONT } from '../tokens'

interface PreviewProjectPickerProps {
  projects: { project: string }[]
  activeIndex: number
  onSelect: (index: number) => void
  forceOpen?: boolean
}

function PickerRow({ project, active, onClick }: {
  project: string
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', width: '100%',
        gap: S.sm, padding: `${S.sm}px`,
        border: 'none', borderRadius: R.control,
        backgroundColor: active ? 'rgba(0,0,0,0.06)' : hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
        fontFamily: FONT, textAlign: 'left',
        fontSize: T.title, color: N.txtPri,
        cursor: 'default',
        transition: 'background-color 0.1s ease',
      }}
    >
      <div style={{
        width: S.xl, height: S.xl, borderRadius: '50%',
        backgroundColor: active ? A.accent : N.border,
        color: active ? 'oklch(1 0 0)' : N.txtSec,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: T.pill, fontWeight: 600, flexShrink: 0,
      }}>
        {project.charAt(0).toUpperCase()}
      </div>
      <span style={{ flex: 1 }}>{project}</span>
      {active && <Check size={ICON.md} strokeWidth={1.5} color={A.accent} />}
    </button>
  )
}

export function PreviewProjectPicker({ projects, activeIndex, onSelect, forceOpen = false }: PreviewProjectPickerProps) {
  const [open, setOpen] = useState(forceOpen)
  const [triggerHovered, setTriggerHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || forceOpen) return
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
  }, [open, forceOpen])

  const active = projects[activeIndex]
  if (!active) return null

  return (
    <div ref={containerRef} style={{ position: 'relative', fontFamily: FONT }}>
      <button
        onClick={() => !forceOpen && setOpen(o => !o)}
        onMouseEnter={() => setTriggerHovered(true)}
        onMouseLeave={() => setTriggerHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: S.sm,
          padding: `${S.xs}px ${S.sm}px`,
          background: triggerHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
          border: 'none', borderRadius: R.control,
          fontFamily: FONT, cursor: 'default',
          transition: 'background-color 0.1s ease',
        }}
      >
        <div style={{
          width: S.xl, height: S.xl, borderRadius: '50%',
          backgroundColor: A.accent, color: 'oklch(1 0 0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: T.pill, fontWeight: 600, flexShrink: 0,
        }}>
          {active.project.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: T.title, fontWeight: 500, color: N.txtPri }}>
          {active.project}
        </span>
        <ChevronDown size={ICON.sm} strokeWidth={1.5} color={N.txtTer} style={{ flexShrink: 0 }} />
      </button>

      <div style={{
        position: 'absolute', top: '100%', left: 0,
        marginTop: S.xs, width: 220,
        background: N.card, borderRadius: R.card,
        border: `1px solid ${N.border}`,
        boxShadow: `0 ${S.xs}px ${S.lg}px rgba(0, 0, 0, 0.08), 0 1px ${S.xs}px rgba(0, 0, 0, 0.04)`,
        padding: S.xs, zIndex: 100,
        transformOrigin: 'top left',
        transform: open ? 'scale(1) translateY(0)' : `scale(0.92) translateY(-${S.xs}px)`,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'transform 0.15s ease, opacity 0.15s ease',
      }}>
        {projects.map((p, i) => (
          <PickerRow
            key={p.project}
            project={p.project}
            active={i === activeIndex}
            onClick={() => { onSelect(i); if (!forceOpen) setOpen(false) }}
          />
        ))}
      </div>
    </div>
  )
}
