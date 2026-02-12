import { useState, type CSSProperties } from 'react'

interface IterationSidebarProps {
  iterations: { name: string; pages: { name: string }[] }[]
  activeIterationIndex: number
  activePageIndex: number
  onSelect: (iterationIndex: number, pageIndex: number) => void
}

const BORDER = '#E5E7EB'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const styles = {
  container: (collapsed: boolean) => ({
    width: collapsed ? 40 : 200,
    borderRight: `1px solid ${BORDER}`,
    backgroundColor: '#FAFAFA',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition: 'width 0.15s ease',
    overflow: 'hidden',
    fontFamily: FONT,
  }) satisfies CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 12px 8px',
    flexShrink: 0,
  } satisfies CSSProperties,
  title: {
    fontSize: 11,
    fontWeight: 600,
    color: TEXT_TERTIARY,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  } satisfies CSSProperties,
  toggleBtn: {
    width: 24,
    height: 24,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: TEXT_TERTIARY,
    borderRadius: 4,
    flexShrink: 0,
  } satisfies CSSProperties,
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '0 8px',
    overflow: 'auto',
    flex: 1,
  } satisfies CSSProperties,
  iterationHeader: (expanded: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 8px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    fontWeight: 600,
    fontSize: 12,
    color: '#374151',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: FONT,
    marginTop: 4,
  }) satisfies CSSProperties,
  chevron: (expanded: boolean) => ({
    width: 12,
    height: 12,
    flexShrink: 0,
    transition: 'transform 0.15s ease',
    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    color: TEXT_TERTIARY,
  }),
  pageItem: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '4px 8px 4px 26px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    fontWeight: active ? 500 : 400,
    fontSize: 13,
    color: active ? '#1F2937' : '#9CA3AF',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'color 0.1s ease',
    fontFamily: FONT,
  }) satisfies CSSProperties,
}

export function IterationSidebar({ iterations, activeIterationIndex, activePageIndex, onSelect }: IterationSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
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
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const isExpanded = (index: number) => expandedSet.has(index)

  return (
    <div style={styles.container(collapsed)}>
      <div style={styles.header}>
        {!collapsed && <span style={styles.title}>Iterations</span>}
        <button
          style={styles.toggleBtn}
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            {collapsed ? (
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>
      {!collapsed && (
        <div style={styles.list}>
          {iterations.map((iter, iterIdx) => {
            const expanded = isExpanded(iterIdx)
            return (
              <div key={iter.name}>
                <button
                  style={styles.iterationHeader(expanded)}
                  onClick={() => toggleExpanded(iterIdx)}
                >
                  <svg style={styles.chevron(expanded)} viewBox="0 0 12 12" fill="none">
                    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {iter.name}
                  </span>
                </button>
                {expanded && iter.pages.map((page, pageIdx) => (
                  <button
                    key={page.name}
                    style={styles.pageItem(iterIdx === activeIterationIndex && pageIdx === activePageIndex)}
                    onClick={() => onSelect(iterIdx, pageIdx)}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {page.name}
                    </span>
                  </button>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
