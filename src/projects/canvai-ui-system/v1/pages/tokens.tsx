import { N, A, E, W, F, S, R, T, ICON, FONT } from '../../../../runtime/tokens'
import { Swatch, ScaleRow } from '../components'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: S.xxl }}>
      <div style={{
        fontSize: T.label, fontWeight: 600, color: N.txtFaint,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: S.sm, fontFamily: FONT,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export function Tokens() {
  return (
    <div style={{ padding: S.xxl, fontFamily: FONT }}>
      <div style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri, marginBottom: S.xl }}>
        OKLCH Token System
      </div>

      <Section title="Neutrals — h=80, c=0.003">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={N.chrome} label="chrome" sublabel="L=0.952 — sidebar, topbar" />
          <Swatch color={N.chromeSub} label="chromeSub" sublabel="L=0.935 — active bg" />
          <Swatch color={N.canvas} label="canvas" sublabel="L=0.972 — workspace" />
          <Swatch color={N.card} label="card" sublabel="L=0.993 — cards, dropdowns" />
          <Swatch color={N.border} label="border" sublabel="L=0.895 — chrome borders" />
          <Swatch color={N.borderSoft} label="borderSoft" sublabel="L=0.925 — soft borders" />
          <Swatch color={N.txtPri} label="txtPri" sublabel="L=0.180 — primary text" />
          <Swatch color={N.txtSec} label="txtSec" sublabel="L=0.380 — secondary text" />
          <Swatch color={N.txtTer} label="txtTer" sublabel="L=0.540 — tertiary text" />
          <Swatch color={N.txtFaint} label="txtFaint" sublabel="L=0.660 — ghost/placeholder" />
        </div>
      </Section>

      <Section title="Accent — h=28 (signal red)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={A.accent} label="accent" sublabel="L=0.52 — primary action" />
          <Swatch color={A.hover} label="hover" sublabel="L=0.62 — hover state" />
          <Swatch color={A.muted} label="muted" sublabel="L=0.92 — subtle bg" />
          <Swatch color={A.strong} label="strong" sublabel="L=0.46 — pressed state" />
          <Swatch color={A.border} label="border" sublabel="L=0.85 — accent borders" />
        </div>
      </Section>

      <Section title="Watch — h=155 (indicator green)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={W.bg} label="bg" sublabel="L=0.92" />
          <Swatch color={W.dot} label="dot" sublabel="L=0.52" />
          <Swatch color={W.text} label="text" sublabel="L=0.40" />
        </div>
      </Section>

      <Section title="Functional">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={F.comment} label="comment" sublabel="L=0.260" />
          <Swatch color={F.resolved} label="resolved" sublabel="L=0.700" />
          <Swatch color={F.success} label="success" sublabel="h=155" />
          <Swatch color={F.danger} label="danger" sublabel="h=28" />
        </div>
      </Section>

      <Section title="Spacing — 4px grid">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(S).map(([key, val]) => (
            <ScaleRow key={key} label={`S.${key}`} value={val} preview="box" />
          ))}
        </div>
      </Section>

      <Section title="Radii">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(R).map(([key, val]) => (
            <ScaleRow key={key} label={`R.${key}`} value={val} preview="radius" />
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(T).map(([key, val]) => (
            <ScaleRow key={key} label={`T.${key}`} value={val} preview="text" />
          ))}
        </div>
      </Section>

      <Section title="Icon sizes">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(ICON).map(([key, val]) => (
            <ScaleRow key={key} label={`ICON.${key}`} value={val} preview="box" />
          ))}
        </div>
      </Section>

      <Section title="Elevation">
        <div style={{
          width: 200, height: 120,
          borderRadius: E.radius,
          backgroundColor: N.canvas,
          boxShadow: E.shadow,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: T.body, color: N.txtSec,
        }}>
          inset={E.inset} radius={E.radius}
        </div>
      </Section>
    </div>
  )
}
