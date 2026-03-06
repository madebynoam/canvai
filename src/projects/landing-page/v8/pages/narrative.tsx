/* ------------------------------------------------------------------ */
/*  Narrative — Grid-based editorial with vertical accent lines        */
/*  Inspired by: Visual Narratives, card grid, blue verticals         */
/* ------------------------------------------------------------------ */

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const S = {
  bg: 'oklch(0.985 0 0)',
  accent: 'oklch(0.65 0.15 240)',
  accentLight: 'oklch(0.92 0.04 240)',
  text: 'oklch(0.15 0 0)',
  textSecondary: 'oklch(0.45 0 0)',
  card: 'oklch(1 0 0)',
  cardBorder: 'oklch(0.92 0 0)',
}

function Nav() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 64px',
      borderBottom: `1px solid ${S.cardBorder}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28,
          height: 28,
          background: S.text,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: S.bg,
          fontSize: 14,
          fontWeight: 700,
        }}>C</div>
        <span style={{ fontSize: 18, fontWeight: 600, color: S.text }}>Bryllen</span>
      </div>
      <div style={{ display: 'flex', gap: 32, fontSize: 14, color: S.textSecondary }}>
        <span>Features</span>
        <span>Docs</span>
        <span>Pricing</span>
      </div>
      <button style={{
        padding: '10px 20px',
        background: S.text,
        color: S.bg,
        border: 'none',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'default',
      }}>Get Started</button>
    </nav>
  )
}

function VerticalLines() {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 64,
      bottom: 0,
      width: 200,
      display: 'flex',
      gap: 8,
      opacity: 0.6,
      pointerEvents: 'none',
    }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          width: 4,
          height: '100%',
          background: S.accent,
          borderRadius: 2,
        }} />
      ))}
    </div>
  )
}

function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '120px 64px',
      overflow: 'hidden',
    }}>
      <VerticalLines />
      <div style={{ maxWidth: 800 }}>
        <h1 style={{
          fontSize: 72,
          fontWeight: 700,
          color: S.text,
          lineHeight: 1.05,
          letterSpacing: -2,
          margin: 0,
          fontFamily: FONT,
        }}>
          Design<br />
          Narratives
        </h1>
        <p style={{
          fontSize: 20,
          color: S.textSecondary,
          lineHeight: 1.6,
          marginTop: 32,
          maxWidth: 500,
        }}>
          An infinite canvas where Claude Code generates design directions in real-time.
          Paste inspiration, annotate frames, iterate instantly.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
          <button style={{
            padding: '14px 28px',
            background: S.text,
            color: S.bg,
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'default',
          }}>Start Designing</button>
          <button style={{
            padding: '14px 28px',
            background: 'transparent',
            color: S.text,
            border: `1px solid ${S.cardBorder}`,
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'default',
          }}>Watch Demo</button>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, description, image }: { title: string; description: string; image: string }) {
  return (
    <div style={{
      background: S.card,
      border: `1px solid ${S.cardBorder}`,
      borderRadius: 12,
      overflow: 'hidden',
    }}>
      <div style={{
        height: 200,
        background: S.accentLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 48,
      }}>{image}</div>
      <div style={{ padding: 24 }}>
        <h3 style={{
          fontSize: 18,
          fontWeight: 600,
          color: S.text,
          margin: 0,
        }}>{title}</h3>
        <p style={{
          fontSize: 14,
          color: S.textSecondary,
          margin: 0,
          marginTop: 8,
          lineHeight: 1.5,
        }}>{description}</p>
      </div>
    </div>
  )
}

function Features() {
  const features = [
    { title: 'Infinite Canvas', description: 'Every design direction lives on one zoomable surface. Compare, iterate, evolve.', image: '🖼️' },
    { title: 'Context Images', description: 'Paste inspiration, Claude analyzes and generates matching designs.', image: '📸' },
    { title: 'Annotations', description: 'Click any element, describe changes, watch updates appear instantly.', image: '💬' },
    { title: 'Iterations', description: 'Freeze winning directions, branch into new explorations.', image: '🔀' },
    { title: 'Claude Vision', description: 'AI understands your reference images and extracts design patterns.', image: '👁️' },
    { title: 'Live Preview', description: 'Every frame is a real React component. Interactive, not mockups.', image: '⚡' },
  ]

  return (
    <section style={{ padding: '80px 64px', background: S.bg }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 48,
      }}>
        <div>
          <p style={{ fontSize: 13, color: S.accent, fontWeight: 600, margin: 0, letterSpacing: 1 }}>FEATURES</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: S.text, margin: 0, marginTop: 8 }}>Creative Flows</h2>
        </div>
        <span style={{ fontSize: 14, color: S.textSecondary }}>View all →</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
      }}>
        {features.map(f => <FeatureCard key={f.title} {...f} />)}
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section style={{
      padding: '80px 64px',
      background: S.text,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 48,
    }}>
      {[
        { value: '∞', label: 'Canvas Size' },
        { value: '3-5', label: 'Directions per prompt' },
        { value: '<2s', label: 'Live preview' },
        { value: '100%', label: 'React components' },
      ].map(s => (
        <div key={s.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: S.bg }}>{s.value}</div>
          <div style={{ fontSize: 14, color: 'oklch(0.7 0 0)', marginTop: 8 }}>{s.label}</div>
        </div>
      ))}
    </section>
  )
}

function CTA() {
  return (
    <section style={{
      padding: '120px 64px',
      textAlign: 'center',
      background: S.bg,
    }}>
      <h2 style={{
        fontSize: 48,
        fontWeight: 700,
        color: S.text,
        margin: 0,
      }}>Start your visual narrative</h2>
      <p style={{
        fontSize: 18,
        color: S.textSecondary,
        marginTop: 16,
        maxWidth: 500,
        marginInline: 'auto',
      }}>
        Design with AI that understands aesthetics, not just instructions.
      </p>
      <button style={{
        marginTop: 32,
        padding: '16px 32px',
        background: S.accent,
        color: 'white',
        border: 'none',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 500,
        cursor: 'default',
      }}>Get Started Free</button>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '48px 64px',
      borderTop: `1px solid ${S.cardBorder}`,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      color: S.textSecondary,
    }}>
      <span>© 2026 Bryllen. Built with Claude Code.</span>
      <div style={{ display: 'flex', gap: 24 }}>
        <span>GitHub</span>
        <span>Twitter</span>
        <span>Discord</span>
      </div>
    </footer>
  )
}

export function Narrative() {
  return (
    <div style={{
      minHeight: '100%',
      background: S.bg,
      fontFamily: FONT,
      WebkitFontSmoothing: 'antialiased',
      cursor: 'default',
    }}>
      <Nav />
      <Hero />
      <Features />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}
