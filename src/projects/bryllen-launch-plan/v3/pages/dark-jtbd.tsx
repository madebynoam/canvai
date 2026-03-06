/**
 * V3 Dark Editorial — Jobs to Be Done
 * Bold serif typography with interactions
 */

const C = {
  bg: '#0a0a0a',
  text: '#fff',
  textSec: '#a0a0a0',
  textMuted: '#666',
  accent: '#8b9a3b',
}

export function V3DarkJtbd() {
  const jobs = [
    { name: 'Explore', desc: 'See multiple directions at once', interaction: 'Canvas shows options' },
    { name: 'Iterate', desc: 'Describe changes in words', interaction: 'Click → Type → Applied' },
    { name: 'Decide', desc: 'Grab the file', interaction: 'Cmd+Shift+Click → Finder' },
    { name: 'Share', desc: 'Get feedback', interaction: 'Share button → Link' },
  ]

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: C.bg, fontFamily: 'Georgia, serif', padding: 48, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
        02 — Jobs to Be Done
      </div>

      <h1 style={{ fontSize: 36, fontWeight: 400, color: C.text, margin: 0, lineHeight: 1.2, marginBottom: 32 }}>
        What Modaio is hired for.
      </h1>

      <div style={{ flex: 1 }}>
        {jobs.map((job, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', padding: '16px 0', borderBottom: `1px solid ${C.textMuted}` }}>
            <div style={{ width: 100, fontSize: 14, color: C.accent, fontWeight: 500 }}>{job.name}</div>
            <div style={{ flex: 1, fontSize: 14, color: C.text }}>{job.desc}</div>
            <div style={{ fontSize: 12, color: C.textSec, fontFamily: 'monospace' }}>{job.interaction}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 13, color: C.textSec }}>
          The code was never a mockup. Explore → Decide → Ship.
        </div>
      </div>
    </div>
  )
}
