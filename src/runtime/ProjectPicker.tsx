import { PickerDropdown } from './PickerDropdown'
import { A, N, S, T } from './tokens'

interface ProjectPickerProps {
  projects: { project: string }[]
  activeIndex: number
  onSelect: (index: number) => void
  forceOpen?: boolean
}

export function ProjectPicker({ projects, activeIndex, onSelect, forceOpen = false }: ProjectPickerProps) {
  return (
    <PickerDropdown
      items={projects}
      activeIndex={activeIndex}
      onSelect={onSelect}
      forceOpen={forceOpen}
      width={220}
      triggerPrefix={
        <div
          style={{
            width: S.xl,
            height: S.xl,
            borderRadius: '50%',
            backgroundColor: A.accent,
            color: 'oklch(1 0 0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: T.pill,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {projects[activeIndex]?.project.charAt(0).toUpperCase()}
        </div>
      }
      renderTriggerLabel={(item) => (
        <span style={{ fontSize: T.title, fontWeight: 500, color: N.txtPri }}>
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
              backgroundColor: isActive ? A.accent : N.border,
              color: isActive ? 'oklch(1 0 0)' : N.txtSec,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: T.pill,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {item.project.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: T.title, color: N.txtPri }}>{item.project}</span>
        </div>
      )}
    />
  )
}
