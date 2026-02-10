import type { CanvasFrame, ManifestFrame, PageManifest } from './types'

const DEFAULT_COL_WIDTH = 320
const DEFAULT_ROW_HEIGHT = 200
const DEFAULT_GAP = 40
const ORIGIN_X = 100
const ORIGIN_Y = 100

/**
 * Convert manifest frames into positioned canvas frames using a grid layout.
 * Frames flow left-to-right, wrapping at the configured column count.
 */
export function layoutFrames(page: PageManifest): CanvasFrame[] {
  const {
    columns = 4,
    columnWidth = DEFAULT_COL_WIDTH,
    rowHeight = DEFAULT_ROW_HEIGHT,
    gap = DEFAULT_GAP,
  } = page.grid ?? {}

  return page.frames.map((frame: ManifestFrame, index: number) => {
    const col = index % columns
    const row = Math.floor(index / columns)

    return {
      id: frame.id,
      title: frame.title,
      x: ORIGIN_X + col * (columnWidth + gap),
      y: ORIGIN_Y + row * (rowHeight + gap),
      width: frame.width ?? columnWidth,
      height: frame.height ?? rowHeight,
      component: frame.component,
      props: frame.props,
    }
  })
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
