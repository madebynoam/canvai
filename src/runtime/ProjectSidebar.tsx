import { useState, type CSSProperties } from 'react'

interface ProjectSidebarProps {
  projects: { project: string }[]
  activeIndex: number
  onSelect: (index: number) => void
}

const styles = {
  container: (collapsed: boolean) => ({
    width: collapsed ? 40 : 200,
    borderRight: '1px solid #e5e7eb',
    backgroundColor: '#fafafa',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    transition: 'width 0.15s ease',
    overflow: 'hidden',
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
    color: '#9ca3af',
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
    color: '#9ca3af',
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
    fontSize: 13,
    padding: '6px 8px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    backgroundColor: active ? '#e5e7eb' : 'transparent',
    color: active ? '#111827' : '#374151',
    fontWeight: active ? 500 : 400,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'background-color 0.1s ease',
  }) satisfies CSSProperties,
}

export function ProjectSidebar({ projects, activeIndex, onSelect }: ProjectSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (projects.length === 0) return null

  return (
    <div style={styles.container(collapsed)}>
      <div style={styles.header}>
        {!collapsed && <span style={styles.title}>Projects</span>}
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
          {projects.map((p, i) => (
            <button
              key={p.project}
              style={styles.item(i === activeIndex)}
              onClick={() => onSelect(i)}
            >
              {p.project}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
