import { describe, it, expect } from 'vitest'
import { layoutFrames, relayoutFrames } from '../runtime/layout'
import type { ManifestFrame, GridConfig, CanvasFrame } from '../runtime/types'

// Mock component for testing
const MockComponent = () => null
MockComponent.displayName = 'MockComponent'

describe('layoutFrames', () => {
  describe('horizontal layout (frames side by side)', () => {
    it('positions 3 frames horizontally when columns >= 3', () => {
      const frames: ManifestFrame[] = [
        { id: 'a', title: 'A', component: MockComponent, width: 1440, height: 900 },
        { id: 'b', title: 'B', component: MockComponent, width: 1440, height: 900 },
        { id: 'c', title: 'C', component: MockComponent, width: 1440, height: 900 },
      ]
      const grid: GridConfig = { columns: 3, columnWidth: 1440, rowHeight: 900, gap: 40 }

      const result = layoutFrames(frames, grid)

      // All frames should have same Y (horizontal layout)
      expect(result[0].y).toBe(100)
      expect(result[1].y).toBe(100)
      expect(result[2].y).toBe(100)

      // X should increase: 100, 100+1440+40=1580, 1580+1440+40=3060
      expect(result[0].x).toBe(100)
      expect(result[1].x).toBe(1580)
      expect(result[2].x).toBe(3060)
    })

    it('positions 5 frames horizontally when columns=5', () => {
      const frames: ManifestFrame[] = [
        { id: 'a', title: 'A', component: MockComponent, width: 1440, height: 900 },
        { id: 'b', title: 'B', component: MockComponent, width: 1440, height: 900 },
        { id: 'c', title: 'C', component: MockComponent, width: 1440, height: 900 },
        { id: 'd', title: 'D', component: MockComponent, width: 1440, height: 900 },
        { id: 'e', title: 'E', component: MockComponent, width: 1440, height: 900 },
      ]
      const grid: GridConfig = { columns: 5, columnWidth: 1440, rowHeight: 900, gap: 40 }

      const result = layoutFrames(frames, grid)

      // All 5 frames on same row
      expect(result.every(f => f.y === 100)).toBe(true)

      // X positions: 100, 1580, 3060, 4540, 6020
      expect(result[0].x).toBe(100)
      expect(result[1].x).toBe(1580)
      expect(result[2].x).toBe(3060)
      expect(result[3].x).toBe(4540)
      expect(result[4].x).toBe(6020)
    })
  })

  describe('wrapping to new rows', () => {
    it('wraps to second row when frames exceed columns', () => {
      const frames: ManifestFrame[] = [
        { id: 'a', title: 'A', component: MockComponent, width: 1440, height: 900 },
        { id: 'b', title: 'B', component: MockComponent, width: 1440, height: 900 },
        { id: 'c', title: 'C', component: MockComponent, width: 1440, height: 900 },
      ]
      const grid: GridConfig = { columns: 2, columnWidth: 1440, rowHeight: 900, gap: 40 }

      const result = layoutFrames(frames, grid)

      // Row 1: frames a, b at y=100
      expect(result[0].y).toBe(100)
      expect(result[1].y).toBe(100)

      // Row 2: frame c at y=100+900+40=1040
      expect(result[2].y).toBe(1040)

      // X positions reset for each row
      expect(result[0].x).toBe(100)
      expect(result[1].x).toBe(1580)
      expect(result[2].x).toBe(100) // Back to left
    })
  })

  describe('uses actual frame widths', () => {
    it('positions frames using their individual widths', () => {
      const frames: ManifestFrame[] = [
        { id: 'a', title: 'A', component: MockComponent, width: 400, height: 300 },
        { id: 'b', title: 'B', component: MockComponent, width: 800, height: 300 },
        { id: 'c', title: 'C', component: MockComponent, width: 600, height: 300 },
      ]
      const grid: GridConfig = { columns: 3, gap: 40 }

      const result = layoutFrames(frames, grid)

      // X: 100, 100+400+40=540, 540+800+40=1380
      expect(result[0].x).toBe(100)
      expect(result[1].x).toBe(540)
      expect(result[2].x).toBe(1380)
    })
  })

  describe('default grid config', () => {
    it('uses default columns=4 when no grid specified', () => {
      const frames: ManifestFrame[] = [
        { id: 'a', title: 'A', component: MockComponent },
        { id: 'b', title: 'B', component: MockComponent },
        { id: 'c', title: 'C', component: MockComponent },
        { id: 'd', title: 'D', component: MockComponent },
        { id: 'e', title: 'E', component: MockComponent }, // 5th frame wraps
      ]

      const result = layoutFrames(frames)

      // First 4 on row 1
      expect(result[0].y).toBe(100)
      expect(result[1].y).toBe(100)
      expect(result[2].y).toBe(100)
      expect(result[3].y).toBe(100)

      // 5th on row 2
      expect(result[4].y).toBe(340) // 100 + 200 + 40
    })
  })

  describe('NO diagonal layout', () => {
    it('NEVER produces diagonal layout (same row = same Y)', () => {
      const frames: ManifestFrame[] = [
        { id: 'a', title: 'A', component: MockComponent, width: 1440, height: 900 },
        { id: 'b', title: 'B', component: MockComponent, width: 1440, height: 900 },
        { id: 'c', title: 'C', component: MockComponent, width: 1440, height: 900 },
      ]
      const grid: GridConfig = { columns: 10 } // More columns than frames

      const result = layoutFrames(frames, grid)

      // All frames must have same Y
      const yValues = result.map(f => f.y)
      expect(new Set(yValues).size).toBe(1)
      expect(yValues[0]).toBe(100)

      // X values must all be different (no overlap)
      const xValues = result.map(f => f.x)
      expect(new Set(xValues).size).toBe(3)

      // X must be strictly increasing
      expect(xValues[0]).toBeLessThan(xValues[1])
      expect(xValues[1]).toBeLessThan(xValues[2])
    })
  })
})

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
