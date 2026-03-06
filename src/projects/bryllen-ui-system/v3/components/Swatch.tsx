import { useState, useRef, useEffect } from 'react'
import { N, S, R, T, FONT } from '../tokens'
import { ColorPicker } from './ColorPicker'

interface SwatchProps {
  color: string
  label: string
  sublabel?: string
  /** If provided, swatch is clickable and opens the color picker */
  oklch?: { l: number; c: number; h: number }
  onColorChange?: (l: number, c: number, h: number) => void
}

export function Swatch({ color, label, sublabel, oklch, onColorChange }: SwatchProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const interactive = !!oklch

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [open])

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        onClick={interactive ? () => setOpen(o => !o) : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: S.sm, fontFamily: FONT,
          padding: `${S.xs}px ${S.sm}px`,
          margin: `0 -${S.sm}px`,
          borderRadius: R.control,
          backgroundColor: interactive && hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
          cursor: 'default',
          transition: 'background-color 120ms ease',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: R.card,
          backgroundColor: color,
          border: `1px solid ${N.border}`,
          flexShrink: 0,
        }} />
        <div>
          <div style={{ fontSize: T.body, fontWeight: 500, color: N.txtPri }}>{label}</div>
          {sublabel && <div style={{ fontSize: T.pill, color: N.txtTer }}>{sublabel}</div>}
        </div>
      </div>

      {open && oklch && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: S.xs,
          zIndex: 100,
        }}>
          <ColorPicker
            l={oklch.l}
            c={oklch.c}
            h={oklch.h}
            onApply={(l, c, h) => {
              onColorChange?.(l, c, h)
              setOpen(false)
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
