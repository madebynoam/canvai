import { useState, type CSSProperties } from 'react'

interface IterationSidebarProps {
  iterations: { name: string }[]
  activeIndex: number
  onSelect: (index: number) => void
}

const ACCENT = '#E8590C'
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
  item: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 8px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    backgroundColor: active ? BORDER : 'transparent',
    fontWeight: active ? 500 : 400,
    fontSize: 13,
    color: active ? '#1F2937' : '#374151',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'background-color 0.1s ease',
    fontFamily: FONT,
  }) satisfies CSSProperties,
  circle: (active: boolean) => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: active ? ACCENT : BORDER,
    color: active ? '#fff' : TEXT_TERTIARY,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    flexShrink: 0,
  }) satisfies CSSProperties,
}

export function IterationSidebar({ iterations, activeIndex, onSelect }: IterationSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (iterations.length === 0) return null

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
          {iterations.map((iter, i) => (
            <button
              key={iter.name}
              style={styles.item(i === activeIndex)}
              onClick={() => onSelect(i)}
            >
              <div style={styles.circle(i === activeIndex)}>
                {i + 1}
              </div>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {iter.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
