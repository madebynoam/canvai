import type { CanvasFrame } from './types'

const DEFAULT_ROW_HEIGHT = 200
const DEFAULT_GAP = 40
const ORIGIN_Y = 100

/**
 * Recompute frame y-positions based on measured rendered heights.
 * Groups frames into rows by the grid column count; each row's height
 * is the tallest measured frame in that row (falling back to rowHeight).
 */
export function relayoutFrames(
  frames: CanvasFrame[],
  measuredHeights: Record<string, number>,
  gridConfig: { columns?: number; rowHeight?: number; gap?: number } = {},
): CanvasFrame[] {
  const {
    columns = 4,
    rowHeight = DEFAULT_ROW_HEIGHT,
    gap = DEFAULT_GAP,
  } = gridConfig

  // Group frames into rows
  const rowCount = Math.ceil(frames.length / columns)
  const rowHeights: number[] = []

  for (let row = 0; row < rowCount; row++) {
    let maxH = rowHeight
    for (let col = 0; col < columns; col++) {
      const idx = row * columns + col
      if (idx >= frames.length) break
      const measured = measuredHeights[frames[idx].id]
      if (measured != null && measured > maxH) {
        maxH = measured
      }
    }
    rowHeights.push(maxH)
  }

  // Compute cumulative y positions
  const rowYPositions: number[] = [ORIGIN_Y]
  for (let i = 1; i < rowCount; i++) {
    rowYPositions.push(rowYPositions[i - 1] + rowHeights[i - 1] + gap)
  }

  return frames.map((frame, index) => {
    // Skip manually positioned frames - respect user's drag position
    if (frame.manuallyPositioned) return frame

    const row = Math.floor(index / columns)
    return {
      ...frame,
      y: rowYPositions[row],
    }
  })
}
