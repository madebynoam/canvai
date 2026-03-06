import { useState, useRef } from 'react'
import { N, S, R, T, ICON, FONT } from '../tokens'
import { PreviewTopBar, PreviewSidebar, PreviewProjectPicker, ColorPicker, ZoomControl, CanvasColorPicker, AnnotationBadge, AnnotationDropdown } from '../components'
import type { Annotation } from '../components'
import { PickerDropdown } from '../../../../runtime/PickerDropdown'
import { Check, Trash2 } from 'lucide-react'

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
              background: deleteHover ? 'rgba(0,0,0,0.06)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: R.control, color: 'var(--txt-ter)', cursor: 'default',
              transition: 'background-color 150ms ease',
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
            background: cancelHover ? 'rgba(0,0,0,0.03)' : 'transparent',
            color: 'var(--txt-sec)',
            border: `1px solid var(--border)`, borderRadius: R.card,
            fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            transition: 'background-color 150ms ease',
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
            color: hasComment ? 'oklch(1 0 0)' : 'var(--txt-ter)',
            border: 'none', borderRadius: R.card,
            fontSize: T.body, fontWeight: 500, fontFamily: FONT, cursor: 'default',
            display: 'flex', alignItems: 'center', gap: S.xs,
            transition: 'background-color 150ms ease',
          }}
        >
          {onApply}
          {showCheck && <Check size={ICON.md} strokeWidth={2} />}
        </button>
      </div>
    </div>
  )
}

const SHOWCASE_ANNOTATIONS: Annotation[] = [
  { id: '1', comment: 'Make the font size larger', componentName: 'Button', elementTag: 'button', status: 'draft' },
  { id: '2', comment: 'Add more padding around the icon', componentName: 'Card', elementTag: 'div', status: 'draft' },
  { id: '3', comment: 'Reduce the gap between label and value', componentName: 'TokenSwatch', elementTag: 'span', status: 'resolved' },
]

function AnnotationDropdownStatic({ annotations }: { annotations: Annotation[] }) {
  const drafts = annotations.filter(a => a.status === 'draft')
  const resolved = annotations.filter(a => a.status === 'resolved')
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

export function Components() {
  const [projectIdx, setProjectIdx] = useState(0)
  const [iterIdx, setIterIdx] = useState(0)
  const [pageIdx, setPageIdx] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div style={{ padding: S.xxl, fontFamily: FONT }}>
      <div style={{ fontSize: T.title, fontWeight: 600, color: 'var(--txt-pri)', marginBottom: S.xl }}>
        Runtime Components
      </div>

      <Section title="TopBar">
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

      <Section title="ProjectPicker">
        <div style={{ display: 'inline-block' }}>
          <PreviewProjectPicker
            projects={sampleProjects}
            activeIndex={projectIdx}
            onSelect={setProjectIdx}
          />
        </div>
      </Section>

      <Section title="ProjectPicker — Open">
        <div style={{ display: 'inline-block', position: 'relative', minHeight: 160 }}>
          <PreviewProjectPicker
            projects={sampleProjects}
            activeIndex={projectIdx}
            onSelect={setProjectIdx}
            forceOpen
          />
        </div>
      </Section>

      <Section title="PickerDropdown — Iteration Picker">
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

      <Section title="IterationSidebar">
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

      <Section title="Zoom Control — 100%">
        <ZoomControl zoom={1} />
      </Section>

      <Section title="Zoom Control — 75%">
        <ZoomControl zoom={0.75} />
      </Section>

      <Section title="Zoom Control — 200%">
        <ZoomControl zoom={2} />
      </Section>

      <Section title="Canvas Color — Trigger (Closed)">
        <CanvasColorPicker />
      </Section>

      <Section title="Canvas Color — Dark Selected">
        <CanvasColorPicker activeColor="oklch(0.200 0.005 80)" />
      </Section>

      <Section title="Zoom + Canvas Color — Inline">
        <div style={{
          display: 'flex',
          gap: S.sm,
          alignItems: 'center',
        }}>
          <CanvasColorPicker />
          <ZoomControl zoom={0.85} />
        </div>
      </Section>

      <Section title="Color Picker — OKLCH">
        <ColorPicker l={0.52} c={0.20} h={28} onApply={() => {}} onCancel={() => {}} />
      </Section>

      <Section title="Color Picker — Low Chroma">
        <ColorPicker l={0.30} c={0.005} h={80} onApply={() => {}} onCancel={() => {}} />
      </Section>

      <Section title="Color Picker — Edit Mode (Pending)">
        <ColorPicker l={0.92} c={0.04} h={155} onApply={() => {}} onCancel={() => {}} onDiscard={() => {}} />
      </Section>

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

      <Section title="Annotation Badge — With Drafts">
        <div style={{ display: 'inline-flex', padding: S.sm, backgroundColor: 'var(--chrome)', borderRadius: R.card }}>
          <AnnotationBadge count={3} onClick={() => {}} />
        </div>
      </Section>

      <Section title="Annotation Badge — Empty">
        <div style={{ display: 'inline-flex', padding: S.sm, backgroundColor: 'var(--chrome)', borderRadius: R.card }}>
          <AnnotationBadge count={0} onClick={() => {}} />
        </div>
      </Section>

      <Section title="Annotation Dropdown — With Drafts">
        <AnnotationDropdownStatic annotations={SHOWCASE_ANNOTATIONS} />
      </Section>

      <Section title="Annotation Dropdown — Empty">
        <AnnotationDropdownStatic annotations={[]} />
      </Section>

      <Section title="Annotation Dropdown — All Resolved">
        <AnnotationDropdownStatic annotations={SHOWCASE_ANNOTATIONS.map(a => ({ ...a, status: 'resolved' as const }))} />
      </Section>
    </div>
  )
}
