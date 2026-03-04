import { useState } from 'react'
import { N, A, D, S, R, T, ICON, FONT } from '../../../../runtime/tokens'
import { ActionButton, MenuPanel, MenuRow, DialogCard, DialogActions } from '../../../../runtime/Menu'
import { ZoomControl } from '../../../../runtime/ZoomControl'
import { TokenSwatch } from '../../../../runtime/TokenSwatch'
import { Check, ChevronDown, Plus, MessageSquare, SquareMousePointer, X, Minus } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════════════
   DESIGN SYSTEM — MATRIX STYLE (DARK)

   Dark background, components shown in a strict grid matrix.
   Columns = states, Rows = variants. Like Figma's component playground.
   ═══════════════════════════════════════════════════════════════════════════ */

const DARK = {
  bg: 'oklch(0.16 0.01 260)',
  card: 'oklch(0.22 0.01 260)',
  border: 'oklch(0.30 0.01 260)',
  txtPri: 'oklch(0.95 0.005 80)',
  txtSec: 'oklch(0.70 0.005 80)',
  txtTer: 'oklch(0.50 0.005 80)',
}

const GRID_CELL = {
  padding: S.lg,
  background: DARK.card,
  borderRadius: R.card,
  border: `1px solid ${DARK.border}`,
}

const HEADER_CELL = {
  padding: `${S.sm}px ${S.lg}px`,
  fontSize: 10,
  fontWeight: 600,
  color: DARK.txtTer,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  fontFamily: FONT,
}

const ROW_LABEL = {
  padding: `${S.lg}px ${S.md}px`,
  fontSize: 11,
  fontWeight: 500,
  color: DARK.txtSec,
  fontFamily: FONT,
  textAlign: 'right' as const,
  minWidth: 100,
}

/* ─── Button Matrix ─── */

function ButtonMatrix() {
  const variants = ['primary', 'secondary', 'ghost'] as const
  const states = ['default', 'hover', 'disabled'] as const

  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Button
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(3, 1fr)', gap: S.sm }}>
        {/* Header row */}
        <div />
        {states.map(s => (
          <div key={s} style={HEADER_CELL}>{s}</div>
        ))}

        {/* Variant rows */}
        {variants.map(variant => (
          <>
            <div key={`${variant}-label`} style={ROW_LABEL}>{variant}</div>
            {states.map(state => (
              <div key={`${variant}-${state}`} style={GRID_CELL}>
                <ActionButton
                  variant={variant}
                  disabled={state === 'disabled'}
                >
                  Button
                </ActionButton>
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}

/* ─── FAB Matrix ─── */

function FABMatrix() {
  const states = ['idle', 'hover', 'active'] as const

  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Annotation FAB
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(3, 1fr)', gap: S.sm }}>
        <div />
        {states.map(s => (
          <div key={s} style={HEADER_CELL}>{s}</div>
        ))}

        <div style={ROW_LABEL}>default</div>
        {states.map((state, i) => (
          <div key={state} style={{ ...GRID_CELL, display: 'flex', justifyContent: 'center' }}>
            <button style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: i === 2 ? A.accent : i === 1 ? DARK.txtSec : DARK.txtPri,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              <SquareMousePointer size={18} strokeWidth={1.5} color={DARK.bg} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Marker Matrix ─── */

function MarkerMatrix() {
  const types = ['draft', 'with comment', 'processing'] as const

  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Annotation Marker
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(3, 1fr)', gap: S.sm }}>
        <div />
        {types.map(t => (
          <div key={t} style={HEADER_CELL}>{t}</div>
        ))}

        <div style={ROW_LABEL}>numbered</div>
        {types.map((type, i) => (
          <div key={type} style={{ ...GRID_CELL, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: i === 1 ? A.accent : i === 2 ? 'transparent' : DARK.txtPri,
              border: i === 2 ? `2px solid ${A.accent}` : 'none',
              color: i === 2 ? A.accent : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: FONT,
              boxShadow: i !== 2 ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
            }}>
              {i === 2 ? '...' : i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Input Matrix ─── */

function InputMatrix() {
  const states = ['default', 'focused', 'filled', 'error'] as const

  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Text Input
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(4, 1fr)', gap: S.sm }}>
        <div />
        {states.map(s => (
          <div key={s} style={HEADER_CELL}>{s}</div>
        ))}

        <div style={ROW_LABEL}>single line</div>
        {states.map((state, i) => (
          <div key={state} style={GRID_CELL}>
            <input
              type="text"
              placeholder={i < 2 ? 'Placeholder...' : undefined}
              defaultValue={i >= 2 ? 'Input value' : undefined}
              style={{
                width: '100%',
                padding: `${S.sm}px ${S.md}px`,
                background: DARK.bg,
                border: `1px solid ${i === 1 ? A.accent : i === 3 ? 'oklch(0.6 0.2 25)' : DARK.border}`,
                borderRadius: R.ui,
                fontSize: 13,
                fontFamily: FONT,
                color: DARK.txtPri,
                outline: 'none',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Mode Toggle Matrix ─── */

function ModeToggleMatrix() {
  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Mode Toggle
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(2, 1fr)', gap: S.sm }}>
        <div />
        <div style={HEADER_CELL}>refine selected</div>
        <div style={HEADER_CELL}>ideate selected</div>

        <div style={ROW_LABEL}>compact</div>
        <div style={GRID_CELL}>
          <div style={{ display: 'flex', gap: 2 }}>
            <button style={{
              padding: '2px 6px',
              background: 'oklch(0.30 0.005 250)',
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: FONT,
              color: DARK.txtPri,
              cursor: 'default',
            }}>Refine</button>
            <button style={{
              padding: '2px 6px',
              background: 'transparent',
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: FONT,
              color: DARK.txtTer,
              cursor: 'default',
            }}>Ideate</button>
          </div>
        </div>
        <div style={GRID_CELL}>
          <div style={{ display: 'flex', gap: 2 }}>
            <button style={{
              padding: '2px 6px',
              background: 'transparent',
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: FONT,
              color: DARK.txtTer,
              cursor: 'default',
            }}>Refine</button>
            <button style={{
              padding: '2px 6px',
              background: 'oklch(0.30 0.005 250)',
              border: 'none',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: FONT,
              color: DARK.txtPri,
              cursor: 'default',
            }}>Ideate</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Zoom Control Matrix ─── */

function ZoomMatrix() {
  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Zoom Control
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: S.sm }}>
        <div style={ROW_LABEL}>horizontal</div>
        <div style={{ ...GRID_CELL, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: N.chrome, padding: S.sm, borderRadius: R.ui }}>
            <ZoomControl />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Color Token Matrix ─── */

function ColorMatrix() {
  const tokens = [
    { name: 'txtPri', light: N.txtPri, dark: DARK.txtPri },
    { name: 'txtSec', light: N.txtSec, dark: DARK.txtSec },
    { name: 'card', light: N.card, dark: DARK.card },
    { name: 'chrome', light: N.chrome, dark: DARK.bg },
    { name: 'border', light: N.border, dark: DARK.border },
    { name: 'accent', light: A.accent, dark: A.accent },
  ]

  return (
    <div>
      <div style={{
        fontSize: 13,
        fontWeight: 600,
        color: DARK.txtPri,
        marginBottom: S.lg,
        fontFamily: FONT,
      }}>
        Color Tokens
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '100px repeat(2, 1fr)', gap: S.sm }}>
        <div />
        <div style={HEADER_CELL}>light mode</div>
        <div style={HEADER_CELL}>dark mode</div>

        {tokens.map(t => (
          <>
            <div key={`${t.name}-label`} style={ROW_LABEL}>{t.name}</div>
            <div key={`${t.name}-light`} style={GRID_CELL}>
              <div style={{
                width: '100%',
                height: 40,
                background: t.light,
                borderRadius: R.ui,
                border: `1px solid ${DARK.border}`,
              }} />
            </div>
            <div key={`${t.name}-dark`} style={GRID_CELL}>
              <div style={{
                width: '100%',
                height: 40,
                background: t.dark,
                borderRadius: R.ui,
                border: `1px solid ${DARK.border}`,
              }} />
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Export ─── */

export function DSMatrix() {
  return (
    <div style={{
      padding: S.xxl,
      background: DARK.bg,
      fontFamily: FONT,
      minHeight: '100%',
    }}>
      {/* Header */}
      <div style={{ marginBottom: S.xxl * 2 }}>
        <div style={{
          display: 'inline-block',
          padding: `${S.xs}px ${S.sm}px`,
          background: A.accent,
          borderRadius: R.ui,
          fontSize: 10,
          fontWeight: 600,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: S.md,
        }}>
          Canvai DS
        </div>
        <div style={{
          fontSize: 28,
          fontWeight: 600,
          color: DARK.txtPri,
          marginBottom: S.sm,
        }}>
          Component Matrix
        </div>
        <div style={{
          fontSize: 13,
          color: DARK.txtSec,
          lineHeight: 1.6,
        }}>
          Rows = variants · Columns = states
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: S.xxl * 2 }}>
        <ButtonMatrix />
        <FABMatrix />
        <MarkerMatrix />
        <ModeToggleMatrix />
        <InputMatrix />
        <ZoomMatrix />
        <ColorMatrix />
      </div>
    </div>
  )
}
