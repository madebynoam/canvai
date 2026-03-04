import { N, S, R, T, FONT } from '../tokens'

interface ScaleRowProps {
  label: string
  value: number | string
  preview?: 'box' | 'radius' | 'text'
}

export function ScaleRow({ label, value, preview = 'box' }: ScaleRowProps) {
  const numVal = typeof value === 'number' ? value : parseInt(value, 10)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: S.md,
      fontFamily: FONT, padding: `${S.xs}px 0`,
    }}>
      <div style={{ width: 64, fontSize: T.body, color: N.txtSec, flexShrink: 0 }}>{label}</div>
      <div style={{ width: 40, fontSize: T.pill, color: N.txtTer, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
        {typeof value === 'number' ? `${value}px` : value}
      </div>
      {preview === 'box' && (
        <div style={{
          width: numVal, height: S.sm,
          backgroundColor: N.txtTer, borderRadius: 1,
        }} />
      )}
      {preview === 'radius' && (
        <div style={{
          width: 32, height: 32,
          border: `2px solid ${N.txtTer}`,
          borderRadius: numVal,
        }} />
      )}
      {preview === 'text' && (
        <span style={{ fontSize: numVal, color: N.txtPri }}>Aa</span>
      )}
    </div>
  )
}
