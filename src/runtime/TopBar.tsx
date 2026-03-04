import { ProjectPicker } from './ProjectPicker'
import { PickerDropdown } from './PickerDropdown'
import { AnnotationPanelWidget } from './AnnotationPanel'
import { PanelLeft, Plus } from 'lucide-react'
import { MenuRow } from './Menu'
import { N, S, R, T, ICON, FONT, DIM } from './tokens'
import type { IterationManifest } from './types'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  iterations: IterationManifest[]
  activeIterationIndex: number
  onSelectIteration: (index: number) => void
  annotationEndpoint: string
  commentCount?: number
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onNewIteration?: () => void
  onNewProject?: () => void
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
  onNewIteration,
  onNewProject,
}: TopBarProps) {
  // Reverse so newest iteration is on top
  const reversedIterations = [...iterations].reverse()
  const reversedActiveIndex = iterations.length - 1 - activeIterationIndex

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: DIM.topbar,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {/* Left section: sidebar toggle → project picker → separator → iteration picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, flex: '0 0 auto' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            width: DIM.control,
            height: DIM.control,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: sidebarOpen ? N.txtPri : N.txtSec,
            borderRadius: R.ui, cornerShape: 'squircle',
            cursor: 'default',
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker
          projects={projects}
          activeIndex={activeProjectIndex}
          onSelect={onSelectProject}
          onNewProject={onNewProject}
        />

        {iterations.length > 0 && (
          <div data-tour-id="iteration-picker" style={{ display: 'flex', alignItems: 'center', gap: S.xs }}>
            <span style={{ fontSize: T.ui, color: N.border, userSelect: 'none' }}>/</span>
            <PickerDropdown
              items={reversedIterations}
              activeIndex={reversedActiveIndex}
              onSelect={(i) => onSelectIteration(iterations.length - 1 - i)}
              width={280}
              renderTriggerLabel={(item) => (
                <span style={{ fontSize: T.ui, fontWeight: 400, color: N.txtPri }}>
                  {item.name}
                </span>
              )}
              renderRow={(item) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{
                    fontSize: T.ui,
                    fontWeight: 400,
                    color: N.txtPri,
                  }}>
                    {item.name}
                  </span>
                  {item.description && (
                    <span style={{
                      fontSize: T.ui,
                      fontWeight: 400,
                      color: N.txtSec,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4',
                    }}>
                      {item.description}
                    </span>
                  )}
                </div>
              )}
              footer={import.meta.env.DEV && onNewIteration ? (
                <MenuRow
                  onClick={onNewIteration}
                  icon={<Plus size={ICON.md} strokeWidth={1.5} color={N.txtSec} />}
                  style={{ padding: `${S.sm}px ${S.sm}px`, fontSize: T.ui, color: N.txtSec }}
                >
                  New Iteration
                </MenuRow>
              ) : undefined}
            />
          </div>
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
                borderRadius: R.ui, cornerShape: 'squircle',
                backgroundColor: N.card,
                border: `1px solid ${N.border}`,
                color: N.txtSec,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: T.ui,
                fontWeight: 600,
                padding: `0 ${S.xs}px`,
              }}
            >
              {commentCount}
            </div>
            <span style={{ fontSize: T.ui, color: N.txtSec }}>comments</span>
          </div>
        )}

      </div>
    </div>
  )
}
