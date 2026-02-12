import { useState, useCallback, type CSSProperties } from 'react'
import { ProjectPicker } from '../../runtime/ProjectPicker'

const BORDER = '#E5E7EB'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

const projects = [
  { project: 'canvai-ui' },
  { project: 'pricing-cards' },
  { project: 'user-profile' },
]

// Latest first (V3 at top, V1 at bottom)
const iterations = [
  { name: 'V3', pages: [{ name: 'Polish' }, { name: 'Dark Mode' }] },
  { name: 'V2', pages: [{ name: 'Exploration' }] },
  { name: 'V1', pages: [{ name: 'Design System' }, { name: 'Components' }] },
]

const container: CSSProperties = {
  height: 360,
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: FONT,
}

const canvasArea: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#F9FAFB',
  fontSize: 13,
  color: TEXT_TERTIARY,
}

/** Sidebar panel icon for TopBar */
function SidebarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="2" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <line x1="5" y1="2" x2="5" y2="12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

/** Reusable chevron for iteration expand/collapse */
function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{
        flexShrink: 0, transition: 'transform 0.15s ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        color: TEXT_TERTIARY,
      }}
    >
      <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Reusable collapsible iteration list — latest first */
function IterationTree({ activeIter, activePage, onSelect }: {
  activeIter: number
  activePage: number
  onSelect: (iterIdx: number, pageIdx: number) => void
}) {
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <>
      {iterations.map((iter, iterIdx) => {
        const expanded = expandedSet.has(iterIdx)
        return (
          <div key={iter.name}>
            <button
              onClick={() => toggle(iterIdx)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                padding: '5px 8px', border: 'none', borderRadius: 5,
                cursor: 'pointer', backgroundColor: 'transparent',
                fontWeight: 600, fontSize: 12, color: '#374151',
                textAlign: 'left', fontFamily: FONT, marginTop: 2,
              }}
            >
              <Chevron expanded={expanded} />
              {iter.name}
            </button>
            {expanded && iter.pages.map((page, pageIdx) => (
              <button
                key={page.name}
                onClick={() => onSelect(iterIdx, pageIdx)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '4px 8px 4px 26px', border: 'none', borderRadius: 5,
                  cursor: 'pointer', backgroundColor: 'transparent',
                  fontSize: 12, fontFamily: FONT,
                  fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                  color: iterIdx === activeIter && pageIdx === activePage ? '#1F2937' : '#9CA3AF',
                }}
              >
                {page.name}
              </button>
            ))}
          </div>
        )
      })}
    </>
  )
}

/** Borderless project picker — same as ProjectPicker but no pill border */
function BorderlessProjectPicker({ activeProject, onSelect }: {
  activeProject: number
  onSelect: (idx: number) => void
}) {
  const [open, setOpen] = useState(false)
  const active = projects[activeProject]

  return (
    <div style={{ position: 'relative', fontFamily: FONT }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '4px 8px', background: 'transparent',
          border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: FONT,
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: 4, backgroundColor: '#E8590C',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, flexShrink: 0,
        }}>
          {active.project.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{active.project}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 220,
          background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: 4, zIndex: 100,
        }}>
          {projects.map((p, i) => (
            <button
              key={p.project}
              onClick={() => { onSelect(i); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                padding: '6px 8px', background: 'transparent', border: 'none',
                borderRadius: 6, cursor: 'pointer', fontSize: 13,
                color: '#1F2937', fontFamily: FONT, textAlign: 'left',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                backgroundColor: i === activeProject ? '#E8590C' : BORDER,
                color: i === activeProject ? '#fff' : '#6B7280',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, flexShrink: 0,
              }}>
                {p.project.charAt(0).toUpperCase()}
              </div>
              <span style={{ flex: 1 }}>{p.project}</span>
              {i === activeProject && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#E8590C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Option K: Like J (icon toggle, animated, separators, chevrons) but
 * with a borderless project picker — no pill outline.
 */
export function SidebarOptionK() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <BorderlessProjectPicker activeProject={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '6px 6px' : '6px 0',
          display: 'flex', flexDirection: 'column', gap: 1,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {iterations.map((iter, iterIdx) => {
            const expanded = expandedSet.has(iterIdx)
            return (
              <div key={iter.name} style={{
                borderTop: iterIdx > 0 ? `1px solid ${BORDER}` : 'none',
                marginTop: iterIdx > 0 ? 4 : 0,
                paddingTop: iterIdx > 0 ? 4 : 0,
              }}>
                <button
                  onClick={() => toggle(iterIdx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                    padding: '5px 8px', border: 'none', borderRadius: 5,
                    cursor: 'pointer', backgroundColor: 'transparent',
                    fontWeight: 600, fontSize: 12, color: '#374151',
                    textAlign: 'left', fontFamily: FONT, marginTop: 2,
                  }}
                >
                  <Chevron expanded={expanded} />
                  {iter.name}
                </button>
                {expanded && iter.pages.map((page, pageIdx) => (
                  <button
                    key={page.name}
                    onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '4px 8px 4px 26px', border: 'none', borderRadius: 5,
                      cursor: 'pointer', backgroundColor: 'transparent',
                      fontSize: 12, fontFamily: FONT,
                      fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                      color: iterIdx === activeIter && pageIdx === activePage ? '#1F2937' : '#9CA3AF',
                    }}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option L: K (borderless picker, separators, chevrons) + E's "ITERATIONS" header.
 */
export function SidebarOptionL() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <BorderlessProjectPicker activeProject={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            padding: '10px 14px 4px',
            fontSize: 10, fontWeight: 600, color: TEXT_TERTIARY,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Iterations
          </div>
          <div style={{ padding: '0 6px 8px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {iterations.map((iter, iterIdx) => {
              const expanded = expandedSet.has(iterIdx)
              return (
                <div key={iter.name} style={{
                  borderTop: iterIdx > 0 ? `1px solid ${BORDER}` : 'none',
                  marginTop: iterIdx > 0 ? 4 : 0,
                  paddingTop: iterIdx > 0 ? 4 : 0,
                }}>
                  <button
                    onClick={() => toggle(iterIdx)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                      padding: '5px 8px', border: 'none', borderRadius: 5,
                      cursor: 'pointer', backgroundColor: 'transparent',
                      fontWeight: 600, fontSize: 12, color: '#374151',
                      textAlign: 'left', fontFamily: FONT, marginTop: 2,
                    }}
                  >
                    <Chevron expanded={expanded} />
                    {iter.name}
                  </button>
                  {expanded && iter.pages.map((page, pageIdx) => (
                    <button
                      key={page.name}
                      onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '4px 8px 4px 26px', border: 'none', borderRadius: 5,
                        cursor: 'pointer', backgroundColor: 'transparent',
                        fontSize: 12, fontFamily: FONT,
                        fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                        color: iterIdx === activeIter && pageIdx === activePage ? '#1F2937' : '#9CA3AF',
                      }}
                    >
                      {page.name}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option D: Icon toggle + animated sidebar + no iteration count + latest first.
 * The "clean" version incorporating all feedback.
 */
export function SidebarOptionD() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '8px 6px' : '8px 0',
          display: 'flex', flexDirection: 'column', gap: 2,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <IterationTree activeIter={activeIter} activePage={activePage} onSelect={(i, p) => { setActiveIter(i); setActivePage(p) }} />
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option E: Same as D but with a subtle "ITERATIONS" label in sidebar header.
 * Proves whether the label adds value or is noise.
 */
export function SidebarOptionE() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{
            padding: '10px 14px 4px',
            fontSize: 10, fontWeight: 600, color: TEXT_TERTIARY,
            textTransform: 'uppercase', letterSpacing: '0.06em',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            Iterations
          </div>
          <div style={{ padding: '0 6px 8px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <IterationTree activeIter={activeIter} activePage={activePage} onSelect={(i, p) => { setActiveIter(i); setActivePage(p) }} />
          </div>
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option F: Icon toggle, picker in sidebar, no TopBar project info.
 * Everything lives in the sidebar — most compact TopBar possible.
 */
export function SidebarOptionF() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center',
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 200 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Project picker at top of sidebar */}
          <div style={{
            padding: '6px 6px', borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0, whiteSpace: 'nowrap',
          }}>
            <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
          </div>
          <div style={{ padding: '4px 6px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <IterationTree activeIter={activeIter} activePage={activePage} onSelect={(i, p) => { setActiveIter(i); setActivePage(p) }} />
          </div>
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option G: Ultra-minimal. Icon toggle, no count, no labels.
 * Iteration names inline with pages (flat list, bold iteration names).
 */
/**
 * Option J: Based on D (icon toggle, animated, no count) but with
 * horizontal separators between iteration groups from G.
 * Chevrons for expand/collapse + thin dividers for visual grouping.
 */
export function SidebarOptionJ() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '6px 6px' : '6px 0',
          display: 'flex', flexDirection: 'column', gap: 1,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {iterations.map((iter, iterIdx) => {
            const expanded = expandedSet.has(iterIdx)
            return (
              <div key={iter.name} style={{
                borderTop: iterIdx > 0 ? `1px solid ${BORDER}` : 'none',
                marginTop: iterIdx > 0 ? 4 : 0,
                paddingTop: iterIdx > 0 ? 4 : 0,
              }}>
                <button
                  onClick={() => toggle(iterIdx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                    padding: '5px 8px', border: 'none', borderRadius: 5,
                    cursor: 'pointer', backgroundColor: 'transparent',
                    fontWeight: 600, fontSize: 12, color: '#374151',
                    textAlign: 'left', fontFamily: FONT, marginTop: 2,
                  }}
                >
                  <Chevron expanded={expanded} />
                  {iter.name}
                </button>
                {expanded && iter.pages.map((page, pageIdx) => (
                  <button
                    key={page.name}
                    onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '4px 8px 4px 26px', border: 'none', borderRadius: 5,
                      cursor: 'pointer', backgroundColor: 'transparent',
                      fontSize: 12, fontFamily: FONT,
                      fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                      color: iterIdx === activeIter && pageIdx === activePage ? '#1F2937' : '#9CA3AF',
                    }}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option H: Icon toggle, sidebar with active iteration highlighted.
 * Iteration headers have a subtle accent left-border when active.
 */
export function SidebarOptionH() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 190 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '6px 6px' : '6px 0',
          display: 'flex', flexDirection: 'column', gap: 2,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {iterations.map((iter, iterIdx) => {
            const expanded = expandedSet.has(iterIdx)
            const isActive = iterIdx === activeIter
            return (
              <div key={iter.name} style={{
                borderLeft: isActive ? '2px solid #E8590C' : '2px solid transparent',
                borderRadius: 2,
                paddingLeft: 2,
              }}>
                <button
                  onClick={() => toggle(iterIdx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                    padding: '5px 6px', border: 'none', borderRadius: 5,
                    cursor: 'pointer', backgroundColor: 'transparent',
                    fontWeight: 600, fontSize: 12,
                    color: isActive ? '#1F2937' : '#374151',
                    textAlign: 'left', fontFamily: FONT, marginTop: 2,
                  }}
                >
                  <Chevron expanded={expanded} />
                  {iter.name}
                </button>
                {expanded && iter.pages.map((page, pageIdx) => (
                  <button
                    key={page.name}
                    onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '4px 6px 4px 24px', border: 'none', borderRadius: 5,
                      cursor: 'pointer', backgroundColor: 'transparent',
                      fontSize: 12, fontFamily: FONT,
                      fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                      color: iterIdx === activeIter && pageIdx === activePage ? '#1F2937' : '#9CA3AF',
                    }}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option I: Narrow icon-rail when collapsed (shows iteration badges V1/V2/V3),
 * expands to full sidebar on click.
 */
export function SidebarOptionI() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 180 : 44,
          borderRight: `1px solid ${BORDER}`,
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {sidebarOpen ? (
            <div style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              {iterations.map((iter, iterIdx) => {
                const expanded = expandedSet.has(iterIdx)
                return (
                  <div key={iter.name}>
                    <button
                      onClick={() => toggle(iterIdx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5, width: '100%',
                        padding: '5px 8px', border: 'none', borderRadius: 5,
                        cursor: 'pointer', backgroundColor: 'transparent',
                        fontWeight: 600, fontSize: 12, color: '#374151',
                        textAlign: 'left', fontFamily: FONT, marginTop: 2,
                      }}
                    >
                      <Chevron expanded={expanded} />
                      {iter.name}
                    </button>
                    {expanded && iter.pages.map((page, pageIdx) => (
                      <button
                        key={page.name}
                        onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '4px 8px 4px 26px', border: 'none', borderRadius: 5,
                          cursor: 'pointer', backgroundColor: 'transparent',
                          fontSize: 12, fontFamily: FONT,
                          fontWeight: iterIdx === activeIter && pageIdx === activePage ? 500 : 400,
                          color: iterIdx === activeIter && pageIdx === activePage ? '#1F2937' : '#9CA3AF',
                        }}
                      >
                        {page.name}
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          ) : (
            /* Collapsed: show iteration badges */
            <div style={{
              padding: '8px 0', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, flex: 1,
            }}>
              {iterations.map((iter, iterIdx) => (
                <button
                  key={iter.name}
                  onClick={() => { setActiveIter(iterIdx); setActivePage(0); setSidebarOpen(true) }}
                  title={`${iter.name} (${iter.pages.length} pages)`}
                  style={{
                    width: 32, height: 24, border: 'none', borderRadius: 6,
                    cursor: 'pointer', fontFamily: FONT,
                    fontSize: 10, fontWeight: 600,
                    backgroundColor: iterIdx === activeIter ? '#E8590C' : 'transparent',
                    color: iterIdx === activeIter ? '#fff' : TEXT_TERTIARY,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {iter.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Option G: Ultra-minimal. Icon toggle, no count, no labels.
 * Iteration names inline with pages (flat list, bold iteration names).
 */
export function SidebarOptionG() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)

  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker projects={projects} activeIndex={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: sidebarOpen ? 170 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '6px' : '6px 0',
          display: 'flex', flexDirection: 'column', gap: 1,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {iterations.map((iter, iterIdx) => (
            <div key={iter.name}>
              {/* Iteration as a non-interactive separator */}
              <div style={{
                padding: '6px 8px 2px', fontSize: 11, fontWeight: 700,
                color: '#374151', whiteSpace: 'nowrap',
                borderTop: iterIdx > 0 ? `1px solid ${BORDER}` : 'none',
                marginTop: iterIdx > 0 ? 4 : 0,
                paddingTop: iterIdx > 0 ? 8 : 6,
              }}>
                {iter.name}
              </div>
              {iter.pages.map((page, pageIdx) => {
                const active = iterIdx === activeIter && pageIdx === activePage
                return (
                  <button
                    key={page.name}
                    onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '3px 8px 3px 16px', border: 'none', borderRadius: 5,
                      cursor: 'pointer', backgroundColor: 'transparent',
                      fontSize: 12, fontFamily: FONT,
                      fontWeight: active ? 500 : 400,
                      color: active ? '#1F2937' : '#9CA3AF',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {page.name}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/** Hoverable row — subtle bg on hover, like Linear */
function HoverRow({ children, active, onClick, style }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  style?: CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  const bg = active
    ? 'rgba(0, 0, 0, 0.06)'
    : hovered
      ? 'rgba(0, 0, 0, 0.03)'
      : 'transparent'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', width: '100%',
        border: 'none', borderRadius: 4,
        backgroundColor: bg,
        fontFamily: FONT, textAlign: 'left',
        transition: 'background-color 0.1s ease',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

/** Tiny inline chevron — sits after text, much smaller than the left-side one */
function ChevronInline({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.15s ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        color: TEXT_TERTIARY,
        marginLeft: 2,
      }}
    >
      <path d="M3.5 2l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Option M: Linear-inspired. Hover bg, highlighted active row, tiny chevron
 * to the right of iteration name (not left), tighter spacing.
 */
export function SidebarOptionM() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      {/* TopBar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
        >
          <SidebarIcon />
        </button>
        <BorderlessProjectPicker activeProject={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '4px 4px' : '4px 0',
          display: 'flex', flexDirection: 'column', gap: 0,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {iterations.map((iter, iterIdx) => {
            const expanded = expandedSet.has(iterIdx)
            return (
              <div key={iter.name} style={{ marginTop: iterIdx > 0 ? 2 : 0 }}>
                {/* Iteration header — text then tiny chevron */}
                <HoverRow
                  onClick={() => toggle(iterIdx)}
                  style={{
                    padding: '4px 8px',
                    gap: 4,
                    fontWeight: 500, fontSize: 12, color: '#374151',
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {iter.name}
                  </span>
                  <ChevronInline expanded={expanded} />
                </HoverRow>

                {/* Pages */}
                {expanded && iter.pages.map((page, pageIdx) => {
                  const active = iterIdx === activeIter && pageIdx === activePage
                  return (
                    <HoverRow
                      key={page.name}
                      active={active}
                      onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                      style={{
                        padding: '4px 8px 4px 20px',
                        fontSize: 12,
                        fontWeight: active ? 500 : 400,
                        color: active ? '#1F2937' : '#6B7280',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {page.name}
                      </span>
                    </HoverRow>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/** Micro chevron — 8px, hugs the text with no gap */
function ChevronMicro({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="8" height="8" viewBox="0 0 8 8" fill="none"
      style={{
        flexShrink: 0,
        transition: 'transform 0.15s ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        color: TEXT_TERTIARY,
      }}
    >
      <path d="M2.5 1.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * Option N: Like M but micro chevron hugs the text — "V1 ›" not "V1        ›".
 * Chevron is inline with the label, not pushed to the right edge.
 */
export function SidebarOptionN() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))

  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }

  return (
    <div style={container}>
      {/* TopBar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            width: 24, height: 24, border: 'none', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
          }}
        >
          <SidebarIcon />
        </button>
        <BorderlessProjectPicker activeProject={activeProject} onSelect={setActiveProject} />
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? 180 : 0,
          borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          padding: sidebarOpen ? '4px 4px' : '4px 0',
          display: 'flex', flexDirection: 'column', gap: 0,
          transition: 'width 0.15s ease, padding 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {iterations.map((iter, iterIdx) => {
            const expanded = expandedSet.has(iterIdx)
            return (
              <div key={iter.name} style={{ marginTop: iterIdx > 0 ? 2 : 0 }}>
                {/* Iteration header — micro chevron hugging the text */}
                <HoverRow
                  onClick={() => toggle(iterIdx)}
                  style={{
                    padding: '4px 8px',
                    gap: 0,
                    fontWeight: 500, fontSize: 12, color: '#374151',
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    {iter.name}
                    <ChevronMicro expanded={expanded} />
                  </span>
                </HoverRow>

                {/* Pages */}
                {expanded && iter.pages.map((page, pageIdx) => {
                  const active = iterIdx === activeIter && pageIdx === activePage
                  return (
                    <HoverRow
                      key={page.name}
                      active={active}
                      onClick={() => { setActiveIter(iterIdx); setActivePage(pageIdx) }}
                      style={{
                        padding: '4px 8px 4px 20px',
                        fontSize: 12,
                        fontWeight: active ? 500 : 400,
                        color: active ? '#1F2937' : '#6B7280',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {page.name}
                      </span>
                    </HoverRow>
                  )
                })}
              </div>
            )
          })}
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/* ─── Reusable N-style sidebar body ─── */
function NSidebar({ sidebarOpen, activeIter, activePage, onSelect }: {
  sidebarOpen: boolean
  activeIter: number
  activePage: number
  onSelect: (iterIdx: number, pageIdx: number) => void
}) {
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))
  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }
  return (
    <div style={{
      width: sidebarOpen ? 180 : 0,
      borderRight: sidebarOpen ? `1px solid ${BORDER}` : 'none',
      backgroundColor: '#FAFAFA',
      padding: sidebarOpen ? '4px 4px' : '4px 0',
      display: 'flex', flexDirection: 'column', gap: 0,
      transition: 'width 0.15s ease, padding 0.15s ease',
      overflow: 'hidden', flexShrink: 0,
    }}>
      <div style={{
        padding: '8px 8px 4px',
        fontSize: 10, fontWeight: 600, color: TEXT_TERTIARY,
        textTransform: 'uppercase', letterSpacing: '0.06em',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Iterations
      </div>
      {iterations.map((iter, iterIdx) => {
        const expanded = expandedSet.has(iterIdx)
        return (
          <div key={iter.name} style={{ marginTop: iterIdx > 0 ? 2 : 0 }}>
            <HoverRow onClick={() => toggle(iterIdx)} style={{
              padding: '4px 8px', gap: 0,
              fontWeight: 500, fontSize: 12, color: '#374151',
            }}>
              <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {iter.name}
                <ChevronMicro expanded={expanded} />
              </span>
            </HoverRow>
            {expanded && iter.pages.map((page, pageIdx) => {
              const active = iterIdx === activeIter && pageIdx === activePage
              return (
                <HoverRow key={page.name} active={active}
                  onClick={() => onSelect(iterIdx, pageIdx)}
                  style={{
                    padding: '4px 8px 4px 20px', fontSize: 12,
                    fontWeight: active ? 500 : 400,
                    color: active ? '#1F2937' : '#6B7280',
                  }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.name}</span>
                </HoverRow>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Shared state hook for picker variants ─── */
function useShellState() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  return { sidebarOpen, setSidebarOpen, activeProject, setActiveProject, activeIter, setActiveIter, activePage, setActivePage }
}

/* ─── Picker variant: Text-only, no icon ─── */
function TextOnlyPicker({ activeProject, onSelect }: {
  activeProject: number; onSelect: (idx: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = projects[activeProject]
  return (
    <div style={{ position: 'relative', fontFamily: FONT }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
          border: 'none', borderRadius: 6, fontFamily: FONT,
          transition: 'background-color 0.1s ease',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{active.project}</span>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 200,
          background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 4, zIndex: 100,
        }}>
          {projects.map((p, i) => (
            <HoverRow key={p.project} active={i === activeProject}
              onClick={() => { onSelect(i); setOpen(false) }}
              style={{ padding: '6px 8px', fontSize: 13, color: '#1F2937', gap: 8 }}>
              <span style={{ flex: 1 }}>{p.project}</span>
              {i === activeProject && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#E8590C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </HoverRow>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Picker P1: Text-only — no icon at all. Just "canvai-ui ▾" with hover bg.
 * Cleanest possible. Lets the name speak for itself.
 */
export function PickerP1() {
  const s = useShellState()
  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button onClick={() => s.setSidebarOpen(o => !o)} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: s.sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
        }}><SidebarIcon /></button>
        <TextOnlyPicker activeProject={s.activeProject} onSelect={s.setActiveProject} />
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <NSidebar sidebarOpen={s.sidebarOpen} activeIter={s.activeIter} activePage={s.activePage}
          onSelect={(i, p) => { s.setActiveIter(i); s.setActivePage(p) }} />
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/* ─── Picker variant: Colored dot instead of square ─── */
function DotPicker({ activeProject, onSelect }: {
  activeProject: number; onSelect: (idx: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = projects[activeProject]
  return (
    <div style={{ position: 'relative', fontFamily: FONT }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '4px 8px', background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
          border: 'none', borderRadius: 6, fontFamily: FONT,
          transition: 'background-color 0.1s ease',
        }}
      >
        <div style={{
          width: 8, height: 8, borderRadius: '50%', backgroundColor: '#E8590C', flexShrink: 0,
        }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#1F2937' }}>{active.project}</span>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 200,
          background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 4, zIndex: 100,
        }}>
          {projects.map((p, i) => (
            <HoverRow key={p.project} active={i === activeProject}
              onClick={() => { onSelect(i); setOpen(false) }}
              style={{ padding: '6px 8px', fontSize: 13, color: '#1F2937', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                backgroundColor: i === activeProject ? '#E8590C' : BORDER,
              }} />
              <span style={{ flex: 1 }}>{p.project}</span>
              {i === activeProject && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#E8590C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </HoverRow>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Picker P2: Colored dot — small accent dot instead of the big square.
 * Keeps color cue but much subtler presence.
 */
export function PickerP2() {
  const s = useShellState()
  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button onClick={() => s.setSidebarOpen(o => !o)} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: s.sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
        }}><SidebarIcon /></button>
        <DotPicker activeProject={s.activeProject} onSelect={s.setActiveProject} />
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <NSidebar sidebarOpen={s.sidebarOpen} activeIter={s.activeIter} activePage={s.activePage}
          onSelect={(i, p) => { s.setActiveIter(i); s.setActivePage(p) }} />
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/* ─── Picker variant: Accent first letter (no separate icon) ─── */
function AccentLetterPicker({ activeProject, onSelect }: {
  activeProject: number; onSelect: (idx: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const active = projects[activeProject]
  return (
    <div style={{ position: 'relative', fontFamily: FONT }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 8px', background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
          border: 'none', borderRadius: 6, fontFamily: FONT,
          transition: 'background-color 0.1s ease',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>
          <span style={{ color: '#E8590C' }}>{active.project.charAt(0).toUpperCase()}</span>
          {active.project.slice(1)}
        </span>
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 200,
          background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 4, zIndex: 100,
        }}>
          {projects.map((p, i) => (
            <HoverRow key={p.project} active={i === activeProject}
              onClick={() => { onSelect(i); setOpen(false) }}
              style={{ padding: '6px 8px', fontSize: 13, color: '#1F2937', gap: 0 }}>
              <span style={{ flex: 1 }}>
                <span style={{ color: i === activeProject ? '#E8590C' : '#6B7280', fontWeight: 600 }}>
                  {p.project.charAt(0).toUpperCase()}
                </span>
                {p.project.slice(1)}
              </span>
              {i === activeProject && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-5" stroke="#E8590C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </HoverRow>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Picker P3: Accent first letter — no icon element, the first letter
 * of the project name IS the accent. "Canvai-ui" with orange C.
 */
export function PickerP3() {
  const s = useShellState()
  return (
    <div style={container}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button onClick={() => s.setSidebarOpen(o => !o)} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: s.sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
        }}><SidebarIcon /></button>
        <AccentLetterPicker activeProject={s.activeProject} onSelect={s.setActiveProject} />
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <NSidebar sidebarOpen={s.sidebarOpen} activeIter={s.activeIter} activePage={s.activePage}
          onSelect={(i, p) => { s.setActiveIter(i); s.setActivePage(p) }} />
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Picker P4: Picker in sidebar — TopBar only has the sidebar toggle,
 * project picker lives at the top of the sidebar panel (like Figma layers).
 */
export function PickerP4() {
  const s = useShellState()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerHover, setPickerHover] = useState(false)
  const active = projects[s.activeProject]
  return (
    <div style={container}>
      {/* Minimal TopBar — just sidebar toggle */}
      <div style={{
        display: 'flex', alignItems: 'center',
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button onClick={() => s.setSidebarOpen(o => !o)} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: s.sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
        }}><SidebarIcon /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: s.sidebarOpen ? 180 : 0,
          borderRight: s.sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Picker at top of sidebar */}
          <div style={{ padding: '6px 4px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, position: 'relative' }}>
            <HoverRow onClick={() => setPickerOpen(o => !o)} style={{
              padding: '4px 8px', gap: 7, fontSize: 13, fontWeight: 500, color: '#1F2937',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', backgroundColor: '#E8590C', flexShrink: 0,
              }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.project}</span>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HoverRow>
            {pickerOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 4, right: 4, marginTop: 2,
                background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 4, zIndex: 100,
              }}>
                {projects.map((p, i) => (
                  <HoverRow key={p.project} active={i === s.activeProject}
                    onClick={() => { s.setActiveProject(i); setPickerOpen(false) }}
                    style={{ padding: '6px 8px', fontSize: 12, color: '#1F2937', gap: 7 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: i === s.activeProject ? '#E8590C' : BORDER,
                    }} />
                    <span style={{ flex: 1 }}>{p.project}</span>
                  </HoverRow>
                ))}
              </div>
            )}
          </div>
          {/* Iterations */}
          <div style={{ padding: '4px 4px', flex: 1, overflow: 'auto' }}>
            <NSidebarContent activeIter={s.activeIter} activePage={s.activePage}
              onSelect={(i, p) => { s.setActiveIter(i); s.setActivePage(p) }} />
          </div>
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Picker P5: Like P4 (picker in sidebar) but with the orange letter square
 * instead of a dot. Same layout — TopBar is minimal, picker at sidebar top.
 */
export function PickerP5() {
  const s = useShellState()
  const [pickerOpen, setPickerOpen] = useState(false)
  const active = projects[s.activeProject]
  return (
    <div style={container}>
      {/* Minimal TopBar — just sidebar toggle */}
      <div style={{
        display: 'flex', alignItems: 'center',
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button onClick={() => s.setSidebarOpen(o => !o)} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: s.sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
        }}><SidebarIcon /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: s.sidebarOpen ? 180 : 0,
          borderRight: s.sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Picker at top of sidebar — letter icon */}
          <div style={{ padding: '6px 4px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, position: 'relative' }}>
            <HoverRow onClick={() => setPickerOpen(o => !o)} style={{
              padding: '4px 8px', gap: 8, fontSize: 13, fontWeight: 500, color: '#1F2937',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4, backgroundColor: '#E8590C',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 600, flexShrink: 0,
              }}>
                {active.project.charAt(0).toUpperCase()}
              </div>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.project}</span>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HoverRow>
            {pickerOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 4, right: 4, marginTop: 2,
                background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 4, zIndex: 100,
              }}>
                {projects.map((p, i) => (
                  <HoverRow key={p.project} active={i === s.activeProject}
                    onClick={() => { s.setActiveProject(i); setPickerOpen(false) }}
                    style={{ padding: '6px 8px', fontSize: 12, color: '#1F2937', gap: 8 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      backgroundColor: i === s.activeProject ? '#E8590C' : BORDER,
                      color: i === s.activeProject ? '#fff' : '#6B7280',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 600,
                    }}>
                      {p.project.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ flex: 1 }}>{p.project}</span>
                  </HoverRow>
                ))}
              </div>
            )}
          </div>
          {/* Iterations */}
          <div style={{ padding: '4px 4px', flex: 1, overflow: 'auto' }}>
            <NSidebarContent activeIter={s.activeIter} activePage={s.activePage}
              onSelect={(i, p) => { s.setActiveIter(i); s.setActivePage(p) }} />
          </div>
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/**
 * Picker P6: Like P4 (picker in sidebar, dot) but with separator lines
 * between iteration groups.
 */
export function PickerP6() {
  const s = useShellState()
  const [pickerOpen, setPickerOpen] = useState(false)
  const active = projects[s.activeProject]
  return (
    <div style={container}>
      {/* Minimal TopBar — just sidebar toggle */}
      <div style={{
        display: 'flex', alignItems: 'center',
        minHeight: 36, padding: '0 10px',
        borderBottom: `1px solid ${BORDER}`, backgroundColor: '#fff',
        fontSize: 12, flexShrink: 0,
      }}>
        <button onClick={() => s.setSidebarOpen(o => !o)} style={{
          width: 24, height: 24, border: 'none', background: 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: s.sidebarOpen ? '#374151' : TEXT_TERTIARY, borderRadius: 4,
        }}><SidebarIcon /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{
          width: s.sidebarOpen ? 180 : 0,
          borderRight: s.sidebarOpen ? `1px solid ${BORDER}` : 'none',
          backgroundColor: '#FAFAFA',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.15s ease',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Picker at top of sidebar */}
          <div style={{ padding: '6px 4px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, position: 'relative' }}>
            <HoverRow onClick={() => setPickerOpen(o => !o)} style={{
              padding: '4px 8px', gap: 7, fontSize: 13, fontWeight: 500, color: '#1F2937',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', backgroundColor: '#E8590C', flexShrink: 0,
              }} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.project}</span>
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HoverRow>
            {pickerOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 4, right: 4, marginTop: 2,
                background: '#fff', borderRadius: 8, border: `1px solid ${BORDER}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: 4, zIndex: 100,
              }}>
                {projects.map((p, i) => (
                  <HoverRow key={p.project} active={i === s.activeProject}
                    onClick={() => { s.setActiveProject(i); setPickerOpen(false) }}
                    style={{ padding: '6px 8px', fontSize: 12, color: '#1F2937', gap: 7 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      backgroundColor: i === s.activeProject ? '#E8590C' : BORDER,
                    }} />
                    <span style={{ flex: 1 }}>{p.project}</span>
                  </HoverRow>
                ))}
              </div>
            )}
          </div>
          {/* Iterations with separators */}
          <div style={{ padding: '4px 4px', flex: 1, overflow: 'auto' }}>
            <NSidebarContent activeIter={s.activeIter} activePage={s.activePage}
              onSelect={(i, p) => { s.setActiveIter(i); s.setActivePage(p) }} separators />
          </div>
        </div>
        <div style={canvasArea}>Canvas area</div>
      </div>
    </div>
  )
}

/** Subtle all-caps section label like L/K */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '8px 8px 4px',
      fontSize: 10, fontWeight: 600, color: TEXT_TERTIARY,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

/** Just the iteration tree content (no outer wrapper) for embedding in P4/P5/P6 */
function NSidebarContent({ activeIter, activePage, onSelect, separators = false }: {
  activeIter: number; activePage: number
  onSelect: (iterIdx: number, pageIdx: number) => void
  separators?: boolean
}) {
  const [expandedSet, setExpandedSet] = useState<Set<number>>(() => new Set([0]))
  const toggle = (idx: number) => {
    setExpandedSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx); else next.add(idx)
      return next
    })
  }
  return (
    <>
      <SectionLabel>Iterations</SectionLabel>
      {iterations.map((iter, iterIdx) => {
        const expanded = expandedSet.has(iterIdx)
        return (
          <div key={iter.name} style={{
            marginTop: iterIdx > 0 ? (separators ? 4 : 2) : 0,
            borderTop: separators && iterIdx > 0 ? `1px solid ${BORDER}` : 'none',
            paddingTop: separators && iterIdx > 0 ? 4 : 0,
          }}>
            <HoverRow onClick={() => toggle(iterIdx)} style={{
              padding: '4px 8px', gap: 0,
              fontWeight: 500, fontSize: 12, color: '#374151',
            }}>
              <span style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                {iter.name}
                <ChevronMicro expanded={expanded} />
              </span>
            </HoverRow>
            {expanded && iter.pages.map((page, pageIdx) => {
              const active = iterIdx === activeIter && pageIdx === activePage
              return (
                <HoverRow key={page.name} active={active}
                  onClick={() => onSelect(iterIdx, pageIdx)}
                  style={{
                    padding: '4px 8px 4px 20px', fontSize: 12,
                    fontWeight: active ? 500 : 400,
                    color: active ? '#1F2937' : '#6B7280',
                  }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.name}</span>
                </HoverRow>
              )
            })}
          </div>
        )
      })}
    </>
  )
}

