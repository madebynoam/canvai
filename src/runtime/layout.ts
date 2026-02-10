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
