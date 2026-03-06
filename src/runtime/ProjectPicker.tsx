import { PickerDropdown } from './PickerDropdown'
import { MenuRow } from './Menu'
import { Plus } from 'lucide-react'
import { A, D, S, T, ICON, V } from './tokens'

interface ProjectPickerProps {
  projects: { project: string }[]
  activeIndex: number
  onSelect: (index: number) => void
  forceOpen?: boolean
  onNewProject?: () => void
}

export function ProjectPicker({ projects, activeIndex, onSelect, forceOpen = false, onNewProject }: ProjectPickerProps) {
  return (
    <PickerDropdown
      items={projects}
      activeIndex={activeIndex}
      onSelect={onSelect}
      forceOpen={forceOpen}
      width={220}
      footer={import.meta.env.DEV && onNewProject ? (
        <MenuRow
          onClick={onNewProject}
          icon={<Plus size={ICON.md} strokeWidth={1.5} style={{ color: V.txtSec }} />}
          style={{ padding: `${S.sm}px ${S.sm}px`, fontSize: T.ui, color: V.txtSec }}
        >
          New Project
        </MenuRow>
      ) : undefined}
      triggerPrefix={
        <div
          style={{
            width: S.xl,
            height: S.xl,
            borderRadius: '50%',
            backgroundColor: A.accent,
            color: D.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: T.ui,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {projects[activeIndex]?.project.charAt(0).toUpperCase()}
        </div>
      }
      renderTriggerLabel={(item) => (
        <span style={{ fontSize: T.ui, fontWeight: 400, color: V.txtPri }}>
          {item.project}
        </span>
      )}
      renderRow={(item, i, isActive) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
          <div
            style={{
              width: S.xl,
              height: S.xl,
              borderRadius: '50%',
              backgroundColor: isActive ? A.accent : V.border,
              color: isActive ? D.text : V.txtSec,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: T.ui,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {item.project.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: T.ui, color: V.txtPri }}>{item.project}</span>
        </div>
      )}
    />
  )
}
