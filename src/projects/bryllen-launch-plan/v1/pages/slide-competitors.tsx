/**
 * Slide 3: The Landscape
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
}

export function SlideCompetitors() {
  const products = [
    { name: 'Cursor', what: 'AI code editor', approach: 'IDE-first, one generation' },
    { name: 'v0', what: 'Chat to UI', approach: 'Conversation, frontend' },
    { name: 'Lovable', what: 'Full-stack builder', approach: 'Chat-based, end-to-end' },
    { name: 'Figma AI', what: 'Design tool', approach: 'Mockups, collaboration' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        03 — The Landscape
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3 }}>
        What exists today.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
        {products.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <div style={{ fontSize: 15, color: C.text, fontWeight: 500, width: 100 }}>{p.name}</div>
            <div style={{ fontSize: 15, color: C.textSec }}>{p.what}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginLeft: 'auto' }}>{p.approach}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${C.textMuted}40`, paddingTop: 24 }}>
        <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>What We're Building</div>
        <div style={{ fontSize: 20, color: C.text, fontWeight: 400 }}>
          Infinite canvas. Multiple directions. Real components.
        </div>
      </div>
    </div>
  )
}
