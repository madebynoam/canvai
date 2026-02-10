import type { CSSProperties } from 'react'

interface PageTabsProps {
  pages: { name: string }[]
  activeIndex: number
  onSelect: (index: number) => void
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: 2,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  } satisfies CSSProperties,
  tab: (active: boolean) => ({
    fontSize: 12,
    fontWeight: active ? 500 : 400,
    padding: '4px 12px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    backgroundColor: active ? '#fff' : 'transparent',
    color: active ? '#111827' : '#6b7280',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
    whiteSpace: 'nowrap',
    transition: 'all 0.1s ease',
    lineHeight: '20px',
  }) satisfies CSSProperties,
}

export function PageTabs({ pages, activeIndex, onSelect }: PageTabsProps) {
  if (pages.length <= 1) return null

  return (
    <div style={styles.container}>
      {pages.map((page, i) => (
        <button
          key={page.name}
          onClick={() => onSelect(i)}
          style={styles.tab(i === activeIndex)}
        >
          {page.name}
        </button>
      ))}
    </div>
  )
}
