/**
 * Playful — Retro-modern, colorful icons, grid-based
 * Inspired by Teenage Engineering / calculator aesthetic
 */

const COLORS = {
  bg: '#F5F3EE',
  card: '#FFFFFF',
  red: '#E54D2E',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  green: '#22C55E',
  navy: '#1E293B',
  gray: '#94A3B8',
}

function IconGrid() {
  const icons = [
    { bg: COLORS.red, symbol: '◐' },
    { bg: COLORS.blue, symbol: '◇' },
    { bg: COLORS.yellow, symbol: '△' },
    { bg: COLORS.green, symbol: '○' },
    { bg: COLORS.navy, symbol: '□' },
    { bg: COLORS.gray, symbol: '▽' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {icons.map((icon, i) => (
        <div
          key={i}
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: icon.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            color: '#fff',
          }}
        >
          {icon.symbol}
        </div>
      ))}
    </div>
  )
}

function FeatureCard({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 32,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: color,
          marginBottom: 20,
        }}
      />
      <h3 style={{ fontSize: 20, fontWeight: 600, color: COLORS.navy, marginBottom: 8 }}>
        {title}
      </h3>
      <p style={{ fontSize: 15, color: COLORS.gray, lineHeight: 1.5 }}>{desc}</p>
    </div>
  )
}

export function Playful() {
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
          padding: '24px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: COLORS.red,
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.navy }}>Bryllen</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <span style={{ fontSize: 14, color: COLORS.gray }}>Features</span>
          <span style={{ fontSize: 14, color: COLORS.gray }}>Docs</span>
          <span style={{ fontSize: 14, color: COLORS.gray }}>Pricing</span>
        </div>
        <button
          style={{
            padding: '10px 20px',
            borderRadius: 12,
            backgroundColor: COLORS.navy,
            color: '#fff',
            border: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: '80px 80px 120px',
          display: 'flex',
          gap: 80,
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: COLORS.navy,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Design with
            <br />
            <span style={{ color: COLORS.red }}>every direction</span>
            <br />
            at once
          </h1>
          <p
            style={{
              fontSize: 18,
              color: COLORS.gray,
              lineHeight: 1.6,
              maxWidth: 480,
              marginBottom: 32,
            }}
          >
            An infinite canvas where Claude Code generates real React components.
            See 5 directions, pick the best, ship it.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: 14,
                backgroundColor: COLORS.red,
                color: '#fff',
                border: 'none',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Start Designing
            </button>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: 14,
                backgroundColor: 'transparent',
                color: COLORS.navy,
                border: `2px solid ${COLORS.navy}`,
                fontSize: 16,
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
              borderRadius: 32,
              padding: 48,
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <IconGrid />
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: COLORS.gray, marginBottom: 8 }}>
                Generating directions...
              </div>
              <div
                style={{
                  height: 8,
                  backgroundColor: '#E2E8F0',
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '65%',
                    height: '100%',
                    backgroundColor: COLORS.blue,
                    borderRadius: 4,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '0 80px 120px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          <FeatureCard
            title="Infinite Canvas"
            desc="Pan and zoom through unlimited design space. Every iteration lives forever."
            color={COLORS.blue}
          />
          <FeatureCard
            title="Real Components"
            desc="Not mockups. Production-ready React/TypeScript that ships."
            color={COLORS.green}
          />
          <FeatureCard
            title="Context Images"
            desc="Drag reference images onto the canvas. Claude sees what inspires you."
            color={COLORS.yellow}
          />
          <FeatureCard
            title="Live Annotations"
            desc="Click anywhere, describe changes, see them applied instantly."
            color={COLORS.red}
          />
          <FeatureCard
            title="Version Control"
            desc="Freeze iterations, branch off, compare directions side by side."
            color={COLORS.navy}
          />
          <FeatureCard
            title="Ship to Production"
            desc="Export clean code. No handoff friction. Design is development."
            color={COLORS.gray}
          />
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          padding: '80px',
          backgroundColor: COLORS.navy,
          display: 'flex',
          justifyContent: 'center',
          gap: 120,
        }}
      >
        {[
          { value: '5+', label: 'Directions per prompt' },
          { value: '<2s', label: 'Generation time' },
          { value: '100%', label: 'Production-ready' },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, fontWeight: 700, color: '#fff' }}>{stat.value}</div>
            <div style={{ fontSize: 16, color: COLORS.gray }}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 80px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 48, fontWeight: 700, color: COLORS.navy, marginBottom: 24 }}>
          Ready to see every direction?
        </h2>
        <button
          style={{
            padding: '18px 40px',
            borderRadius: 16,
            backgroundColor: COLORS.red,
            color: '#fff',
            border: 'none',
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 80px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 14, color: COLORS.gray }}>© 2025 Bryllen</span>
        <div style={{ display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 14, color: COLORS.gray }}>Twitter</span>
          <span style={{ fontSize: 14, color: COLORS.gray }}>GitHub</span>
          <span style={{ fontSize: 14, color: COLORS.gray }}>Discord</span>
        </div>
      </footer>
    </div>
  )
}
