/**
 * Slide 1: Vision
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
}

export function SlideSummary() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        01 — Vision
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3, maxWidth: 500 }}>
        See every direction — at once.
      </h1>

      <p style={{ fontSize: 16, color: C.textSec, marginTop: 32, maxWidth: 420, lineHeight: 1.6, fontWeight: 400 }}>
        Design canvas for Claude Code. Generate real React components. Compare directions side-by-side. Ship what works.
      </p>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 64 }}>
        {[
          { value: '∞', label: 'Canvas' },
          { value: 'N', label: 'Directions' },
          { value: '1', label: 'Click to share' },
          { value: '0', label: 'Mockups' },
        ].map((m, i) => (
          <div key={i}>
            <div style={{ fontSize: 36, fontWeight: 300, color: C.text, fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
            <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 48, fontSize: 14, color: C.textSec }}>
        Not mockups. Not chat. A canvas where designs become code.
      </div>
    </div>
  )
}
