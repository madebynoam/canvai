import { useState } from 'react'
import { IterationSidebar } from '../../runtime/IterationSidebar'

interface IterationSidebarPreviewProps {
  count: number
}

export function IterationSidebarPreview({ count }: IterationSidebarPreviewProps) {
  const [activePageIndex, setActivePageIndex] = useState(0)
  const pages = Array.from({ length: count }, (_, i) => ({
    name: ['Initial', 'Refined', 'Final', 'Polish', 'Ship'][i] ?? `Page ${i + 1}`,
  }))

  return (
    <div style={{
      height: 320,
      border: '1px solid #E5E7EB',
      borderRadius: 10,
      overflow: 'hidden',
      display: 'flex',
    }}>
      <IterationSidebar
        iterationName="V1"
        pages={pages}
        activePageIndex={activePageIndex}
        onSelectPage={setActivePageIndex}
        collapsed={false}
      />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        fontSize: 13,
        color: '#9CA3AF',
      }}>
        Canvas area
      </div>
    </div>
  )
}
