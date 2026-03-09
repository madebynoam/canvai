import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { A, S, R, T, FONT, V } from './tokens'
import { TokenSlider } from './TokenSlider'
import { useTokenOverride } from './Canvas'

const ENDPOINT = `http://localhost:${__BRYLLEN_HTTP_PORT__ ?? 4748}`

export interface FontSizeTokenProps {
  value: number
  label: string
  sublabel?: string
  tokenPath?: string
}

export function FontSizeToken({ value, label, sublabel, tokenPath }: FontSizeTokenProps) {
  // Token editing disabled — not shipping in v1 (CSS variable cascade needs work)
  const [open, setOpen] = useState(false)
  const disabled = true
  const [hovered, setHovered] = useState(false)
  const [previewValue, setPreviewValue] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { setOverride, clearOverride, setPending, pending } = useTokenOverride()
  const myPending = tokenPath ? pending[tokenPath] : undefined
  const isPending = !!myPending

  const displayValue = previewValue ?? myPending?.value ?? value
  const previewFontSize = Math.min(16, Math.max(8, displayValue * 0.5))

  const closePopup = () => {
    setOpen(false)
    setPreviewValue(null)
    if (!isPending && tokenPath) clearOverride(tokenPath)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        onClick={disabled ? undefined : () => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: S.sm, fontFamily: FONT,
          padding: `${S.xs}px ${S.sm}px`,
          margin: `0 -${S.sm}px`,
          borderRadius: R.ui,
          backgroundColor: hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
          cursor: 'default',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: R.ui,
            border: `1px solid ${V.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: V.card,
          }}>
            <span style={{
              fontSize: tokenPath ? `clamp(8px, calc(var(${tokenPath}) * 0.5), 16px)` : previewFontSize,
              fontWeight: 500,
              color: A.accent,
              fontFamily: FONT,
            }}>
              Aa
            </span>
          </div>
          {isPending && (
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: A.accent, border: `1.5px solid ${V.card}`,
            }} />
          )}
        </div>
        <div>
          <div style={{ fontSize: T.ui, fontWeight: 500, color: V.txtPri }}>{label}</div>
          {sublabel && <div style={{ fontSize: T.ui, color: V.txtSec }}>{sublabel}</div>}
        </div>
      </div>

      {open && createPortal(
        <>
          <div onClick={closePopup} style={{ position: 'fixed', inset: 0, zIndex: 9999 }} />
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
              left: containerRef.current?.getBoundingClientRect().left ?? 0,
              zIndex: 10000,
              backgroundColor: V.card,
              borderRadius: R.ui,
              border: `1px solid ${V.border}`,
              padding: S.sm,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            <TokenSlider
              value={displayValue}
              min={10}
              max={48}
              step={1}
              unit="px"
              onChange={(v) => {
                setPreviewValue(v)
                if (tokenPath) setOverride(tokenPath, `${v}px`)
              }}
              onApply={async (v) => {
                setOpen(false)
                setPreviewValue(null)

                // Always set the override
                if (tokenPath) setOverride(tokenPath, `${v}px`)

                const frameEl = containerRef.current?.closest('[data-frame-id]')
                const frameId = frameEl?.getAttribute('data-frame-id')

                if (!frameId) {
                  console.warn('[bryllen] No frame found for token annotation — using "tokens" fallback')
                }

                // Create annotation with project-level fallback
                if (tokenPath) {
                  try {
                    const res = await fetch(`${ENDPOINT}/annotations`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        frameId: frameId || 'tokens',
                        componentName: 'Tokens',
                        selector: `[data-token="${tokenPath}"]`,
                        comment: `Change token ${tokenPath} to ${v}px`,
                        computedStyles: {},
                      }),
                    })
                    const annotation = await res.json()
                    setPending(tokenPath, { id: String(annotation.id), value: v, unit: 'px' })
                  } catch (err) {
                    console.error('[bryllen] Failed to create annotation:', err)
                    clearOverride(tokenPath)
                  }
                }
              }}
              onCancel={closePopup}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
