import type { ReactNode } from 'react'
import { useCanvas } from './Canvas'

interface FrameProps {
  id: string
  title: string
  x: number
  y: number
  width: number
  height: number
  children: ReactNode
}

export function Frame({ title, x, y, width, height, children }: FrameProps) {
  const { zoom } = useCanvas()

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
      }}
    >
      <div
        style={{
          fontSize: 12 / zoom,
          color: '#999',
          marginBottom: 8 / zoom,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: width,
        }}
      >
        {title}
      </div>
      <div
        style={{
          width,
          minHeight: height,
          background: '#fff',
          borderRadius: 8 / zoom,
          boxShadow: `0 ${2 / zoom}px ${8 / zoom}px rgba(0,0,0,0.3)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}
