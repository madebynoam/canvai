import { useState } from 'react'
import { S, R, T, FONT, N, A } from '../tokens'
import { Badge, Button } from '../components'

/**
 * Direction A — Editorial Hero
 * Bold, asymmetric layout with oversized headline and a tilted product shot placeholder.
 * Feels like a design-tool brand page (Figma, Linear style).
 */
export function LpHeroEditorial() {
  const [ctaHover, setCtaHover] = useState(false)

  return (
    <div style={{
      width: 720,
      minHeight: 520,
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
          <span style={{ fontSize: T.body, color: N.txtSec, cursor: 'default' }}>Docs</span>
          <span style={{ fontSize: T.body, color: N.txtSec, cursor: 'default' }}>Pricing</span>
          <Badge label="v0.1" variant="default" />
        </div>
      </nav>

      {/* Hero — asymmetric two-column */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: S.xxl,
        padding: `${S.xxl * 2}px ${S.xxl}px ${S.xxl}px`,
        alignItems: 'center',
      }}>
        {/* Left — oversized headline */}
        <div>
          <div style={{
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1.1,
            color: N.txtPri,
            letterSpacing: '-0.03em',
            marginBottom: S.lg,
            textWrap: 'pretty',
          }}>
            Design with
            <br />
            real code.
          </div>
          <div style={{
            fontSize: T.body,
            lineHeight: 1.6,
            color: N.txtSec,
            maxWidth: 300,
            marginBottom: S.xl,
            textWrap: 'pretty',
          }}>
            An infinite canvas where Claude generates multiple React components
            from your descriptions. Compare, iterate, ship.
          </div>
          <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
            <button
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={{
                padding: `${S.md}px ${S.xl}px`,
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
              Get started
            </button>
            <span style={{ fontSize: T.caption, color: N.txtTer }}>
              Free during beta
            </span>
          </div>
        </div>

        {/* Right — clean product preview (Bryllen canvas mockup) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: 280,
            height: 200,
            borderRadius: R.card,
            background: N.canvas,
            border: `1px solid ${N.border}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Toolbar */}
            <div style={{
              padding: `${S.xs + 2}px ${S.md}px`,
              borderBottom: `1px solid ${N.borderSoft}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ display: 'flex', gap: S.xs, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: 6, background: N.border }} />
                <div style={{ width: 6, height: 6, borderRadius: 6, background: N.border }} />
                <div style={{ width: 6, height: 6, borderRadius: 6, background: N.border }} />
              </div>
              <span style={{ fontSize: 8, color: N.txtFaint, fontFamily: FONT }}>my-project</span>
            </div>
            {/* Canvas area with frame cards */}
            <div style={{
              flex: 1,
              padding: S.md,
              background: N.canvas,
              display: 'flex',
              gap: S.sm,
              alignItems: 'stretch',
            }}>
              {/* Frame 1 */}
              <div style={{
                flex: 1,
                borderRadius: R.control,
                background: N.card,
                border: `1px solid ${N.borderSoft}`,
                padding: S.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: S.xs,
              }}>
                <div style={{ height: 4, width: '70%', borderRadius: 2, background: N.txtFaint, opacity: 0.3 }} />
                <div style={{ height: 3, width: '90%', borderRadius: 2, background: N.border }} />
                <div style={{ height: 3, width: '50%', borderRadius: 2, background: N.border }} />
                <div style={{ flex: 1 }} />
                <div style={{ height: 14, borderRadius: R.control, background: A.accent }} />
              </div>
              {/* Frame 2 */}
              <div style={{
                flex: 1,
                borderRadius: R.control,
                background: N.card,
                border: `1px solid ${N.borderSoft}`,
                padding: S.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: S.xs,
              }}>
                <div style={{ height: 20, borderRadius: R.control, background: A.muted }} />
                <div style={{ height: 3, width: '80%', borderRadius: 2, background: N.border }} />
                <div style={{ height: 3, width: '60%', borderRadius: 2, background: N.border }} />
                <div style={{ flex: 1 }} />
                <div style={{ height: 14, borderRadius: R.control, background: N.chromeSub }} />
              </div>
              {/* Frame 3 */}
              <div style={{
                flex: 1,
                borderRadius: R.control,
                background: N.card,
                border: `1px solid ${N.borderSoft}`,
                padding: S.sm,
                display: 'flex',
                flexDirection: 'column',
                gap: S.xs,
              }}>
                <div style={{ height: 4, width: '60%', borderRadius: 2, background: N.txtFaint, opacity: 0.3 }} />
                <div style={{ height: 3, width: '100%', borderRadius: 2, background: N.border }} />
                <div style={{ height: 3, width: '40%', borderRadius: 2, background: N.border }} />
                <div style={{ flex: 1 }} />
                <div style={{ height: 14, borderRadius: R.control, background: A.accent }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
