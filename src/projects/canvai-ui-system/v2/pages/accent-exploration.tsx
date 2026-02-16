import { N, S, R, T, FONT } from '../../../../runtime/tokens'

const accents = [
  { name: 'Signal Red',  oklch: 'oklch(0.52 0.20 28)',  note: 'Current — Braun TG 60' },
  { name: 'Coral',       oklch: 'oklch(0.58 0.16 30)',  note: 'Softer, warmer red' },
  { name: 'Amber',       oklch: 'oklch(0.62 0.15 70)',  note: 'Warm gold — Vercel energy' },
  { name: 'Olive',       oklch: 'oklch(0.55 0.12 130)', note: 'Earthy, grounded' },
  { name: 'Emerald',     oklch: 'oklch(0.52 0.14 155)', note: 'Watch green — Braun SK 4' },
  { name: 'Teal',        oklch: 'oklch(0.55 0.12 185)', note: 'Stripe-like calm' },
  { name: 'Cyan',        oklch: 'oklch(0.55 0.14 215)', note: 'Fresh, Arc browser' },
  { name: 'Blue',        oklch: 'oklch(0.52 0.18 250)', note: 'Classic tech — GitHub' },
  { name: 'Indigo',      oklch: 'oklch(0.48 0.20 275)', note: 'Linear, deep focus' },
  { name: 'Violet',      oklch: 'oklch(0.50 0.20 300)', note: 'Creative, Figma' },
]

function AccentCard({ accent }: { accent: typeof accents[number] }) {
  return (
    <div style={{
      width: 200,
      backgroundColor: N.card,
      borderRadius: R.card,
      border: `1px solid ${N.borderSoft}`,
      overflow: 'hidden',
      fontFamily: FONT,
    }}>
      {/* Color swatch header */}
      <div style={{
        height: 48,
        backgroundColor: accent.oklch,
        display: 'flex',
        alignItems: 'flex-end',
        padding: `0 ${S.sm}px ${S.xs}px`,
      }}>
        <span style={{
          fontSize: T.pill, fontWeight: 600,
          color: 'oklch(1 0 0)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}>
          {accent.name}
        </span>
      </div>

      <div style={{ padding: S.md }}>
        {/* OKLCH value */}
        <div style={{
          fontSize: T.label, color: N.txtFaint,
          fontFamily: 'monospace', marginBottom: S.md,
        }}>
          {accent.oklch}
        </div>

        {/* Note */}
        <div style={{
          fontSize: T.caption, color: N.txtTer,
          marginBottom: S.lg, lineHeight: 1.4,
          textWrap: 'pretty',
        } as React.CSSProperties}>
          {accent.note}
        </div>

        {/* Button simulation */}
        <div style={{
          padding: `${S.xs}px ${S.md}px`,
          backgroundColor: accent.oklch,
          color: 'oklch(1 0 0)',
          borderRadius: R.control,
          fontSize: T.body,
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: S.sm,
        }}>
          Primary Action
        </div>

        {/* Muted badge */}
        <div style={{ display: 'flex', gap: S.sm, marginBottom: S.sm }}>
          <div style={{
            padding: `2px ${S.sm}px`,
            backgroundColor: accent.oklch.replace('0.52', '0.92').replace('0.55', '0.92').replace('0.58', '0.92').replace('0.62', '0.92').replace('0.48', '0.92').replace('0.50', '0.92'),
            color: accent.oklch,
            borderRadius: R.pill,
            fontSize: T.label,
            fontWeight: 500,
          }}>
            Badge
          </div>
          <div style={{
            width: S.xl,
            height: S.xl,
            borderRadius: '50%',
            backgroundColor: accent.oklch,
            color: 'oklch(1 0 0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: T.pill,
            fontWeight: 600,
          }}>
            C
          </div>
        </div>

        {/* Outline variant */}
        <div style={{
          padding: `${S.xs}px ${S.md}px`,
          backgroundColor: 'transparent',
          color: accent.oklch,
          border: `1px solid ${accent.oklch}`,
          borderRadius: R.control,
          fontSize: T.body,
          fontWeight: 500,
          textAlign: 'center',
          marginBottom: S.sm,
        }}>
          Secondary
        </div>

        {/* Text link */}
        <div style={{
          fontSize: T.body, color: accent.oklch,
          fontWeight: 500,
        }}>
          Text link style
        </div>
      </div>
    </div>
  )
}

export function AccentExploration() {
  return (
    <div style={{ padding: S.xxl, fontFamily: FONT }}>
      <div style={{
        fontSize: T.title, fontWeight: 600,
        color: N.txtPri, marginBottom: S.xs,
      }}>
        Accent Color Exploration
      </div>
      <div style={{
        fontSize: T.body, color: N.txtTer,
        marginBottom: S.xl,
      }}>
        10 OKLCH accents — same perceptual framework, different hues.
        Pick one to replace signal red.
      </div>

      {/* Grid of accent cards — 5 per row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: S.lg,
      }}>
        {accents.map(accent => (
          <AccentCard key={accent.name} accent={accent} />
        ))}
      </div>
    </div>
  )
}
