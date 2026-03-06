/**
 * V3 — The Landscape
 * Minimal style with competitor analysis
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
}

export function V3Landscape() {
  const products = [
    { name: 'Cursor', what: 'AI code editor', approach: 'IDE-first, one generation' },
    { name: 'v0', what: 'Chat to UI', approach: 'Conversation, frontend' },
    { name: 'Lovable', what: 'Full-stack builder', approach: 'Chat-based, end-to-end' },
    { name: 'Figma AI', what: 'Design tool', approach: 'Mockups, collaboration' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        03 — The Landscape
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25 }}>
        What exists today.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
        {products.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 20, padding: '12px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ fontSize: 14, color: C.text, fontWeight: 500, width: 80 }}>{p.name}</div>
            <div style={{ fontSize: 14, color: C.textSec, flex: 1 }}>{p.what}</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{p.approach}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: 20, marginTop: 24 }}>
        <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>What We're Building</div>
        <div style={{ fontSize: 16, color: C.text }}>
          Infinite canvas. Multiple directions. Real components.
        </div>
      </div>
    </div>
  )
}
