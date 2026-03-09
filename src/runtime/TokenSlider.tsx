import { A, S, R, T, FONT, V } from './tokens'

export interface TokenSliderProps {
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
  onApply: (value: number) => void
  onCancel: () => void
}

export function TokenSlider({
  value,
  min,
  max,
  step = 1,
  unit = 'px',
  onChange,
  onApply,
  onCancel,
}: TokenSliderProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.sm,
        fontFamily: FONT,
      }}
    >
      {/* Value display */}
      <div style={{
        fontSize: T.ui,
        fontWeight: 500,
        color: V.txtPri,
        minWidth: 44,
        textAlign: 'right',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}{unit}
      </div>

      {/* Native range input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 120,
          height: 20,
          cursor: 'ew-resize',
          accentColor: A.accent,
        }}
      />

      {/* Apply button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onApply(value)
        }}
        style={{
          padding: `${S.xs}px ${S.sm}px`,
          fontSize: T.ui,
          fontWeight: 500,
          fontFamily: FONT,
          color: V.card,
          backgroundColor: A.accent,
          border: 'none',
          borderRadius: R.ui, cornerShape: 'squircle',
          cursor: 'default',
        } as React.CSSProperties}
      >
        Apply
      </button>

      {/* Cancel button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onCancel()
        }}
        style={{
          padding: `${S.xs}px ${S.sm}px`,
          fontSize: T.ui,
          fontWeight: 500,
          fontFamily: FONT,
          color: V.txtSec,
          backgroundColor: 'transparent',
          border: `1px solid ${V.border}`,
          borderRadius: R.ui, cornerShape: 'squircle',
          cursor: 'default',
        } as React.CSSProperties}
      >
        Cancel
      </button>
    </div>
  )
}
