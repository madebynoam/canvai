import type { ComponentType } from 'react'

/** A frame positioned on the canvas (runtime representation) */
export interface CanvasFrame {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  component: ComponentType<any>
  props?: Record<string, unknown>
  onResize?: (id: string, height: number) => void
}

/** A frame declared in a manifest (no position — layout is computed) */
export interface ManifestFrame {
  id: string
  title: string
  component: ComponentType<any>
  props?: Record<string, unknown>
  /** Optional explicit width hint */
  width?: number
  /** Optional explicit height hint */
  height?: number
}

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
