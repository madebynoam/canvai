import { useState, useRef } from 'react'
import { N, A, S, R, T, ICON, FONT } from '../../../../runtime/tokens'
import { ActionButton, MenuPanel, MenuRow, DialogCard, DialogActions } from '../../../../runtime/Menu'
import { ZoomControl } from '../../../../runtime/ZoomControl'
import { CanvasColorPicker, DEFAULT_CANVAS_COLOR } from '../../../../runtime/CanvasColorPicker'
import { TokenSwatch } from '../../../../runtime/TokenSwatch'
import { Check, ChevronDown, Plus, Minus, MessageSquare, Wand2, SquareMousePointer, X, SlidersHorizontal, ExternalLink } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAI DESIGN SYSTEM

   Tenets:
   1. Many at once — 3+ directions simultaneously
   2. The code is the design — Live React, everything works
   3. Point, don't describe — Annotations carry context
   4. Proliferate before converging — Multiple bets first

   Design Language:
   - Braun / Jony Ive aesthetic
   - OKLCH only, no hex
   - 4px spacing grid
   - Spring physics for motion
   - cursor: default on all shell UI
   - Achromatic shell (c ≤ 0.003), one accent hue
   ═══════════════════════════════════════════════════════════════════════════ */

const SECTION = {
  marginBottom: 64,
}

const SECTION_LABEL = {
  fontSize: 10,
  fontWeight: 600 as const,
  color: N.txtTer,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  marginBottom: S.lg,
  fontFamily: FONT,
}

const COMPONENT_LABEL = {
  fontSize: T.ui,
  fontWeight: 600 as const,
  color: N.txtPri,
  marginBottom: S.md,
  fontFamily: FONT,
}

const STATE_LABEL = {
  fontSize: 10,
  color: N.txtTer,
  fontFamily: FONT,
  marginTop: S.sm,
  textAlign: 'center' as const,
}

const COMPONENT_ROW = {
  display: 'flex',
  gap: S.xl,
  alignItems: 'flex-start',
  marginBottom: S.xxl,
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. NAVIGATION — TopBar elements, Sidebar, Pickers
   ───────────────────────────────────────────────────────────────────────────── */

function ProjectPicker({ projects, active }: { projects: string[]; active: number }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.xs,
          padding: `${S.xs}px ${S.sm}px`,
          background: hovered ? 'rgba(0,0,0,0.04)' : 'transparent',
          border: 'none',
          borderRadius: R.ui,
          fontSize: T.ui,
          fontWeight: 600,
          fontFamily: FONT,
          color: N.txtPri,
          cursor: 'default',
        }}
      >
        {projects[active]}
        <ChevronDown size={ICON.sm} color={N.txtSec} />
      </button>
      {open && (
        <MenuPanel style={{ position: 'absolute', top: '100%', left: 0, marginTop: S.xs, width: 180 }}>
          {projects.map((p, i) => (
            <MenuRow key={p} onClick={() => setOpen(false)} style={{ fontWeight: i === active ? 600 : 400 }}>
              {p}
              {i === active && <Check size={ICON.sm} color={A.accent} />}
            </MenuRow>
          ))}
          <div style={{ height: 1, background: N.border, margin: `${S.xs}px 0` }} />
          <MenuRow onClick={() => {}}>
            <Plus size={ICON.sm} color={N.txtSec} />
            New Project
          </MenuRow>
        </MenuPanel>
      )}
    </div>
  )
}

function IterationPicker({ iterations, active }: { iterations: string[]; active: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.xs,
          padding: `${S.xs}px ${S.sm}px`,
          background: N.chrome,
          border: `1px solid ${N.border}`,
          borderRadius: R.ui,
          fontSize: T.ui,
          fontWeight: 500,
          fontFamily: FONT,
          color: N.txtPri,
          cursor: 'default',
        }}
      >
        {iterations[active]}
        <ChevronDown size={ICON.sm} color={N.txtSec} />
      </button>
      {open && (
        <MenuPanel style={{ position: 'absolute', top: '100%', left: 0, marginTop: S.xs, width: 140 }}>
          {iterations.map((it, i) => (
            <MenuRow key={it} onClick={() => setOpen(false)}>
              {it}
              {i === active && <Check size={ICON.sm} color={A.accent} />}
            </MenuRow>
          ))}
          <div style={{ height: 1, background: N.border, margin: `${S.xs}px 0` }} />
          <MenuRow onClick={() => {}}>
            <Plus size={ICON.sm} color={N.txtSec} />
            New Iteration
          </MenuRow>
        </MenuPanel>
      )}
    </div>
  )
}

function AnnotationBadge({ count, hasNew }: { count: number; hasNew?: boolean }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
        padding: `${S.xs}px ${S.sm}px`,
        background: hover ? 'rgba(0,0,0,0.04)' : 'transparent',
        border: 'none',
        borderRadius: R.ui,
        fontSize: T.ui,
        fontFamily: FONT,
        color: N.txtSec,
        cursor: 'default',
      }}
    >
      <MessageSquare size={ICON.md} strokeWidth={1.5} />
      {count}
      {hasNew && (
        <div style={{
          position: 'absolute',
          top: 4,
          right: 4,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: A.accent,
        }} />
      )}
    </button>
  )
}

function SidebarItem({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block',
        width: '100%',
        padding: `${S.sm}px ${S.md}px`,
        background: active ? 'rgba(0,0,0,0.06)' : hover ? 'rgba(0,0,0,0.03)' : 'transparent',
        border: 'none',
        borderRadius: R.ui,
        fontSize: T.ui,
        fontWeight: active ? 600 : 400,
        fontFamily: FONT,
        color: active ? N.txtPri : N.txtSec,
        textAlign: 'left',
        cursor: 'default',
      }}
    >
      {label}
    </button>
  )
}

function Sidebar({ pages, active }: { pages: string[]; active: number }) {
  return (
    <div style={{
      width: 160,
      padding: S.sm,
      background: N.chrome,
      borderRadius: R.ui,
      border: `1px solid ${N.border}`,
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: N.txtTer,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        padding: `${S.sm}px ${S.md}px`,
        marginBottom: S.xs,
      }}>
        Pages
      </div>
      {pages.map((p, i) => (
        <SidebarItem key={p} label={p} active={i === active} />
      ))}
    </div>
  )
}

function NavigationSection() {
  return (
    <div style={SECTION}>
      <div style={SECTION_LABEL}>Navigation</div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Project Picker</div>
          <ProjectPicker projects={['canvai-ui-system', 'landing-page', 'dashboard']} active={0} />
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Iteration Picker</div>
          <IterationPicker iterations={['V1', 'V2', 'V3']} active={2} />
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Annotation Badge</div>
          <div style={{ display: 'flex', gap: S.md }}>
            <div style={{ textAlign: 'center' }}>
              <AnnotationBadge count={0} />
              <div style={STATE_LABEL}>Empty</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnnotationBadge count={3} />
              <div style={STATE_LABEL}>With count</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnnotationBadge count={3} hasNew />
              <div style={STATE_LABEL}>New</div>
            </div>
          </div>
        </div>
      </div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Sidebar</div>
          <Sidebar pages={['Tokens', 'Components', 'Shell', 'Context']} active={1} />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. CANVAS CONTROLS — Zoom, Color Picker, Frame Chrome
   ───────────────────────────────────────────────────────────────────────────── */

function FrameChrome({ title, width = 280 }: { title: string; width?: number }) {
  return (
    <div style={{
      width,
      background: N.card,
      borderRadius: R.card,
      border: `1px solid ${N.border}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: `${S.sm}px ${S.md}px`,
        borderBottom: `1px solid ${N.border}`,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: FONT,
        color: N.txtSec,
        background: N.chrome,
      }}>
        {title}
      </div>
      <div style={{
        padding: S.lg,
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: N.txtTer,
        fontSize: T.ui,
        fontFamily: FONT,
      }}>
        Frame content
      </div>
    </div>
  )
}

function CanvasSection() {
  const [canvasColor, setCanvasColor] = useState(DEFAULT_CANVAS_COLOR)

  return (
    <div style={SECTION}>
      <div style={SECTION_LABEL}>Canvas Controls</div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Zoom Control</div>
          <div style={{ background: N.chrome, padding: S.md, borderRadius: R.ui, display: 'inline-block' }}>
            <ZoomControl />
          </div>
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Canvas Color Picker</div>
          <div style={{
            background: canvasColor,
            padding: S.lg,
            borderRadius: R.ui,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
            <CanvasColorPicker activeColor={canvasColor} onSelect={setCanvasColor} />
          </div>
        </div>
      </div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Frame Chrome</div>
          <div style={{ display: 'flex', gap: S.lg }}>
            <FrameChrome title="Button / Primary / Default" />
            <FrameChrome title="Card / With Image" width={320} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. ANNOTATION SYSTEM — FAB, Mode Toggle, Comment Card, Marker
   ───────────────────────────────────────────────────────────────────────────── */

function AnnotationFAB({ state = 'idle' }: { state?: 'idle' | 'hover' | 'active' }) {
  const bgMap = {
    idle: N.txtPri,
    hover: N.txtSec,
    active: A.accent,
  }

  return (
    <button style={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: 'none',
      background: bgMap[state],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'default',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <SquareMousePointer size={18} strokeWidth={1.5} color="#fff" />
    </button>
  )
}

function ModeToggle({ value }: { value: 'refine' | 'ideate' }) {
  const options = ['refine', 'ideate'] as const

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {options.map(m => {
        const active = value === m
        return (
          <button
            key={m}
            style={{
              border: 'none',
              cursor: 'default',
              padding: '2px 6px',
              borderRadius: 4,
              background: active ? 'oklch(0.92 0.005 250)' : 'transparent',
              fontSize: 11,
              fontWeight: active ? 500 : 400,
              fontFamily: FONT,
              color: active ? N.txtPri : N.txtTer,
            }}
          >
            {m === 'refine' ? 'Refine' : 'Ideate'}
          </button>
        )
      })}
    </div>
  )
}

function CommentCard({ header, comment, showMode }: { header: string; comment: string; showMode?: boolean }) {
  const [value, setValue] = useState(comment)

  return (
    <DialogCard style={{ width: 320 }}>
      <div style={{
        fontSize: 11,
        color: N.txtTer,
        marginBottom: S.sm,
        fontFamily: FONT,
      }}>
        {header}
      </div>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Describe the change..."
        style={{
          width: '100%',
          minHeight: 72,
          padding: S.md,
          background: N.chrome,
          border: `1px solid ${N.border}`,
          borderRadius: R.ui,
          fontSize: T.ui,
          fontFamily: FONT,
          color: N.txtPri,
          resize: 'vertical',
          outline: 'none',
          lineHeight: 1.5,
        }}
      />
      <DialogActions style={{ marginTop: S.md }}>
        {showMode && <ModeToggle value="refine" />}
        <div style={{ flex: 1 }} />
        <ActionButton variant="ghost">Cancel</ActionButton>
        <ActionButton variant="primary" disabled={!value.trim()}>Save</ActionButton>
      </DialogActions>
    </DialogCard>
  )
}

function Marker({ number, hasComment }: { number: number; hasComment?: boolean }) {
  return (
    <div style={{
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: hasComment ? A.accent : N.txtPri,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: FONT,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    }}>
      {number}
    </div>
  )
}

function AnnotationSection() {
  return (
    <div style={SECTION}>
      <div style={SECTION_LABEL}>Annotation System</div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Annotation FAB</div>
          <div style={{ display: 'flex', gap: S.lg }}>
            <div style={{ textAlign: 'center' }}>
              <AnnotationFAB state="idle" />
              <div style={STATE_LABEL}>Idle</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnnotationFAB state="hover" />
              <div style={STATE_LABEL}>Hover</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <AnnotationFAB state="active" />
              <div style={STATE_LABEL}>Active</div>
            </div>
          </div>
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Markers</div>
          <div style={{ display: 'flex', gap: S.md }}>
            <div style={{ textAlign: 'center' }}>
              <Marker number={1} />
              <div style={STATE_LABEL}>Draft</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Marker number={2} hasComment />
              <div style={STATE_LABEL}>With comment</div>
            </div>
          </div>
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Mode Toggle</div>
          <div style={{ display: 'flex', gap: S.lg }}>
            <div style={{ textAlign: 'center' }}>
              <ModeToggle value="refine" />
              <div style={STATE_LABEL}>Refine mode</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ModeToggle value="ideate" />
              <div style={STATE_LABEL}>Ideate mode</div>
            </div>
          </div>
        </div>
      </div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Comment Card</div>
          <div style={{ display: 'flex', gap: S.lg }}>
            <CommentCard header="Button · Primary" comment="" />
            <CommentCard header="Card · Header" comment="Make the title larger and bolder" showMode />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. DIALOGS & MENUS — Dialog, Menu Panel, Action Buttons
   ───────────────────────────────────────────────────────────────────────────── */

function InfoMenu() {
  return (
    <MenuPanel style={{ width: 160 }}>
      <div style={{
        padding: `${S.xs}px ${S.sm}px`,
        fontSize: T.ui,
        color: N.txtSec,
        fontFamily: FONT,
      }}>
        v0.0.38
      </div>
      <MenuRow onClick={() => {}}>
        Relaunch tour
      </MenuRow>
      <MenuRow onClick={() => {}}>
        <span style={{ flex: 1 }}>GitHub</span>
        <ExternalLink size={ICON.sm} strokeWidth={1.5} color={N.txtSec} />
      </MenuRow>
    </MenuPanel>
  )
}

function NewIterationDialog() {
  return (
    <DialogCard style={{ width: 360 }}>
      <div style={{
        fontSize: T.ui,
        fontWeight: 600,
        color: N.txtPri,
        marginBottom: S.md,
        fontFamily: FONT,
      }}>
        New Iteration
      </div>
      <div style={{
        fontSize: T.ui,
        color: N.txtSec,
        marginBottom: S.lg,
        fontFamily: FONT,
        lineHeight: 1.5,
      }}>
        Create V4 as a copy of V3. Describe what direction to explore.
      </div>
      <textarea
        placeholder="What should change in this iteration?"
        style={{
          width: '100%',
          minHeight: 80,
          padding: S.md,
          background: N.chrome,
          border: `1px solid ${N.border}`,
          borderRadius: R.ui,
          fontSize: T.ui,
          fontFamily: FONT,
          color: N.txtPri,
          resize: 'vertical',
          outline: 'none',
        }}
      />
      <DialogActions style={{ marginTop: S.lg }}>
        <ActionButton variant="ghost">Cancel</ActionButton>
        <ActionButton variant="primary">Create V4</ActionButton>
      </DialogActions>
    </DialogCard>
  )
}

function DialogsSection() {
  return (
    <div style={SECTION}>
      <div style={SECTION_LABEL}>Dialogs & Menus</div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Action Buttons</div>
          <div style={{ display: 'flex', gap: S.md, alignItems: 'center' }}>
            <ActionButton variant="primary">Primary</ActionButton>
            <ActionButton variant="secondary">Secondary</ActionButton>
            <ActionButton variant="ghost">Ghost</ActionButton>
            <ActionButton variant="primary" disabled>Disabled</ActionButton>
          </div>
        </div>
      </div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Menu Panel</div>
          <InfoMenu />
        </div>

        <div>
          <div style={COMPONENT_LABEL}>New Iteration Dialog</div>
          <NewIterationDialog />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. TOKEN SYSTEM — Swatches with live OKLCH editing
   ───────────────────────────────────────────────────────────────────────────── */

function TokenSystemSection() {
  return (
    <div style={SECTION}>
      <div style={SECTION_LABEL}>Token System (Live OKLCH)</div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Color Tokens</div>
          <div style={{ display: 'flex', gap: S.md, flexWrap: 'wrap' }}>
            <TokenSwatch
              color={N.txtPri}
              label="txtPri"
              sublabel="oklch(0.205 0.006 250)"
              oklch={{ l: 0.205, c: 0.006, h: 250 }}
              tokenPath="--txt-pri"
            />
            <TokenSwatch
              color={N.txtSec}
              label="txtSec"
              sublabel="oklch(0.556 0.005 250)"
              oklch={{ l: 0.556, c: 0.005, h: 250 }}
              tokenPath="--txt-sec"
            />
            <TokenSwatch
              color={N.card}
              label="card"
              sublabel="oklch(0.995 0.001 80)"
              oklch={{ l: 0.995, c: 0.001, h: 80 }}
              tokenPath="--card"
            />
            <TokenSwatch
              color={N.chrome}
              label="chrome"
              sublabel="oklch(0.968 0.002 80)"
              oklch={{ l: 0.968, c: 0.002, h: 80 }}
              tokenPath="--chrome"
            />
            <TokenSwatch
              color={N.border}
              label="border"
              sublabel="oklch(0.918 0.003 80)"
              oklch={{ l: 0.918, c: 0.003, h: 80 }}
              tokenPath="--border"
            />
            <TokenSwatch
              color={A.accent}
              label="accent"
              sublabel="oklch(0.541 0.184 265)"
              oklch={{ l: 0.541, c: 0.184, h: 265 }}
              tokenPath="--accent"
            />
          </div>
        </div>
      </div>

      <div style={COMPONENT_ROW}>
        <div>
          <div style={COMPONENT_LABEL}>Spacing Scale (4px grid)</div>
          <div style={{ display: 'flex', gap: S.lg, alignItems: 'flex-end' }}>
            {[
              { name: 'xs', value: S.xs },
              { name: 'sm', value: S.sm },
              { name: 'md', value: S.md },
              { name: 'lg', value: S.lg },
              { name: 'xl', value: S.xl },
              { name: 'xxl', value: S.xxl },
            ].map(s => (
              <div key={s.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: s.value,
                  height: s.value,
                  background: A.accent,
                  borderRadius: 2,
                  marginBottom: S.xs,
                }} />
                <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT }}>{s.name}</div>
                <div style={{ fontSize: 9, color: N.txtTer, fontFamily: FONT }}>{s.value}px</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Border Radius</div>
          <div style={{ display: 'flex', gap: S.lg }}>
            {[
              { name: 'ui', value: R.ui },
              { name: 'card', value: R.card },
              { name: 'pill', value: R.pill },
            ].map(r => (
              <div key={r.name} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  background: N.chrome,
                  border: `1px solid ${N.border}`,
                  borderRadius: r.value,
                  marginBottom: S.xs,
                }} />
                <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT }}>{r.name}</div>
                <div style={{ fontSize: 9, color: N.txtTer, fontFamily: FONT }}>{r.value}px</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={COMPONENT_LABEL}>Icon Sizes (Lucide)</div>
          <div style={{ display: 'flex', gap: S.lg, alignItems: 'center' }}>
            {[
              { name: 'sm', value: ICON.sm },
              { name: 'md', value: ICON.md },
              { name: 'lg', value: ICON.lg },
            ].map(i => (
              <div key={i.name} style={{ textAlign: 'center' }}>
                <Check size={i.value} strokeWidth={1.5} color={N.txtSec} />
                <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT, marginTop: S.xs }}>{i.name}</div>
                <div style={{ fontSize: 9, color: N.txtTer, fontFamily: FONT }}>{i.value}px</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   6. TYPOGRAPHY
   ───────────────────────────────────────────────────────────────────────────── */

function TypographySection() {
  return (
    <div style={SECTION}>
      <div style={SECTION_LABEL}>Typography</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.md }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.lg }}>
          <div style={{ width: 80, fontSize: 10, color: N.txtTer, fontFamily: FONT }}>title</div>
          <div style={{ fontSize: T.ui, fontWeight: 600, color: N.txtPri, fontFamily: FONT }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.lg }}>
          <div style={{ width: 80, fontSize: 10, color: N.txtTer, fontFamily: FONT }}>body</div>
          <div style={{ fontSize: T.ui, color: N.txtPri, fontFamily: FONT }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.lg }}>
          <div style={{ width: 80, fontSize: 10, color: N.txtTer, fontFamily: FONT }}>secondary</div>
          <div style={{ fontSize: T.ui, color: N.txtSec, fontFamily: FONT }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.lg }}>
          <div style={{ width: 80, fontSize: 10, color: N.txtTer, fontFamily: FONT }}>caption</div>
          <div style={{ fontSize: 11, color: N.txtTer, fontFamily: FONT }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.lg }}>
          <div style={{ width: 80, fontSize: 10, color: N.txtTer, fontFamily: FONT }}>label</div>
          <div style={{
            fontSize: 10,
            fontWeight: 600,
            color: N.txtTer,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: FONT,
          }}>
            Section Label
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

export function DesignSystem() {
  return (
    <div style={{
      padding: S.xxl,
      background: N.card,
      fontFamily: FONT,
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: A.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: S.sm,
          fontFamily: FONT,
        }}>
          Canvai Design System
        </div>
        <div style={{
          fontSize: 24,
          fontWeight: 600,
          color: N.txtPri,
          marginBottom: S.md,
          fontFamily: FONT,
        }}>
          Runtime Components
        </div>
        <div style={{
          fontSize: T.ui,
          color: N.txtSec,
          fontFamily: FONT,
          lineHeight: 1.6,
          maxWidth: 560,
        }}>
          Braun / Jony Ive aesthetic. OKLCH colors, 4px grid, spring physics.
          Achromatic shell (c ≤ 0.003), one accent hue. Everything interactive.
        </div>
      </div>

      <NavigationSection />
      <CanvasSection />
      <AnnotationSection />
      <DialogsSection />
      <TokenSystemSection />
      <TypographySection />
    </div>
  )
}
