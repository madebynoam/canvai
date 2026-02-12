import { useState } from 'react'
import { TopBar } from '../../runtime/TopBar'

const sampleProjects = [
  { project: 'pricing-cards' },
  { project: 'user-profile' },
]

interface TopBarPreviewProps {
  mode: 'manual' | 'watch'
  pendingCount: number
}

export function TopBarPreview({ mode, pendingCount }: TopBarPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div style={{ width: 720, border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
      <TopBar
        projects={sampleProjects}
        activeProjectIndex={activeIndex}
        onSelectProject={setActiveIndex}
        iterationCount={3}
        pendingCount={pendingCount}
        mode={mode}
      />
    </div>
  )
}
