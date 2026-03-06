/**
 * Slide 7: Docs Strategy
 * Dark editorial style
 */

const C = {
  bg: '#141414',
  text: '#FAFAFA',
  textSec: '#A1A1A1',
  textMuted: '#6B6B6B',
  green: '#42B883',
}

export function SlideDocs() {
  const principles = [
    { name: 'Approachability', desc: 'No jargon. Enable more people to build.' },
    { name: 'Progressive', desc: 'Minimal core. Add complexity gradually.' },
    { name: 'Defaults', desc: 'Works out of the box. Config optional.' },
  ]

  const steps = [
    { num: 1, title: 'Install', code: 'npx canvai new my-app' },
    { num: 2, title: 'Design', code: 'npx canvai design' },
    { num: 3, title: 'Annotate', code: 'Click → Describe → Apply' },
    { num: 4, title: 'Share', code: 'Click Share → Get URL' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 64, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24 }}>
        07 — Docs Strategy
      </div>

      <h1 style={{ fontSize: 44, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.3 }}>
        Learn from Vue.js.
      </h1>

      <p style={{ fontSize: 16, color: C.textSec, marginTop: 16, marginBottom: 40 }}>
        Vue won because of docs. Approachable, progressive, sensible.
      </p>

      <div style={{ display: 'flex', gap: 48, marginBottom: 40 }}>
        {principles.map((p, i) => (
          <div key={i}>
            <div style={{ fontSize: 13, color: C.green, marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: C.textMuted, maxWidth: 180 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>
        Quick Start — 60 Seconds
      </div>

      <div style={{ display: 'flex', gap: 32, flex: 1, alignItems: 'flex-start' }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.textSec, marginBottom: 8 }}>{s.num}. {s.title}</div>
            <div style={{ fontSize: 13, color: C.text, fontFamily: 'monospace', backgroundColor: '#1E1E1E', padding: 12, borderRadius: 4 }}>
              {s.code}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 14, color: C.textSec, marginTop: 32 }}>
        If they can't start in 60 seconds, we've failed.
      </div>
    </div>
  )
}
