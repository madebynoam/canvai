/* ------------------------------------------------------------------ */
/*  Statement — Minimalist large typography, warm off-white           */
/*  Inspired by: Designer portfolio, clarity/simplicity/logic         */
/* ------------------------------------------------------------------ */

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const S = {
  bg: 'oklch(0.97 0.01 80)',
  text: 'oklch(0.15 0 0)',
  textSecondary: 'oklch(0.50 0 0)',
  accent: 'oklch(0.20 0 0)',
  cardBg: 'oklch(0.94 0.01 80)',
}

function Nav() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '32px 80px',
    }}>
      <div style={{ fontSize: 13, color: S.textSecondary }}>
        <span style={{ fontWeight: 600, color: S.text }}>Canvai</span>
        <br />
        Design Canvas
      </div>
      <div style={{ display: 'flex', gap: 40, fontSize: 14, color: S.textSecondary }}>
        <span>About</span>
        <span>Features</span>
        <span>Pricing</span>
      </div>
      <div style={{
        width: 32,
        height: 32,
        background: S.text,
        borderRadius: '50%',
      }} />
    </nav>
  )
}

function Hero() {
  return (
    <section style={{
      padding: '80px 80px 120px',
      maxWidth: 1100,
    }}>
      <p style={{
        fontSize: 13,
        color: S.textSecondary,
        margin: 0,
        marginBottom: 24,
      }}>
        Design tool for
        <br />
        Claude Code
      </p>
      <h1 style={{
        fontSize: 52,
        fontWeight: 400,
        color: S.text,
        lineHeight: 1.25,
        letterSpacing: -0.5,
        margin: 0,
        fontFamily: FONT,
        maxWidth: 900,
      }}>
        Infinite canvas creating scalable
        design directions with AI, striving
        for clarity, simplicity & iteration.
      </h1>
    </section>
  )
}

function WorkGrid() {
  const works = [
    { title: 'Context Images', aspect: 'tall', bg: 'oklch(0.25 0 0)' },
    { title: 'Live Annotations', aspect: 'wide', bg: 'oklch(0.35 0.05 240)' },
    { title: 'Iteration Flow', aspect: 'square', bg: 'oklch(0.92 0.02 60)' },
    { title: 'Claude Vision', aspect: 'tall', bg: 'oklch(0.88 0.04 30)' },
  ]

  return (
    <section style={{ padding: '0 80px 80px' }}>
      <p style={{
        fontSize: 12,
        color: S.textSecondary,
        marginBottom: 24,
      }}>Featured workflows</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        height: 320,
      }}>
        {works.map((w, i) => (
          <div
            key={i}
            style={{
              background: w.bg,
              borderRadius: 8,
              gridRow: w.aspect === 'tall' ? 'span 2' : 'span 1',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 20,
            }}
          >
            <span style={{
              fontSize: 13,
              color: w.bg.includes('0.25') || w.bg.includes('0.35') ? 'oklch(0.9 0 0)' : S.text,
              fontWeight: 500,
            }}>{w.title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Principles() {
  const items = [
    { num: '01', title: 'Clarity', desc: 'Every design direction visible at once. No hidden tabs, no modal hell.' },
    { num: '02', title: 'Simplicity', desc: 'Paste an image, describe what you want, see it appear. That simple.' },
    { num: '03', title: 'Iteration', desc: 'Freeze what works. Branch into variations. Never lose progress.' },
  ]

  return (
    <section style={{
      padding: '80px 80px',
      background: S.cardBg,
    }}>
      <p style={{
        fontSize: 12,
        color: S.textSecondary,
        marginBottom: 48,
      }}>Design principles</p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 64,
      }}>
        {items.map(item => (
          <div key={item.num}>
            <span style={{
              fontSize: 11,
              color: S.textSecondary,
              fontFamily: 'monospace',
            }}>{item.num}</span>
            <h3 style={{
              fontSize: 20,
              fontWeight: 500,
              color: S.text,
              margin: '12px 0 8px',
            }}>{item.title}</h3>
            <p style={{
              fontSize: 14,
              color: S.textSecondary,
              lineHeight: 1.6,
              margin: 0,
            }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatementSection() {
  return (
    <section style={{
      padding: '120px 80px',
      maxWidth: 900,
    }}>
      <p style={{
        fontSize: 32,
        fontWeight: 400,
        color: S.text,
        lineHeight: 1.5,
        margin: 0,
      }}>
        Design tools are either too rigid or too chaotic.
        Canvai finds the balance—infinite space with
        intelligent structure. Claude understands your
        vision and generates real, working components.
      </p>
    </section>
  )
}

function Features() {
  const features = [
    'Infinite zoomable canvas',
    'Multiple directions per prompt',
    'Context image analysis',
    'Live React components',
    'Annotation system',
    'Iteration management',
    'Claude Vision integration',
    'Export to production',
  ]

  return (
    <section style={{
      padding: '80px 80px',
      borderTop: `1px solid oklch(0.90 0 0)`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <p style={{
          fontSize: 12,
          color: S.textSecondary,
          margin: 0,
        }}>Capabilities</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px 64px',
        }}>
          {features.map(f => (
            <span key={f} style={{
              fontSize: 14,
              color: S.text,
            }}>{f}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section style={{
      padding: '80px 80px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: S.text,
    }}>
      <div>
        <h2 style={{
          fontSize: 28,
          fontWeight: 400,
          color: S.bg,
          margin: 0,
        }}>Ready to design with clarity?</h2>
        <p style={{
          fontSize: 14,
          color: 'oklch(0.7 0 0)',
          margin: 0,
          marginTop: 8,
        }}>Start free. No credit card required.</p>
      </div>
      <button style={{
        padding: '14px 28px',
        background: S.bg,
        color: S.text,
        border: 'none',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'default',
      }}>Get Started</button>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{
      padding: '48px 80px',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
      color: S.textSecondary,
    }}>
      <span>© 2026 Canvai</span>
      <div style={{ display: 'flex', gap: 32 }}>
        <span>GitHub</span>
        <span>Twitter</span>
        <span>Discord</span>
        <span>Privacy</span>
      </div>
    </footer>
  )
}

export function Statement() {
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
      <WorkGrid />
      <Principles />
      <StatementSection />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}
