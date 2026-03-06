/* ------------------------------------------------------------------ */
/*  Werkstatt — Bold geometric with strong black/orange contrast       */
/*  Copy: Bryllen landing page                                          */
/* ------------------------------------------------------------------ */

const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const DISPLAY = 'system-ui, sans-serif'

const S = {
  bg: 'oklch(0.98 0.005 80)',      // Near white
  bgDark: 'oklch(0.12 0 0)',       // Pure black
  bgOrange: 'oklch(0.62 0.23 30)', // Bold orange
  text: 'oklch(0.1 0 0)',
  textMuted: 'oklch(0.55 0 0)',
  textLight: 'oklch(0.97 0 0)',
  border: 'oklch(0.92 0 0)',
}

function Nav() {
  return (
    <nav style={{
      padding: '24px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: S.bg,
    }}>
      <span style={{
        fontSize: 22,
        fontWeight: 700,
        color: S.text,
        fontFamily: DISPLAY,
        textTransform: 'uppercase',
        letterSpacing: -0.5,
      }}>CANVAI</span>
      <div style={{
        display: 'flex',
        gap: 32,
        fontSize: 11,
        color: S.text,
        fontFamily: SANS,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
      }}>
        <span>Features</span>
        <span>Docs</span>
        <span>Pricing</span>
        <span>GitHub</span>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      minHeight: 600,
    }}>
      {/* Left: Black with text */}
      <div style={{
        background: S.bgDark,
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontSize: 11,
            color: 'oklch(0.5 0 0)',
            textTransform: 'uppercase',
            letterSpacing: 2,
            margin: 0,
            marginBottom: 32,
            fontFamily: SANS,
          }}>Design canvas for Claude Code</p>
          <h1 style={{
            fontSize: 64,
            fontWeight: 700,
            color: S.textLight,
            lineHeight: 1,
            letterSpacing: -2,
            margin: 0,
            fontFamily: DISPLAY,
            textTransform: 'uppercase',
          }}>
            SEE
            <br />
            EVERY
            <br />
            DIRECTION
            <br />
            <span style={{ color: S.bgOrange }}>AT ONCE.</span>
          </h1>
        </div>
        <p style={{
          fontSize: 14,
          color: 'oklch(0.6 0 0)',
          lineHeight: 1.7,
          margin: 0,
          maxWidth: 320,
          fontFamily: SANS,
        }}>
          Multiple design directions on an infinite canvas.
          Real React components, not mockups.
        </p>
      </div>

      {/* Right: Orange with features */}
      <div style={{
        background: S.bgOrange,
        padding: '80px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {['INFINITE CANVAS', 'LIVE COMPONENTS', 'ANNOTATIONS', 'ITERATIONS'].map((item, i) => (
            <div key={item} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none',
            }}>
              <span style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'white',
                fontFamily: DISPLAY,
                letterSpacing: -1,
              }}>{item}</span>
              <span style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: SANS,
              }}>0{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section style={{
      padding: '60px',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 40,
      borderBottom: `1px solid ${S.border}`,
    }}>
      {[
        { num: '3-5', label: 'Directions per prompt' },
        { num: '∞', label: 'Canvas size' },
        { num: '0', label: 'Mockups to handoff' },
        { num: '1', label: 'Click to annotate' },
      ].map(stat => (
        <div key={stat.label}>
          <span style={{
            fontSize: 48,
            fontWeight: 700,
            color: S.text,
            fontFamily: DISPLAY,
            letterSpacing: -2,
          }}>{stat.num}</span>
          <p style={{
            fontSize: 12,
            color: S.textMuted,
            margin: 0,
            marginTop: 8,
            fontFamily: SANS,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>{stat.label}</p>
        </div>
      ))}
    </section>
  )
}

function Features() {
  return (
    <section style={{
      padding: '80px 60px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 48,
      }}>
        <h2 style={{
          fontSize: 14,
          fontWeight: 600,
          color: S.text,
          margin: 0,
          fontFamily: SANS,
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}>How It Works</h2>
        <span style={{
          fontSize: 12,
          color: S.textMuted,
          fontFamily: SANS,
        }}>View docs →</span>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: 24,
      }}>
        <div style={{
          height: 400,
          background: S.bgDark,
          borderRadius: 4,
          gridRow: 'span 2',
          position: 'relative',
          overflow: 'hidden',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <code style={{
            fontSize: 13,
            color: 'oklch(0.5 0 0)',
            fontFamily: 'SF Mono, Consolas, monospace',
          }}>npx canvai new my-project</code>
          <div>
            <h3 style={{
              fontSize: 24,
              fontWeight: 700,
              color: S.textLight,
              margin: 0,
              fontFamily: DISPLAY,
              textTransform: 'uppercase',
            }}>Start in seconds</h3>
            <p style={{
              fontSize: 12,
              color: 'oklch(0.5 0 0)',
              margin: 0,
              marginTop: 4,
              fontFamily: SANS,
            }}>One command to scaffold</p>
          </div>
        </div>
        <div style={{
          height: 188,
          background: 'oklch(0.92 0.02 75)',
          borderRadius: 4,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: S.text,
            fontFamily: SANS,
          }}>Context images</span>
          <span style={{
            fontSize: 12,
            color: S.textMuted,
            fontFamily: SANS,
          }}>Drag inspiration</span>
        </div>
        <div style={{
          height: 188,
          background: S.bgOrange,
          borderRadius: 4,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'white',
            fontFamily: SANS,
          }}>Annotations</span>
          <span style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: SANS,
          }}>Click to change</span>
        </div>
        <div style={{
          height: 188,
          background: 'oklch(0.85 0.03 180)',
          borderRadius: 4,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: S.text,
            fontFamily: SANS,
          }}>Iterations</span>
          <span style={{
            fontSize: 12,
            color: S.textMuted,
            fontFamily: SANS,
          }}>Freeze and branch</span>
        </div>
        <div style={{
          height: 188,
          background: 'oklch(0.75 0.05 50)',
          borderRadius: 4,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: S.text,
            fontFamily: SANS,
          }}>Real code</span>
          <span style={{
            fontSize: 12,
            color: S.textMuted,
            fontFamily: SANS,
          }}>React + TypeScript</span>
        </div>
      </div>
    </section>
  )
}

function Workflow() {
  return (
    <section style={{
      padding: '80px 60px',
      background: 'oklch(0.96 0.005 80)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 100,
      }}>
        <div>
          <h2 style={{
            fontSize: 14,
            fontWeight: 600,
            color: S.text,
            margin: 0,
            marginBottom: 20,
            fontFamily: SANS,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}>Workflow</h2>
          <p style={{
            fontSize: 14,
            color: S.textMuted,
            lineHeight: 1.7,
            margin: 0,
            fontFamily: SANS,
          }}>
            From prompt to production in minutes.
            No handoff, no translation, no mockups.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 40,
        }}>
          {[
            { step: '01', title: 'Prompt', desc: 'Describe what you want. Add context images.' },
            { step: '02', title: 'Generate', desc: 'See multiple directions appear on your canvas.' },
            { step: '03', title: 'Ship', desc: 'Copy React code directly into your project.' },
          ].map(item => (
            <div key={item.step}>
              <span style={{
                fontSize: 11,
                color: S.bgOrange,
                fontFamily: SANS,
                fontWeight: 600,
              }}>{item.step}</span>
              <h3 style={{
                fontSize: 20,
                fontWeight: 700,
                color: S.text,
                margin: 0,
                marginTop: 12,
                marginBottom: 8,
                fontFamily: DISPLAY,
                textTransform: 'uppercase',
              }}>{item.title}</h3>
              <p style={{
                fontSize: 13,
                color: S.textMuted,
                lineHeight: 1.6,
                margin: 0,
                fontFamily: SANS,
              }}>{item.desc}</p>
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
      padding: '100px 60px',
      background: S.bgDark,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <h2 style={{
          fontSize: 42,
          fontWeight: 700,
          color: S.textLight,
          margin: 0,
          fontFamily: DISPLAY,
          textTransform: 'uppercase',
          letterSpacing: -1,
        }}>
          READY TO
          <br />
          DESIGN?
        </h2>
      </div>
      <button style={{
        padding: '18px 40px',
        background: S.bgOrange,
        color: 'white',
        border: 'none',
        borderRadius: 4,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: SANS,
        textTransform: 'uppercase',
        letterSpacing: 1,
        cursor: 'default',
      }}>Get started free</button>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '32px 60px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: S.bg,
    }}>
      <span style={{
        fontSize: 18,
        fontWeight: 700,
        color: S.text,
        fontFamily: DISPLAY,
        textTransform: 'uppercase',
      }}>CANVAI</span>
      <div style={{
        display: 'flex',
        gap: 32,
        fontSize: 11,
        color: S.textMuted,
        fontFamily: SANS,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}>
        <span>GitHub</span>
        <span>Twitter</span>
        <span>Discord</span>
      </div>
      <span style={{
        fontSize: 11,
        color: S.textMuted,
        fontFamily: SANS,
      }}>© 2026 Bryllen</span>
    </footer>
  )
}

export function Werkstatt() {
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
      <Stats />
      <Features />
      <Workflow />
      <CTA />
      <Footer />
    </div>
  )
}
