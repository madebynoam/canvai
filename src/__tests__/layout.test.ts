import { describe, it, expect } from 'vitest'
import { relayoutFrames } from '../runtime/layout'
import type { CanvasFrame } from '../runtime/types'

// Mock component for testing
const MockComponent = () => null
MockComponent.displayName = 'MockComponent'

describe('relayoutFrames', () => {
  it('adjusts Y positions based on measured heights', () => {
    const frames: CanvasFrame[] = [
      { id: 'a', title: 'A', x: 100, y: 100, width: 400, height: 200, component: MockComponent },
      { id: 'b', title: 'B', x: 540, y: 100, width: 400, height: 200, component: MockComponent },
      { id: 'c', title: 'C', x: 100, y: 340, width: 400, height: 200, component: MockComponent },
    ]

    const measuredHeights = {
      'a': 500, // First row is now 500px tall
      'b': 300,
      'c': 200,
    }

    const result = relayoutFrames(frames, measuredHeights, { columns: 2, gap: 40 })

    // Row 1 Y unchanged
    expect(result[0].y).toBe(100)
    expect(result[1].y).toBe(100)

    // Row 2 Y adjusted: 100 + 500 + 40 = 640
    expect(result[2].y).toBe(640)
  })

  it('preserves X positions', () => {
    const frames: CanvasFrame[] = [
      { id: 'a', title: 'A', x: 100, y: 100, width: 1440, height: 900, component: MockComponent },
      { id: 'b', title: 'B', x: 1580, y: 100, width: 1440, height: 900, component: MockComponent },
    ]

    const result = relayoutFrames(frames, {}, { columns: 2 })

    // X should be unchanged
    expect(result[0].x).toBe(100)
    expect(result[1].x).toBe(1580)
  })
})
