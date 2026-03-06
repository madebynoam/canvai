/* ------------------------------------------------------------------ */
/*  Studio — Overlapping cards aesthetic with bold orange accent       */
/*  Copy: Bryllen landing page                                          */
/* ------------------------------------------------------------------ */

const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const S = {
  bg: 'oklch(0.96 0.012 75)',      // Warm cream
  bgDark: 'oklch(0.15 0 0)',       // Near black
  text: 'oklch(0.12 0 0)',         // Dark text
  textMuted: 'oklch(0.45 0 0)',    // Muted
  textLight: 'oklch(0.92 0 0)',    // Light text on dark
  accent: 'oklch(0.58 0.22 28)',   // Bold orange-red
  border: 'oklch(0.88 0.015 75)',
}

function Nav() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '28px 64px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 400,
          color: S.text,
          fontFamily: SERIF,
        }}>— Bryllen</span>
      </div>
      <div style={{
        display: 'flex',
        gap: 40,
        fontSize: 12,
        color: S.textMuted,
        fontFamily: SANS,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}>
        <span>Features</span>
        <span>Docs</span>
        <span>Pricing</span>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section style={{
      position: 'relative',
      padding: '40px 64px 120px',
    }}>
      {/* Main content grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        alignItems: 'start',
      }}>
        {/* Left: Typography */}
        <div style={{ paddingTop: 40 }}>
          <p style={{
            fontSize: 12,
            color: S.textMuted,
            margin: 0,
            marginBottom: 24,
            fontFamily: SANS,
            lineHeight: 1.7,
            maxWidth: 320,
          }}>
            Design canvas for Claude Code. Generate
            real React components on an infinite surface —
            multiple directions at once.
          </p>
          <h1 style={{
            fontSize: 96,
            fontWeight: 400,
            color: S.text,
            lineHeight: 0.95,
            letterSpacing: -3,
            margin: 0,
            fontFamily: SERIF,
            marginTop: 100,
          }}>
            — SEE
            <br />
            EVERY
            <br />
            DIR /
          </h1>
        </div>

        {/* Right: Overlapping cards */}
        <div style={{
          position: 'relative',
          height: 500,
        }}>
          {/* Back card - canvas preview */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 340,
            height: 420,
            background: 'oklch(0.92 0.02 70)',
            borderRadius: 8,
            overflow: 'hidden',
            padding: 16,
          }}>
            {/* Mini canvas grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              height: '100%',
            }}>
              <div style={{ background: 'oklch(0.98 0.01 80)', borderRadius: 4 }} />
              <div style={{ background: 'oklch(0.2 0 0)', borderRadius: 4 }} />
              <div style={{ background: 'oklch(0.85 0.04 200)', borderRadius: 4 }} />
              <div style={{ background: 'oklch(0.75 0.06 40)', borderRadius: 4 }} />
            </div>
          </div>

          {/* Front card - orange with features */}
          <div style={{
            position: 'absolute',
            top: 80,
            right: 100,
            width: 300,
            height: 360,
            background: S.accent,
            borderRadius: 8,
            padding: 40,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {['INFINITE CANVAS', 'LIVE REACT', 'CONTEXT IMAGES'].map(item => (
                <span key={item} style={{
                  fontSize: 28,
                  fontWeight: 400,
                  color: 'white',
                  fontFamily: SERIF,
                  letterSpacing: -0.5,
                }}>— {item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section style={{
      padding: '80px 64px',
      background: S.bgDark,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 40,
      }}>
        {[
          { title: 'Multiple directions', items: ['3-5 per prompt', 'Side by side', 'Compare instantly'] },
          { title: 'Real components', items: ['React/TypeScript', 'Production-ready', 'Not mockups'] },
          { title: 'Context images', items: ['Drag inspiration', 'Visual reference', 'Direct to output'] },
        ].map((section, i) => (
          <div key={i}>
            <h3 style={{
              fontSize: 14,
              fontWeight: 500,
              color: S.textLight,
              margin: 0,
              marginBottom: 20,
              fontFamily: SANS,
            }}>{section.title}</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              {section.items.map(item => (
                <span key={item} style={{
                  fontSize: 13,
                  color: 'oklch(0.6 0 0)',
                  fontFamily: SANS,
                }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section style={{
      padding: '80px 64px',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 24,
        marginBottom: 24,
      }}>
        <div style={{
          height: 400,
          background: 'oklch(0.25 0.01 50)',
          borderRadius: 8,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontSize: 11,
            color: 'oklch(0.5 0 0)',
            fontFamily: SANS,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>How it works</span>
          <span style={{
            fontSize: 24,
            color: S.textLight,
            fontFamily: SERIF,
            marginTop: 8,
          }}>Prompt → Canvas → Code</span>
        </div>
        <div style={{
          height: 400,
          background: 'oklch(0.88 0.03 70)',
          borderRadius: 8,
        }} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 24,
      }}>
        <div style={{
          height: 300,
          background: S.accent,
          borderRadius: 8,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
          <span style={{
            fontSize: 24,
            color: 'white',
            fontFamily: SERIF,
          }}>View
            <br />documentation →</span>
        </div>
        <div style={{
          height: 300,
          background: 'oklch(0.92 0.02 75)',
          borderRadius: 8,
          padding: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <code style={{
            fontSize: 14,
            color: S.text,
            fontFamily: 'SF Mono, Consolas, monospace',
            opacity: 0.6,
          }}>npx canvai new my-project</code>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section style={{
      padding: '80px 64px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      borderTop: `1px solid ${S.border}`,
    }}>
      <div>
        <p style={{
          fontSize: 11,
          color: S.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          margin: 0,
          marginBottom: 24,
          fontFamily: SANS,
        }}>Why Bryllen</p>
        <p style={{
          fontSize: 24,
          fontWeight: 400,
          color: S.text,
          lineHeight: 1.5,
          margin: 0,
          fontFamily: SERIF,
        }}>
          Traditional design tools
          produce mockups.
          Bryllen outputs code.
        </p>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        paddingTop: 32,
      }}>
        <p style={{
          fontSize: 14,
          color: S.textMuted,
          lineHeight: 1.7,
          margin: 0,
          fontFamily: SANS,
        }}>
          Every frame on the canvas is a real React component.
          Claude Code generates production-ready TypeScript you can
          copy directly into your project.
        </p>
        <button style={{
          padding: '14px 28px',
          background: S.text,
          color: S.bg,
          border: 'none',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          fontFamily: SANS,
          cursor: 'default',
          alignSelf: 'flex-start',
        }}>Get started free</button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '48px 64px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${S.border}`,
    }}>
      <span style={{
        fontSize: 16,
        fontFamily: SERIF,
        color: S.text,
      }}>— Bryllen</span>
      <div style={{
        display: 'flex',
        gap: 32,
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
      }}>© 2026</span>
    </footer>
  )
}

export function Studio() {
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
      <Features />
      <Gallery />
      <About />
      <Footer />
    </div>
  )
}
