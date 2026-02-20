import { ProjectPicker } from './ProjectPicker'
import { IterationPills } from './IterationPills'
import { AnnotationPanelWidget } from './AnnotationPanel'
import { PanelLeft } from 'lucide-react'
import { N, S, R, T, ICON, FONT } from './tokens'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  iterations: { name: string }[]
  activeIterationIndex: number
  onSelectIteration: (index: number) => void
  annotationEndpoint: string
  commentCount?: number
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
  annotationEndpoint,
  commentCount = 0,
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
        {/* Annotation panel */}
        {import.meta.env.DEV && (
          <AnnotationPanelWidget endpoint={annotationEndpoint} />
        )}

        {/* Comment count badge */}
        {commentCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S.xs }}>
            <div
              style={{
                minWidth: S.lg,
                height: S.lg,
                borderRadius: R.card,
                backgroundColor: N.chromeSub,
                border: `1px solid ${N.border}`,
                color: N.txtTer,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: T.label,
                fontWeight: 600,
                padding: `0 ${S.xs}px`,
              }}
            >
              {commentCount}
            </div>
            <span style={{ fontSize: T.caption, color: N.txtTer }}>comments</span>
          </div>
        )}

      </div>
    </div>
  )
}
