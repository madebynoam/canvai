import { S, R, T, FONT } from '../tokens'
import { TokenSwatch } from '../../../../runtime'
import { ScaleRow } from '../components'


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: S.xxl }}>
      <div style={{
        fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
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
      <div style={{ fontSize: T.title, fontWeight: 600, color: 'var(--txt-pri)', marginBottom: S.xl }}>
        OKLCH Token System — Live App
      </div>

      <Section title="Neutrals — white chrome">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--chrome)" label="chrome" sublabel="L=0.985 — sidebar, topbar" oklch={{ l: 0.985, c: 0.000, h: 90 }} tokenPath="--chrome" />
          <TokenSwatch color="var(--chrome-sub)" label="chromeSub" sublabel="L=0.955 — active bg" oklch={{ l: 0.955, c: 0.003, h: 80 }} tokenPath="--chrome-sub" />
          <TokenSwatch color="var(--canvas)" label="canvas" sublabel="L=0.972 — cool workspace" oklch={{ l: 0.972, c: 0.001, h: 197 }} tokenPath="--canvas" />
          <TokenSwatch color="var(--card)" label="card" sublabel="L=0.993 — cards, dropdowns" oklch={{ l: 0.993, c: 0.003, h: 80 }} tokenPath="--card" />
          <TokenSwatch color="var(--border)" label="border" sublabel="L=0.895 — chrome borders" oklch={{ l: 0.895, c: 0.005, h: 80 }} tokenPath="--border" />
          <TokenSwatch color="var(--border-soft)" label="borderSoft" sublabel="L=0.925 — soft borders" oklch={{ l: 0.925, c: 0.003, h: 80 }} tokenPath="--border-soft" />
          <TokenSwatch color="var(--txt-pri)" label="txtPri" sublabel="L=0.180 — primary text" oklch={{ l: 0.180, c: 0.005, h: 80 }} tokenPath="--txt-pri" />
          <TokenSwatch color="var(--txt-sec)" label="txtSec" sublabel="L=0.380 — secondary text" oklch={{ l: 0.380, c: 0.005, h: 80 }} tokenPath="--txt-sec" />
          <TokenSwatch color="var(--txt-ter)" label="txtTer" sublabel="L=0.540 — tertiary text" oklch={{ l: 0.540, c: 0.005, h: 80 }} tokenPath="--txt-ter" />
          <TokenSwatch color="var(--txt-faint)" label="txtFaint" sublabel="L=0.660 — ghost/placeholder" oklch={{ l: 0.660, c: 0.003, h: 80 }} tokenPath="--txt-faint" />
        </div>
      </Section>

      <Section title="Accent — charcoal (h=80, c=0.005)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--accent)" label="accent" sublabel="L=0.300 — primary action" oklch={{ l: 0.300, c: 0.005, h: 80 }} tokenPath="--accent" />
          <TokenSwatch color="var(--accent-hover)" label="hover" sublabel="L=0.400 — hover state" oklch={{ l: 0.400, c: 0.005, h: 80 }} tokenPath="--accent-hover" />
          <TokenSwatch color="var(--accent-muted)" label="muted" sublabel="L=0.920 — subtle bg" oklch={{ l: 0.920, c: 0.003, h: 80 }} tokenPath="--accent-muted" />
          <TokenSwatch color="var(--accent-strong)" label="strong" sublabel="L=0.220 — pressed state" oklch={{ l: 0.220, c: 0.005, h: 80 }} tokenPath="--accent-strong" />
          <TokenSwatch color="var(--accent-border)" label="border" sublabel="L=0.700 — accent borders" oklch={{ l: 0.700, c: 0.005, h: 80 }} tokenPath="--accent-border" />
        </div>
      </Section>

      <Section title="Watch — h=155">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--watch-bg)" label="bg" sublabel="L=0.92" oklch={{ l: 0.92, c: 0.04, h: 155 }} tokenPath="--watch-bg" />
          <TokenSwatch color="var(--watch-dot)" label="dot" sublabel="L=0.52" oklch={{ l: 0.52, c: 0.14, h: 155 }} tokenPath="--watch-dot" />
          <TokenSwatch color="var(--watch-text)" label="text" sublabel="L=0.40" oklch={{ l: 0.40, c: 0.12, h: 155 }} tokenPath="--watch-text" />
        </div>
      </Section>

      <Section title="Functional">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--fn-comment)" label="comment" sublabel="L=0.260" oklch={{ l: 0.260, c: 0.005, h: 80 }} tokenPath="--fn-comment" />
          <TokenSwatch color="var(--fn-resolved)" label="resolved" sublabel="L=0.700" oklch={{ l: 0.700, c: 0.003, h: 80 }} tokenPath="--fn-resolved" />
          <TokenSwatch color="var(--fn-success)" label="success" sublabel="h=155" oklch={{ l: 0.55, c: 0.14, h: 155 }} tokenPath="--fn-success" />
          <TokenSwatch color="var(--fn-danger)" label="danger" sublabel="h=28" oklch={{ l: 0.52, c: 0.20, h: 28 }} tokenPath="--fn-danger" />
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
    </div>
  )
}
