import { useState, useRef, useEffect } from 'react'
import { N, A, S, R, T, FONT } from '../tokens'
import { ColorPicker } from './ColorPicker'
import { oklchToDisplayHex } from './colorUtils'

const ENDPOINT = 'http://localhost:4748'

interface SwatchProps {
  color: string
  label: string
  sublabel?: string
  /** If provided, swatch is clickable and opens the color picker */
  oklch?: { l: number; c: number; h: number }
  /** Token path for annotation comment, e.g. "N.chrome" */
  tokenPath?: string
}

export function Swatch({ color, label, sublabel, oklch, tokenPath }: SwatchProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const interactive = !!oklch

  // Live preview color while picker is open
  const [previewColor, setPreviewColor] = useState<string | null>(null)

  // Pending annotation state
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [pendingColor, setPendingColor] = useState<string | null>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setPreviewColor(null)
      }
    }
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
  }, [open])

  // SSE subscription for pending annotation resolution
  useEffect(() => {
    if (!pendingId) return
    const source = new EventSource(`${ENDPOINT}/annotations/events`)
    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'resolved' && String(data.id) === String(pendingId)) {
          setPendingId(null)
          setPendingColor(null)
        }
      } catch { /* ignore parse errors */ }
    }
    return () => source.close()
  }, [pendingId])

  // Determine display color: preview > pending > token
  const displayColor = previewColor ?? pendingColor ?? color
  const isPending = pendingId !== null

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        onClick={interactive ? () => {
          if (!open) {
            setOpen(true)
          } else {
            setOpen(false)
            setPreviewColor(null)
          }
        } : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: S.sm, fontFamily: FONT,
          padding: `${S.xs}px ${S.sm}px`,
          margin: `0 -${S.sm}px`,
          borderRadius: R.control,
          backgroundColor: interactive && hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
          cursor: 'default',
          transition: 'background-color 120ms ease',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: R.card,
            backgroundColor: displayColor,
            border: `1px solid ${N.border}`,
          }} />
          {isPending && (
            <div style={{
              position: 'absolute',
              top: -2, right: -2,
              width: 8, height: 8,
              borderRadius: '50%',
              backgroundColor: A.accent,
              border: `1.5px solid ${N.card}`,
            }} />
          )}
        </div>
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
            onChange={(l, c, h) => {
              setPreviewColor(oklchToDisplayHex(l, c, h))
            }}
            onApply={async (l, c, h) => {
              setOpen(false)
              setPreviewColor(null)

              // Show pending state with the applied color
              const hex = oklchToDisplayHex(l, c, h)
              setPendingColor(hex)

              // Derive frameId from DOM
              const frameEl = containerRef.current?.closest('[data-frame-id]')
              const frameId = frameEl?.getAttribute('data-frame-id') ?? ''

              // Post annotation to MCP server
              if (tokenPath && frameId) {
                try {
                  const newVal = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${Math.round(h)})`
                  const res = await fetch(`${ENDPOINT}/annotations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      frameId,
                      componentName: 'Tokens',
                      selector: `[data-token="${tokenPath}"]`,
                      comment: `Change token ${tokenPath} to ${newVal}`,
                      computedStyles: {},
                    }),
                  })
                  const annotation = await res.json()
                  setPendingId(String(annotation.id))
                } catch {
                  // If POST fails, clear pending state
                  setPendingColor(null)
                }
              }
            }}
            onCancel={() => {
              setOpen(false)
              setPreviewColor(null)
            }}
          />
        </div>
      )}
    </div>
  )
}
