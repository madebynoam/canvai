/* ------------------------------------------------------------------ */
/*  Atelier — Warm minimal with strong typography, subtle orange       */
/*  Copy: Bryllen landing page                                          */
/* ------------------------------------------------------------------ */

const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const S = {
  bg: 'oklch(0.97 0.01 70)',       // Warm off-white
  bgWarm: 'oklch(0.94 0.02 65)',   // Warmer section
  bgDark: 'oklch(0.18 0 0)',       // Dark sections
  text: 'oklch(0.15 0 0)',         // Near black
  textMuted: 'oklch(0.5 0.01 50)', // Warm gray
  textLight: 'oklch(0.95 0 0)',
  accent: 'oklch(0.6 0.2 30)',     // Terracotta orange
  border: 'oklch(0.9 0.015 70)',
}

function Nav() {
  return (
    <nav style={{
      padding: '32px 80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{
        fontSize: 20,
        fontFamily: SERIF,
        color: S.text,
        fontStyle: 'italic',
      }}>Bryllen</span>
      <div style={{
        display: 'flex',
        gap: 48,
        fontSize: 13,
        color: S.text,
        fontFamily: SANS,
      }}>
        <span>Features</span>
        <span>How it works</span>
        <span>Docs</span>
        <span>Pricing</span>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section style={{
      padding: '60px 80px 100px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'center',
    }}>
      <div>
        <h1 style={{
          fontSize: 72,
          fontWeight: 400,
          color: S.text,
          lineHeight: 1.05,
          letterSpacing: -2,
          margin: 0,
          fontFamily: SERIF,
        }}>
          Design that
          <br />
          <em style={{ fontStyle: 'italic' }}>ships</em> as
          <br />
          code.
        </h1>
        <p style={{
          fontSize: 15,
          color: S.textMuted,
          lineHeight: 1.7,
          margin: 0,
          marginTop: 32,
          maxWidth: 400,
          fontFamily: SANS,
        }}>
          Bryllen is a design canvas for Claude Code. Every frame
          is a real React component. See multiple directions at once,
          iterate with annotations, ship production-ready code.
        </p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        height: 480,
      }}>
        <div style={{
          background: 'oklch(0.2 0 0)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 20,
        }}>
          <span style={{
            fontSize: 12,
            color: 'oklch(0.6 0 0)',
            fontFamily: SANS,
          }}>Direction A</span>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div style={{
            flex: 1,
            background: S.accent,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 20,
          }}>
            <span style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              fontFamily: SANS,
            }}>Direction B</span>
          </div>
          <div style={{
            flex: 1,
            background: 'oklch(0.88 0.03 75)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'flex-end',
            padding: 20,
          }}>
            <span style={{
              fontSize: 12,
              color: S.textMuted,
              fontFamily: SANS,
            }}>Direction C</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Statement() {
  return (
    <section style={{
      padding: '100px 80px',
      background: S.bgWarm,
    }}>
      <div style={{
        maxWidth: 900,
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 11,
          color: S.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 2,
          margin: 0,
          marginBottom: 32,
          fontFamily: SANS,
        }}>The problem</p>
        <h2 style={{
          fontSize: 42,
          fontWeight: 400,
          color: S.text,
          lineHeight: 1.4,
          margin: 0,
          fontFamily: SERIF,
        }}>
          "Design tools produce mockups. AI tools produce one idea.
          Bryllen produces multiple real components you can ship."
        </h2>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section style={{
      padding: '100px 80px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 48,
      }}>
        <div>
          <p style={{
            fontSize: 11,
            color: S.textMuted,
            textTransform: 'uppercase',
            letterSpacing: 2,
            margin: 0,
            marginBottom: 12,
            fontFamily: SANS,
          }}>Features</p>
          <h3 style={{
            fontSize: 32,
            fontWeight: 400,
            color: S.text,
            margin: 0,
            fontFamily: SERIF,
          }}>Everything you need</h3>
        </div>
        <span style={{
          fontSize: 13,
          color: S.accent,
          fontFamily: SANS,
          borderBottom: `1px solid ${S.accent}`,
          paddingBottom: 2,
        }}>View documentation →</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 32,
      }}>
        {[
          { name: 'Infinite Canvas', desc: 'Pan and zoom through your design space. No page limits.', color: 'oklch(0.82 0.04 80)' },
          { name: 'Multiple Directions', desc: '3-5 distinct designs per prompt, side by side.', color: 'oklch(0.25 0.02 40)' },
          { name: 'Context Images', desc: 'Drag inspiration onto the canvas. Claude sees it.', color: 'oklch(0.72 0.05 150)' },
        ].map((feature, i) => (
          <div key={i}>
            <div style={{
              height: 240,
              background: feature.color,
              borderRadius: 8,
              marginBottom: 20,
            }} />
            <h4 style={{
              fontSize: 18,
              fontWeight: 400,
              color: S.text,
              margin: 0,
              marginBottom: 6,
              fontFamily: SERIF,
            }}>{feature.name}</h4>
            <p style={{
              fontSize: 13,
              color: S.textMuted,
              margin: 0,
              lineHeight: 1.5,
              fontFamily: SANS,
            }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section style={{
      padding: '100px 80px',
      background: S.bgDark,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 120,
      }}>
        <div>
          <p style={{
            fontSize: 11,
            color: 'oklch(0.6 0 0)',
            textTransform: 'uppercase',
            letterSpacing: 2,
            margin: 0,
            marginBottom: 20,
            fontFamily: SANS,
          }}>How it works</p>
          <h3 style={{
            fontSize: 28,
            fontWeight: 400,
            color: S.textLight,
            lineHeight: 1.4,
            margin: 0,
            fontFamily: SERIF,
          }}>
            Prompt to
            <br />
            production.
          </h3>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px 64px',
        }}>
          {[
            { num: '01', title: 'Describe', desc: 'Tell Claude what you want. Add context images for inspiration.' },
            { num: '02', title: 'Generate', desc: 'See 3-5 distinct directions appear on your canvas.' },
            { num: '03', title: 'Annotate', desc: 'Click anywhere, describe changes. Watch them happen.' },
            { num: '04', title: 'Ship', desc: 'Copy the React code directly into your project.' },
          ].map(step => (
            <div key={step.num}>
              <span style={{
                fontSize: 11,
                color: S.accent,
                fontFamily: SANS,
              }}>{step.num}</span>
              <h4 style={{
                fontSize: 18,
                fontWeight: 400,
                color: S.textLight,
                margin: 0,
                marginTop: 12,
                marginBottom: 8,
                fontFamily: SERIF,
              }}>{step.title}</h4>
              <p style={{
                fontSize: 13,
                color: 'oklch(0.6 0 0)',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: SANS,
              }}>{step.desc}</p>
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
      padding: '100px 80px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'center',
    }}>
      <div>
        <p style={{
          fontSize: 11,
          color: S.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 2,
          margin: 0,
          marginBottom: 24,
          fontFamily: SANS,
        }}>Get started</p>
        <h3 style={{
          fontSize: 42,
          fontWeight: 400,
          color: S.text,
          lineHeight: 1.3,
          margin: 0,
          marginBottom: 24,
          fontFamily: SERIF,
        }}>
          Design with
          <br />
          Claude Code.
        </h3>
        <div style={{ display: 'flex', gap: 16 }}>
          <button style={{
            padding: '16px 32px',
            background: S.accent,
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: SANS,
            cursor: 'default',
          }}>Start free</button>
          <button style={{
            padding: '16px 32px',
            background: 'transparent',
            color: S.text,
            border: `1px solid ${S.border}`,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            fontFamily: SANS,
            cursor: 'default',
          }}>View docs</button>
        </div>
      </div>
      <div style={{
        height: 360,
        background: 'oklch(0.92 0.02 75)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <code style={{
          fontSize: 15,
          color: S.text,
          fontFamily: 'SF Mono, Consolas, monospace',
        }}>npx canvai new</code>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '48px 80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${S.border}`,
    }}>
      <span style={{
        fontSize: 16,
        fontFamily: SERIF,
        fontStyle: 'italic',
        color: S.text,
      }}>Bryllen</span>
      <div style={{
        display: 'flex',
        gap: 40,
        fontSize: 12,
        color: S.textMuted,
        fontFamily: SANS,
      }}>
        <span>GitHub</span>
        <span>Twitter</span>
        <span>Discord</span>
      </div>
      <span style={{
        fontSize: 12,
        color: S.textMuted,
        fontFamily: SANS,
      }}>© 2026 Bryllen</span>
    </footer>
  )
}

export function Atelier() {
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
      <Statement />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  )
}
