import { ProjectPicker } from './ProjectPicker'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  iterationCount: number
  pendingCount: number
  mode: 'manual' | 'watch'
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

const ACCENT = '#E8590C'
const BORDER = '#E5E7EB'
const TEXT_TERTIARY = '#9CA3AF'
const TEXT_SECONDARY = '#6B7280'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

function SidebarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="5" y1="2" x2="5" y2="12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function TopBar({
  projects,
  activeProjectIndex,
  onSelectProject,
  iterationCount,
  pendingCount,
  mode,
  sidebarOpen,
  onToggleSidebar,
}: TopBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
        padding: '0 12px',
        backgroundColor: '#FFFFFF',
        borderBottom: `1px solid ${BORDER}`,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {/* Left section: sidebar toggle + project picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            width: 24,
            height: 24,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY,
            borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker
          projects={projects}
          activeIndex={activeProjectIndex}
          onSelect={onSelectProject}
        />
      </div>

      {/* Right section — annotation UI hidden in production builds */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Pending count */}
        {import.meta.env.DEV && pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: ACCENT,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 600,
              }}
            >
              {pendingCount}
            </div>
            <span style={{ fontSize: 11, color: ACCENT, fontWeight: 500 }}>pending</span>
          </div>
        )}

        {/* Mode pill — dev only */}
        {import.meta.env.DEV && (mode === 'manual' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 12px',
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              fontSize: 11,
              fontWeight: 500,
              color: TEXT_SECONDARY,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: TEXT_TERTIARY,
              }}
            />
            Manual
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 12px',
              borderRadius: 12,
              backgroundColor: '#ECFDF5',
              fontSize: 11,
              fontWeight: 500,
              color: '#059669',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 4px rgba(16, 185, 129, 0.4)',
              }}
            />
            Watch
          </div>
        ))}
      </div>
    </div>
  )
}
