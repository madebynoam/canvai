/**
 * V3 — Jobs to Be Done
 * Minimal style with full content including interactions
 */

const C = {
  bg: '#fff',
  text: '#1a1a1a',
  textSec: '#666',
  textMuted: '#999',
}

export function V3Jtbd() {
  const jobs = [
    { name: 'Explore', desc: 'See multiple directions at once', interaction: 'Canvas shows options' },
    { name: 'Iterate', desc: 'Describe changes in words', interaction: 'Click → Type → Applied' },
    { name: 'Decide', desc: 'Grab the file', interaction: 'Cmd+Shift+Click → Finder' },
    { name: 'Share', desc: 'Get feedback', interaction: 'Share button → Link' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Inter, -apple-system, sans-serif', padding: 56, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>
        02 — Jobs to Be Done
      </div>

      <h1 style={{ fontSize: 32, fontWeight: 300, color: C.text, margin: 0, lineHeight: 1.25 }}>
        What Modaio is hired for.
      </h1>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
        {jobs.map((job, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 20, padding: '14px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ fontSize: 12, color: C.textMuted, width: 64 }}>{job.name}</div>
            <div style={{ fontSize: 15, color: C.text, flex: 1 }}>{job.desc}</div>
            <div style={{ fontSize: 11, color: C.textSec, fontFamily: 'monospace' }}>{job.interaction}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: C.textSec, marginTop: 24 }}>
        The code was never a mockup. Explore → Decide → Ship.
      </div>
    </div>
  )
}
