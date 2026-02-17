import { N, A, E, W, F, S, R, T, ICON, FONT } from '../tokens'
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

      <Section title="Neutrals — white chrome experiment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={N.chrome} label="chrome" sublabel="L=1.000 — white sidebar, topbar" oklch={{ l: 1.000, c: 0, h: 0 }} />
          <Swatch color={N.chromeSub} label="chromeSub" sublabel="L=0.955 — active bg" oklch={{ l: 0.955, c: 0.003, h: 80 }} />
          <Swatch color={N.canvas} label="canvas" sublabel="L=0.972 — workspace" oklch={{ l: 0.972, c: 0.003, h: 80 }} />
          <Swatch color={N.card} label="card" sublabel="L=0.993 — cards, dropdowns" oklch={{ l: 0.993, c: 0.003, h: 80 }} />
          <Swatch color={N.border} label="border" sublabel="L=0.895 — chrome borders" oklch={{ l: 0.895, c: 0.005, h: 80 }} />
          <Swatch color={N.borderSoft} label="borderSoft" sublabel="L=0.925 — soft borders" oklch={{ l: 0.925, c: 0.003, h: 80 }} />
          <Swatch color={N.txtPri} label="txtPri" sublabel="L=0.180 — primary text" oklch={{ l: 0.180, c: 0.005, h: 80 }} />
          <Swatch color={N.txtSec} label="txtSec" sublabel="L=0.380 — secondary text" oklch={{ l: 0.380, c: 0.005, h: 80 }} />
          <Swatch color={N.txtTer} label="txtTer" sublabel="L=0.540 — tertiary text" oklch={{ l: 0.540, c: 0.005, h: 80 }} />
          <Swatch color={N.txtFaint} label="txtFaint" sublabel="L=0.660 — ghost/placeholder" oklch={{ l: 0.660, c: 0.003, h: 80 }} />
        </div>
      </Section>

      <Section title="Accent — charcoal (h=80, c=0.005)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={A.accent} label="accent" sublabel="L=0.30 — primary action" oklch={{ l: 0.300, c: 0.005, h: 80 }} />
          <Swatch color={A.hover} label="hover" sublabel="L=0.40 — hover state" oklch={{ l: 0.400, c: 0.005, h: 80 }} />
          <Swatch color={A.muted} label="muted" sublabel="L=0.92 — subtle bg" oklch={{ l: 0.920, c: 0.003, h: 80 }} />
          <Swatch color={A.strong} label="strong" sublabel="L=0.22 — pressed state" oklch={{ l: 0.220, c: 0.005, h: 80 }} />
          <Swatch color={A.border} label="border" sublabel="L=0.70 — accent borders" oklch={{ l: 0.700, c: 0.005, h: 80 }} />
        </div>
      </Section>

      <Section title="Watch — h=155 (indicator green)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={W.bg} label="bg" sublabel="L=0.92" oklch={{ l: 0.92, c: 0.04, h: 155 }} />
          <Swatch color={W.dot} label="dot" sublabel="L=0.52" oklch={{ l: 0.52, c: 0.14, h: 155 }} />
          <Swatch color={W.text} label="text" sublabel="L=0.40" oklch={{ l: 0.40, c: 0.12, h: 155 }} />
        </div>
      </Section>

      <Section title="Functional">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <Swatch color={F.comment} label="comment" sublabel="L=0.260" oklch={{ l: 0.260, c: 0.005, h: 80 }} />
          <Swatch color={F.resolved} label="resolved" sublabel="L=0.700" oklch={{ l: 0.700, c: 0.003, h: 80 }} />
          <Swatch color={F.success} label="success" sublabel="h=155" oklch={{ l: 0.55, c: 0.14, h: 155 }} />
          <Swatch color={F.danger} label="danger" sublabel="h=28" oklch={{ l: 0.52, c: 0.20, h: 28 }} />
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
