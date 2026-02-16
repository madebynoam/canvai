import { useState } from 'react'
import { ProjectPicker } from '../../runtime/ProjectPicker'

const projects = [
  { project: 'pricing-cards' },
  { project: 'user-profile' },
  { project: 'canvai-ui' },
]

export function ProjectPickerPreview() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div style={{
      padding: 24,
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <span style={{
        fontSize: 11,
        color: '#9CA3AF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      }}>
        Click to open:
      </span>
      <ProjectPicker
        projects={projects}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
      />
    </div>
  )
}
