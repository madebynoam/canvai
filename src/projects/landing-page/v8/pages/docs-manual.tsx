import { useState } from 'react'

// ── Docs Manual — Book-style Documentation ──────────────────────────────────
// Extends the Codex aesthetic to documentation. Warm cream, numbered chapters,
// dot leaders, book-like reading experience. NOW WITH LIVE NAVIGATION.

const C = {
  bg: 'oklch(0.985 0.008 85)',
  text: 'oklch(0.150 0.010 80)',
  textSec: 'oklch(0.400 0.008 80)',
  textTer: 'oklch(0.580 0.006 80)',
  border: 'oklch(0.900 0.010 85)',
  accent: 'oklch(0.280 0.010 80)',
  code: 'oklch(0.970 0.005 85)',
}

const font = '"Söhne", -apple-system, system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

type Chapter = '01' | '02' | '03' | '04' | '05' | '06' | '07'

const toc: { num: Chapter; title: string }[] = [
  { num: '01', title: 'Getting Started' },
  { num: '02', title: 'The Canvas' },
  { num: '03', title: 'Generating Designs' },
  { num: '04', title: 'Annotations' },
  { num: '05', title: 'Iterations' },
  { num: '06', title: 'Sharing' },
  { num: '07', title: 'CLI Reference' },
]

const chapters: Record<Chapter, { title: string; sections: { num: string; title: string; content: string }[] }> = {
  '01': {
    title: 'Getting Started',
    sections: [
      { num: '1.1', title: 'Install', content: 'Bryllen is a Claude Code plugin. Install it from the plugin marketplace with: claude plugin install bryllen' },
      { num: '1.2', title: 'First Project', content: 'Create a new design project with /bryllen-new my-landing-page. This sets up the folder structure and starts the canvas. Describe what you want and Bryllen generates multiple directions.' },
    ],
  },
  '02': {
    title: 'The Canvas',
    sections: [
      { num: '2.1', title: 'Navigation', content: 'The canvas is infinite and zoomable, like Figma. Pan by dragging empty space or hold Space + drag. Zoom with scroll wheel or trackpad pinch. Press 1 to fit all frames, 0 for 100% zoom.' },
      { num: '2.2', title: 'Frames', content: 'Each design direction appears as a frame on the canvas. Frames are laid out horizontally for easy comparison. Click a frame to select it, then use the toolbar to annotate or export.' },
      { num: '2.3', title: 'Pages', content: 'Pages group related frames together. Use the page selector in the sidebar to switch between pages. Each page has its own canvas position that\'s remembered.' },
    ],
  },
  '03': {
    title: 'Generating Designs',
    sections: [
      { num: '3.1', title: 'Writing Prompts', content: 'Describe what you want in natural language. Be specific about purpose (landing page, dashboard), vibe (minimal, playful), colors (warm, monochrome), and references ("like Stripe").' },
      { num: '3.2', title: 'Multiple Directions', content: 'Bryllen generates genuinely different directions — not color variations, but different layouts, hierarchies, and approaches. Compare them side by side to find what feels right.' },
    ],
  },
  '04': {
    title: 'Annotations',
    sections: [
      { num: '4.1', title: 'Click to Refine', content: 'Enter targeting mode by clicking the crosshair button. Click any element on any frame. A dialog appears where you describe the change. Example: Click a button → "Make this bigger and blue"' },
      { num: '4.2', title: 'Ideate Mode', content: 'Toggle "Ideate" in the annotation dialog to generate multiple variations instead of applying one change. Great for exploring different directions for a specific component.' },
    ],
  },
  '05': {
    title: 'Iterations',
    sections: [
      { num: '5.1', title: 'Version History', content: 'Every iteration is automatically saved. Use the iteration selector in the sidebar to switch between V1, V2, V3, etc. Previous iterations are frozen — view only, no modifications.' },
      { num: '5.2', title: 'Branching', content: 'Click "New Iteration" to create a copy of the current iteration. The previous is frozen, you get a fresh version to modify. Each iteration carries forward all pages from the previous one.' },
    ],
  },
  '06': {
    title: 'Sharing',
    sections: [
      { num: '6.1', title: 'Deploy', content: 'Build and deploy your canvas to GitHub Pages with one command: /bryllen-share. This creates a public URL you can share with anyone.' },
      { num: '6.2', title: 'Share Links', content: 'After deploying, anyone can view and navigate the canvas — perfect for getting feedback from stakeholders who don\'t have Claude Code installed.' },
    ],
  },
  '07': {
    title: 'CLI Reference',
    sections: [
      { num: '7.1', title: 'Commands', content: '/bryllen-new <name> — Create project. /bryllen-design — Start server. /bryllen-share — Deploy. /bryllen-close — Stop servers. /bryllen-update — Update Bryllen.' },
    ],
  },
}

export function DocsManual() {
  const [activeChapter, setActiveChapter] = useState<Chapter>('01')
  const current = chapters[activeChapter]
  const currentIdx = toc.findIndex(t => t.num === activeChapter)
  const prevChapter = currentIdx > 0 ? toc[currentIdx - 1] : null
  const nextChapter = currentIdx < toc.length - 1 ? toc[currentIdx + 1] : null

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 80px', maxWidth: 1120, margin: '0 auto',
        width: '100%', boxSizing: 'border-box',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{ fontFamily: font, fontSize: 15, fontWeight: 600, color: C.text }}>bryllen</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Documentation</span>
        </div>
        <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer }}>v1.0</span>
      </nav>

      <div style={{ display: 'flex', maxWidth: 1120, margin: '0 auto', padding: '0 80px', boxSizing: 'border-box' }}>
        {/* Sidebar TOC */}
        <aside style={{
          width: 260, flexShrink: 0, paddingRight: 48,
          borderRight: `1px solid ${C.border}`, paddingTop: 40,
        }}>
          <p style={{
            fontFamily: mono, fontSize: 10, color: C.textTer,
            letterSpacing: '0.12em', textTransform: 'uppercase' as const,
            margin: '0 0 20px',
          }}>Contents</p>
          {toc.map((ch) => (
            <div
              key={ch.num}
              onClick={() => setActiveChapter(ch.num)}
              style={{
                display: 'flex', alignItems: 'baseline', padding: '10px 0',
                cursor: 'default', opacity: activeChapter === ch.num ? 1 : 0.6,
                transition: 'opacity 0.15s ease',
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 11, color: C.textTer, width: 28, flexShrink: 0 }}>{ch.num}</span>
              <span style={{ fontFamily: font, fontSize: 14, fontWeight: activeChapter === ch.num ? 500 : 400, color: C.text }}>{ch.title}</span>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '40px 0 80px 48px' }}>
          <p style={{
            fontFamily: mono, fontSize: 10, color: C.textTer,
            letterSpacing: '0.12em', textTransform: 'uppercase' as const,
            margin: '0 0 12px',
          }}>Chapter {activeChapter}</p>
          <h1 style={{
            fontFamily: font, fontSize: 36, fontWeight: 500, color: C.text,
            lineHeight: 1.15, letterSpacing: '-0.025em', margin: '0 0 32px',
          }}>{current.title}</h1>

          {current.sections.map((section) => (
            <section key={section.num} style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: font, fontSize: 18, fontWeight: 500, color: C.text,
                margin: '0 0 16px', display: 'flex', alignItems: 'baseline',
              }}>
                <span style={{ fontFamily: mono, fontSize: 12, color: C.textTer, width: 40 }}>{section.num}</span>
                {section.title}
              </h2>
              <p style={{
                fontFamily: font, fontSize: 15, color: C.textSec,
                lineHeight: 1.65, margin: 0, maxWidth: 560,
              }}>{section.content}</p>
            </section>
          ))}

          {/* Chapter nav */}
          <div style={{
            borderTop: `1px solid ${C.border}`, paddingTop: 32, marginTop: 48,
            display: 'flex', justifyContent: 'space-between',
          }}>
            {prevChapter ? (
              <div onClick={() => setActiveChapter(prevChapter.num)} style={{ cursor: 'default' }}>
                <span style={{ fontFamily: font, fontSize: 13, color: C.textTer }}>← {prevChapter.title}</span>
              </div>
            ) : <span />}
            {nextChapter && (
              <div onClick={() => setActiveChapter(nextChapter.num)} style={{ cursor: 'default', display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 500, color: C.text }}>Next: {nextChapter.title}</span>
                <span style={{ fontFamily: font, fontSize: 13, color: C.textTer, marginLeft: 8 }}>→</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
