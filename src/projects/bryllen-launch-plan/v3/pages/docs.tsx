/**
 * V3 — Docs Strategy
 * Minimal style with Vue.js principles and quickstart
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
  accent: '#16a34a',
}

export function V3Docs() {
  const principles = [
    { name: 'Approachability', desc: 'No jargon. Enable more people to build.' },
    { name: 'Progressive', desc: 'Minimal core. Add complexity gradually.' },
    { name: 'Defaults', desc: 'Works out of the box. Config optional.' },
  ]

  const steps = [
    { num: 1, title: 'Install', code: 'npx modaio new my-app' },
    { num: 2, title: 'Design', code: 'npx modaio design' },
    { num: 3, title: 'Annotate', code: 'Click → Describe → Apply' },
    { num: 4, title: 'Share', code: 'Click Share → Get URL' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        06 — Docs Strategy
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25 }}>
        Learn from Vue.js.
      </h1>

      <p style={{ fontSize: 13, color: C.textSec, marginTop: 12, marginBottom: 24 }}>
        Vue won because of docs. Approachable, progressive, sensible.
      </p>

      <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
        {principles.map((p, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.accent, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 9, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        Quick Start — 60 Seconds
      </div>

      <div style={{ display: 'flex', gap: 16, flex: 1 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.textSec, marginBottom: 8 }}>{s.num}. {s.title}</div>
            <div style={{ fontSize: 11, color: C.text, fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 4 }}>
              {s.code}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 24 }}>
        If they can't start in 60 seconds, we've failed.
      </div>
    </div>
  )
}
