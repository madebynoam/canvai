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
}

/** An image frame positioned on the canvas */
export interface CanvasImageFrame extends BaseCanvasFrame {
  type: 'image'
  src: string
}

/** A frame positioned on the canvas (runtime representation) */
export type CanvasFrame = CanvasComponentFrame | CanvasImageFrame

/** A component frame declared in a manifest (no position — layout is computed) */
export interface ComponentFrame {
  type?: 'component'
  id: string
  title: string
  component: ComponentType<any>
  props?: Record<string, unknown>
  /** Optional explicit width hint */
  width?: number
  /** Optional explicit height hint */
  height?: number
}

/** An image frame for context/inspiration (stored in context/ folder) */
export interface ImageFrame {
  type: 'image'
  id: string
  title: string
  /** Relative path to image: 'context/mood-board.png' */
  src: string
  width?: number
  height?: number
}

/** A frame declared in a manifest (no position — layout is computed) */
export type ManifestFrame = ComponentFrame | ImageFrame

/** Grid layout config for canvas */
export interface GridConfig {
  columns?: number
  columnWidth?: number
  rowHeight?: number
  gap?: number
}

/** Frame status for visual filtering */
export type FrameStatus = 'none' | 'starred' | 'approved' | 'rejected'

/** Page manifest for iterations (DEPRECATED - use flat frames array) */
export interface PageManifest {
  name: string
  frames: ManifestFrame[]
  grid?: GridConfig
}

/** Iteration manifest (DEPRECATED - use flat frames array) */
export interface IterationManifest {
  name: string
  frozen?: boolean
  description?: string
  pages: PageManifest[]
}

/** A project manifest — exported from src/projects/<name>/manifest.ts */
export interface ProjectManifest {
  /** Unique identifier for this project (UUID) */
  id?: string
  project: string
  /** All frames displayed on the canvas (new flat structure) */
  frames?: ManifestFrame[]
  /** DEPRECATED: Use frames array instead */
  iterations?: IterationManifest[]
  /** Grid layout config */
  grid?: GridConfig
  /** URL where this project was last shared via /canvai-share */
  shareUrl?: string
}

/** Type guard: check if a ManifestFrame is an ImageFrame */
export function isImageFrame(frame: ManifestFrame): frame is ImageFrame {
  return frame.type === 'image'
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
