import { N, S, R, T, FONT } from '../../../../runtime/tokens'

interface SwatchProps {
  color: string
  label: string
  sublabel?: string
}

export function Swatch({ color, label, sublabel }: SwatchProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S.sm, fontFamily: FONT }}>
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
  )
}
