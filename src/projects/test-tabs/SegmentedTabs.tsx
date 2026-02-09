import { useState, type CSSProperties } from 'react'

interface SegmentedTabsProps {
  tabs: string[]
  activeIndex?: number
  size?: 'small' | 'medium' | 'large'
  variant?: 'filled' | 'outline'
  disabled?: boolean
}

const colors = {
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
  gray900: '#111827',
  white: '#ffffff',
  blue50: '#eff6ff',
  blue500: '#3b82f6',
  blue600: '#2563eb',
}

const sizes = {
  small: { fontSize: 12, padding: '4px 12px', height: 28, borderRadius: 6, gap: 2 },
  medium: { fontSize: 13, padding: '6px 16px', height: 34, borderRadius: 8, gap: 2 },
  large: { fontSize: 14, padding: '8px 20px', height: 40, borderRadius: 10, gap: 3 },
}

export function SegmentedTabs({
  tabs,
  activeIndex = 0,
  size = 'medium',
  variant = 'filled',
  disabled = false,
}: SegmentedTabsProps) {
  const [active, setActive] = useState(activeIndex)
  const s = sizes[size]

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: s.gap,
    padding: s.gap,
    borderRadius: s.borderRadius,
    backgroundColor: variant === 'filled' ? colors.gray100 : 'transparent',
    border: variant === 'outline' ? `1px solid ${colors.gray200}` : 'none',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  }

  const tabStyle = (isActive: boolean): CSSProperties => ({
    fontSize: s.fontSize,
    fontWeight: isActive ? 500 : 400,
    padding: s.padding,
    height: s.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: s.borderRadius - 2,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    backgroundColor: isActive
      ? variant === 'filled' ? colors.white : colors.blue50
      : 'transparent',
    color: isActive ? colors.gray900 : colors.gray500,
    boxShadow: isActive && variant === 'filled'
      ? '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)'
      : 'none',
    whiteSpace: 'nowrap',
  })

  return (
    <div style={containerStyle}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          style={tabStyle(i === active)}
          onClick={() => setActive(i)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
