/**
 * V3 Dark Editorial — The Landscape
 * Competitor analysis with architectural images
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
}

export function V3DarkLandscape() {
  const competitors = [
    { name: 'Cursor', what: 'AI code editor', diff: 'IDE first, one generation at a time' },
    { name: 'v0', what: 'Chat to UI', diff: 'Conversation, limited context' },
    { name: 'Lovable', what: 'Full-stack builder', diff: 'Opinionated, end-to-end' },
    { name: 'Figma AI', what: 'Design tool', diff: 'Mockups, collaborative' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', display: 'flex' }}>
      {/* Left: Image strip */}
      <div style={{ width: 200, display: 'flex', flexDirection: 'column' }}>
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80"
          alt="Architecture"
          style={{ width: '100%', height: '50%', objectFit: 'cover' }}
        />
        <img
          src="https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=400&q=80"
          alt="Workspace"
          style={{ width: '100%', height: '50%', objectFit: 'cover' }}
        />
      </div>

      {/* Right: Content */}
      <div style={{ flex: 1, padding: 48, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          03 — The Landscape
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 32 }}>
          What exists today.
        </h1>

        <div style={{ flex: 1 }}>
          {competitors.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 24, padding: '12px 0', borderBottom: `1px solid ${C.textMuted}` }}>
              <div style={{ width: 80, fontSize: 13, color: C.accent }}>{c.name}</div>
              <div style={{ width: 120, fontSize: 13, color: C.textSec }}>{c.what}</div>
              <div style={{ flex: 1, fontSize: 12, color: C.textMuted }}>{c.diff}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: C.textSec, marginTop: 16 }}>
          Infinite canvas. Multiple directions. Real components.
        </div>
      </div>
    </div>
  )
}
