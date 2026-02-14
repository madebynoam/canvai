import { useState, useRef, useCallback, useEffect } from 'react'
import { TopBar } from '../../runtime/TopBar'
import { ProjectPicker } from '../../runtime/ProjectPicker'
import { IterationSidebar } from '../../runtime/IterationSidebar'
import { Pencil, Check, Trash2 } from 'lucide-react'
import {
  ACCENT, ACCENT_HOVER, ACCENT_MUTED, SURFACE, SURFACE_SUBTLE,
  BORDER, TEXT, TEXT_SEC, TEXT_TER, FONT,
} from './tokens'
import { SPRING, useSpring } from './spring'

/* ── Design constants ── */

const ACCENT_PRESSED = '#D4520A'
const ACCENT_SHADOW = 'rgba(232, 89, 12, 0.25)'
const PAD = 32
const SECTION_GAP = 48
const SOFT_BG = '#F9FAFB'

/* ── Spring-driven FAB ── */

// FAB with spring squish on press and bounce-back on release.
// Uses snappy preset (tension 233, friction 19) — same feel as real AnnotationOverlay.
function SpringFAB({ onClick }: { onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const spring = useSpring(SPRING.snappy)
  const [state, setState] = useState<'idle' | 'hover' | 'pressed'>('idle')

  const handleDown = useCallback(() => {
    setState('pressed')
    spring.state.value = 1
    spring.set(0.92, (v) => {
      if (ref.current) ref.current.style.transform = `scale(${v})`
    })
  }, [spring])

  const handleUp = useCallback(() => {
    setState('hover')
    spring.set(1, (v) => {
      if (ref.current) ref.current.style.transform = `scale(${v})`
    })
  }, [spring])

  return (
    <button
      ref={ref}
      onClick={onClick}
      onPointerEnter={() => setState('hover')}
      onPointerLeave={() => { setState('idle'); handleUp() }}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      style={{
        width: 40, height: 40, borderRadius: '50%',
        background: state === 'hover' ? ACCENT_HOVER : state === 'pressed' ? ACCENT_PRESSED : ACCENT,
        color: '#fff', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: state === 'hover'
          ? `0 4px 16px ${ACCENT_SHADOW}`
          : `0 2px 8px ${ACCENT_SHADOW}`,
      }}
    >
      <Pencil size={16} strokeWidth={1.5} />
    </button>
  )
}

// Button with spring press — generic for Apply/Send/Cancel buttons.
function SpringButton({ children, style, onClick }: {
  children: React.ReactNode
  style: React.CSSProperties
  onClick?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const spring = useSpring(SPRING.snappy)

  const handleDown = useCallback(() => {
    spring.state.value = 1
    spring.set(0.94, (v) => {
      if (ref.current) ref.current.style.transform = `scale(${v})`
    })
  }, [spring])

  const handleUp = useCallback(() => {
    spring.set(1, (v) => {
      if (ref.current) ref.current.style.transform = `scale(${v})`
    })
  }, [spring])

  return (
    <button
      ref={ref}
      onClick={onClick}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      style={style}
    >
      {children}
    </button>
  )
}

/* ── Hover button (showcase version) ── */
function ShowcaseHoverButton({ children, onClick, baseStyle, hoverBg }: {
  children: React.ReactNode
  onClick?: () => void
  baseStyle: React.CSSProperties
  hoverBg: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...baseStyle,
        backgroundColor: hovered ? hoverBg : (baseStyle.background as string ?? 'transparent'),
        transition: 'background-color 150ms ease',
      }}
    >
      {children}
    </button>
  )
}

/* ── Helpers ── */

function FrameTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 18, fontWeight: 600, color: TEXT,
      fontFamily: FONT, textWrap: 'pretty' as any,
    }}>
      {children}
    </div>
  )
}

function StateLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 500, color: TEXT_SEC,
      fontFamily: FONT, textWrap: 'pretty' as any,
    }}>
      {children}
    </div>
  )
}

/* ── Fake data for demos ── */

const DEMO_PROJECTS = [
  { project: 'canvai-ui' },
  { project: 'checkout-flow' },
  { project: 'settings-panel' },
]

const DEMO_ITERATIONS = [
  { name: 'V6', pages: [{ name: 'App Shell' }, { name: 'Components' }, { name: 'Annotation Flow' }] },
  { name: 'V5', pages: [{ name: 'Tokens' }, { name: 'Structure' }, { name: 'Components' }, { name: 'Compositions' }, { name: 'Motion' }] },
  { name: 'V4', pages: [{ name: 'Comment Threads Refined' }, { name: 'Motion Language' }, { name: 'Annotation Management' }] },
  { name: 'V3', pages: [{ name: 'Sidebar Refined' }, { name: 'Comment Threads' }, { name: 'Picker Variants' }] },
  { name: 'V2', pages: [{ name: 'Sidebar Toggle Exploration' }] },
]

/* ═══════════════════════════════════════════════════════════════════
   Page 1: App Shell
   Two full app shells stacked — watch mode vs manual mode.
   Uses real TopBar + IterationSidebar from runtime (not recreations).
   Sidebar toggle is interactive — click the PanelLeft icon to collapse.
   ═══════════════════════════════════════════════════════════════════ */

export function AppShellShowcase() {
  const [sidebarOpen1, setSidebarOpen1] = useState(true)
  const [sidebarOpen2, setSidebarOpen2] = useState(false)

  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>Canvai App Shell</FrameTitle>

      {/* Watch mode — sidebar open, pending annotations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <StateLabel>Watch mode — 3 pending, sidebar open</StateLabel>
        <div style={{
          borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}`,
          height: 360, display: 'flex', flexDirection: 'column',
          background: SURFACE,
        }}>
          <TopBar
            projects={DEMO_PROJECTS}
            activeProjectIndex={0}
            onSelectProject={() => {}}
            iterationCount={5}
            pendingCount={3}
            mode="watch"
            sidebarOpen={sidebarOpen1}
            onToggleSidebar={() => setSidebarOpen1(o => !o)}
          />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <IterationSidebar
              iterations={DEMO_ITERATIONS}
              activeIterationIndex={0}
              activePageIndex={0}
              onSelect={() => {}}
              collapsed={!sidebarOpen1}
            />
            <div style={{ flex: 1, background: '#F3F4F6', position: 'relative' }}>
              {/* Placeholder frames on the canvas */}
              <div style={{ padding: 32, display: 'flex', gap: 24 }}>
                {['TopBar', 'ProjectPicker', 'Sidebar'].map(name => (
                  <div key={name} style={{
                    width: 200, height: 140, background: SURFACE, borderRadius: 8,
                    border: `1px solid ${BORDER}`, padding: 16,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: TEXT_TER }}>{name}</div>
                    <div style={{ flex: 1, background: SOFT_BG, borderRadius: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual mode — sidebar collapsed, no indicators */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <StateLabel>Manual mode — no indicators, sidebar collapsed</StateLabel>
        <div style={{
          borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}`,
          height: 360, display: 'flex', flexDirection: 'column',
          background: SURFACE,
        }}>
          <TopBar
            projects={DEMO_PROJECTS}
            activeProjectIndex={0}
            onSelectProject={() => {}}
            iterationCount={5}
            pendingCount={0}
            mode="manual"
            sidebarOpen={sidebarOpen2}
            onToggleSidebar={() => setSidebarOpen2(o => !o)}
          />
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <IterationSidebar
              iterations={DEMO_ITERATIONS}
              activeIterationIndex={0}
              activePageIndex={0}
              onSelect={() => {}}
              collapsed={!sidebarOpen2}
            />
            <div style={{ flex: 1, background: '#F3F4F6', position: 'relative' }}>
              <div style={{ padding: 32, display: 'flex', gap: 24 }}>
                {['Component A', 'Component B'].map(name => (
                  <div key={name} style={{
                    width: 240, height: 160, background: SURFACE, borderRadius: 8,
                    border: `1px solid ${BORDER}`, padding: 16,
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: TEXT_TER }}>{name}</div>
                    <div style={{ flex: 1, background: SOFT_BG, borderRadius: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 2: Components — TopBar
   Three real TopBar instances in soft containers.
   ProjectPicker inside each one is interactive — click to open.
   Watch pill springs in when mode='watch' and window is focused.
   ═══════════════════════════════════════════════════════════════════ */

export function TopBarShowcase() {
  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>TopBar</FrameTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Manual / 0 pending */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Manual — 0 pending</StateLabel>
          <div style={{ borderRadius: 8, background: SOFT_BG }}>
            <TopBar
              projects={DEMO_PROJECTS}
              activeProjectIndex={0}
              onSelectProject={() => {}}
              iterationCount={5}
              pendingCount={0}
              mode="manual"
              sidebarOpen={true}
              onToggleSidebar={() => {}}
            />
          </div>
        </div>

        {/* Watch / 3 pending */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Watch — 3 pending</StateLabel>
          <div style={{ borderRadius: 8, background: SOFT_BG }}>
            <TopBar
              projects={DEMO_PROJECTS}
              activeProjectIndex={0}
              onSelectProject={() => {}}
              iterationCount={5}
              pendingCount={3}
              mode="watch"
              sidebarOpen={true}
              onToggleSidebar={() => {}}
            />
          </div>
        </div>

        {/* Watch / sidebar closed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Watch — sidebar closed</StateLabel>
          <div style={{ borderRadius: 8, background: SOFT_BG }}>
            <TopBar
              projects={DEMO_PROJECTS}
              activeProjectIndex={1}
              onSelectProject={() => {}}
              iterationCount={3}
              pendingCount={0}
              mode="watch"
              sidebarOpen={false}
              onToggleSidebar={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 2: Components — ProjectPicker
   Real component (left, interactive) + always-open visual (right).
   The left picker opens/closes on click with outside-click dismiss.
   The right shows the dropdown anatomy without interaction.
   ═══════════════════════════════════════════════════════════════════ */

export function ProjectPickerShowcase() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>ProjectPicker</FrameTitle>

      <div style={{ display: 'flex', gap: 64, alignItems: 'flex-start' }}>
        {/* Interactive picker — click to open/close, spring scaleY reveal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Interactive — click to open</StateLabel>
          <div style={{ padding: 16, background: SOFT_BG, borderRadius: 8, minHeight: 220 }}>
            <ProjectPicker
              projects={DEMO_PROJECTS}
              activeIndex={activeIdx}
              onSelect={setActiveIdx}
            />
          </div>
        </div>

        {/* Always-open visual — shows dropdown anatomy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Open state</StateLabel>
          <div style={{ padding: 16, background: SOFT_BG, borderRadius: 8, minHeight: 220 }}>
            <PickerAlwaysOpen projects={DEMO_PROJECTS} activeIndex={activeIdx} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** A visual recreation of the picker in its open state (no click-outside dismiss) */
function PickerAlwaysOpen({ projects, activeIndex }: { projects: { project: string }[]; activeIndex: number }) {
  const active = projects[activeIndex]
  if (!active) return null

  return (
    <div style={{ position: 'relative', fontFamily: FONT }}>
      {/* Trigger (visual only) */}
      <button style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '4px 8px', background: 'rgba(0, 0, 0, 0.04)',
        border: 'none', borderRadius: 4, fontFamily: FONT,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4,
          backgroundColor: ACCENT, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, flexShrink: 0,
        }}>
          {active.project.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{active.project}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown (always visible) */}
      <div style={{
        position: 'absolute', top: '100%', left: 0, marginTop: 4,
        width: 220, background: SURFACE, borderRadius: 8,
        border: `1px solid ${BORDER}`,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
        padding: 4, zIndex: 10,
      }}>
        {projects.map((p, i) => (
          <div key={p.project} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 8px', borderRadius: 4, fontSize: 13, color: TEXT,
            backgroundColor: i === activeIndex ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 4,
              backgroundColor: i === activeIndex ? ACCENT : BORDER,
              color: i === activeIndex ? '#fff' : TEXT_SEC,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600, flexShrink: 0,
            }}>
              {p.project.charAt(0).toUpperCase()}
            </div>
            <span style={{ flex: 1 }}>{p.project}</span>
            {i === activeIndex && <Check size={14} strokeWidth={1.5} color={ACCENT} />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 2: Components — Iteration Sidebar
   Real component in expanded + collapsed states side by side.
   Expanded sidebar is interactive — click iterations to expand/collapse,
   click pages to select. Shows real chevron micro animation.
   ═══════════════════════════════════════════════════════════════════ */

export function IterationSidebarShowcase() {
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)

  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>Iteration Sidebar</FrameTitle>

      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
        {/* Expanded */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Expanded — 5 iterations, active page</StateLabel>
          <div style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${BORDER}`,
            height: 400, background: '#FAFAFA',
          }}>
            <IterationSidebar
              iterations={DEMO_ITERATIONS}
              activeIterationIndex={activeIter}
              activePageIndex={activePage}
              onSelect={(i, p) => { setActiveIter(i); setActivePage(p) }}
              collapsed={false}
            />
          </div>
        </div>

        {/* Collapsed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Collapsed</StateLabel>
          <div style={{
            borderRadius: 8, overflow: 'hidden', border: `1px solid ${BORDER}`,
            height: 400, width: 48, background: '#FAFAFA',
            display: 'flex', alignItems: 'stretch',
          }}>
            <IterationSidebar
              iterations={DEMO_ITERATIONS}
              activeIterationIndex={0}
              activePageIndex={0}
              onSelect={() => {}}
              collapsed={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 3: Annotation Flow — Idle / FAB
   Static state samples (idle/hover/pressed) + interactive spring FAB.
   The mini canvas FAB uses the snappy spring preset (tension 233,
   friction 19) — press it to feel the scale(0.92) squish and
   bounce-back. Same physics as the real AnnotationOverlay.
   ═══════════════════════════════════════════════════════════════════ */

export function AnnotateIdleShowcase() {
  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>Annotate</FrameTitle>

      {/* FAB states */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StateLabel>FAB — idle, hover, pressed</StateLabel>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {([
            { state: 'idle', bg: ACCENT, shadow: `0 2px 8px ${ACCENT_SHADOW}`, scale: 1 },
            { state: 'hover', bg: ACCENT_HOVER, shadow: `0 4px 16px ${ACCENT_SHADOW}`, scale: 1 },
            { state: 'pressed', bg: ACCENT_PRESSED, shadow: `0 2px 8px ${ACCENT_SHADOW}`, scale: 0.95 },
          ] as const).map(({ state, bg, shadow, scale }) => (
            <div key={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: bg, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: shadow, transform: `scale(${scale})`,
              }}>
                <Pencil size={16} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 11, color: TEXT_TER }}>{state}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive mini canvas — FAB uses spring squish on press */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StateLabel>FAB on canvas — click to feel the spring</StateLabel>
        <div style={{
          position: 'relative', width: 320, height: 200,
          background: '#F3F4F6', borderRadius: 8, border: `1px solid ${BORDER}`,
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 20, left: 20,
            width: 160, height: 100, background: SURFACE, borderRadius: 8,
            border: `1px solid ${BORDER}`, padding: 12,
          }}>
            <div style={{ fontSize: 10, color: TEXT_TER, fontWeight: 500 }}>Component</div>
            <div style={{ marginTop: 8, height: 24, background: SOFT_BG, borderRadius: 4 }} />
            <div style={{ marginTop: 8, height: 24, background: SOFT_BG, borderRadius: 4, width: '60%' }} />
          </div>
          {/* Spring-driven FAB — scale(0.92) on press, bounces back via snappy spring */}
          <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
            <SpringFAB />
          </div>
        </div>
      </div>

      {/* Numbered markers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StateLabel>Annotation markers</StateLabel>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{
              width: 18, height: 18, borderRadius: '50%',
              backgroundColor: ACCENT, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, fontFamily: FONT,
              boxShadow: `0 1px 4px ${ACCENT_SHADOW}`,
            }}>
              {n}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 3: Annotation Flow — Targeting
   Visual recreation of the targeting phase — crosshair cursor,
   orange highlight box snapping to elements. The crosshair lines
   are positioned to suggest a cursor hovering over "Button element".
   ═══════════════════════════════════════════════════════════════════ */

export function AnnotateTargetingShowcase() {
  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>Targeting</FrameTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StateLabel>Crosshair cursor + orange highlight on hover</StateLabel>
        <div style={{
          position: 'relative', width: 320, height: 240,
          background: '#F3F4F6', borderRadius: 8, border: `1px solid ${BORDER}`,
          overflow: 'hidden', cursor: 'crosshair',
        }}>
          {/* Placeholder frame */}
          <div style={{
            position: 'absolute', top: 20, left: 20,
            width: 200, height: 160, background: SURFACE, borderRadius: 8,
            border: `1px solid ${BORDER}`, padding: 16,
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ fontSize: 10, color: TEXT_TER, fontWeight: 500 }}>TopBar</div>
            <div style={{ height: 28, background: SOFT_BG, borderRadius: 4 }} />
            {/* Highlighted element */}
            <div style={{ position: 'relative' }}>
              <div style={{
                height: 32, background: SOFT_BG, borderRadius: 4,
                display: 'flex', alignItems: 'center', padding: '0 8px',
                fontSize: 11, color: TEXT_SEC,
              }}>
                Button element
              </div>
              {/* Orange highlight overlay */}
              <div style={{
                position: 'absolute', inset: -2,
                border: `2px solid ${ACCENT}`, borderRadius: 4,
                pointerEvents: 'none',
              }} />
            </div>
            <div style={{ height: 28, background: SOFT_BG, borderRadius: 4, width: '70%' }} />
          </div>

          {/* Crosshair indicator */}
          <div style={{
            position: 'absolute', top: 100, left: 148,
            width: 1, height: 20, background: TEXT_TER, opacity: 0.5,
          }} />
          <div style={{
            position: 'absolute', top: 109, left: 139,
            width: 20, height: 1, background: TEXT_TER, opacity: 0.5,
          }} />
        </div>
      </div>

      {/* Element highlight detail */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StateLabel>Highlight on element</StateLabel>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              padding: '8px 16px', background: '#F3F4F6', borderRadius: 4,
              fontSize: 13, color: TEXT,
            }}>
              Sample button
            </div>
            <div style={{
              position: 'absolute', inset: -2,
              border: `2px solid ${ACCENT}`, borderRadius: 4,
              pointerEvents: 'none',
            }} />
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
              padding: '12px 20px', background: ACCENT, borderRadius: 8,
              fontSize: 13, color: '#fff', fontWeight: 500,
            }}>
              Primary action
            </div>
            <div style={{
              position: 'absolute', inset: -2,
              border: `2px solid ${ACCENT}`, borderRadius: 4,
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 3: Annotation Flow — Commenting
   Three comment cards (empty, filled-manual, filled-watch) + toast.
   All textareas are typeable. Buttons use spring press animation
   (snappy preset). Cards are standalone — no HTTP connection to
   the annotation server.
   ═══════════════════════════════════════════════════════════════════ */

export function AnnotateCommentShowcase() {
  const [comment1, setComment1] = useState('')
  const [comment2, setComment2] = useState('Make the font weight 600 and reduce the gap to 4px')
  const [comment3, setComment3] = useState('Change the active text color to the accent orange')

  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: SECTION_GAP }}>
      <FrameTitle>Commenting</FrameTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Empty state */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Empty — Apply disabled</StateLabel>
          <CommentCard
            componentName="ButtonSamples"
            elementTag="button"
            mode="manual"
            comment={comment1}
            onCommentChange={setComment1}
          />
        </div>

        {/* Filled — Apply active */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Filled — Apply active</StateLabel>
          <CommentCard
            componentName="TopBar"
            elementTag="div"
            mode="manual"
            comment={comment2}
            onCommentChange={setComment2}
          />
        </div>

        {/* Reopened — editing existing annotation, trash icon visible */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <StateLabel>Reopened — delete available</StateLabel>
          <CommentCard
            componentName="IterationSidebar"
            elementTag="span"
            mode="watch"
            comment={comment3}
            onCommentChange={setComment3}
            editing
          />
        </div>
      </div>

      {/* Toast */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StateLabel>Toast — watch mode confirmation</StateLabel>
        <div style={{
          padding: '8px 24px', background: TEXT,
          color: '#fff', borderRadius: 20,
          fontSize: 13, fontWeight: 500, fontFamily: FONT,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
          alignSelf: 'flex-start',
        }}>
          Sent to agent
        </div>
      </div>
    </div>
  )
}

// Faithful recreation of the annotation comment card.
// Textarea is typeable, buttons use spring press (scale squish → bounce-back).
// No HTTP connection — standalone visual element.
// When editing=true, shows delete icon in header (reopening a pending annotation).
function CommentCard({
  componentName, elementTag, mode, comment, onCommentChange, editing,
}: {
  componentName: string
  elementTag: string
  mode: 'manual' | 'watch'
  comment: string
  onCommentChange: (v: string) => void
  editing?: boolean
}) {
  const filled = comment.trim().length > 0

  return (
    <div style={{
      background: SURFACE, borderRadius: 10, padding: 16,
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
      border: `1px solid ${BORDER}`, width: 320, fontFamily: FONT,
    }}>
      {/* Header: component·tag + delete icon when re-editing */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em' }}>
          {componentName} &middot; {elementTag}
        </div>
        {editing && (
          <ShowcaseHoverButton
            hoverBg="rgba(0,0,0,0.06)"
            baseStyle={{
              width: 24, height: 24, border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 4, color: TEXT_TER,
            }}
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </ShowcaseHoverButton>
        )}
      </div>

      {/* Typeable textarea */}
      <textarea
        value={comment}
        onChange={e => onCommentChange(e.target.value)}
        placeholder="Describe the change..."
        style={{
          width: '100%', minHeight: 72, background: SURFACE_SUBTLE,
          color: filled ? TEXT : TEXT_TER, border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: 10, fontSize: 13, lineHeight: 1.5,
          resize: 'vertical', outline: 'none', fontFamily: 'inherit',
        }}
      />

      {/* Spring buttons with hover states */}
      <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
        <SpringButton style={{
          padding: '7px 14px', background: 'transparent', color: TEXT_SEC,
          border: `1px solid ${BORDER}`, borderRadius: 8,
          fontSize: 12, fontWeight: 500, fontFamily: FONT,
          transition: 'background-color 150ms ease',
        }}>
          Cancel
        </SpringButton>
        <SpringButton style={{
          padding: '7px 14px',
          background: filled ? ACCENT : ACCENT_MUTED,
          color: filled ? '#fff' : TEXT_TER,
          border: 'none', borderRadius: 8,
          fontSize: 12, fontWeight: 500, fontFamily: FONT,
          display: 'flex', alignItems: 'center', gap: 5,
          transition: 'background-color 150ms ease',
        }}>
          {mode === 'watch' ? (
            <>
              Send
              <Check size={14} strokeWidth={2} />
            </>
          ) : 'Apply'}
        </SpringButton>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Page 4: Interaction Playground
   Full working mini-app with every component together.
   TopBar + Sidebar + canvas area + mock annotation flow.
   No HTTP — everything is local state. Test every interaction:
   - Sidebar toggle (PanelLeft icon)
   - Sidebar folder expand/collapse (click iteration names)
   - ProjectPicker dropdown (spring reveal)
   - FAB → targeting → highlight → comment card → marker + toast
   - Click marker to re-edit, trash to delete
   ═══════════════════════════════════════════════════════════════════ */

type PlaygroundMode = 'idle' | 'targeting' | 'commenting'

interface PlaygroundMarker {
  id: number
  boxIndex: number
  comment: string
}

function usePlaygroundSpring(
  visible: boolean,
  apply: (el: HTMLElement, v: number) => void,
) {
  const ref = useRef<HTMLElement | null>(null)
  const [render, setRender] = useState(visible)
  const animRef = useRef(0)
  const stRef = useRef({ value: visible ? 1 : 0, velocity: 0 })
  const applyRef = useRef(apply)
  applyRef.current = apply

  useEffect(() => {
    if (visible) setRender(true)
    cancelAnimationFrame(animRef.current)
    const target = visible ? 1 : 0
    const tension = 233
    const friction = 21
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      const s = stRef.current
      while (accum >= DT) {
        s.velocity += (-tension * (s.value - target) - friction * s.velocity) * DT
        s.value += s.velocity * DT
        accum -= DT
      }
      if (ref.current) applyRef.current(ref.current, Math.max(0, Math.min(1, s.value)))
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        animRef.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        if (ref.current) applyRef.current(ref.current, target)
        if (!visible) setRender(false)
      }
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [visible])

  return { ref, render }
}

const PLAYGROUND_BOXES = [
  { label: 'Header', w: 180, h: 48 },
  { label: 'Card A', w: 160, h: 100 },
  { label: 'Card B', w: 160, h: 100 },
  { label: 'Button', w: 120, h: 36 },
]

export function InteractionPlayground() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeProject, setActiveProject] = useState(0)
  const [activeIter, setActiveIter] = useState(0)
  const [activePage, setActivePage] = useState(0)
  const [pgMode, setPgMode] = useState<PlaygroundMode>('idle')
  const [hoveredBox, setHoveredBox] = useState<number | null>(null)
  const [selectedBox, setSelectedBox] = useState<number | null>(null)
  const [pgComment, setPgComment] = useState('')
  const [pgMarkers, setPgMarkers] = useState<PlaygroundMarker[]>([])
  const [pgToast, setPgToast] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [fabState, setFabState] = useState<'idle' | 'hover' | 'pressed'>('idle')
  const nextId = useRef(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const boxRefs = useRef<(HTMLDivElement | null)[]>([])

  // Spring presence for card, toast, FAB
  const cardSpring = usePlaygroundSpring(
    pgMode === 'commenting' && selectedBox !== null,
    (el, v) => {
      el.style.opacity = `${v}`
      el.style.transform = `translateY(${(1 - v) * 8}px) scale(${0.96 + 0.04 * v})`
    },
  )
  const toastSpring = usePlaygroundSpring(
    pgToast !== null,
    (el, v) => {
      el.style.opacity = `${v}`
      el.style.transform = `translateY(${(1 - v) * 12}px)`
    },
  )
  const fabSpring = usePlaygroundSpring(
    pgMode === 'idle',
    (el, v) => {
      el.style.opacity = `${v}`
      el.style.transform = `scale(${0.8 + 0.2 * v})`
    },
  )

  // Keep last values for exit animation
  const lastBoxRef = useRef<number | null>(null)
  const lastToastRef = useRef<string | null>(null)
  if (selectedBox !== null) lastBoxRef.current = selectedBox
  if (pgToast) lastToastRef.current = pgToast

  // Focus textarea when commenting
  useEffect(() => {
    if (pgMode === 'commenting' && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [pgMode])

  // Auto-dismiss toast
  useEffect(() => {
    if (!pgToast) return
    const t = setTimeout(() => setPgToast(null), 2000)
    return () => clearTimeout(t)
  }, [pgToast])

  const handleFabClick = () => setPgMode('targeting')

  const handleBoxClick = (index: number) => {
    if (pgMode !== 'targeting') return
    setSelectedBox(index)
    setPgComment('')
    setEditingId(null)
    setPgMode('commenting')
  }

  const handleSubmit = () => {
    const box = selectedBox ?? lastBoxRef.current
    if (box === null || !pgComment.trim()) return
    if (editingId !== null) {
      setPgMarkers(prev => prev.map(m => m.id === editingId ? { ...m, comment: pgComment.trim() } : m))
    } else {
      const id = nextId.current++
      setPgMarkers(prev => [...prev, { id, boxIndex: box, comment: pgComment.trim() }])
    }
    setPgToast(editingId !== null ? 'Updated' : 'Annotation placed')
    setPgMode('idle')
    setSelectedBox(null)
    setPgComment('')
    setEditingId(null)
  }

  const handleCancel = () => {
    setPgMode('idle')
    setSelectedBox(null)
    setPgComment('')
    setEditingId(null)
  }

  const handleMarkerClick = (marker: PlaygroundMarker) => {
    setSelectedBox(marker.boxIndex)
    setPgComment(marker.comment)
    setEditingId(marker.id)
    setPgMode('commenting')
  }

  const handleDelete = () => {
    if (editingId === null) return
    setPgMarkers(prev => prev.filter(m => m.id !== editingId))
    setPgMode('idle')
    setSelectedBox(null)
    setPgComment('')
    setEditingId(null)
    setPgToast('Annotation deleted')
  }

  const displayBox = selectedBox ?? lastBoxRef.current
  const displayToast = pgToast ?? lastToastRef.current

  return (
    <div style={{ padding: PAD, fontFamily: FONT, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <FrameTitle>Interaction Playground</FrameTitle>
      <StateLabel>Full system — every component working together</StateLabel>

      {/* Mini app shell */}
      <div style={{
        borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}`,
        height: 520, display: 'flex', flexDirection: 'column',
        background: SURFACE, position: 'relative',
      }}>
        {/* TopBar */}
        <TopBar
          projects={DEMO_PROJECTS}
          activeProjectIndex={activeProject}
          onSelectProject={setActiveProject}
          iterationCount={5}
          pendingCount={pgMarkers.length}
          mode="watch"
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
        />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          <IterationSidebar
            iterations={DEMO_ITERATIONS}
            activeIterationIndex={activeIter}
            activePageIndex={activePage}
            onSelect={(i, p) => { setActiveIter(i); setActivePage(p) }}
            collapsed={!sidebarOpen}
          />

          {/* Canvas area with interactive target boxes */}
          <div
            style={{
              flex: 1, background: '#F3F4F6', position: 'relative',
              cursor: pgMode === 'targeting' ? 'crosshair' : 'default',
            }}
            onClick={(e) => {
              // Click on empty canvas in targeting mode → cancel
              if (pgMode === 'targeting' && e.target === e.currentTarget) {
                handleCancel()
              }
            }}
          >
            <div style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
              {PLAYGROUND_BOXES.map((box, i) => (
                <div
                  key={box.label}
                  ref={el => { boxRefs.current[i] = el }}
                  onClick={() => handleBoxClick(i)}
                  onMouseEnter={() => pgMode === 'targeting' && setHoveredBox(i)}
                  onMouseLeave={() => setHoveredBox(null)}
                  style={{
                    width: box.w, height: box.h,
                    background: SURFACE, borderRadius: 8,
                    border: hoveredBox === i && pgMode === 'targeting'
                      ? `2px solid ${ACCENT}`
                      : `1px solid ${BORDER}`,
                    padding: hoveredBox === i && pgMode === 'targeting' ? 11 : 12,
                    display: 'flex', flexDirection: 'column', gap: 8,
                    cursor: pgMode === 'targeting' ? 'crosshair' : 'default',
                    transition: 'border-color 0.05s ease-out',
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 500, color: TEXT_TER }}>{box.label}</div>
                  <div style={{ flex: 1, background: SOFT_BG, borderRadius: 4 }} />
                </div>
              ))}
            </div>

            {/* Annotation markers on boxes */}
            {pgMarkers.map(marker => {
              const boxEl = boxRefs.current[marker.boxIndex]
              if (!boxEl) return null
              const parent = boxEl.parentElement?.parentElement
              if (!parent) return null
              return (
                <div
                  key={marker.id}
                  title={marker.comment}
                  onClick={() => handleMarkerClick(marker)}
                  style={{
                    position: 'absolute',
                    left: boxEl.offsetLeft + 24 - 6,
                    top: boxEl.offsetTop + 24 - 6,
                    width: 18, height: 18, borderRadius: '50%',
                    backgroundColor: ACCENT, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, fontFamily: FONT,
                    boxShadow: `0 1px 4px ${ACCENT_SHADOW}`,
                    cursor: 'default', userSelect: 'none',
                    zIndex: 10,
                  }}
                >
                  {marker.id}
                </div>
              )
            })}

            {/* Comment card — spring animated */}
            {cardSpring.render && displayBox !== null && (
              <div
                ref={cardSpring.ref as React.RefObject<HTMLDivElement>}
                style={{
                  position: 'absolute', bottom: 16, right: 16,
                  background: SURFACE, borderRadius: RADIUS, padding: 16,
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
                  border: `1px solid ${BORDER}`, width: 280, fontFamily: FONT,
                  zIndex: 20,
                  opacity: 0, transform: 'translateY(8px) scale(0.96)',
                  willChange: 'opacity, transform',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: TEXT_TER, letterSpacing: '0.02em' }}>
                    {PLAYGROUND_BOXES[displayBox]?.label ?? 'Element'} &middot; div
                  </div>
                  {editingId !== null && (
                    <ShowcaseHoverButton
                      onClick={handleDelete}
                      hoverBg="rgba(0,0,0,0.06)"
                      baseStyle={{
                        width: 24, height: 24, border: 'none', background: 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 4, color: TEXT_TER,
                      }}
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </ShowcaseHoverButton>
                  )}
                </div>
                <textarea
                  ref={textareaRef}
                  value={pgComment}
                  onChange={e => setPgComment(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Escape') handleCancel()
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                  }}
                  placeholder="Describe the change..."
                  style={{
                    width: '100%', minHeight: 56, background: SURFACE_SUBTLE,
                    color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 8,
                    padding: 10, fontSize: 13, lineHeight: 1.5,
                    resize: 'vertical', outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                  <SpringButton onClick={handleCancel} style={{
                    padding: '7px 14px', background: 'transparent', color: TEXT_SEC,
                    border: `1px solid ${BORDER}`, borderRadius: 8,
                    fontSize: 12, fontWeight: 500, fontFamily: FONT,
                  }}>
                    Cancel
                  </SpringButton>
                  <SpringButton onClick={handleSubmit} style={{
                    padding: '7px 14px',
                    background: pgComment.trim() ? ACCENT : ACCENT_MUTED,
                    color: pgComment.trim() ? '#fff' : TEXT_TER,
                    border: 'none', borderRadius: 8,
                    fontSize: 12, fontWeight: 500, fontFamily: FONT,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    Send
                    <Check size={14} strokeWidth={2} />
                  </SpringButton>
                </div>
              </div>
            )}

            {/* FAB — spring animated */}
            {fabSpring.render && (
              <div
                ref={fabSpring.ref as React.RefObject<HTMLDivElement>}
                style={{
                  position: 'absolute', bottom: 12, right: 12,
                  opacity: 0, transform: 'scale(0.8)',
                  willChange: 'opacity, transform',
                  zIndex: 20,
                }}
              >
                <button
                  onClick={handleFabClick}
                  onPointerEnter={() => setFabState('hover')}
                  onPointerLeave={() => setFabState('idle')}
                  onPointerDown={() => setFabState('pressed')}
                  onPointerUp={() => setFabState('hover')}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: fabState === 'hover' ? ACCENT_HOVER : fabState === 'pressed' ? ACCENT_PRESSED : ACCENT,
                    color: '#fff', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: fabState === 'hover'
                      ? `0 4px 16px ${ACCENT_SHADOW}`
                      : `0 2px 8px ${ACCENT_SHADOW}`,
                    transform: fabState === 'pressed' ? 'scale(0.95)' : 'scale(1)',
                    transition: 'transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease',
                  }}
                >
                  <Pencil size={16} strokeWidth={1.5} />
                </button>
              </div>
            )}

            {/* Toast — spring animated */}
            {toastSpring.render && displayToast && (
              <div
                ref={toastSpring.ref as React.RefObject<HTMLDivElement>}
                style={{
                  position: 'absolute', bottom: 16,
                  left: '50%', transform: 'translateX(-50%) translateY(12px)',
                  padding: '8px 24px', background: TEXT,
                  color: '#fff', borderRadius: 20,
                  fontSize: 13, fontWeight: 500, fontFamily: FONT,
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.12)',
                  opacity: 0, willChange: 'opacity, transform',
                  zIndex: 30,
                }}
              >
                {displayToast}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
