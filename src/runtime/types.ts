import type { ComponentType } from 'react'

export interface CanvasFrame {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  component: ComponentType<any>
  props?: Record<string, unknown>
}
