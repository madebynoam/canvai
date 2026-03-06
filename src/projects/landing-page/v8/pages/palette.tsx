/**
 * Palette — Bold color blocks, chunky buttons, warm tones
 * Inspired by Teenage Engineering / calculator aesthetic
 */

const COLORS = {
  bg: '#FDF6E3',
  card: '#FFFFFF',
  coral: '#FF6B5B',
  mint: '#5BDBB0',
  sky: '#5BA8FF',
  peach: '#FFB36B',
  plum: '#9B6BFF',
  charcoal: '#2D3436',
  stone: '#636E72',
}

function ColorBlock({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 12,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', opacity: 0.9 }}>
        {label}
      </span>
    </div>
  )
}

function ChunkyButton({ children, primary }: { children: string; primary?: boolean }) {
  return (
    <button
      style={{
        padding: '16px 32px',
        borderRadius: 16,
        backgroundColor: primary ? COLORS.coral : COLORS.card,
        color: primary ? '#fff' : COLORS.charcoal,
        border: primary ? 'none' : `2px solid ${COLORS.charcoal}`,
        fontSize: 16,
        fontWeight: 700,
        boxShadow: primary ? '0 4px 0 #D94A3A' : `0 4px 0 ${COLORS.charcoal}`,
        transform: 'translateY(-2px)',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

function FeatureBlock({
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
        borderRadius: 24,
        padding: 28,
        border: `3px solid ${COLORS.charcoal}`,
        boxShadow: `6px 6px 0 ${color}`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          backgroundColor: color,
          marginBottom: 16,
        }}
      />
      <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: COLORS.stone, lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}

export function Palette() {
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
          padding: '20px 60px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: COLORS.coral,
              border: `3px solid ${COLORS.charcoal}`,
            }}
          />
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.charcoal }}>
            Bryllen
          </span>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>Features</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>Docs</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: COLORS.charcoal }}>Pricing</span>
        </div>
        <ChunkyButton>Try Free</ChunkyButton>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: '60px 60px 100px',
          display: 'flex',
          gap: 60,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: COLORS.charcoal,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Every direction,
            <br />
            <span style={{ color: COLORS.coral }}>all at once.</span>
          </h1>
          <p
            style={{
              fontSize: 18,
              color: COLORS.stone,
              lineHeight: 1.6,
              maxWidth: 440,
              marginBottom: 28,
            }}
          >
            An infinite canvas where Claude Code generates real React components.
            See multiple directions, pick the best, ship it.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <ChunkyButton primary>Start Designing</ChunkyButton>
            <ChunkyButton>See Demo</ChunkyButton>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 28,
              padding: 40,
              border: `3px solid ${COLORS.charcoal}`,
              boxShadow: `8px 8px 0 ${COLORS.mint}`,
            }}
          >
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <ColorBlock color={COLORS.coral} label="01" />
              <ColorBlock color={COLORS.mint} label="02" />
              <ColorBlock color={COLORS.sky} label="03" />
              <ColorBlock color={COLORS.peach} label="04" />
              <ColorBlock color={COLORS.plum} label="05" />
              <ColorBlock color={COLORS.charcoal} label="06" />
            </div>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: COLORS.mint,
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.charcoal,
                }}
              >
                6 directions ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 60px 100px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
          }}
        >
          <FeatureBlock
            title="Infinite Canvas"
            desc="Pan and zoom through unlimited design space."
            color={COLORS.coral}
          />
          <FeatureBlock
            title="Real Components"
            desc="Production-ready React/TypeScript that ships."
            color={COLORS.mint}
          />
          <FeatureBlock
            title="Context Images"
            desc="Drag references onto the canvas. Claude sees them."
            color={COLORS.sky}
          />
          <FeatureBlock
            title="Live Annotations"
            desc="Click anywhere, describe changes, see them applied."
            color={COLORS.peach}
          />
          <FeatureBlock
            title="Version Control"
            desc="Freeze iterations, branch off, compare side by side."
            color={COLORS.plum}
          />
          <FeatureBlock
            title="Ship to Production"
            desc="Export clean code. Design is development."
            color={COLORS.charcoal}
          />
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: '60px',
          backgroundColor: COLORS.charcoal,
          display: 'flex',
          justifyContent: 'center',
          gap: 100,
        }}
      >
        {[
          { value: '5+', label: 'Directions per prompt' },
          { value: '<2s', label: 'Generation time' },
          { value: '100%', label: 'Production-ready' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: COLORS.coral }}>{stat.value}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.stone }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 60px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: COLORS.charcoal,
            marginBottom: 24,
          }}
        >
          Ready to see every direction?
        </h2>
        <ChunkyButton primary>Get Started Free</ChunkyButton>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 60px',
          borderTop: `3px solid ${COLORS.charcoal}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>
          © 2025 Bryllen
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>Twitter</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>GitHub</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>Discord</span>
        </div>
      </footer>
    </div>
  )
}
