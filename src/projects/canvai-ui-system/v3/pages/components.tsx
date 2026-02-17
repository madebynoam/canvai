import { useState } from 'react'
import { N, A, S, R, T, ICON, FONT } from '../tokens'
import { PreviewTopBar, PreviewSidebar, PreviewProjectPicker } from '../components'
import { IterationPills } from '../../../../runtime/IterationPills'
import { Check, Trash2 } from 'lucide-react'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: S.xxl }}>
      <div style={{
        fontSize: T.label, fontWeight: 600, color: N.txtFaint,
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
      background: N.card,
      borderRadius: R.card,
      padding: S.lg,
      boxShadow: `0 ${S.xs}px ${S.xxl}px rgba(0,0,0,0.08), 0 1px ${S.xs}px rgba(0,0,0,0.04)`,
      border: `1px solid ${N.border}`,
      fontFamily: FONT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.sm }}>
        <div style={{ fontSize: T.caption, color: N.txtTer, letterSpacing: '0.02em' }}>
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
              borderRadius: R.control, color: N.txtTer, cursor: 'default',
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
          background: N.canvas, color: N.txtPri,
          border: `1px solid ${N.border}`, borderRadius: R.card,
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
            color: N.txtSec,
            border: `1px solid ${N.border}`, borderRadius: R.card,
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
              ? (applyHover ? A.hover : A.accent)
              : A.muted,
            color: hasComment ? 'oklch(1 0 0)' : N.txtTer,
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
      <div style={{ fontSize: T.title, fontWeight: 600, color: N.txtPri, marginBottom: S.xl }}>
        Runtime Components
      </div>

      <Section title="TopBar">
        <div style={{ border: `1px solid ${N.border}`, borderRadius: R.card, overflow: 'hidden' }}>
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

      <Section title="TopBar — Watch Mode">
        <div style={{ border: `1px solid ${N.border}`, borderRadius: R.card, overflow: 'hidden' }}>
          <PreviewTopBar
            projectName={sampleProjects[0].project}
            iterations={sampleIterations}
            activeIterationIndex={1}
            onSelectIteration={() => {}}
            pendingCount={0}
            mode="watch"
            sidebarOpen={true}
            onToggleSidebar={() => {}}
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

      <Section title="IterationPills — 3 items">
        <div style={{ display: 'inline-block', padding: S.sm, backgroundColor: N.chrome, borderRadius: R.card }}>
          <IterationPills
            items={sampleIterations}
            activeIndex={iterIdx}
            onSelect={setIterIdx}
          />
        </div>
      </Section>

      <Section title="IterationPills — 6 items (scrolling)">
        <div style={{ display: 'inline-block', padding: S.sm, backgroundColor: N.chrome, borderRadius: R.card }}>
          <IterationPills
            items={['V1', 'V2', 'V3', 'V4', 'V5', 'V6']}
            activeIndex={0}
            onSelect={() => {}}
          />
        </div>
      </Section>

      <Section title="IterationSidebar">
        <div style={{
          display: 'inline-flex', height: 280,
          border: `1px solid ${N.border}`, borderRadius: R.card, overflow: 'hidden',
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
          border: `1px solid ${N.border}`, borderRadius: R.card, overflow: 'hidden',
        }}>
          <PreviewSidebar
            pages={samplePages}
            activePageIndex={0}
            onSelectPage={() => {}}
            collapsed={true}
          />
          <div style={{
            width: 200, backgroundColor: N.canvas,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: T.body, color: N.txtTer,
          }}>
            Canvas area
          </div>
        </div>
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
    </div>
  )
}
