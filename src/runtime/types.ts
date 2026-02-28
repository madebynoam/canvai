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

/** A page within a project — one tab on the canvas */
export interface PageManifest {
  name: string
  frames: ManifestFrame[]
  /** Grid layout config */
  grid?: {
    columns?: number
    columnWidth?: number
    rowHeight?: number
    gap?: number
  }
}

/** An iteration grouping pages within a project */
export interface IterationManifest {
  name: string
  description?: string
  frozen?: boolean
  pages: PageManifest[]
}

/** A project manifest — exported from src/projects/<name>/manifest.ts */
export interface ProjectManifest {
  project: string
  iterations: IterationManifest[]
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
