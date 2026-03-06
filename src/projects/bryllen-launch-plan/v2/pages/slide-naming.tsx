/**
 * Slide 6: The Name
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
  green: '#4ADE80',
}

export function SlideNaming() {
  const names = [
    { name: 'Pano', meaning: 'Panoramic — see everything at once', domain: 'pano.dev', available: true },
    { name: 'Verse', meaning: 'Every direction is a verse', domain: 'verse.dev', available: false },
    { name: 'Muse', meaning: 'Creative inspiration', domain: 'muse.ai', available: false },
    { name: 'Drift', meaning: 'Explore directions', domain: 'drift.com', available: false },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        06 — Identity
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3, marginBottom: 48 }}>
        The name.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        {names.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <div style={{ fontSize: 18, color: n.available ? C.text : C.textMuted, fontWeight: n.available ? 500 : 400, width: 80 }}>{n.name}</div>
            <div style={{ fontSize: 14, color: C.textSec, flex: 1 }}>{n.meaning}</div>
            <div style={{ fontSize: 12, color: n.available ? C.green : C.textMuted, fontFamily: 'monospace' }}>{n.domain}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.textMuted}40`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontSize: 11, color: C.green, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Recommendation</div>
          <div style={{ fontSize: 32, color: C.text, fontWeight: 400 }}>Pano</div>
        </div>
        <div style={{ fontSize: 14, color: C.textSec, textAlign: 'right' }}>
          Short. Clear. Available.<br />
          "See the whole picture."
        </div>
      </div>
    </div>
  )
}
