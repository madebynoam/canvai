import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { A, S, R, T, FONT, V } from './tokens'
import { ColorPicker } from './ColorPicker'
import { oklchToDisplayHex } from './colorUtils'
import { useTokenOverride } from './Canvas'

const ENDPOINT = `http://localhost:${__BRYLLEN_HTTP_PORT__ ?? 4748}`

export interface TokenSwatchProps {
  /** CSS color string for display */
  color: string
  /** Token name shown next to the swatch */
  label: string
  /** Optional secondary text (e.g. the OKLCH value) */
  sublabel?: string
  /** If provided, swatch is clickable and opens the color picker */
  oklch?: { l: number; c: number; h: number }
  /** CSS custom property name for the annotation (e.g. "--chrome") */
  tokenPath?: string
}

export function TokenSwatch({ color, label, sublabel, oklch, tokenPath }: TokenSwatchProps) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // Token editing disabled — not shipping in v1 (CSS variable cascade needs work)
  const interactive = false

  // Live preview color while picker is open
  const [previewColor, setPreviewColor] = useState<string | null>(null)

  // Pending state from Canvas (survives page navigation)
  const { setOverride, clearOverride, setPending, clearPending, pending } = useTokenOverride()
  const myPending = tokenPath ? pending[tokenPath] : undefined
  const isPending = !!myPending

  const closePopup = () => {
    setOpen(false)
    setPreviewColor(null)
    if (!isPending && tokenPath) clearOverride(tokenPath)
  }

  // Determine display color: preview > pending > token
  const displayColor = previewColor ?? myPending?.color ?? color

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        onClick={interactive ? () => {
          if (!open) {
            setOpen(true)
          } else {
            closePopup()
          }
        } : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: S.sm, fontFamily: FONT,
          padding: `${S.xs}px ${S.sm}px`,
          margin: `0 -${S.sm}px`,
          borderRadius: R.ui, cornerShape: 'squircle',
          backgroundColor: interactive && hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
          cursor: 'default',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: R.ui, cornerShape: 'squircle',
            backgroundColor: displayColor,
            border: `1px solid ${V.border}`,
          }} />
          {isPending && (
            <div style={{
              position: 'absolute',
              top: -2, right: -2,
              width: 8, height: 8,
              borderRadius: '50%',
              backgroundColor: A.accent,
              border: `1.5px solid ${V.card}`,
            }} />
          )}
        </div>
        <div>
          <div style={{ fontSize: T.ui, fontWeight: 500, color: V.txtPri }}>{label}</div>
          {sublabel && <div style={{ fontSize: T.ui, color: V.txtSec }}>{sublabel}</div>}
        </div>
      </div>

      {open && oklch && createPortal(
        <>
          {/* Backdrop to catch outside clicks */}
          <div
            onClick={closePopup}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
            }}
          />
          {/* Color picker popup */}
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
              left: containerRef.current?.getBoundingClientRect().left ?? 0,
              zIndex: 10000,
            }}
          >
            <ColorPicker
              l={myPending?.lch?.l ?? oklch.l}
              c={myPending?.lch?.c ?? oklch.c}
              h={myPending?.lch?.h ?? oklch.h}
              onChange={(l, c, h) => {
                setPreviewColor(oklchToDisplayHex(l, c, h))
                // Propagate live edit to all var(--token) consumers
                if (tokenPath) setOverride(tokenPath, `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${Math.round(h)})`)
              }}
              onApply={async (l, c, h) => {
                setOpen(false)
                setPreviewColor(null)

                // Keep the override active
                const hex = oklchToDisplayHex(l, c, h)
                if (tokenPath) setOverride(tokenPath, `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${Math.round(h)})`)

                // Derive frameId from DOM — the swatch lives inside a Frame with data-frame-id
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
                    setPending(tokenPath, { id: String(annotation.id), color: hex, lch: { l, c, h } })
                  } catch {
                    // If POST fails, clear override
                    if (tokenPath) clearOverride(tokenPath)
                  }
                }
              }}
              onCancel={() => {
                setOpen(false)
                setPreviewColor(null)
                // Only clear override if not pending
                if (!isPending && tokenPath) clearOverride(tokenPath)
              }}
              onDiscard={isPending ? () => {
                setOpen(false)
                setPreviewColor(null)
                if (tokenPath) {
                  clearPending(tokenPath)
                  clearOverride(tokenPath)
                }
                // Resolve the annotation so the agent doesn't pick it up
                if (myPending) {
                  fetch(`${ENDPOINT}/annotations/${myPending.id}/resolve`, { method: 'POST' }).catch(() => {})
                }
              } : undefined}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
