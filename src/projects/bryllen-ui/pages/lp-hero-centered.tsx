import { useState } from 'react'
import { S, R, T, FONT, N, A } from '../tokens'
import { Badge } from '../components'

/**
 * Direction B — Centered Product Hero
 * Minimal, centered layout with a feature grid below.
 * Feels like a modern SaaS page (Vercel, Raycast style).
 */

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: S.xl,
        background: hovered ? N.card : 'transparent',
        borderRadius: R.card,
        border: `1px solid ${hovered ? N.border : N.borderSoft}`,
        transition: 'all 150ms ease',
        cursor: 'default',
      }}
    >
      <div style={{
        width: 28,
        height: 28,
        borderRadius: R.control,
        background: A.muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        marginBottom: S.md,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: T.title,
        fontWeight: 600,
        color: N.txtPri,
        marginBottom: S.xs,
      }}>
        {title}
      </div>
      <div style={{
        fontSize: T.body,
        color: N.txtTer,
        lineHeight: 1.5,
        textWrap: 'pretty',
      }}>
        {desc}
      </div>
    </div>
  )
}

export function LpHeroCentered() {
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <div style={{
      width: 720,
      minHeight: 580,
      background: N.chrome,
      borderRadius: R.panel,
      border: `1px solid ${N.border}`,
      overflow: 'hidden',
      fontFamily: FONT,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${S.lg}px ${S.xxl}px`,
        borderBottom: `1px solid ${N.borderSoft}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
          <div style={{
            width: 20,
            height: 20,
            borderRadius: R.control,
            background: A.accent,
          }} />
          <span style={{ fontSize: T.title, fontWeight: 700, color: N.txtPri }}>
            Bryllen
          </span>
        </div>
        <div style={{ display: 'flex', gap: S.xl, alignItems: 'center' }}>
          <span style={{ fontSize: T.body, color: N.txtSec, cursor: 'default' }}>Features</span>
          <span style={{ fontSize: T.body, color: N.txtSec, cursor: 'default' }}>GitHub</span>
        </div>
      </nav>

      {/* Hero — centered */}
      <div style={{
        textAlign: 'center',
        padding: `${S.xxl * 2}px ${S.xxl * 2}px ${S.xxl}px`,
      }}>
        <Badge label="Now in beta" variant="accent" />
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          lineHeight: 1.15,
          color: N.txtPri,
          letterSpacing: '-0.025em',
          marginTop: S.lg,
          marginBottom: S.md,
        }}>
          The infinite canvas
          <br />
          for Claude Code
        </div>
        <div style={{
          fontSize: T.body,
          lineHeight: 1.6,
          color: N.txtSec,
          maxWidth: 360,
          margin: `0 auto ${S.xl}px`,
          textWrap: 'pretty',
        }}>
          Describe what you want. See multiple real components side by side.
          Pick the best one and ship it.
        </div>
        <button
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            padding: `${S.md}px ${S.xxl}px`,
            background: ctaHover ? A.hover : A.accent,
            color: 'oklch(0.99 0 0)',
            border: 'none',
            borderRadius: R.pill,
            fontSize: T.body,
            fontWeight: 600,
            fontFamily: FONT,
            cursor: 'default',
          }}
        >
          Install Bryllen
        </button>
      </div>

      {/* Feature grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: S.md,
        padding: `${S.lg}px ${S.xxl}px ${S.xxl}px`,
      }}>
        <FeatureCard
          icon="+"
          title="Explore"
          desc="Generate 3-5 directions from a single prompt"
        />
        <FeatureCard
          icon="~"
          title="Iterate"
          desc="Click any element, describe the change"
        />
        <FeatureCard
          icon=">"
          title="Ship"
          desc="Pick the winner and export real code"
        />
      </div>
    </div>
  )
}
