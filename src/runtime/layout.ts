import type { CanvasFrame, ManifestFrame, PageManifest } from './types'

const DEFAULT_COL_WIDTH = 320
const DEFAULT_ROW_HEIGHT = 200
const DEFAULT_GAP = 40
const ORIGIN_X = 100
const ORIGIN_Y = 100

/**
 * Convert manifest frames into positioned canvas frames.
 * Frames flow left-to-right using ACTUAL frame widths, wrapping at column count.
 */
export function layoutFrames(page: PageManifest): CanvasFrame[] {
  const {
    columns = 4,
    columnWidth = DEFAULT_COL_WIDTH,
    rowHeight = DEFAULT_ROW_HEIGHT,
    gap = DEFAULT_GAP,
  } = page.grid ?? {}

  // Group frames into rows
  const rows: ManifestFrame[][] = []
  for (let i = 0; i < page.frames.length; i += columns) {
    rows.push(page.frames.slice(i, i + columns))
  }

  const result: CanvasFrame[] = []
  let currentY = ORIGIN_Y

  for (const row of rows) {
    let currentX = ORIGIN_X
    let maxHeight = rowHeight

    for (const frame of row) {
      const frameWidth = frame.width ?? columnWidth
      const frameHeight = frame.height ?? rowHeight

      result.push({
        id: frame.id,
        title: frame.title,
        x: currentX,
        y: currentY,
        width: frameWidth,
        height: frameHeight,
        component: frame.component,
        props: frame.props,
      })

      currentX += frameWidth + gap
      if (frameHeight > maxHeight) maxHeight = frameHeight
    }

    currentY += maxHeight + gap
  }

  return result
}

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
    const row = Math.floor(index / columns)
    return {
      ...frame,
      y: rowYPositions[row],
    }
  })
}
