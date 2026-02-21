import { ProjectPicker } from './ProjectPicker'
import { PickerDropdown } from './PickerDropdown'
import { AnnotationPanelWidget } from './AnnotationPanel'
import { PanelLeft, ChevronRight } from 'lucide-react'
import { N, S, R, T, ICON, FONT } from './tokens'
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
  // Reverse so newest iteration is on top
  const reversedIterations = [...iterations].reverse()
  const reversedActiveIndex = iterations.length - 1 - activeIterationIndex

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
      }}
    >
      {/* Left section: sidebar toggle → project picker → separator → iteration picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, flex: '0 0 auto' }}>
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

        {iterations.length > 0 && (
          <>
            <ChevronRight size={ICON.sm} strokeWidth={1.5} color={N.txtTer} />
            <PickerDropdown
              items={reversedIterations}
              activeIndex={reversedActiveIndex}
              onSelect={(i) => onSelectIteration(iterations.length - 1 - i)}
              width={280}
              renderTriggerLabel={(item) => (
                <span style={{ fontSize: T.title, fontWeight: 500, color: N.txtPri }}>
                  {item.name}
                </span>
              )}
              renderRow={(item, _i, isActive) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{
                    fontSize: T.body,
                    fontWeight: 500,
                    color: N.txtPri,
                    textWrap: 'pretty',
                  }}>
                    {item.name}
                  </span>
                  {item.description && (
                    <span style={{
                      fontSize: T.caption,
                      fontWeight: 400,
                      color: N.txtTer,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.description}
                    </span>
                  )}
                </div>
              )}
            />
          </>
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
