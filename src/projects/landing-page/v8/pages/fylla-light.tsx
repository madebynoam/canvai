/* ------------------------------------------------------------------ */
/*  Fylla Light — Editorial serif, warm cream, portrait grid          */
/*  Inspired by: gola.io/FYLLA creative studio aesthetic              */
/* ------------------------------------------------------------------ */

const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const S = {
  bg: 'oklch(0.97 0.015 75)',
  text: 'oklch(0.12 0 0)',
  textMuted: 'oklch(0.45 0 0)',
  accent: 'oklch(0.92 0.02 75)',
  warm: 'oklch(0.94 0.025 70)',
  border: 'oklch(0.88 0.02 75)',
}

function Nav() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '28px 64px',
      borderBottom: `1px solid ${S.border}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 24,
          height: 24,
          background: S.text,
          borderRadius: 4,
        }} />
        <span style={{
          fontSize: 14,
          fontWeight: 600,
          color: S.text,
          fontFamily: SANS,
        }}>Bryllen</span>
      </div>
      <div style={{
        display: 'flex',
        gap: 36,
        fontSize: 13,
        color: S.textMuted,
        fontFamily: SANS,
      }}>
        <span>About</span>
        <span>Features</span>
        <span>Pricing</span>
        <span>Docs</span>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: S.textMuted, fontFamily: SANS }}>Log in</span>
        <button style={{
          padding: '10px 20px',
          background: S.text,
          color: S.bg,
          border: 'none',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          fontFamily: SANS,
          cursor: 'default',
        }}>Get Started</button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section style={{
      padding: '80px 64px 60px',
    }}>
      <p style={{
        fontSize: 11,
        color: S.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        margin: 0,
        marginBottom: 20,
        fontFamily: SANS,
      }}>Design tool</p>
      <h1 style={{
        fontSize: 64,
        fontWeight: 400,
        color: S.text,
        lineHeight: 1.1,
        letterSpacing: -1,
        margin: 0,
        fontFamily: SERIF,
        maxWidth: 700,
      }}>
        Design canvas
        <br />
        that inspires.
      </h1>
    </section>
  )
}

function PortraitGrid() {
  return (
    <section style={{
      padding: '0 64px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
      height: 400,
    }}>
      {/* Tall portrait left */}
      <div style={{
        background: 'linear-gradient(180deg, oklch(0.75 0.08 50) 0%, oklch(0.65 0.1 40) 100%)',
        borderRadius: 8,
        gridRow: 'span 2',
      }} />
      {/* Two smaller on right */}
      <div style={{
        background: 'oklch(0.78 0.06 140)',
        borderRadius: 8,
      }} />
      <div style={{
        background: 'oklch(0.88 0.04 80)',
        borderRadius: 8,
      }} />
      {/* Bottom row */}
      <div style={{
        background: 'oklch(0.72 0.05 200)',
        borderRadius: 8,
        gridColumn: 'span 2',
      }} />
    </section>
  )
}

function VisionStatement() {
  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      padding: '80px 64px',
      borderTop: `1px solid ${S.border}`,
    }}>
      <div>
        <p style={{
          fontSize: 11,
          color: S.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          margin: 0,
          marginBottom: 20,
          fontFamily: SANS,
        }}>Our vision</p>
        <h2 style={{
          fontSize: 36,
          fontWeight: 400,
          color: S.text,
          lineHeight: 1.35,
          margin: 0,
          fontFamily: SERIF,
        }}>
          Our vision is to connect
          with the world through
          innovation.
        </h2>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        paddingTop: 40,
      }}>
        {[
          { label: 'Vision', desc: 'See every design direction at once. Compare, iterate, decide.' },
          { label: 'Innovation', desc: 'Claude generates real React components, not mockups.' },
          { label: 'Connection', desc: 'Context images link inspiration directly to output.' },
        ].map(item => (
          <div key={item.label}>
            <h4 style={{
              fontSize: 14,
              fontWeight: 600,
              color: S.text,
              margin: 0,
              marginBottom: 6,
              fontFamily: SANS,
            }}>{item.label}</h4>
            <p style={{
              fontSize: 14,
              color: S.textMuted,
              lineHeight: 1.6,
              margin: 0,
              fontFamily: SANS,
            }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Team() {
  return (
    <section style={{
      padding: '80px 64px',
      background: S.warm,
    }}>
      <p style={{
        fontSize: 11,
        color: S.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        margin: 0,
        marginBottom: 12,
        fontFamily: SANS,
      }}>Our approach</p>
      <p style={{
        fontSize: 14,
        color: S.textMuted,
        lineHeight: 1.6,
        margin: 0,
        marginBottom: 48,
        maxWidth: 400,
        fontFamily: SANS,
      }}>
        Design tools should amplify creativity, not constrain it.
        We build for designers who think in systems.
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24,
      }}>
        {[
          { name: 'Infinite Canvas', role: 'Zoomable workspace' },
          { name: 'Multiple Directions', role: 'Side-by-side comparison' },
          { name: 'Context Images', role: 'Visual inspiration' },
          { name: 'Live Components', role: 'Real React code' },
        ].map((member, i) => (
          <div key={i}>
            <div style={{
              height: 280,
              background: i % 2 === 0 ? 'oklch(0.70 0.06 180)' : 'oklch(0.82 0.05 60)',
              borderRadius: 8,
              marginBottom: 16,
            }} />
            <h4 style={{
              fontSize: 15,
              fontWeight: 500,
              color: S.text,
              margin: 0,
              marginBottom: 4,
              fontFamily: SANS,
            }}>{member.name}</h4>
            <p style={{
              fontSize: 12,
              color: S.textMuted,
              margin: 0,
              fontFamily: SANS,
            }}>{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section style={{
      padding: '80px 64px',
      borderTop: `1px solid ${S.border}`,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 80,
      }}>
        <div>
          <p style={{
            fontSize: 11,
            color: S.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            margin: 0,
            marginBottom: 20,
            fontFamily: SANS,
          }}>Features</p>
          <h3 style={{
            fontSize: 28,
            fontWeight: 400,
            color: S.text,
            lineHeight: 1.3,
            margin: 0,
            fontFamily: SERIF,
          }}>
            Everything you need
            to design with AI.
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px 48px',
        }}>
          {[
            'Infinite zoomable canvas',
            'Multiple directions per prompt',
            'Context image analysis',
            'Live React components',
            'Real-time annotations',
            'Iteration management',
            'Claude Vision integration',
            'Production-ready export',
          ].map(f => (
            <div key={f} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 6,
                height: 6,
                background: S.text,
                borderRadius: '50%',
              }} />
              <span style={{
                fontSize: 14,
                color: S.text,
                fontFamily: SANS,
              }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section style={{
      padding: '100px 64px',
      background: S.text,
      textAlign: 'center',
    }}>
      <h2 style={{
        fontSize: 42,
        fontWeight: 400,
        color: S.bg,
        lineHeight: 1.2,
        margin: 0,
        marginBottom: 20,
        fontFamily: SERIF,
      }}>
        Ready to design
        <br />
        with clarity?
      </h2>
      <p style={{
        fontSize: 15,
        color: 'oklch(0.65 0 0)',
        margin: 0,
        marginBottom: 32,
        fontFamily: SANS,
      }}>Start free. No credit card required.</p>
      <button style={{
        padding: '14px 32px',
        background: S.bg,
        color: S.text,
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        fontFamily: SANS,
        cursor: 'default',
      }}>Get Started</button>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '40px 64px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: S.textMuted,
      fontFamily: SANS,
    }}>
      <span>© 2026 Bryllen</span>
      <div style={{ display: 'flex', gap: 32 }}>
        <span>GitHub</span>
        <span>Twitter</span>
        <span>Discord</span>
        <span>Privacy</span>
      </div>
    </footer>
  )
}

export function FyllaLight() {
  return (
    <div style={{
      minHeight: '100%',
      background: S.bg,
      fontFamily: SANS,
      WebkitFontSmoothing: 'antialiased',
      cursor: 'default',
    }}>
      <Nav />
      <Hero />
      <PortraitGrid />
      <VisionStatement />
      <Team />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}
