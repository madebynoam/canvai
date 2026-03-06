/**
 * V3 Dark Editorial — Naming
 * Bold serif with etymology
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
}

export function V3DarkNaming() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', display: 'flex' }}>
      {/* Left: Hero */}
      <div style={{ flex: 1, padding: 48, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>
          08 — Identity
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1, marginBottom: 24 }}>
          Modaio
        </h1>

        <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.7, maxWidth: 320, marginBottom: 40 }}>
          From <em>modello</em> — the Italian word for model. The sculptor's maquette. The architect's scale study.
        </p>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: 48 }}>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Domain</div>
              <div style={{ fontSize: 18, color: C.text, fontFamily: 'monospace' }}>modaio.dev</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>CLI</div>
              <div style={{ fontSize: 14, color: C.text, fontFamily: 'monospace' }}>npx modaio</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: C.textSec, marginTop: 32 }}>
          Short. Clear. Memorable. Test ideas before you build.
        </div>
      </div>

      {/* Right: Image */}
      <div style={{ width: 320, backgroundColor: C.accent }}>
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80"
          alt="Architecture detail"
          style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', opacity: 0.8 }}
        />
      </div>
    </div>
  )
}
