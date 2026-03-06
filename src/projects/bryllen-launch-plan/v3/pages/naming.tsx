/**
 * V3 — Naming
 * Minimal style - Modaio
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
}

export function V3Naming() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        08 — Identity
      </div>

      <h1 style={{ fontSize: 56, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1, marginBottom: 24 }}>
        Modaio
      </h1>

      <p style={{ fontSize: 14, color: C.textSec, lineHeight: 1.7, maxWidth: 340, marginBottom: 40 }}>
        From <em>modello</em> — the Italian word for model. The sculptor's maquette. The architect's scale study.
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '24px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Domain</div>
              <div style={{ fontSize: 18, color: C.text, fontFamily: 'monospace' }}>modaio.dev</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>CLI</div>
              <div style={{ fontSize: 14, color: C.text, fontFamily: 'monospace' }}>npx modaio</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: C.textSec }}>
        Short. Clear. Memorable. Test ideas before you build.
      </div>
    </div>
  )
}
