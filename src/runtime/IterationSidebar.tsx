import { useState, type CSSProperties } from 'react'

interface IterationSidebarProps {
  iterationName: string
  pages: { name: string }[]
  activePageIndex: number
  onSelectPage: (pageIndex: number) => void
  collapsed: boolean
}

const BORDER = '#E5E7EB'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

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

export function IterationSidebar({ iterationName, pages, activePageIndex, onSelectPage, collapsed }: IterationSidebarProps) {
  if (pages.length === 0) return null

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
      {/* Iteration name — read-only label (switching happens via pills in TopBar) */}
      <div style={{
        padding: '8px 8px 4px',
        fontSize: 12, fontWeight: 500, color: '#374151',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {iterationName}
      </div>

      {/* Flat page list */}
      {pages.map((page, pageIdx) => {
        const active = pageIdx === activePageIndex
        return (
          <HoverRow
            key={page.name}
            active={active}
            onClick={() => onSelectPage(pageIdx)}
            style={{
              padding: '0 8px 0 16px',
              fontSize: 12,
              fontWeight: 400,
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
}
