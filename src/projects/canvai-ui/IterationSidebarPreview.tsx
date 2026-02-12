import { useState } from 'react'
import { IterationSidebar } from '../../runtime/IterationSidebar'

interface IterationSidebarPreviewProps {
  count: number
}

export function IterationSidebarPreview({ count }: IterationSidebarPreviewProps) {
  const [activeIterationIndex, setActiveIterationIndex] = useState(0)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const iterations = Array.from({ length: count }, (_, i) => ({
    name: `V${i + 1}`,
    pages: [
      { name: ['Initial', 'Refined', 'Final', 'Polish', 'Ship'][i] ?? `Page ${i + 1}` },
      { name: 'Components' },
    ],
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
        iterations={iterations}
        activeIterationIndex={activeIterationIndex}
        activePageIndex={activePageIndex}
        onSelect={(iterIdx, pageIdx) => {
          setActiveIterationIndex(iterIdx)
          setActivePageIndex(pageIdx)
        }}
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
