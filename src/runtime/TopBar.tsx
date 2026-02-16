import { ProjectPicker } from './ProjectPicker'
import { IterationPills } from './IterationPills'
import { PanelLeft } from 'lucide-react'
import { N, A, W, S, R, T, ICON, FONT } from './tokens'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  iterations: { name: string }[]
  activeIterationIndex: number
  onSelectIteration: (index: number) => void
  pendingCount: number
  mode: 'manual' | 'watch'
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

function SidebarIcon() {
  return <PanelLeft size={ICON.lg} strokeWidth={1.5} />
}

export function TopBar({
  projects,
  activeProjectIndex,
  onSelectProject,
  iterations,
  activeIterationIndex,
  onSelectIteration,
  pendingCount,
  mode,
  sidebarOpen,
  onToggleSidebar,
}: TopBarProps) {
  const isWatch = mode === 'watch'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        fontFamily: FONT,
        flexShrink: 0,
        position: 'relative',
      }}
    >
      {/* Left section: sidebar toggle + project picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, flex: '0 0 auto' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            width: S.xxl,
            height: S.xxl,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: sidebarOpen ? N.txtPri : N.txtTer,
            borderRadius: R.control,
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

      {/* Center section: iteration pills — absolutely centered, immune to left/right width changes */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'auto',
      }}>
        {iterations.length > 0 && (
          <IterationPills
            items={iterations.map(iter => iter.name)}
            activeIndex={activeIterationIndex}
            onSelect={onSelectIteration}
          />
        )}
      </div>

      {/* Right section — annotation UI hidden in production builds */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.md, flex: '0 0 auto' }}>
        {/* Pending count */}
        {import.meta.env.DEV && pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
            <div
              style={{
                width: S.lg,
                height: S.lg,
                borderRadius: '50%',
                backgroundColor: A.accent,
                color: 'oklch(1 0 0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: T.label,
                fontWeight: 600,
              }}
            >
              {pendingCount}
            </div>
            <span style={{ fontSize: T.caption, color: A.accent, fontWeight: 500 }}>pending</span>
          </div>
        )}

        {/* Watch mode pill — always visible, green when active, gray when off */}
        {import.meta.env.DEV && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.xs,
              padding: `${S.xs}px ${S.md}px`,
              borderRadius: R.card,
              backgroundColor: isWatch ? W.bg : N.chromeSub,
              border: `1px solid ${isWatch ? 'oklch(0.82 0.06 155)' : N.border}`,
              fontSize: T.pill,
              fontWeight: 500,
              color: isWatch ? W.text : N.txtTer,
            }}
          >
            <div
              style={{
                width: S.sm,
                height: S.sm,
                borderRadius: '50%',
                backgroundColor: isWatch ? W.dot : N.txtFaint,
                boxShadow: 'none',
              }}
            />
            Watch
          </div>
        )}
      </div>
    </div>
  )
}
