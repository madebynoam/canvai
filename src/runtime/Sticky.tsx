import { useState, useRef } from 'react'
import { StickyNote } from 'lucide-react'
import { V, R, S, T, FONT, A } from './tokens'
import type { CanvasSticky } from './types'

interface StickyProps {
  sticky: CanvasSticky
  x: number          // absolute canvas x (computed from parent + offset)
  y: number          // absolute canvas y
  zoom: number
  selected: boolean
  onSelect: (id: string, shiftKey: boolean) => void
}

export function Sticky({ sticky, x, y, zoom, selected, onSelect }: StickyProps) {
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    pointerDownPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation()
    if (!pointerDownPos.current) return
    const dx = e.clientX - pointerDownPos.current.x
    const dy = e.clientY - pointerDownPos.current.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 5) {
      onSelect(sticky.id, e.shiftKey)
    }
    pointerDownPos.current = null
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 280,
        background: V.card,
        border: `1px solid ${selected ? A.accent : V.border}`,
        borderRadius: R.ui,
        boxShadow: selected
          ? `0 0 0 2px ${A.accent}, ${V.shadow}`
          : V.shadow,
        padding: `${S.sm}px ${S.md}px`,
        cursor: 'default',
        userSelect: 'none',
        fontFamily: FONT,
        fontSize: T.ui,
        color: V.txtPri,
        zIndex: 10,
        transition: 'border-color 0.1s, box-shadow 0.1s',
        pointerEvents: 'auto',
      } as React.CSSProperties}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: S.xs }}>
        <StickyNote
          size={12}
          style={{ color: V.txtSec, flexShrink: 0, marginTop: 1 }}
          strokeWidth={1.5}
        />
        <span
          style={{
            lineHeight: 1.5,
            color: V.txtPri,
            textWrap: 'pretty',
            whiteSpace: 'pre-wrap',
          } as React.CSSProperties}
        >
          {sticky.content}
        </span>
      </div>
    </div>
  )
}
