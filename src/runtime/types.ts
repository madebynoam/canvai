import type { ComponentType } from 'react'

/** Base frame positioned on the canvas (runtime representation) */
interface BaseCanvasFrame {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  onResize?: (id: string, height: number) => void
  /** When true, relayout skips this frame - user dragged it manually */
  manuallyPositioned?: boolean
}

/** A component frame positioned on the canvas */
export interface CanvasComponentFrame extends BaseCanvasFrame {
  type?: 'component'
  component: ComponentType<any>
  props?: Record<string, unknown>
  /** Component registry key, used for duplication */
  componentKey?: string
}

/** An image frame positioned on the canvas */
export interface CanvasImageFrame extends BaseCanvasFrame {
  type: 'image'
  src: string
}

/** A frame positioned on the canvas (runtime representation) */
export type CanvasFrame = CanvasComponentFrame | CanvasImageFrame

/** Grid layout config for canvas */
export interface GridConfig {
  columns?: number
  columnWidth?: number
  rowHeight?: number
  gap?: number
}

/** Frame status for visual filtering */
export type FrameStatus = 'none' | 'starred' | 'approved' | 'rejected'

/** A project manifest — exported from src/projects/<name>/manifest.ts */
export interface ProjectManifest {
  /** Unique identifier for this project (UUID) */
  id?: string
  project: string
  /** Maps component keys to React components (frames stored in SQLite) */
  components?: Record<string, ComponentType<any>>
  /** Grid layout config */
  grid?: GridConfig
  /** URL where this project was last shared via /canvai-share */
  shareUrl?: string
}

/** Type guard: check if a CanvasFrame is a CanvasImageFrame */
export function isCanvasImageFrame(frame: CanvasFrame): frame is CanvasImageFrame {
  return frame.type === 'image'
}

/** A connection between two context images */
export interface Connection {
  id: string
  fromFrameId: string
  toFrameId: string
  annotationId?: string
}

/** A sticky note semantically bound to a parent frame */
export interface CanvasSticky {
  id: string
  parentFrameId: string
  content: string
  offsetX: number   // relative to parent frame's x
  offsetY: number   // typically negative (above the frame)
}
