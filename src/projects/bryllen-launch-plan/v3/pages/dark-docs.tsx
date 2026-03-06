/**
 * V3 Dark Editorial — Docs Strategy
 * Vue.js principles with quickstart
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
}

export function V3DarkDocs() {
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
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', padding: 48, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
        06 — Docs Strategy
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2 }}>
        Learn from Vue.js.
      </h1>

      <p style={{ fontSize: 14, color: C.textSec, marginTop: 12, marginBottom: 24 }}>
        Vue won because of docs. Approachable, progressive, sensible.
      </p>

      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        {principles.map((p, i) => (
          <div key={i} style={{ flex: 1, padding: '16px', borderLeft: `2px solid ${C.accent}` }}>
            <div style={{ fontSize: 12, color: C.accent, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>
        Quick Start — 60 Seconds
      </div>

      <div style={{ display: 'flex', gap: 12, flex: 1 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.textSec, marginBottom: 6 }}>{s.num}. {s.title}</div>
            <div style={{ fontSize: 11, color: C.text, fontFamily: 'monospace', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 4 }}>
              {s.code}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 16 }}>
        If they can't start in 60 seconds, we've failed.
      </div>
    </div>
  )
}
