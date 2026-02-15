import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { useReducedMotion } from './useReducedMotion'

interface ProjectPickerProps {
  projects: { project: string }[]
  activeIndex: number
  onSelect: (index: number) => void
}

const ACCENT = '#E8590C'
const SURFACE = '#FFFFFF'
const BORDER = '#E5E7EB'
const TEXT_PRIMARY = '#1F2937'
const TEXT_SECONDARY = '#6B7280'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

/* Snappy spring for dropdown reveal — scale + opacity + translateY */
function useDropdownSpring(open: boolean, reducedMotion: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef({ value: 0, velocity: 0 })

  const animate = useCallback((target: number) => {
    cancelAnimationFrame(animRef.current)

    // Reduced motion: snap to target
    if (reducedMotion) {
      stateRef.current = { value: target, velocity: 0 }
      if (ref.current) {
        ref.current.style.transform = target === 1 ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(-4px)'
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
        const ty = (1 - v) * -4
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
          ref.current.style.transform = `scale(${scale}) translateY(${target === 1 ? 0 : -4}px)`
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

/** Row with subtle hover bg and optional active highlight */
function HoverRow({ children, active, onClick, style }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  style?: CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  const bg = active
    ? 'rgba(0, 0, 0, 0.06)'
    : hovered
      ? 'rgba(0, 0, 0, 0.03)'
      : 'transparent'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', width: '100%',
        border: 'none', borderRadius: 4,
        backgroundColor: bg,
        fontFamily: FONT, textAlign: 'left',
        transition: 'background-color 0.1s ease',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function ProjectPicker({ projects, activeIndex, onSelect }: ProjectPickerProps) {
  const reducedMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [triggerHovered, setTriggerHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useDropdownSpring(open, reducedMotion)

  // Click-outside + Escape to close
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const active = projects[activeIndex]
  if (!active) return null

  return (
    <div ref={containerRef} style={{ position: 'relative', fontFamily: FONT }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setTriggerHovered(true)}
        onMouseLeave={() => setTriggerHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 8px',
          background: triggerHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
          border: 'none',
          borderRadius: 4,
          fontFamily: FONT,
          transition: 'background-color 0.1s ease',
        }}
      >
        {/* Orange square with first letter */}
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: ACCENT,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {active.project.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: TEXT_PRIMARY }}>
          {active.project}
        </span>
        {/* Chevron */}
        <ChevronDown size={12} strokeWidth={1.5} color="#9CA3AF" style={{ flexShrink: 0 }} />
      </button>

      {/* Dropdown — always rendered, spring drives scaleY + opacity */}
      <div
        ref={dropdownRef}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 4,
          width: 220,
          background: SURFACE,
          borderRadius: 8,
          border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
          padding: 4,
          zIndex: 100,
          transformOrigin: 'top left',
          transform: 'scale(0.92) translateY(-4px)',
          opacity: 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        {projects.map((p, i) => (
          <HoverRow
            key={p.project}
            active={i === activeIndex}
            onClick={() => {
              onSelect(i)
              setOpen(false)
            }}
            style={{
              gap: 8,
              padding: '8px 8px',
              fontSize: 13,
              color: TEXT_PRIMARY,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                backgroundColor: i === activeIndex ? ACCENT : BORDER,
                color: i === activeIndex ? '#fff' : TEXT_SECONDARY,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {p.project.charAt(0).toUpperCase()}
            </div>
            <span style={{ flex: 1, textAlign: 'left' }}>{p.project}</span>
            {i === activeIndex && (
              <Check size={14} strokeWidth={1.5} color={ACCENT} />
            )}
          </HoverRow>
        ))}
      </div>
    </div>
  )
}
