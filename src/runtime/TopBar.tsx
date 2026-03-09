import { useState } from 'react'
import { ProjectPicker } from './ProjectPicker'
import { AnnotationPanelWidget } from './AnnotationPanel'
import { ShareButton } from './ShareButton'
import { ArrowUp } from 'lucide-react'
import { A, D, S, R, T, ICON, FONT, DIM, V } from './tokens'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  annotationEndpoint: string
  commentCount?: number
  onNewProject?: () => void
  shareUrl?: string
  projectName: string
  updateAvailable?: boolean
  onUpdateClick?: () => void
  /** UUID of the active project — used for per-project annotation storage */
  projectId?: string
}


export function TopBar({
  projects,
  activeProjectIndex,
  onSelectProject,
  annotationEndpoint,
  commentCount = 0,
  onNewProject,
  shareUrl,
  projectName,
  updateAvailable,
  onUpdateClick,
  projectId,
}: TopBarProps) {
  const [updateHovered, setUpdateHovered] = useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: DIM.topbar,
        padding: `0 ${S.md}px`,
        backgroundColor: V.chrome,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {/* Left section: project picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.xs, flex: '0 0 auto' }}>
        <ProjectPicker
          projects={projects}
          activeIndex={activeProjectIndex}
          onSelect={onSelectProject}
          onNewProject={onNewProject}
        />
      </div>

      {/* Right section — annotation UI hidden in production builds */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.md, flex: '0 0 auto' }}>
        {/* Update available button */}
        {updateAvailable && onUpdateClick && (
          <button
            onClick={onUpdateClick}
            onMouseEnter={() => setUpdateHovered(true)}
            onMouseLeave={() => setUpdateHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: S.xs,
              padding: `${S.xs}px ${S.sm}px`,
              border: 'none',
              borderRadius: R.ui,
              background: updateHovered ? 'oklch(0.50 0.14 250)' : 'oklch(0.55 0.14 250)',
              color: D.text,
              fontSize: T.ui,
              fontWeight: 500,
              fontFamily: FONT,
              cursor: 'default',
              transition: 'background 0.1s ease-out',
            }}
          >
            <ArrowUp size={ICON.sm} strokeWidth={2} />
            Update available
          </button>
        )}

        {/* Annotation panel */}
        {import.meta.env.DEV && (
          <AnnotationPanelWidget endpoint={annotationEndpoint} projectId={projectId} />
        )}

        {/* Share button — DEV only (needs annotation server) */}
        {import.meta.env.DEV && projectName && (
          <ShareButton
            shareUrl={shareUrl}
            projectName={projectName}
            annotationEndpoint={annotationEndpoint}
          />
        )}

        {/* Comment count badge */}
        {commentCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: S.xs }}>
            <div
              style={{
                minWidth: S.lg,
                height: S.lg,
                borderRadius: R.ui, cornerShape: 'squircle',
                backgroundColor: V.card,
                border: `1px solid ${V.border}`,
                color: V.txtSec,
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
            <span style={{ fontSize: T.ui, color: V.txtSec }}>comments</span>
          </div>
        )}

      </div>
    </div>
  )
}
