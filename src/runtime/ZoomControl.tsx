import { useState } from 'react'
import { Plus, Minus, Maximize2 } from 'lucide-react'
import { N, S, R, T, ICON, FONT } from './tokens'
import { useCanvas } from './Canvas'

function ZoomButton({ children, onClick, title }: {
  children: React.ReactNode
  onClick?: () => void
  title?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      style={{
        width: S.xxl,
        height: S.xxl,
        border: 'none',
        background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: N.txtSec,
        borderRadius: R.control,
        cursor: 'default',
        transition: 'background-color 120ms ease',
        padding: 0,
      }}
    >
      {children}
    </button>
  )
}

export function ZoomControl() {
  const { zoom, zoomIn, zoomOut, fitToView } = useCanvas()
  const pct = Math.round(zoom * 100)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 0,
      background: N.chrome,
      border: `1px solid ${N.border}`,
      borderRadius: R.card,
      padding: 2,
      fontFamily: FONT,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 0 0 0.5px rgba(0,0,0,0.03)',
    }}>
      <ZoomButton onClick={zoomOut} title="Zoom out (Cmd -)">
        <Minus size={ICON.sm} strokeWidth={1.5} />
      </ZoomButton>

      <div style={{
        minWidth: 36,
        textAlign: 'center',
        fontSize: T.caption,
        fontWeight: 500,
        color: N.txtPri,
        fontVariantNumeric: 'tabular-nums',
        userSelect: 'none',
        letterSpacing: '-0.01em',
      }}>
        {pct}%
      </div>

      <ZoomButton onClick={zoomIn} title="Zoom in (Cmd +)">
        <Plus size={ICON.sm} strokeWidth={1.5} />
      </ZoomButton>

      <div style={{
        width: 1,
        height: S.md,
        backgroundColor: N.border,
        marginInline: 2,
      }} />

      <ZoomButton onClick={fitToView} title="Fit to view (Cmd 0)">
        <Maximize2 size={ICON.sm} strokeWidth={1.5} />
      </ZoomButton>
    </div>
  )
}
