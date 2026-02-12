import { useState, type CSSProperties } from 'react'

interface IterationSidebarProps {
  iterations: { name: string; pages: { name: string }[] }[]
  activeIterationIndex: number
  activePageIndex: number
  onSelect: (iterationIndex: number, pageIndex: number) => void
  collapsed: boolean
}

const BORDER = '#E5E7EB'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

/** Micro chevron — 8px, inline next to text */
function ChevronMicro({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="8" height="8" viewBox="0 0 8 8" fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.15s ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        color: TEXT_TERTIARY,
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
      borderRight: collapsed ? 'none' : `1px solid ${BORDER}`,
      backgroundColor: '#FAFAFA',
      padding: collapsed ? '4px 0' : '4px 4px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      transition: 'width 0.15s ease, padding 0.15s ease',
      overflow: 'hidden',
      flexShrink: 0,
      fontFamily: FONT,
    }}>
      <div style={{
        padding: '8px 8px 4px',
        fontSize: 10, fontWeight: 600, color: TEXT_TERTIARY,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Iterations
      </div>
      {iterations.map((iter, iterIdx) => {
        const expanded = expandedSet.has(iterIdx)
        return (
          <div key={iter.name} style={{
            borderTop: iterIdx > 0 ? `1px solid ${BORDER}` : 'none',
            marginTop: iterIdx > 0 ? 4 : 0,
            paddingTop: iterIdx > 0 ? 4 : 0,
          }}>
            <HoverRow
              onClick={() => toggleExpanded(iterIdx)}
              style={{
                padding: '0 8px', gap: 0,
                fontWeight: 500, fontSize: 12, color: '#374151',
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
            {expanded && iter.pages.map((page, pageIdx) => {
              const active = iterIdx === activeIterationIndex && pageIdx === activePageIndex
              return (
                <HoverRow
                  key={page.name}
                  active={active}
                  onClick={() => onSelect(iterIdx, pageIdx)}
                  style={{
                    padding: '0 8px 0 24px',
                    fontSize: 12,
                    fontWeight: active ? 500 : 400,
                    color: active ? '#1F2937' : '#6B7280',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {page.name}
                  </span>
                </HoverRow>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
