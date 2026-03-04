import { useState } from 'react'
import { N, A, S, R, T, ICON, FONT } from '../../../../runtime/tokens'
import { ActionButton, MenuPanel, MenuRow, DialogCard, DialogActions } from '../../../../runtime/Menu'
import { ZoomControl } from '../../../../runtime/ZoomControl'
import { CanvasColorPicker, DEFAULT_CANVAS_COLOR } from '../../../../runtime/CanvasColorPicker'
import { TokenSwatch } from '../../../../runtime/TokenSwatch'
import { Check, ChevronDown, Plus, MessageSquare, SquareMousePointer, ExternalLink } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — SPECIMEN STYLE

   Editorial, typographic-first layout inspired by type specimens.
   Large headlines, generous whitespace, components as artifacts.
   ═══════════════════════════════════════════════════════════════════════════ */

function Divider() {
  return <div style={{ height: 1, background: N.border, margin: `${S.xxl * 2}px 0` }} />
}

function SectionNumber({ n }: { n: string }) {
  return (
    <div style={{
      fontSize: 120,
      fontWeight: 300,
      color: N.border,
      fontFamily: FONT,
      lineHeight: 1,
      marginBottom: S.lg,
    }}>
      {n}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 32,
      fontWeight: 600,
      color: N.txtPri,
      fontFamily: FONT,
      marginBottom: S.md,
      letterSpacing: '-0.02em',
    }}>
      {children}
    </div>
  )
}

function SectionDescription({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 15,
      color: N.txtSec,
      fontFamily: FONT,
      lineHeight: 1.7,
      maxWidth: 480,
      marginBottom: S.xxl * 2,
    }}>
      {children}
    </div>
  )
}

function ComponentName({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 500,
      color: N.txtTer,
      fontFamily: FONT,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: S.lg,
    }}>
      {children}
    </div>
  )
}

/* ─── Navigation Components ─── */

function ProjectPickerSpecimen() {
  return (
    <div style={{ display: 'flex', gap: S.xxl }}>
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
        padding: `${S.sm}px ${S.md}px`,
        background: 'transparent',
        border: 'none',
        fontSize: 15,
        fontWeight: 600,
        fontFamily: FONT,
        color: N.txtPri,
        cursor: 'default',
      }}>
        canvai-ui-system
        <ChevronDown size={14} color={N.txtSec} />
      </button>
      <button style={{
        display: 'flex',
        alignItems: 'center',
        gap: S.xs,
        padding: `${S.sm}px ${S.md}px`,
        background: N.chrome,
        border: `1px solid ${N.border}`,
        borderRadius: R.ui,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: FONT,
        color: N.txtPri,
        cursor: 'default',
      }}>
        V11
        <ChevronDown size={12} color={N.txtSec} />
      </button>
    </div>
  )
}

function SidebarSpecimen() {
  const pages = ['Design System', 'Tokens', 'Components', 'Shell']
  return (
    <div style={{
      width: 200,
      padding: S.lg,
      background: N.chrome,
      borderRadius: R.card,
    }}>
      {pages.map((p, i) => (
        <div
          key={p}
          style={{
            padding: `${S.sm}px ${S.md}px`,
            background: i === 0 ? 'rgba(0,0,0,0.05)' : 'transparent',
            borderRadius: R.ui,
            fontSize: 13,
            fontWeight: i === 0 ? 600 : 400,
            fontFamily: FONT,
            color: i === 0 ? N.txtPri : N.txtSec,
            marginBottom: 2,
          }}
        >
          {p}
        </div>
      ))}
    </div>
  )
}

/* ─── Annotation Components ─── */

function FABSpecimen() {
  return (
    <div style={{ display: 'flex', gap: S.xxl, alignItems: 'center' }}>
      {['idle', 'hover', 'active'].map((state, i) => (
        <div key={state} style={{ textAlign: 'center' }}>
          <button style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            border: 'none',
            background: i === 2 ? A.accent : i === 1 ? N.txtSec : N.txtPri,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'default',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <SquareMousePointer size={20} strokeWidth={1.5} color="#fff" />
          </button>
          <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT, marginTop: S.md }}>{state}</div>
        </div>
      ))}
    </div>
  )
}

function CommentCardSpecimen() {
  return (
    <DialogCard style={{ width: 340 }}>
      <div style={{ fontSize: 11, color: N.txtTer, marginBottom: S.sm, fontFamily: FONT }}>
        Button · Primary
      </div>
      <textarea
        defaultValue="Increase the font weight to 600 for better hierarchy"
        style={{
          width: '100%',
          minHeight: 80,
          padding: S.md,
          background: N.chrome,
          border: `1px solid ${N.border}`,
          borderRadius: R.ui,
          fontSize: 13,
          fontFamily: FONT,
          color: N.txtPri,
          resize: 'none',
          outline: 'none',
          lineHeight: 1.6,
        }}
      />
      <DialogActions style={{ marginTop: S.md }}>
        <div style={{ display: 'flex', gap: 2 }}>
          <button style={{
            padding: '2px 8px',
            background: 'oklch(0.92 0.005 250)',
            border: 'none',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 500,
            fontFamily: FONT,
            color: N.txtPri,
            cursor: 'default',
          }}>Refine</button>
          <button style={{
            padding: '2px 8px',
            background: 'transparent',
            border: 'none',
            borderRadius: 4,
            fontSize: 11,
            fontFamily: FONT,
            color: N.txtTer,
            cursor: 'default',
          }}>Ideate</button>
        </div>
        <div style={{ flex: 1 }} />
        <ActionButton variant="ghost">Cancel</ActionButton>
        <ActionButton variant="primary">Save</ActionButton>
      </DialogActions>
    </DialogCard>
  )
}

/* ─── Token Display ─── */

function ColorGrid() {
  const colors = [
    { name: 'txtPri', value: N.txtPri, oklch: '0.205 0.006 250' },
    { name: 'txtSec', value: N.txtSec, oklch: '0.556 0.005 250' },
    { name: 'txtTer', value: N.txtTer, oklch: '0.708 0.003 250' },
    { name: 'card', value: N.card, oklch: '0.995 0.001 80' },
    { name: 'chrome', value: N.chrome, oklch: '0.968 0.002 80' },
    { name: 'border', value: N.border, oklch: '0.918 0.003 80' },
    { name: 'accent', value: A.accent, oklch: '0.541 0.184 265' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: S.lg }}>
      {colors.map(c => (
        <div key={c.name}>
          <div style={{
            width: '100%',
            aspectRatio: '1',
            background: c.value,
            borderRadius: R.card,
            border: `1px solid ${N.border}`,
            marginBottom: S.sm,
          }} />
          <div style={{ fontSize: 12, fontWeight: 500, color: N.txtPri, fontFamily: FONT }}>{c.name}</div>
          <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT, fontFeatureSettings: '"tnum"' }}>{c.oklch}</div>
        </div>
      ))}
    </div>
  )
}

function SpacingScale() {
  const spaces = [
    { name: 'xs', value: S.xs },
    { name: 'sm', value: S.sm },
    { name: 'md', value: S.md },
    { name: 'lg', value: S.lg },
    { name: 'xl', value: S.xl },
    { name: 'xxl', value: S.xxl },
  ]

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: S.lg }}>
      {spaces.map(s => (
        <div key={s.name} style={{ textAlign: 'center' }}>
          <div style={{
            width: 32,
            height: s.value,
            background: A.accent,
            borderRadius: 2,
            marginBottom: S.sm,
          }} />
          <div style={{ fontSize: 11, fontWeight: 500, color: N.txtPri, fontFamily: FONT }}>{s.name}</div>
          <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Export ─── */

export function DSSpecimen() {
  return (
    <div style={{
      padding: `${S.xxl * 2}px`,
      background: N.card,
      fontFamily: FONT,
    }}>
      {/* Hero */}
      <div style={{ marginBottom: S.xxl * 3 }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: A.accent,
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: S.lg,
        }}>
          Canvai
        </div>
        <div style={{
          fontSize: 56,
          fontWeight: 600,
          color: N.txtPri,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: S.lg,
        }}>
          Design<br />System
        </div>
        <div style={{
          fontSize: 15,
          color: N.txtSec,
          lineHeight: 1.7,
          maxWidth: 400,
        }}>
          Braun / Jony Ive aesthetic. OKLCH colors, 4px spacing grid,
          spring physics. Achromatic shell, one accent.
        </div>
      </div>

      <Divider />

      {/* 01 Navigation */}
      <SectionNumber n="01" />
      <SectionTitle>Navigation</SectionTitle>
      <SectionDescription>
        Project and iteration pickers in the top bar. Sidebar for page navigation.
        Annotation badge shows draft count with optional new indicator.
      </SectionDescription>

      <ComponentName>Pickers</ComponentName>
      <div style={{ marginBottom: S.xxl * 2 }}>
        <ProjectPickerSpecimen />
      </div>

      <ComponentName>Sidebar</ComponentName>
      <div style={{ marginBottom: S.xxl * 2 }}>
        <SidebarSpecimen />
      </div>

      <Divider />

      {/* 02 Annotation */}
      <SectionNumber n="02" />
      <SectionTitle>Annotation</SectionTitle>
      <SectionDescription>
        Point at any element, describe the change. FAB enters targeting mode.
        Mode toggle: Refine edits one thing, Ideate generates 3+ directions.
      </SectionDescription>

      <ComponentName>Floating Action Button</ComponentName>
      <div style={{ marginBottom: S.xxl * 2 }}>
        <FABSpecimen />
      </div>

      <ComponentName>Comment Card</ComponentName>
      <div style={{ marginBottom: S.xxl * 2 }}>
        <CommentCardSpecimen />
      </div>

      <Divider />

      {/* 03 Tokens */}
      <SectionNumber n="03" />
      <SectionTitle>Color</SectionTitle>
      <SectionDescription>
        All colors in OKLCH. Achromatic shell with chroma ≤ 0.003.
        One accent hue for interactive elements.
      </SectionDescription>

      <div style={{ marginBottom: S.xxl * 2 }}>
        <ColorGrid />
      </div>

      <Divider />

      {/* 04 Spacing */}
      <SectionNumber n="04" />
      <SectionTitle>Spacing</SectionTitle>
      <SectionDescription>
        4px base unit. All spacing derived from this grid.
        Font sizes are exempt from the grid.
      </SectionDescription>

      <div style={{ marginBottom: S.xxl * 2 }}>
        <SpacingScale />
      </div>

      <Divider />

      {/* 05 Actions */}
      <SectionNumber n="05" />
      <SectionTitle>Actions</SectionTitle>
      <SectionDescription>
        Primary for main actions, ghost for secondary. All buttons use
        cursor: default. No pointer cursors in the shell.
      </SectionDescription>

      <div style={{ display: 'flex', gap: S.lg }}>
        <ActionButton variant="primary">Primary</ActionButton>
        <ActionButton variant="secondary">Secondary</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
        <ActionButton variant="primary" disabled>Disabled</ActionButton>
      </div>
    </div>
  )
}
