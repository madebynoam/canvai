import { S, R, T, FONT } from '../tokens'
import { TokenSwatch } from '../../../../runtime'
import { ScaleRow } from '../components'

const FRAME_ID = 'v5-tokens'

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
        OKLCH Token System
      </div>

      <Section title="Neutrals — white chrome experiment">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--chrome)" label="chrome" sublabel="L=1.000 — white sidebar, topbar" oklch={{ l: 1.000, c: 0, h: 0 }} tokenPath="--chrome" frameId={FRAME_ID} />
          <TokenSwatch color="var(--chrome-sub)" label="chromeSub" sublabel="L=0.955 — active bg" oklch={{ l: 0.955, c: 0.003, h: 80 }} tokenPath="--chrome-sub" frameId={FRAME_ID} />
          <TokenSwatch color="var(--canvas)" label="canvas" sublabel="L=0.972 — workspace" oklch={{ l: 0.972, c: 0.003, h: 80 }} tokenPath="--canvas" frameId={FRAME_ID} />
          <TokenSwatch color="var(--card)" label="card" sublabel="L=0.993 — cards, dropdowns" oklch={{ l: 0.993, c: 0.003, h: 80 }} tokenPath="--card" frameId={FRAME_ID} />
          <TokenSwatch color="var(--border)" label="border" sublabel="L=0.895 — chrome borders" oklch={{ l: 0.895, c: 0.005, h: 80 }} tokenPath="--border" frameId={FRAME_ID} />
          <TokenSwatch color="var(--border-soft)" label="borderSoft" sublabel="L=0.925 — soft borders" oklch={{ l: 0.925, c: 0.003, h: 80 }} tokenPath="--border-soft" frameId={FRAME_ID} />
          <TokenSwatch color="var(--txt-pri)" label="txtPri" sublabel="L=0.180 — primary text" oklch={{ l: 0.180, c: 0.005, h: 80 }} tokenPath="--txt-pri" frameId={FRAME_ID} />
          <TokenSwatch color="var(--txt-sec)" label="txtSec" sublabel="L=0.380 — secondary text" oklch={{ l: 0.380, c: 0.005, h: 80 }} tokenPath="--txt-sec" frameId={FRAME_ID} />
          <TokenSwatch color="var(--txt-ter)" label="txtTer" sublabel="L=0.540 — tertiary text" oklch={{ l: 0.540, c: 0.005, h: 80 }} tokenPath="--txt-ter" frameId={FRAME_ID} />
          <TokenSwatch color="var(--txt-faint)" label="txtFaint" sublabel="L=0.660 — ghost/placeholder" oklch={{ l: 0.660, c: 0.003, h: 80 }} tokenPath="--txt-faint" frameId={FRAME_ID} />
        </div>
      </Section>

      <Section title="Accent — charcoal (h=80, c=0.005)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--accent)" label="accent" sublabel="L=0.30 — primary action" oklch={{ l: 0.300, c: 0.005, h: 80 }} tokenPath="--accent" frameId={FRAME_ID} />
          <TokenSwatch color="var(--accent-hover)" label="hover" sublabel="L=0.40 — hover state" oklch={{ l: 0.400, c: 0.005, h: 80 }} tokenPath="--accent-hover" frameId={FRAME_ID} />
          <TokenSwatch color="var(--accent-muted)" label="muted" sublabel="L=0.92 — subtle bg" oklch={{ l: 0.920, c: 0.003, h: 80 }} tokenPath="--accent-muted" frameId={FRAME_ID} />
          <TokenSwatch color="var(--accent-strong)" label="strong" sublabel="L=0.22 — pressed state" oklch={{ l: 0.220, c: 0.005, h: 80 }} tokenPath="--accent-strong" frameId={FRAME_ID} />
          <TokenSwatch color="var(--accent-border)" label="border" sublabel="L=0.70 — accent borders" oklch={{ l: 0.700, c: 0.005, h: 80 }} tokenPath="--accent-border" frameId={FRAME_ID} />
        </div>
      </Section>

      <Section title="Watch — h=155 (indicator green)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--watch-bg)" label="bg" sublabel="L=0.92" oklch={{ l: 0.92, c: 0.04, h: 155 }} tokenPath="--watch-bg" frameId={FRAME_ID} />
          <TokenSwatch color="var(--watch-dot)" label="dot" sublabel="L=0.52" oklch={{ l: 0.52, c: 0.14, h: 155 }} tokenPath="--watch-dot" frameId={FRAME_ID} />
          <TokenSwatch color="var(--watch-text)" label="text" sublabel="L=0.40" oklch={{ l: 0.40, c: 0.12, h: 155 }} tokenPath="--watch-text" frameId={FRAME_ID} />
        </div>
      </Section>

      <Section title="Functional">
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <TokenSwatch color="var(--fn-comment)" label="comment" sublabel="L=0.260" oklch={{ l: 0.260, c: 0.005, h: 80 }} tokenPath="--fn-comment" frameId={FRAME_ID} />
          <TokenSwatch color="var(--fn-resolved)" label="resolved" sublabel="L=0.700" oklch={{ l: 0.700, c: 0.003, h: 80 }} tokenPath="--fn-resolved" frameId={FRAME_ID} />
          <TokenSwatch color="var(--fn-success)" label="success" sublabel="h=155" oklch={{ l: 0.55, c: 0.14, h: 155 }} tokenPath="--fn-success" frameId={FRAME_ID} />
          <TokenSwatch color="var(--fn-danger)" label="danger" sublabel="h=28" oklch={{ l: 0.52, c: 0.20, h: 28 }} tokenPath="--fn-danger" frameId={FRAME_ID} />
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
