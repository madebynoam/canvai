import { useState } from 'react'
import { Search, ChevronRight, Book, Layers, Sparkles, MessageSquare, GitBranch, Share2, Terminal } from 'lucide-react'

// ── Docs Guide — Modern Sidebar Documentation ───────────────────────────────
// Clean white documentation with sidebar navigation and search. Scannable,
// organized, professional. Inspired by Stripe/Vercel/Tailwind docs.
// NOW WITH LIVE NAVIGATION - click sections to see real content.

const C = {
  bg: 'oklch(1.000 0 0)',
  bgSoft: 'oklch(0.980 0.005 260)',
  bgHover: 'oklch(0.970 0.008 260)',
  text: 'oklch(0.120 0.010 260)',
  textSec: 'oklch(0.450 0.010 260)',
  textTer: 'oklch(0.600 0.008 260)',
  border: 'oklch(0.920 0.005 260)',
  accent: 'oklch(0.550 0.200 260)',
  accentSoft: 'oklch(0.960 0.040 260)',
  code: 'oklch(0.970 0.005 260)',
}

const font = '"Inter", -apple-system, system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

type Section = 'getting-started' | 'canvas' | 'generating' | 'annotations' | 'iterations' | 'sharing' | 'cli'

const navItems: { icon: typeof Book; label: string; id: Section }[] = [
  { icon: Book, label: 'Getting Started', id: 'getting-started' },
  { icon: Layers, label: 'The Canvas', id: 'canvas' },
  { icon: Sparkles, label: 'Generating Designs', id: 'generating' },
  { icon: MessageSquare, label: 'Annotations', id: 'annotations' },
  { icon: GitBranch, label: 'Iterations', id: 'iterations' },
  { icon: Share2, label: 'Sharing', id: 'sharing' },
  { icon: Terminal, label: 'CLI Reference', id: 'cli' },
]

const content: Record<Section, { title: string; intro: string; sections: { title: string; content: React.ReactNode }[] }> = {
  'getting-started': {
    title: 'Getting Started',
    intro: 'Get up and running with Bryllen in under 5 minutes. Create your first AI-generated design project.',
    sections: [
      {
        title: 'Install',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              Bryllen is a Claude Code plugin. Install it from the marketplace:
            </p>
            <div style={{ background: C.code, borderRadius: 8, padding: '16px 20px', border: `1px solid ${C.border}` }}>
              <code style={{ fontFamily: mono, fontSize: 14, color: C.text }}>claude plugin install bryllen</code>
            </div>
          </>
        ),
      },
      {
        title: 'Create your first project',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              Create a new design project. This sets up the folder structure and opens the canvas:
            </p>
            <div style={{ background: C.code, borderRadius: 8, padding: '16px 20px', border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <code style={{ fontFamily: mono, fontSize: 14, color: C.text }}>/bryllen-new my-landing-page</code>
            </div>
            <div style={{ background: C.accentSoft, borderRadius: 8, padding: '16px 20px', borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: 14, color: C.text, margin: 0, lineHeight: 1.6 }}>
                <strong>Tip:</strong> Be specific about the vibe. "A minimal landing page with warm colors" works better than "a landing page."
              </p>
            </div>
          </>
        ),
      },
    ],
  },
  'canvas': {
    title: 'The Canvas',
    intro: 'Learn to navigate the infinite canvas where all your designs live side by side.',
    sections: [
      {
        title: 'Navigation',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              The canvas is infinite and zoomable, like Figma. Use these controls:
            </p>
            <ul style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
              <li><strong>Pan:</strong> Click and drag on empty space, or hold Space + drag</li>
              <li><strong>Zoom:</strong> Scroll wheel, or pinch on trackpad</li>
              <li><strong>Fit all:</strong> Press <code style={{ fontFamily: mono, fontSize: 13, background: C.code, padding: '2px 6px', borderRadius: 4 }}>1</code> to fit all frames</li>
              <li><strong>100%:</strong> Press <code style={{ fontFamily: mono, fontSize: 13, background: C.code, padding: '2px 6px', borderRadius: 4 }}>0</code> for actual size</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Frames',
        content: (
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: 0 }}>
            Each design direction appears as a frame on the canvas. Frames are laid out horizontally for easy comparison. Click a frame to select it, then use the toolbar to annotate or export.
          </p>
        ),
      },
      {
        title: 'Pages',
        content: (
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: 0 }}>
            Pages group related frames together. Use the page selector in the sidebar to switch between pages. Each page has its own canvas position that's remembered.
          </p>
        ),
      },
    ],
  },
  'generating': {
    title: 'Generating Designs',
    intro: 'How to describe what you want and get multiple design directions.',
    sections: [
      {
        title: 'Writing prompts',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              Describe what you want in natural language. Be specific about:
            </p>
            <ul style={{ fontSize: 15, color: C.textSec, lineHeight: 1.8, margin: 0, paddingLeft: 20 }}>
              <li><strong>Purpose:</strong> What is this for? Landing page, dashboard, settings?</li>
              <li><strong>Vibe:</strong> Minimal, playful, corporate, brutalist?</li>
              <li><strong>Colors:</strong> Warm, cool, monochrome, specific palette?</li>
              <li><strong>References:</strong> "Like Stripe" or "inspired by Apple"</li>
            </ul>
          </>
        ),
      },
      {
        title: 'Multiple directions',
        content: (
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: 0 }}>
            Bryllen generates multiple genuinely different directions — not just color variations, but different layouts, hierarchies, and approaches. Compare them side by side on the canvas to find what feels right.
          </p>
        ),
      },
    ],
  },
  'annotations': {
    title: 'Annotations',
    intro: 'Click any element to request changes. Like commenting in Figma, but the changes happen automatically.',
    sections: [
      {
        title: 'Click to refine',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              Enter targeting mode by clicking the crosshair button in the toolbar. Then click any element on any frame. A dialog appears where you describe what you want changed.
            </p>
            <div style={{ background: C.accentSoft, borderRadius: 8, padding: '16px 20px', borderLeft: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: 14, color: C.text, margin: 0, lineHeight: 1.6 }}>
                <strong>Example:</strong> Click a button → "Make this bigger and change the color to blue"
              </p>
            </div>
          </>
        ),
      },
      {
        title: 'Ideate mode',
        content: (
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: 0 }}>
            Toggle "Ideate" in the annotation dialog to generate multiple variations instead of applying one change. Great for exploring different directions for a specific component.
          </p>
        ),
      },
    ],
  },
  'iterations': {
    title: 'Iterations',
    intro: 'Freeze versions and branch in new directions without losing previous work.',
    sections: [
      {
        title: 'Version history',
        content: (
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: 0 }}>
            Every iteration is automatically saved. Use the iteration selector in the sidebar to switch between V1, V2, V3, etc. Previous iterations are frozen — you can view them but not modify them.
          </p>
        ),
      },
      {
        title: 'Creating new iterations',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              Click "New Iteration" to create a copy of the current iteration. The previous iteration is frozen, and you get a fresh version to modify. Each iteration carries forward all pages from the previous one.
            </p>
            <div style={{ background: C.code, borderRadius: 8, padding: '16px 20px', border: `1px solid ${C.border}` }}>
              <code style={{ fontFamily: mono, fontSize: 14, color: C.text }}>V1 → V2 → V3 → ...</code>
            </div>
          </>
        ),
      },
    ],
  },
  'sharing': {
    title: 'Sharing',
    intro: 'Deploy your designs to GitHub Pages and share links with your team.',
    sections: [
      {
        title: 'Deploy to GitHub Pages',
        content: (
          <>
            <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: '0 0 16px' }}>
              Build and deploy your canvas to GitHub Pages with one command:
            </p>
            <div style={{ background: C.code, borderRadius: 8, padding: '16px 20px', border: `1px solid ${C.border}` }}>
              <code style={{ fontFamily: mono, fontSize: 14, color: C.text }}>/bryllen-share</code>
            </div>
          </>
        ),
      },
      {
        title: 'Share links',
        content: (
          <p style={{ fontSize: 15, color: C.textSec, lineHeight: 1.65, margin: 0 }}>
            After deploying, you get a public URL you can share with anyone. They can view and navigate the canvas — perfect for getting feedback from stakeholders who don't have Claude Code installed.
          </p>
        ),
      },
    ],
  },
  'cli': {
    title: 'CLI Reference',
    intro: 'All the slash commands available in Bryllen.',
    sections: [
      {
        title: 'Commands',
        content: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { cmd: '/bryllen-new <name>', desc: 'Create a new project and start designing' },
              { cmd: '/bryllen-design', desc: 'Start the dev server (if stopped)' },
              { cmd: '/bryllen-share', desc: 'Build and deploy to GitHub Pages' },
              { cmd: '/bryllen-close', desc: 'Stop all dev servers' },
              { cmd: '/bryllen-update', desc: 'Update Bryllen to the latest version' },
            ].map((c) => (
              <div key={c.cmd} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                <code style={{ fontFamily: mono, fontSize: 14, color: C.accent, flexShrink: 0 }}>{c.cmd}</code>
                <span style={{ fontSize: 14, color: C.textSec }}>{c.desc}</span>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },
}

export function DocsGuide() {
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeSection, setActiveSection] = useState<Section>('getting-started')

  const currentContent = content[activeSection]

  return (
    <div style={{ background: C.bg, minHeight: '100%', overflow: 'auto', fontFamily: font, WebkitFontSmoothing: 'antialiased' }}>
      {/* Top nav */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, background: C.bg, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: C.text }}>bryllen</span>
          <nav style={{ display: 'flex', gap: 24 }}>
            {['Docs', 'Examples', 'Blog'].map((item, i) => (
              <span key={item} style={{
                fontSize: 14, fontWeight: i === 0 ? 500 : 400,
                color: i === 0 ? C.text : C.textSec,
                cursor: 'default',
              }}>{item}</span>
            ))}
          </nav>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: C.bgSoft, borderRadius: 8, padding: '8px 14px',
          border: `1px solid ${searchFocused ? C.accent : C.border}`,
          transition: 'border-color 0.15s ease',
          width: 240,
        }}>
          <Search size={14} color={C.textTer} strokeWidth={1.5} />
          <input
            placeholder="Search docs..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: 13, color: C.text, width: '100%',
              fontFamily: font,
            }}
          />
          <span style={{
            fontSize: 11, color: C.textTer, background: C.bg,
            padding: '2px 6px', borderRadius: 4, border: `1px solid ${C.border}`,
          }}>⌘K</span>
        </div>
      </header>

      <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto' }}>
        {/* Sidebar */}
        <aside style={{
          width: 240, flexShrink: 0, padding: '24px 16px',
          borderRight: `1px solid ${C.border}`,
          position: 'sticky', top: 65, height: 'calc(100vh - 65px)',
          overflowY: 'auto',
        }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 6,
                background: activeSection === item.id ? C.accentSoft : 'transparent',
                cursor: 'default', marginBottom: 2,
                transition: 'background 0.15s ease',
              }}
            >
              <item.icon size={16} color={activeSection === item.id ? C.accent : C.textTer} strokeWidth={1.5} />
              <span style={{
                fontSize: 14, fontWeight: activeSection === item.id ? 500 : 400,
                color: activeSection === item.id ? C.accent : C.textSec,
              }}>{item.label}</span>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: '40px 64px 80px', maxWidth: 720 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <span style={{ fontSize: 13, color: C.textTer }}>Docs</span>
            <ChevronRight size={12} color={C.textTer} strokeWidth={1.5} />
            <span style={{ fontSize: 13, color: C.text }}>{currentContent.title}</span>
          </div>

          <h1 style={{
            fontSize: 32, fontWeight: 600, color: C.text,
            lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 16px',
          }}>{currentContent.title}</h1>
          <p style={{
            fontSize: 17, color: C.textSec, lineHeight: 1.6, margin: '0 0 40px',
          }}>{currentContent.intro}</p>

          {currentContent.sections.map((section, i) => (
            <section key={section.title} style={{ marginBottom: 48 }}>
              <h2 style={{
                fontSize: 20, fontWeight: 600, color: C.text,
                margin: '0 0 16px', paddingTop: i > 0 ? 24 : 0,
                borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
              }}>{section.title}</h2>
              {section.content}
            </section>
          ))}
        </main>

        {/* On this page */}
        <aside style={{
          width: 180, flexShrink: 0, padding: '40px 24px',
          position: 'sticky', top: 65, height: 'calc(100vh - 65px)',
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: C.textTer,
            letterSpacing: '0.05em', textTransform: 'uppercase' as const,
            margin: '0 0 12px',
          }}>On this page</p>
          {currentContent.sections.map((section, i) => (
            <div key={section.title} style={{
              fontSize: 13, color: i === 0 ? C.text : C.textSec,
              padding: '6px 0', cursor: 'default',
            }}>{section.title}</div>
          ))}
        </aside>
      </div>
    </div>
  )
}
