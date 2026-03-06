/**
 * V3 — Vision
 * Minimal style with full content
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
}

export function V3Vision() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        01 — Vision
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25, maxWidth: 400 }}>
        See every direction — at once.
      </h1>

      <p style={{ fontSize: 14, color: C.textSec, marginTop: 24, maxWidth: 380, lineHeight: 1.7 }}>
        Design canvas for Claude Code. Generate real React components. Compare directions side-by-side. Ship what works.
      </p>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 48 }}>
        {[
          { value: '∞', label: 'Canvas' },
          { value: 'N', label: 'Directions' },
          { value: '1', label: 'Click to share' },
          { value: '0', label: 'Mockups' },
        ].map((m, i) => (
          <div key={i}>
            <div style={{ fontSize: 28, fontWeight: 300, color: C.text }}>{m.value}</div>
            <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, fontSize: 13, color: C.textSec, borderTop: `1px solid #eee`, paddingTop: 20 }}>
        Not mockups. Not chat. A canvas where designs become code.
      </div>
    </div>
  )
}
