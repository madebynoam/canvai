/**
 * Dark Style — Naming
 * Minimal editorial, the name is Modaio
 */

const C = {
  bg: '#0A0A0A',
  text: '#FAFAFA',
  textSec: '#888888',
  textMuted: '#555555',
}

export function DarkNaming() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex' }}>
      {/* Left: Content */}
      <div style={{ flex: 1, padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 48 }}>
          Identity
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1, marginBottom: 32 }}>
          Modaio
        </h1>

        <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.8, maxWidth: 280, marginBottom: 48 }}>
          From <em>modello</em> — the Italian word for model. The sculptor's maquette. The architect's scale study. Test ideas before you build.
        </p>

        <div style={{ borderTop: `1px solid ${C.textMuted}`, paddingTop: 24 }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            modaio.dev
          </div>
          <div style={{ fontSize: 13, color: C.textSec }}>
            Short. Clear. Memorable.
          </div>
        </div>
      </div>

      {/* Right: Full-bleed image - sculptor's studio / material samples */}
      <div style={{ flex: 1 }}>
        <img
          src="https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=800&q=80"
          alt="Material samples"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
        />
      </div>
    </div>
  )
}
