import { ProjectPicker } from './ProjectPicker'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  iterationCount: number
  pendingCount: number
  mode: 'manual' | 'watch'
}

const ACCENT = '#E8590C'
const BORDER = '#E5E7EB'
const TEXT_TERTIARY = '#9CA3AF'
const TEXT_SECONDARY = '#6B7280'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

export function TopBar({
  projects,
  activeProjectIndex,
  onSelectProject,
  iterationCount,
  pendingCount,
  mode,
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
      {/* Left section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ProjectPicker
          projects={projects}
          activeIndex={activeProjectIndex}
          onSelect={onSelectProject}
        />
        {/* Divider */}
        <div style={{ width: 1, height: 16, backgroundColor: BORDER }} />
        {/* Iteration count */}
        <span style={{ fontSize: 11, color: TEXT_TERTIARY }}>
          {iterationCount} {iterationCount === 1 ? 'iteration' : 'iterations'}
        </span>
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Pending count */}
        {pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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

        {/* Divider */}
        <div style={{ width: 1, height: 16, backgroundColor: BORDER }} />

        {/* Mode pill */}
        {mode === 'manual' ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '3px 10px',
              borderRadius: 12,
              backgroundColor: '#F3F4F6',
              fontSize: 11,
              fontWeight: 500,
              color: TEXT_SECONDARY,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
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
              gap: 5,
              padding: '3px 10px',
              borderRadius: 12,
              backgroundColor: '#ECFDF5',
              fontSize: 11,
              fontWeight: 500,
              color: '#059669',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 4px rgba(16, 185, 129, 0.4)',
              }}
            />
            Watch
          </div>
        )}
      </div>
    </div>
  )
}
