import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { N, FONT } from './tokens'

interface IterationSidebarProps {
  iterations: { name: string; pages: { name: string }[] }[]
  activeIterationIndex: number
  activePageIndex: number
  onSelect: (iterationIndex: number, pageIndex: number) => void
  collapsed: boolean
}

/* Gentle spring for page list reveal — animates container height */
function useHeightSpring(expanded: boolean, reducedMotion: boolean) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef({ value: 0, velocity: 0 })

  const animate = useCallback((target: number) => {
    cancelAnimationFrame(animRef.current)

    // Reduced motion: snap to target
    if (reducedMotion) {
      stateRef.current = { value: target, velocity: 0 }
      if (outerRef.current) {
        outerRef.current.style.height = target === 1 ? 'auto' : '0px'
        outerRef.current.style.opacity = `${target}`
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
      if (outerRef.current && innerRef.current) {
        const contentH = innerRef.current.scrollHeight
        const h = Math.max(0, s.value) * contentH
        outerRef.current.style.height = `${h}px`
        outerRef.current.style.opacity = `${Math.max(0, Math.min(1, s.value))}`
      }
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        animRef.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        if (outerRef.current && innerRef.current) {
          if (target === 1) {
            outerRef.current.style.height = 'auto'
          } else {
            outerRef.current.style.height = '0px'
          }
          outerRef.current.style.opacity = `${target}`
        }
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [reducedMotion])

  useEffect(() => {
    animate(expanded ? 1 : 0)
    return () => cancelAnimationFrame(animRef.current)
  }, [expanded, animate])

  return { outerRef, innerRef }
}

/** Spring-animated expandable wrapper for page lists */
function ExpandablePages({ expanded, children, reducedMotion }: { expanded: boolean; children: React.ReactNode; reducedMotion: boolean }) {
  const { outerRef, innerRef } = useHeightSpring(expanded, reducedMotion)

  return (
    <div ref={outerRef} style={{ overflow: 'hidden', height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}>
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  )
}

/** Micro chevron — 8px, inline next to text */
function ChevronMicro({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="8" height="8" viewBox="0 0 8 8" fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.15s ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        color: N.txtTer,
      }}
    >
      <path d="M2.5 1.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
        minHeight: 28,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function IterationSidebar({ iterations, activeIterationIndex, activePageIndex, onSelect, collapsed }: IterationSidebarProps) {
  const reducedMotion = useReducedMotion()
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([activeIterationIndex]))

  // Auto-expand when the active iteration changes
  const prevActiveRef = useState({ current: activeIterationIndex })[0]
  if (prevActiveRef.current !== activeIterationIndex) {
    prevActiveRef.current = activeIterationIndex
    if (!expandedSet.has(activeIterationIndex)) {
      setExpandedSet(prev => new Set(prev).add(activeIterationIndex))
    }
  }

  if (iterations.length === 0) return null

  const toggleExpanded = (index: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index); else next.add(index)
      return next
    })
  }

  return (
    <div style={{
      width: collapsed ? 0 : 184,
      borderRight: collapsed ? 'none' : `1px solid ${N.border}`,
      backgroundColor: N.chrome,
      padding: collapsed ? '4px 0' : '4px 4px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      transition: 'width 0.15s ease, padding 0.15s ease',
      overflowX: 'hidden',
      overflowY: 'auto',
      scrollbarWidth: 'none' as any,
      flexShrink: 0,
      fontFamily: FONT,
    }}>
      <div style={{
        padding: '8px 8px 4px',
        fontSize: 10, fontWeight: 600, color: N.txtTer,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Iterations
      </div>
      {iterations.map((iter, iterIdx) => {
        const expanded = expandedSet.has(iterIdx)
        return (
          <div key={iter.name} style={{
            borderTop: iterIdx > 0 ? `1px solid ${N.border}` : 'none',
            marginTop: iterIdx > 0 ? 4 : 0,
            paddingTop: iterIdx > 0 ? 4 : 0,
          }}>
            <HoverRow
              onClick={() => toggleExpanded(iterIdx)}
              style={{
                padding: '0 8px', gap: 0,
                fontWeight: 500, fontSize: 12, color: N.txtPri,
              }}
            >
              <span style={{
                whiteSpace: 'nowrap', display: 'inline-flex',
                alignItems: 'center', gap: 4,
                overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {iter.name}
                <ChevronMicro expanded={expanded} />
              </span>
            </HoverRow>
            <ExpandablePages expanded={expanded} reducedMotion={reducedMotion}>
              {iter.pages.map((page, pageIdx) => {
                const active = iterIdx === activeIterationIndex && pageIdx === activePageIndex
                return (
                  <HoverRow
                    key={page.name}
                    active={active}
                    onClick={() => onSelect(iterIdx, pageIdx)}
                    style={{
                      padding: '0 8px 0 24px',
                      fontSize: 12,
                      fontWeight: 400,
                      color: active ? N.txtPri : N.txtSec,
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {page.name}
                    </span>
                  </HoverRow>
                )
              })}
            </ExpandablePages>
          </div>
        )
      })}
    </div>
  )
}
