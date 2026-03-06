/**
 * Mosaic — Grid-heavy, pastel tones, playful icons, soft shadows
 * Inspired by Teenage Engineering / calculator aesthetic
 */

const COLORS = {
  bg: '#F8F6F4',
  card: '#FFFFFF',
  rose: '#F4A5A5',
  lavender: '#B5A5F4',
  sage: '#A5D9C8',
  butter: '#F4D9A5',
  sky: '#A5C9F4',
  charcoal: '#3D3D3D',
  muted: '#8A8A8A',
}

const ICONS = ['◐', '◇', '△', '○', '□', '◑', '▽', '◈', '▢']

function IconTile({ symbol, bg }: { symbol: string; bg: string }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        color: COLORS.charcoal,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {symbol}
    </div>
  )
}

function IconMosaic() {
  const tiles = [
    { symbol: '◐', bg: COLORS.rose },
    { symbol: '◇', bg: COLORS.lavender },
    { symbol: '△', bg: COLORS.sage },
    { symbol: '○', bg: COLORS.butter },
    { symbol: '□', bg: COLORS.sky },
    { symbol: '◑', bg: COLORS.rose },
    { symbol: '▽', bg: COLORS.lavender },
    { symbol: '◈', bg: COLORS.sage },
    { symbol: '▢', bg: COLORS.butter },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {tiles.map((tile, i) => (
        <IconTile key={i} symbol={tile.symbol} bg={tile.bg} />
      ))}
    </div>
  )
}

function PillTag({ children, color }: { children: string; color: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: 20,
        backgroundColor: color,
        fontSize: 13,
        fontWeight: 600,
        color: COLORS.charcoal,
      }}
    >
      {children}
    </span>
  )
}

function FeatureTile({
  title,
  desc,
  color,
}: {
  title: string
  desc: string
  color: string
}) {
  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 24,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: color,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          color: COLORS.charcoal,
        }}
      >
        ●
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.charcoal, marginBottom: 6 }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}

export function Mosaic() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100%',
        backgroundColor: COLORS.bg,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.lavender})`,
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>Bryllen</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 14, color: COLORS.muted }}>Features</span>
          <span style={{ fontSize: 14, color: COLORS.muted }}>Docs</span>
          <span style={{ fontSize: 14, color: COLORS.muted }}>Pricing</span>
        </div>
        <button
          style={{
            padding: '10px 20px',
            borderRadius: 12,
            background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.lavender})`,
            color: COLORS.charcoal,
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: '60px 64px 100px',
          display: 'flex',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <PillTag color={COLORS.sage}>Design</PillTag>
            <PillTag color={COLORS.butter}>Generate</PillTag>
            <PillTag color={COLORS.sky}>Ship</PillTag>
          </div>
          <h1
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: COLORS.charcoal,
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            See every
            <br />
            direction at once
          </h1>
          <p
            style={{
              fontSize: 17,
              color: COLORS.muted,
              lineHeight: 1.6,
              maxWidth: 420,
              marginBottom: 28,
            }}
          >
            An infinite canvas where Claude Code generates real React components.
            Pick the best, ship it.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: 14,
                background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.lavender})`,
                color: COLORS.charcoal,
                border: 'none',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Start Designing
            </button>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: 14,
                backgroundColor: 'transparent',
                color: COLORS.charcoal,
                border: `2px solid ${COLORS.charcoal}`,
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Watch Demo
            </button>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 28,
              padding: 36,
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            }}
          >
            <IconMosaic />
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div
                style={{
                  height: 6,
                  backgroundColor: COLORS.bg,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '72%',
                    height: '100%',
                    background: `linear-gradient(90deg, ${COLORS.rose}, ${COLORS.lavender})`,
                    borderRadius: 3,
                  }}
                />
              </div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 10 }}>
                Generating directions...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '0 64px 100px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          <FeatureTile
            title="Infinite Canvas"
            desc="Pan and zoom through unlimited design space."
            color={COLORS.rose}
          />
          <FeatureTile
            title="Real Components"
            desc="Production-ready React/TypeScript that ships."
            color={COLORS.lavender}
          />
          <FeatureTile
            title="Context Images"
            desc="Drag references onto the canvas. Claude sees them."
            color={COLORS.sage}
          />
          <FeatureTile
            title="Live Annotations"
            desc="Click anywhere, describe changes, see them applied."
            color={COLORS.butter}
          />
          <FeatureTile
            title="Version Control"
            desc="Freeze iterations, branch off, compare side by side."
            color={COLORS.sky}
          />
          <FeatureTile
            title="Ship to Production"
            desc="Export clean code. Design is development."
            color={COLORS.rose}
          />
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: '60px 64px',
          backgroundColor: COLORS.charcoal,
          borderRadius: 32,
          margin: '0 48px 80px',
          display: 'flex',
          justifyContent: 'center',
          gap: 100,
        }}
      >
        {[
          { value: '5+', label: 'Directions', color: COLORS.rose },
          { value: '<2s', label: 'Generation', color: COLORS.lavender },
          { value: '100%', label: 'Production', color: COLORS.sage },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 64px 100px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: COLORS.charcoal,
            marginBottom: 24,
          }}
        >
          Ready to see every direction?
        </h2>
        <button
          style={{
            padding: '16px 36px',
            borderRadius: 16,
            background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.lavender})`,
            color: COLORS.charcoal,
            border: 'none',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 64px',
          borderTop: `1px solid ${COLORS.muted}20`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 13, color: COLORS.muted }}>© 2025 Bryllen</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ fontSize: 13, color: COLORS.muted }}>Twitter</span>
          <span style={{ fontSize: 13, color: COLORS.muted }}>GitHub</span>
          <span style={{ fontSize: 13, color: COLORS.muted }}>Discord</span>
        </div>
      </footer>
    </div>
  )
}
