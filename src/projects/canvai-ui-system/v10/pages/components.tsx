import { useState, useRef } from 'react'
import { N, S, R, T, ICON, FONT, F, A } from '../tokens'
import { PreviewTopBar, PreviewSidebar, PreviewProjectPicker, ColorPicker, ZoomControl, CanvasColorPicker, AnnotationBadge, AnnotationDropdown, ThemeToggle } from '../components'
import type { Annotation } from '../components'
import { PickerDropdown } from '../../../../runtime/PickerDropdown'
import { Check, Trash2, SquareMousePointer, SlidersHorizontal, ExternalLink, Wand2 } from 'lucide-react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: S.xxl }}>
      <div style={{
        fontSize: T.label, fontWeight: 600, color: 'var(--txt-faint)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        marginBottom: S.sm, fontFamily: FONT,
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

/* ─── Annotation Comment Card ─── */
function CommentCard({ header, comment, onApply, showDelete, showCheck }: {
  header: string
  comment: string
  onApply: string
  showDelete?: boolean
  showCheck?: boolean
}) {
  const [value, setValue] = useState(comment)
  const [cancelHover, setCancelHover] = useState(false)
  const [applyHover, setApplyHover] = useState(false)
  const [deleteHover, setDeleteHover] = useState(false)
  const hasComment = value.trim().length > 0

  return (
    <div style={{
      width: 320,
      background: 'var(--card)',
      borderRadius: R.card,
      padding: S.lg,
      boxShadow: `0 ${S.xs}px ${S.xxl}px rgba(0,0,0,0.08), 0 1px ${S.xs}px rgba(0,0,0,0.04)`,
      border: `1px solid var(--border)`,
      fontFamily: FONT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.sm }}>
        <div style={{ fontSize: T.caption, color: 'var(--txt-ter)', letterSpacing: '0.02em' }}>
          {header}
        </div>
        {showDelete && (
          <button
            onMouseEnter={() => setDeleteHover(true)}
            onMouseLeave={() => setDeleteHover(false)}
            title="Delete annotation"
            style={{
              width: S.xxl, height: S.xxl, border: 'none',
              background: deleteHover ? 'var(--hover-active)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: R.control, color: 'var(--txt-ter)', cursor: 'default',
            }}
          >
            <Trash2 size={ICON.md} strokeWidth={1.5} />
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Describe the change..."
        style={{
          width: '100%', minHeight: 72,
          background: 'var(--canvas)', color: 'var(--txt-pri)',
          border: `1px solid var(--border)`, borderRadius: R.card,
          padding: S.md, fontSize: T.title, lineHeight: 1.5,
          resize: 'vertical', outline: 'none', fontFamily: 'inherit',
        }}
      />
      <div style={{ display: 'flex', gap: S.sm, marginTop: S.md, justifyContent: 'flex-end' }}>
        <button
          onMouseEnter={() => setCancelHover(true)}
          onMouseLeave={() => setCancelHover(false)}
          style={{
            padding: `${S.sm}px ${S.md}px`,
            background: cancelHover ? 'var(--hover-subtle)' : 'transparent',
            color: 'var(--txt-sec)',
            border: `1px solid var(--border)`, borderRadius: R.card,
            fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
          }}
        >
          Cancel
        </button>
        <button
          onMouseEnter={() => setApplyHover(true)}
          onMouseLeave={() => setApplyHover(false)}
          style={{
            padding: `${S.sm}px ${S.md}px`,
            background: hasComment
              ? (applyHover ? 'var(--accent-hover)' : 'var(--accent)')
              : 'var(--accent-muted)',
            color: hasComment ? 'var(--text-on-accent)' : 'var(--txt-ter)',
            border: 'none', borderRadius: R.card,
            fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            display: 'flex', alignItems: 'center', gap: S.xs,
          }}
        >
          {onApply}
          {showCheck && <Check size={ICON.md} strokeWidth={2} />}
        </button>
      </div>
    </div>
  )
}

/* ─── Static Annotation Dropdown showcase ─── */
const SHOWCASE_ANNOTATIONS: Annotation[] = [
  { id: '1', comment: 'Make the font size larger', componentName: 'Button', elementTag: 'button', status: 'draft' },
  { id: '2', comment: 'Add more padding around the icon', componentName: 'Card', elementTag: 'div', status: 'draft' },
  { id: '3', comment: 'Reduce the gap between label and value', componentName: 'TokenSwatch', elementTag: 'span', status: 'resolved' },
]

function AnnotationDropdownStatic({ annotations }: { annotations: Annotation[] }) {
  const drafts = annotations.filter(a => a.status === 'draft')
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ display: 'inline-flex', padding: S.sm, backgroundColor: 'var(--chrome)', borderRadius: R.card }}>
        <AnnotationBadge count={drafts.length} onClick={() => {}} />
      </div>
      <AnnotationDropdown
        annotations={annotations}
        open={true}
        dropdownRef={ref}
        onApplyAll={() => {}}
        onApplyOne={() => {}}
        onNavigate={() => {}}
        forceOpen
      />
    </div>
  )
}

/* ─── MenuPanel showcase (static) ─── */
function MenuPanelShowcase() {
  return (
    <div style={{
      width: 160,
      background: N.card,
      borderRadius: R.card,
      border: `1px solid ${N.border}`,
      boxShadow: `0 ${S.xs}px ${S.lg}px rgba(0, 0, 0, 0.08), 0 1px ${S.xs}px rgba(0, 0, 0, 0.04)`,
      padding: S.xs,
      fontFamily: FONT,
    }}>
      <div style={{
        padding: `${S.xs}px ${S.sm}px`,
        fontSize: T.caption, color: N.txtTer,
        userSelect: 'none',
      }}>
        v0.0.34
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', width: '100%',
        gap: S.sm, padding: `${S.xs}px ${S.sm}px`,
        border: 'none', borderRadius: R.control,
        backgroundColor: 'transparent', fontFamily: FONT,
        textAlign: 'left', cursor: 'default',
        fontSize: T.body, color: N.txtSec,
      }}>
        <span style={{ flex: 1 }}>GitHub</span>
        <ExternalLink size={ICON.sm} strokeWidth={1.5} color={N.txtTer} />
      </button>
    </div>
  )
}

/* ─── DialogCard showcase ─── */
function DialogCardShowcase({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: N.card,
      borderRadius: R.card,
      border: `1px solid ${N.border}`,
      boxShadow: `0 ${S.xs}px ${S.lg}px rgba(0, 0, 0, 0.08), 0 1px ${S.xs}px rgba(0, 0, 0, 0.04)`,
      padding: S.xxl,
      fontFamily: FONT,
      width: 480,
    }}>
      {title && (
        <div style={{
          fontSize: T.title, fontWeight: 600, color: N.txtPri,
          marginBottom: S.lg, textWrap: 'pretty',
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

/* ─── ActionButton showcase ─── */
function ActionButtonShowcase({ variant, label, disabled }: { variant: 'ghost' | 'primary'; label: string; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const isPrimary = variant === 'primary'
  const bg = isPrimary
    ? (disabled ? A.muted : hovered ? A.hover : A.accent)
    : (hovered ? 'rgba(0, 0, 0, 0.03)' : 'transparent')
  const color = isPrimary
    ? (disabled ? N.txtTer : 'oklch(1 0 0)')
    : N.txtSec

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: `${S.sm}px ${S.md}px`,
        background: bg,
        color,
        border: isPrimary ? 'none' : `1px solid ${N.border}`,
        borderRadius: R.card,
        cursor: 'default',
        fontSize: T.body,
        fontWeight: 500,
        fontFamily: FONT,
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
      }}
    >
      {label}
    </button>
  )
}

/* ─── MarkerDot showcase ─── */
function MarkerDotShowcase({ id }: { id: number }) {
  return (
    <div style={{
      width: S.lg,
      height: S.lg,
      borderRadius: '50%',
      background: F.marker,
      color: 'oklch(1 0 0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: T.label,
      fontWeight: 700,
      fontFamily: FONT,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 2px rgba(0,0,0,0.15), 0 0 0 0.5px rgba(0,0,0,0.06)',
    }}>
      {id}
    </div>
  )
}

/* ─── FAB showcase ─── */
function FABShowcase({ state }: { state: 'idle' | 'hover' | 'pressed' }) {
  const bg = state === 'pressed' ? A.strong : state === 'hover' ? A.hover : A.accent

  return (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      background: bg,
      color: 'oklch(1 0 0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: state === 'pressed'
        ? 'inset 0 1px 2px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)'
        : state === 'hover'
          ? 'inset 0 1px 0 rgba(255,255,255,0.10), 0 2px 6px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.06)'
          : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 3px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)',
    }}>
      <SquareMousePointer size={S.xl} strokeWidth={1.5} />
    </div>
  )
}

/* ─── InfoButton showcase ─── */
function InfoButtonShowcase() {
  return (
    <div style={{ display: 'inline-flex', position: 'relative' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        border: 'none', background: N.chromeSub,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <SlidersHorizontal size={ICON.md} strokeWidth={1.5} color={N.txtTer} />
      </div>
    </div>
  )
}

/* ─── Sample data ─── */
const sampleProjects = [
  { project: 'settings-page' },
  { project: 'dashboard' },
  { project: 'onboarding' },
]

const sampleIterations = ['V1', 'V2', 'V3']

const samplePages = [
  { name: 'Tokens' },
  { name: 'Components' },
  { name: 'Team Settings' },
  { name: 'Dashboard' },
]

/* ═══════════════════════════════════════════════════════
   Components Page — Every Runtime Part
   ═══════════════════════════════════════════════════════ */

export function Components() {
  const [projectIdx, setProjectIdx] = useState(0)
  const [iterIdx, setIterIdx] = useState(0)
  const [pageIdx, setPageIdx] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ padding: S.xxl, fontFamily: FONT }}>
      <div style={{ fontSize: T.title, fontWeight: 600, color: 'var(--txt-pri)', marginBottom: S.xl }}>
        Runtime Components — All Parts
      </div>

      {/* ─── TopBar ─── */}
      <Section title="TopBar — With Pending Annotations">
        <div style={{ border: `1px solid var(--border)`, borderRadius: R.card, overflow: 'hidden' }}>
          <PreviewTopBar
            projectName={sampleProjects[projectIdx].project}
            iterations={sampleIterations}
            activeIterationIndex={iterIdx}
            onSelectIteration={setIterIdx}
            pendingCount={2}
            mode="manual"
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(o => !o)}
          />
        </div>
      </Section>

      <Section title="TopBar — No Pending">
        <div style={{ border: `1px solid var(--border)`, borderRadius: R.card, overflow: 'hidden' }}>
          <PreviewTopBar
            projectName="onboarding"
            iterations={['V1', 'V2']}
            activeIterationIndex={1}
            onSelectIteration={() => {}}
            pendingCount={0}
            mode="manual"
            sidebarOpen={true}
            onToggleSidebar={() => {}}
          />
        </div>
      </Section>

      {/* ─── ProjectPicker ─── */}
      <Section title="ProjectPicker — Closed">
        <div style={{ display: 'inline-block' }}>
          <PreviewProjectPicker
            projects={sampleProjects}
            activeIndex={projectIdx}
            onSelect={setProjectIdx}
          />
        </div>
      </Section>

      <Section title="ProjectPicker — Open Dropdown">
        <div style={{ display: 'inline-block', position: 'relative', minHeight: 160 }}>
          <PreviewProjectPicker
            projects={sampleProjects}
            activeIndex={projectIdx}
            onSelect={setProjectIdx}
            forceOpen
          />
        </div>
      </Section>

      {/* ─── PickerDropdown ─── */}
      <Section title="PickerDropdown — Iteration Picker (Open)">
        <div style={{ display: 'inline-block', position: 'relative', minHeight: 160 }}>
          <PickerDropdown
            items={[
              { name: 'V3', description: 'Final polish pass' },
              { name: 'V2', description: 'Revised spacing and color' },
              { name: 'V1', description: 'Initial exploration' },
            ]}
            activeIndex={0}
            onSelect={() => {}}
            width={280}
            forceOpen
            renderTriggerLabel={(item) => (
              <span style={{ fontSize: T.title, fontWeight: 500, color: N.txtPri }}>{item.name}</span>
            )}
            renderRow={(item) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: T.body, fontWeight: 500, color: N.txtPri }}>{item.name}</span>
                {item.description && (
                  <span style={{ fontSize: T.caption, fontWeight: 400, color: N.txtTer, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.description}
                  </span>
                )}
              </div>
            )}
          />
        </div>
      </Section>

      <Section title="PickerDropdown — Simple List">
        <div style={{ display: 'inline-block' }}>
          <PickerDropdown
            items={sampleIterations.map(name => ({ name }))}
            activeIndex={iterIdx}
            onSelect={setIterIdx}
            width={180}
            renderTriggerLabel={(item) => (
              <span style={{ fontSize: T.title, fontWeight: 500, color: N.txtPri }}>{item.name}</span>
            )}
            renderRow={(item) => (
              <span style={{ fontSize: T.body, color: N.txtPri }}>{item.name}</span>
            )}
          />
        </div>
      </Section>

      {/* ─── IterationSidebar ─── */}
      <Section title="IterationSidebar — Expanded">
        <div style={{
          display: 'inline-flex', height: 280,
          border: `1px solid var(--border)`, borderRadius: R.card, overflow: 'hidden',
        }}>
          <PreviewSidebar
            pages={samplePages}
            activePageIndex={pageIdx}
            onSelectPage={setPageIdx}
            collapsed={false}
          />
        </div>
      </Section>

      <Section title="IterationSidebar — Collapsed">
        <div style={{
          display: 'inline-flex', height: 120,
          border: `1px solid var(--border)`, borderRadius: R.card, overflow: 'hidden',
        }}>
          <PreviewSidebar
            pages={samplePages}
            activePageIndex={0}
            onSelectPage={() => {}}
            collapsed={true}
          />
          <div style={{
            width: 200, backgroundColor: 'var(--canvas)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: T.body, color: 'var(--txt-ter)',
          }}>
            Canvas area
          </div>
        </div>
      </Section>

      {/* ─── ZoomControl ─── */}
      <Section title="ZoomControl — 100%">
        <ZoomControl zoom={1} />
      </Section>

      <Section title="ZoomControl — 75%">
        <ZoomControl zoom={0.75} />
      </Section>

      <Section title="ZoomControl — 200%">
        <ZoomControl zoom={2} />
      </Section>

      {/* ─── CanvasColorPicker ─── */}
      <Section title="CanvasColorPicker — Closed">
        <CanvasColorPicker />
      </Section>

      <Section title="CanvasColorPicker — Dark Selected">
        <CanvasColorPicker activeColor="oklch(0.200 0.005 80)" />
      </Section>

      <Section title="ZoomControl + CanvasColorPicker — Inline">
        <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
          <CanvasColorPicker />
          <ZoomControl zoom={0.85} />
        </div>
      </Section>

      {/* ─── ColorPicker ─── */}
      <Section title="ColorPicker — OKLCH (Danger)">
        <ColorPicker l={0.52} c={0.20} h={28} onApply={() => {}} onCancel={() => {}} />
      </Section>

      <Section title="ColorPicker — Low Chroma (Accent)">
        <ColorPicker l={0.30} c={0.005} h={80} onApply={() => {}} onCancel={() => {}} />
      </Section>

      <Section title="ColorPicker — Edit Mode (Discard)">
        <ColorPicker l={0.92} c={0.04} h={155} onApply={() => {}} onCancel={() => {}} onDiscard={() => {}} />
      </Section>

      {/* ─── Annotation Comment Card ─── */}
      <Section title="Annotation Card — Empty">
        <CommentCard header="Button · button" comment="" onApply="Save" />
      </Section>

      <Section title="Annotation Card — With Comment">
        <CommentCard header="TopBar · div" comment="Make the padding 12px and reduce font weight to 500" onApply="Save" />
      </Section>

      <Section title="Annotation Card — Editing (Delete)">
        <CommentCard header="Sidebar · nav" comment="Tighten the row gap" onApply="Save" showDelete />
      </Section>

      <Section title="Annotation Card — Watch Mode">
        <CommentCard header="Frame · section" comment="Increase border radius" onApply="Send" showCheck />
      </Section>

      {/* ─── Annotation Badge ─── */}
      <Section title="AnnotationBadge — With Drafts">
        <div style={{ display: 'inline-flex', padding: S.sm, backgroundColor: 'var(--chrome)', borderRadius: R.card }}>
          <AnnotationBadge count={3} onClick={() => {}} />
        </div>
      </Section>

      <Section title="AnnotationBadge — Empty">
        <div style={{ display: 'inline-flex', padding: S.sm, backgroundColor: 'var(--chrome)', borderRadius: R.card }}>
          <AnnotationBadge count={0} onClick={() => {}} />
        </div>
      </Section>

      {/* ─── Annotation Dropdown ─── */}
      <Section title="AnnotationDropdown — With Drafts">
        <AnnotationDropdownStatic annotations={SHOWCASE_ANNOTATIONS} />
      </Section>

      <Section title="AnnotationDropdown — Empty">
        <AnnotationDropdownStatic annotations={[]} />
      </Section>

      <Section title="AnnotationDropdown — All Resolved">
        <AnnotationDropdownStatic annotations={SHOWCASE_ANNOTATIONS.map(a => ({ ...a, status: 'resolved' as const }))} />
      </Section>

      {/* ─── FAB (Floating Action Button) ─── */}
      <Section title="FAB — Idle">
        <FABShowcase state="idle" />
      </Section>

      <Section title="FAB — Hover">
        <FABShowcase state="hover" />
      </Section>

      <Section title="FAB — Pressed">
        <FABShowcase state="pressed" />
      </Section>

      {/* ─── Marker Dots ─── */}
      <Section title="MarkerDot — Annotation Markers">
        <div style={{ display: 'flex', gap: S.sm, alignItems: 'center' }}>
          <MarkerDotShowcase id={1} />
          <MarkerDotShowcase id={2} />
          <MarkerDotShowcase id={3} />
        </div>
      </Section>

      {/* ─── ActionButton ─── */}
      <Section title="ActionButton — Primary">
        <ActionButtonShowcase variant="primary" label="Create" />
      </Section>

      <Section title="ActionButton — Primary (Disabled)">
        <ActionButtonShowcase variant="primary" label="Create" disabled />
      </Section>

      <Section title="ActionButton — Ghost">
        <ActionButtonShowcase variant="ghost" label="Cancel" />
      </Section>

      <Section title="ActionButton — Row">
        <div style={{ display: 'flex', gap: S.sm, justifyContent: 'flex-end' }}>
          <ActionButtonShowcase variant="ghost" label="Cancel" />
          <ActionButtonShowcase variant="primary" label="Create" />
        </div>
      </Section>

      {/* ─── MenuPanel ─── */}
      <Section title="MenuPanel — InfoButton Menu">
        <MenuPanelShowcase />
      </Section>

      {/* ─── InfoButton ─── */}
      <Section title="InfoButton — Trigger">
        <InfoButtonShowcase />
      </Section>

      {/* ─── DialogCard ─── */}
      <Section title="DialogCard — New Iteration">
        <DialogCardShowcase title="New iteration">
          <textarea
            placeholder="What do you want to change?"
            rows={3}
            style={{
              width: '100%', minHeight: 72,
              background: N.canvas, color: N.txtPri,
              border: `1px solid ${N.border}`, borderRadius: R.card,
              padding: S.md, fontSize: T.title, lineHeight: 1.5,
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S.sm, marginTop: S.lg }}>
            <ActionButtonShowcase variant="ghost" label="Cancel" />
            <ActionButtonShowcase variant="primary" label="Create" disabled />
          </div>
        </DialogCardShowcase>
      </Section>

      <Section title="DialogCard — New Iteration (Filled)">
        <DialogCardShowcase title="New iteration">
          <textarea
            defaultValue="Simplify the sidebar — remove the divider and make the info button smaller"
            rows={3}
            style={{
              width: '100%', minHeight: 72,
              background: N.canvas, color: N.txtPri,
              border: `1px solid ${N.border}`, borderRadius: R.card,
              padding: S.md, fontSize: T.title, lineHeight: 1.5,
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: S.sm, marginTop: S.lg }}>
            <ActionButtonShowcase variant="ghost" label="Cancel" />
            <ActionButtonShowcase variant="primary" label="Create" />
          </div>
        </DialogCardShowcase>
      </Section>

      {/* ─── Overlay backdrop ─── */}
      <Section title="Overlay — Modal Backdrop">
        <div style={{
          width: 480, height: 120,
          background: 'rgba(0, 0, 0, 0.15)',
          borderRadius: R.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: N.card, borderRadius: R.card,
            border: `1px solid ${N.border}`,
            boxShadow: `0 ${S.xs}px ${S.lg}px rgba(0, 0, 0, 0.08)`,
            padding: `${S.md}px ${S.xxl}px`,
            fontFamily: FONT, fontSize: T.body, color: N.txtSec,
          }}>
            Dialog appears here
          </div>
        </div>
      </Section>

      {/* ─── ThemeToggle ─── */}
      <Section title="ThemeToggle — System">
        <ThemeToggle mode="system" />
      </Section>

      <Section title="ThemeToggle — Light">
        <ThemeToggle mode="light" />
      </Section>

      <Section title="ThemeToggle — Dark">
        <ThemeToggle mode="dark" />
      </Section>

      {/* ─── Frame title ─── */}
      <Section title="Frame Title — As Rendered on Canvas">
        <div style={{
          fontSize: 12, color: '#999',
          whiteSpace: 'nowrap', overflow: 'hidden',
          textOverflow: 'ellipsis', userSelect: 'none',
          marginBottom: S.sm,
        }}>
          OKLCH Token System — Live App
        </div>
        <div style={{
          width: 320, height: 80,
          background: N.card, borderRadius: R.card,
          border: `1px solid ${N.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: T.body, color: N.txtSec, fontFamily: FONT,
        }}>
          Frame content
        </div>
      </Section>
    </div>
  )
}
