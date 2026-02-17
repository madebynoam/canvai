import { useState, useRef, useEffect, useCallback } from 'react'
import { N, A, S, R, T, ICON, FONT } from '../tokens'
import {
  oklchToDisplayHex, hexToOklch, oklchToHsl, hslToOklch,
  oklchToSrgb, clampSrgb, isInGamut,
} from './colorUtils'
import { Trash2 } from 'lucide-react'

type Format = 'oklch' | 'hsl' | 'hex'

export interface ColorPickerProps {
  /** Current color as oklch(L C H) string or {l, c, h} */
  l: number
  c: number
  h: number
  /** Fires on every color change (drag, type) for live preview */
  onChange?: (l: number, c: number, h: number) => void
  onApply: (l: number, c: number, h: number) => void
  onCancel: () => void
  /** If provided, shows a discard (trash) button — for edit mode on pending swatches */
  onDiscard?: () => void
}

const AREA_W = 248
const AREA_H = 160
const HUE_H = 12
const MAX_C = 0.4

function renderColorArea(
  ctx: CanvasRenderingContext2D,
  hue: number,
  width: number,
  height: number,
) {
  const img = ctx.createImageData(width, height)
  for (let y = 0; y < height; y++) {
    const l = 1 - y / (height - 1) // top=1, bottom=0
    for (let x = 0; x < width; x++) {
      const c = (x / (width - 1)) * MAX_C
      const [r, g, b] = oklchToSrgb(l, c, hue)
      const [cr, cg, cb] = clampSrgb(r, g, b)
      const i = (y * width + x) * 4
      img.data[i] = cr * 255
      img.data[i + 1] = cg * 255
      img.data[i + 2] = cb * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

function renderHueStrip(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const img = ctx.createImageData(width, height)
  for (let x = 0; x < width; x++) {
    const hue = (x / (width - 1)) * 360
    const [r, g, b] = oklchToSrgb(0.65, 0.15, hue)
    const [cr, cg, cb] = clampSrgb(r, g, b)
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4
      img.data[i] = cr * 255
      img.data[i + 1] = cg * 255
      img.data[i + 2] = cb * 255
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
}

function FormatTab({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: 'none', cursor: 'default',
        padding: `${S.xs}px ${S.sm}px`,
        borderRadius: R.control,
        backgroundColor: active ? N.chromeSub : hovered ? 'rgba(0,0,0,0.03)' : 'transparent',
        fontSize: T.pill, fontWeight: active ? 600 : 400,
        fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
        color: active ? N.txtPri : N.txtTer,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </button>
  )
}

function NumericInput({ label, value, onChange, step = 1, min = 0, max = 360 }: {
  label: string; value: number; onChange: (v: number) => void
  step?: number; min?: number; max?: number
}) {
  const [focused, setFocused] = useState(false)
  const formatted = step < 1 ? value.toFixed(3) : Math.round(value).toString()
  const [local, setLocal] = useState(formatted)

  useEffect(() => {
    if (!focused) setLocal(formatted)
  }, [formatted, focused])

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      <span style={{
        fontSize: T.label, color: N.txtFaint, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>{label}</span>
      <input
        type="text"
        value={focused ? local : formatted}
        onChange={e => {
          setLocal(e.target.value)
          const v = parseFloat(e.target.value)
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)))
        }}
        onFocus={() => { setLocal(formatted); setFocused(true) }}
        onBlur={() => {
          setFocused(false)
          const v = parseFloat(local)
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)))
        }}
        style={{
          width: '100%',
          padding: `${S.xs}px ${S.sm}px`,
          border: `1px solid ${focused ? A.accent : N.border}`,
          borderRadius: R.control,
          backgroundColor: N.canvas,
          color: N.txtPri,
          fontSize: T.body,
          fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
          fontVariantNumeric: 'tabular-nums',
          outline: 'none',
          transition: 'border-color 120ms ease',
        }}
      />
    </label>
  )
}

function HexInput({ value, onChange }: {
  value: string; onChange: (hex: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const [local, setLocal] = useState(value)

  useEffect(() => { setLocal(value) }, [value])

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
      <span style={{
        fontSize: T.label, color: N.txtFaint, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.08em',
      }}>Hex</span>
      <input
        type="text"
        value={local}
        onChange={e => {
          setLocal(e.target.value)
          const hex = e.target.value.replace('#', '')
          if (hex.length === 6 && /^[0-9a-fA-F]{6}$/.test(hex)) {
            onChange('#' + hex)
          }
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: `${S.xs}px ${S.sm}px`,
          border: `1px solid ${focused ? A.accent : N.border}`,
          borderRadius: R.control,
          backgroundColor: N.canvas,
          color: N.txtPri,
          fontSize: T.body,
          fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
          outline: 'none',
          transition: 'border-color 120ms ease',
        }}
      />
    </label>
  )
}

export function ColorPicker({ l: initL, c: initC, h: initH, onChange, onApply, onCancel, onDiscard }: ColorPickerProps) {
  const [l, setL] = useState(initL)
  const [c, setC] = useState(initC)
  const [h, setH] = useState(initH)
  const [format, setFormat] = useState<Format>('oklch')

  const areaRef = useRef<HTMLCanvasElement>(null)
  const hueRef = useRef<HTMLCanvasElement>(null)

  const didMount = useRef(false)
  const [cancelHover, setCancelHover] = useState(false)
  const [applyHover, setApplyHover] = useState(false)
  const [discardHover, setDiscardHover] = useState(false)

  // Fire onChange for live preview (skip initial mount)
  useEffect(() => {
    if (!didMount.current) { didMount.current = true; return }
    onChange?.(l, c, h)
  }, [l, c, h, onChange])

  // Render color area when hue changes
  useEffect(() => {
    const ctx = areaRef.current?.getContext('2d')
    if (ctx) renderColorArea(ctx, h, AREA_W, AREA_H)
  }, [h])

  // Render hue strip once
  useEffect(() => {
    const ctx = hueRef.current?.getContext('2d')
    if (ctx) renderHueStrip(ctx, AREA_W, HUE_H)
  }, [])

  const handleAreaPointer = useCallback((e: React.PointerEvent | PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(AREA_W - 1, e.clientX - rect.left))
    const y = Math.max(0, Math.min(AREA_H - 1, e.clientY - rect.top))
    setC((x / (AREA_W - 1)) * MAX_C)
    setL(1 - y / (AREA_H - 1))
  }, [])

  const handleHuePointer = useCallback((e: React.PointerEvent | PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.max(0, Math.min(AREA_W - 1, e.clientX - rect.left))
    setH((x / (AREA_W - 1)) * 360)
  }, [])

  const startDrag = useCallback((
    e: React.PointerEvent,
    handler: (e: PointerEvent, canvas: HTMLCanvasElement) => void,
    canvas: HTMLCanvasElement,
  ) => {
    handler(e.nativeEvent, canvas)
    const onMove = (ev: PointerEvent) => handler(ev, canvas)
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }, [])

  // Gamut indicator
  const inGamut = isInGamut(l, c, h)
  const previewHex = oklchToDisplayHex(l, c, h)

  // Crosshair position on area
  const crossX = (c / MAX_C) * AREA_W
  const crossY = (1 - l) * AREA_H

  // Hue indicator position
  const hueX = (h / 360) * AREA_W

  // Format-specific values
  const [hslH, hslS, hslL] = oklchToHsl(l, c, h)

  return (
    <div style={{
      width: 280,
      background: N.card,
      borderRadius: R.card,
      padding: S.lg,
      boxShadow: `0 ${S.xs}px ${S.xxl}px rgba(0,0,0,0.08), 0 1px ${S.xs}px rgba(0,0,0,0.04)`,
      border: `1px solid ${N.border}`,
      fontFamily: FONT,
    }}>
      {/* Color area */}
      <div style={{ position: 'relative', marginBottom: S.sm }}>
        <canvas
          ref={areaRef}
          width={AREA_W}
          height={AREA_H}
          onPointerDown={e => areaRef.current && startDrag(e, handleAreaPointer, areaRef.current)}
          style={{
            width: AREA_W, height: AREA_H,
            borderRadius: R.control,
            cursor: 'default',
            display: 'block',
          }}
        />
        {/* Crosshair */}
        <div style={{
          position: 'absolute',
          left: crossX - 6, top: crossY - 6,
          width: 12, height: 12,
          borderRadius: '50%',
          border: '2px solid oklch(1 0 0)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Hue strip */}
      <div style={{ position: 'relative', marginBottom: S.md }}>
        <canvas
          ref={hueRef}
          width={AREA_W}
          height={HUE_H}
          onPointerDown={e => hueRef.current && startDrag(e, handleHuePointer, hueRef.current)}
          style={{
            width: AREA_W, height: HUE_H,
            borderRadius: HUE_H / 2,
            cursor: 'default',
            display: 'block',
          }}
        />
        {/* Hue indicator */}
        <div style={{
          position: 'absolute',
          left: hueX - 6, top: -2,
          width: 12, height: HUE_H + 4,
          borderRadius: HUE_H / 2,
          border: '2px solid oklch(1 0 0)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Preview swatch + gamut indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, marginBottom: S.md }}>
        <div style={{
          width: S.xxl, height: S.xxl,
          borderRadius: R.control,
          backgroundColor: previewHex,
          border: `1px solid ${N.border}`,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: T.pill, color: N.txtTer,
          fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
        }}>
          {previewHex}
        </span>
        {!inGamut && (
          <span style={{
            fontSize: T.label, color: A.accent, fontWeight: 500,
            marginLeft: 'auto',
          }}>
            out of sRGB
          </span>
        )}
      </div>

      {/* Format tabs */}
      <div style={{ display: 'flex', gap: S.xs, marginBottom: S.sm }}>
        <FormatTab label="OKLCH" active={format === 'oklch'} onClick={() => setFormat('oklch')} />
        <FormatTab label="HSL" active={format === 'hsl'} onClick={() => setFormat('hsl')} />
        <FormatTab label="Hex" active={format === 'hex'} onClick={() => setFormat('hex')} />
      </div>

      {/* Input fields */}
      <div style={{ display: 'flex', gap: S.sm, marginBottom: S.md }}>
        {format === 'oklch' && (
          <>
            <NumericInput label="L" value={l} onChange={setL} step={0.001} min={0} max={1} />
            <NumericInput label="C" value={c} onChange={setC} step={0.001} min={0} max={MAX_C} />
            <NumericInput label="H" value={h} onChange={setH} step={1} min={0} max={360} />
          </>
        )}
        {format === 'hsl' && (
          <>
            <NumericInput label="H" value={hslH} onChange={v => {
              const [nl, nc, nh] = hslToOklch(v, hslS, hslL)
              setL(nl); setC(nc); setH(nh)
            }} step={1} min={0} max={360} />
            <NumericInput label="S" value={hslS} onChange={v => {
              const [nl, nc, nh] = hslToOklch(hslH, v, hslL)
              setL(nl); setC(nc); setH(nh)
            }} step={1} min={0} max={100} />
            <NumericInput label="L" value={hslL} onChange={v => {
              const [nl, nc, nh] = hslToOklch(hslH, hslS, v)
              setL(nl); setC(nc); setH(nh)
            }} step={1} min={0} max={100} />
          </>
        )}
        {format === 'hex' && (
          <HexInput value={previewHex} onChange={hex => {
            const [nl, nc, nh] = hexToOklch(hex)
            setL(nl); setC(nc); setH(nh)
          }} />
        )}
      </div>

      {/* OKLCH output (always visible) */}
      {format !== 'oklch' && (
        <div style={{
          fontSize: T.pill, color: N.txtTer,
          fontFamily: 'SF Mono, Monaco, Inconsolata, monospace',
          marginBottom: S.md,
          padding: `${S.xs}px ${S.sm}px`,
          backgroundColor: N.canvas,
          borderRadius: R.control,
          border: `1px solid ${N.borderSoft}`,
        }}>
          oklch({l.toFixed(3)} {c.toFixed(3)} {Math.round(h)})
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
        {onDiscard && (
          <button
            onClick={onDiscard}
            onMouseEnter={() => setDiscardHover(true)}
            onMouseLeave={() => setDiscardHover(false)}
            style={{
              width: S.xxl, height: S.xxl, border: 'none',
              background: discardHover ? 'rgba(0,0,0,0.06)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: R.control, color: N.txtTer, cursor: 'default',
              transition: 'background-color 120ms ease',
            }}
            title="Discard change"
          >
            <Trash2 size={ICON.md} strokeWidth={1.5} />
          </button>
        )}
        <div style={{ flex: 1 }} />
        <button
          onClick={onCancel}
          onMouseEnter={() => setCancelHover(true)}
          onMouseLeave={() => setCancelHover(false)}
          style={{
            padding: `${S.sm}px ${S.md}px`,
            background: cancelHover ? 'rgba(0,0,0,0.03)' : 'transparent',
            color: N.txtSec,
            border: `1px solid ${N.border}`, borderRadius: R.card,
            fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            transition: 'background-color 120ms ease',
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(l, c, h)}
          onMouseEnter={() => setApplyHover(true)}
          onMouseLeave={() => setApplyHover(false)}
          style={{
            padding: `${S.sm}px ${S.md}px`,
            background: applyHover ? A.hover : A.accent,
            color: 'oklch(1 0 0)',
            border: 'none', borderRadius: R.card,
            fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            transition: 'background-color 120ms ease',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}
