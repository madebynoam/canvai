import { N, S, R, FONT } from '../tokens'
import {
  AnnotationBadge,
  AnnotationDropdown,
  useAnnotationPanel,
} from '../components'
import type { Annotation } from '../components'

/* ─── Mock data ────────────────────────────────────────── */

const MOCK_ANNOTATIONS: Annotation[] = [
  { id: '1', comment: 'Make the font size larger', componentName: 'Button', elementTag: 'button', status: 'draft' },
  { id: '2', comment: 'Add more padding around the icon', componentName: 'Card', elementTag: 'div', status: 'draft' },
  { id: '3', comment: 'Change the border color to match tokens', componentName: 'Input', elementTag: 'input', status: 'draft' },
  { id: '4', comment: 'Reduce the gap between label and value', componentName: 'TokenSwatch', elementTag: 'span', status: 'resolved' },
]

/* ─── Assembled previews ───────────────────────────────── */

function TopBarWithPanel() {
  const {
    open, setOpen, annotations, drafts,
    containerRef, dropdownRef,
    handleApplyAll, handleApplyOne,
  } = useAnnotationPanel(MOCK_ANNOTATIONS)

  return (
    <div ref={containerRef} style={{ fontFamily: FONT }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
      }}>
        <AnnotationBadge count={drafts.length} onClick={() => setOpen(o => !o)} />
      </div>
      <AnnotationDropdown
        annotations={annotations}
        open={open}
        dropdownRef={dropdownRef}
        onApplyAll={handleApplyAll}
        onApplyOne={handleApplyOne}
        onNavigate={() => {}}
      />
    </div>
  )
}

function EmptyPanel() {
  const {
    open, setOpen, annotations,
    containerRef, dropdownRef,
    handleApplyAll, handleApplyOne,
  } = useAnnotationPanel([])

  return (
    <div ref={containerRef} style={{ fontFamily: FONT }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
      }}>
        <AnnotationBadge count={0} onClick={() => setOpen(o => !o)} />
      </div>
      <AnnotationDropdown
        annotations={annotations}
        open={open}
        dropdownRef={dropdownRef}
        onApplyAll={handleApplyAll}
        onApplyOne={handleApplyOne}
        onNavigate={() => {}}
      />
    </div>
  )
}

function ResolvedPanel() {
  const resolvedAnnotations = MOCK_ANNOTATIONS.map(a => ({ ...a, status: 'resolved' as const }))
  const {
    open, setOpen, annotations,
    containerRef, dropdownRef,
    handleApplyAll, handleApplyOne,
  } = useAnnotationPanel(resolvedAnnotations)

  return (
    <div ref={containerRef} style={{ fontFamily: FONT }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 40,
        padding: `0 ${S.md}px`,
        backgroundColor: N.chrome,
        borderRadius: R.card,
        border: `1px solid ${N.border}`,
      }}>
        <AnnotationBadge count={0} onClick={() => setOpen(o => !o)} />
      </div>
      <AnnotationDropdown
        annotations={annotations}
        open={open}
        dropdownRef={dropdownRef}
        onApplyAll={handleApplyAll}
        onApplyOne={handleApplyOne}
        onNavigate={() => {}}
      />
    </div>
  )
}

/* ─── Exports ──────────────────────────────────────────── */

export function AnnotationPanelInteractive() {
  return <TopBarWithPanel />
}

export function AnnotationPanelEmpty() {
  return <EmptyPanel />
}

export function AnnotationPanelResolved() {
  return <ResolvedPanel />
}
