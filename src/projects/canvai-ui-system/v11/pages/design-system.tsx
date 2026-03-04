import { useState } from 'react'
import { N, S, R, T, ICON, FONT, A } from '../tokens'
import { Check, ChevronDown, ChevronRight, X, AlertCircle, Info, CheckCircle, Loader2, Search, Plus, Minus, Eye, EyeOff } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   CANVAI DESIGN SYSTEM — Organized per Design Systems Checklist
   https://tylercoderre.com/projects/design-systems-checklist.html
   ───────────────────────────────────────────────────────────────────────────── */

const SECTION_STYLE = {
  marginBottom: S.xxl * 2,
}

const SECTION_TITLE_STYLE = {
  fontSize: 11,
  fontWeight: 600 as const,
  color: N.txtTer,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  marginBottom: S.lg,
  fontFamily: FONT,
}

const SUBSECTION_TITLE_STYLE = {
  fontSize: T.ui,
  fontWeight: 600 as const,
  color: N.txtPri,
  marginBottom: S.md,
  fontFamily: FONT,
}

const COMPONENT_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: S.lg,
}

const COMPONENT_CARD = {
  padding: S.lg,
  background: N.card,
  borderRadius: R.ui,
  border: `1px solid ${N.border}`,
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. FOUNDATIONS — Color, Typography, Spacing, Iconography, Elevation, Motion
   ═══════════════════════════════════════════════════════════════════════════ */

function FoundationsSection() {
  return (
    <div style={SECTION_STYLE}>
      <div style={SECTION_TITLE_STYLE}>Foundations</div>

      {/* Color */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Color</div>
        <div style={{ display: 'flex', gap: S.sm, flexWrap: 'wrap' }}>
          {[
            { name: 'Primary', value: N.txtPri },
            { name: 'Secondary', value: N.txtSec },
            { name: 'Tertiary', value: N.txtTer },
            { name: 'Card', value: N.card },
            { name: 'Chrome', value: N.chrome },
            { name: 'Border', value: N.border },
            { name: 'Accent', value: A.accent },
          ].map(c => (
            <div key={c.name} style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48, borderRadius: R.ui,
                background: c.value, border: `1px solid ${N.border}`,
                marginBottom: S.xs,
              }} />
              <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT }}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Typography</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: N.txtPri, fontFamily: FONT }}>Display — 24px / 600</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: N.txtPri, fontFamily: FONT }}>Heading — 18px / 600</div>
          <div style={{ fontSize: T.ui, fontWeight: 500, color: N.txtPri, fontFamily: FONT }}>Title — 13px / 500</div>
          <div style={{ fontSize: T.ui, color: N.txtSec, fontFamily: FONT }}>Body — 13px / 400</div>
          <div style={{ fontSize: 11, color: N.txtTer, fontFamily: FONT }}>Caption — 11px / 400</div>
        </div>
      </div>

      {/* Spacing */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Spacing (4px grid)</div>
        <div style={{ display: 'flex', gap: S.md, alignItems: 'flex-end' }}>
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
                width: s.value, height: s.value,
                background: A.accent, borderRadius: 2,
                marginBottom: S.xs,
              }} />
              <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT }}>{s.name}</div>
              <div style={{ fontSize: 9, color: N.txtTer, fontFamily: FONT }}>{s.value}px</div>
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Border Radius</div>
        <div style={{ display: 'flex', gap: S.lg }}>
          {[
            { name: 'sm', value: 4 },
            { name: 'ui', value: R.ui },
            { name: 'card', value: R.card },
            { name: 'pill', value: R.pill },
          ].map(r => (
            <div key={r.name} style={{ textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48,
                background: N.chrome, border: `1px solid ${N.border}`,
                borderRadius: r.value,
                marginBottom: S.xs,
              }} />
              <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT }}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Icons */}
      <div>
        <div style={SUBSECTION_TITLE_STYLE}>Iconography (Lucide)</div>
        <div style={{ display: 'flex', gap: S.lg, alignItems: 'center' }}>
          {[
            { name: 'sm', size: ICON.sm },
            { name: 'md', size: ICON.md },
            { name: 'lg', size: ICON.lg },
          ].map(i => (
            <div key={i.name} style={{ textAlign: 'center' }}>
              <Check size={i.size} strokeWidth={1.5} color={N.txtSec} />
              <div style={{ fontSize: 10, color: N.txtTer, fontFamily: FONT, marginTop: S.xs }}>{i.name} ({i.size}px)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. FORM ELEMENTS — Button, Input, Checkbox, Radio, Select, Switch, Textarea
   ═══════════════════════════════════════════════════════════════════════════ */

function Button({ variant = 'primary', size = 'md', children, disabled }: {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  children: React.ReactNode
  disabled?: boolean
}) {
  const [hover, setHover] = useState(false)

  const styles = {
    primary: {
      background: disabled ? N.border : hover ? A.accentHover : A.accent,
      color: disabled ? N.txtTer : '#fff',
      border: 'none',
    },
    secondary: {
      background: hover ? N.chrome : N.card,
      color: N.txtPri,
      border: `1px solid ${N.border}`,
    },
    ghost: {
      background: hover ? 'rgba(0,0,0,0.04)' : 'transparent',
      color: N.txtSec,
      border: 'none',
    },
  }

  const sizeStyles = {
    sm: { padding: `${S.xs}px ${S.sm}px`, fontSize: 11 },
    md: { padding: `${S.sm}px ${S.md}px`, fontSize: T.ui },
  }

  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}
      style={{
        ...styles[variant],
        ...sizeStyles[size],
        borderRadius: R.ui,
        fontWeight: 500,
        fontFamily: FONT,
        cursor: disabled ? 'not-allowed' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        gap: S.xs,
      }}
    >
      {children}
    </button>
  )
}

function Input({ placeholder, disabled, error }: { placeholder?: string; disabled?: boolean; error?: boolean }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type="text"
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        padding: `${S.sm}px ${S.md}px`,
        fontSize: T.ui,
        fontFamily: FONT,
        background: disabled ? N.chrome : N.card,
        color: disabled ? N.txtTer : N.txtPri,
        border: `1px solid ${error ? 'oklch(0.65 0.2 25)' : focused ? A.accent : N.border}`,
        borderRadius: R.ui,
        outline: 'none',
      }}
    />
  )
}

function Checkbox({ checked, label }: { checked?: boolean; label?: string }) {
  const [isChecked, setIsChecked] = useState(checked ?? false)
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: S.sm, cursor: 'default', fontFamily: FONT, fontSize: T.ui, color: N.txtPri }}>
      <div
        onClick={() => setIsChecked(!isChecked)}
        style={{
          width: 16, height: 16,
          borderRadius: 4,
          border: `1px solid ${isChecked ? A.accent : N.border}`,
          background: isChecked ? A.accent : N.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isChecked && <Check size={12} strokeWidth={2.5} color="#fff" />}
      </div>
      {label}
    </label>
  )
}

function Radio({ selected, label }: { selected?: boolean; label?: string }) {
  const [isSelected, setIsSelected] = useState(selected ?? false)
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: S.sm, cursor: 'default', fontFamily: FONT, fontSize: T.ui, color: N.txtPri }}>
      <div
        onClick={() => setIsSelected(!isSelected)}
        style={{
          width: 16, height: 16,
          borderRadius: '50%',
          border: `1px solid ${isSelected ? A.accent : N.border}`,
          background: N.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: A.accent }} />}
      </div>
      {label}
    </label>
  )
}

function Switch({ on, label }: { on?: boolean; label?: string }) {
  const [isOn, setIsOn] = useState(on ?? false)
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: S.sm, cursor: 'default', fontFamily: FONT, fontSize: T.ui, color: N.txtPri }}>
      <div
        onClick={() => setIsOn(!isOn)}
        style={{
          width: 36, height: 20,
          borderRadius: R.pill,
          background: isOn ? A.accent : N.border,
          padding: 2,
          transition: 'background 150ms',
        }}
      >
        <div style={{
          width: 16, height: 16,
          borderRadius: '50%',
          background: '#fff',
          transform: `translateX(${isOn ? 16 : 0}px)`,
          transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }} />
      </div>
      {label}
    </label>
  )
}

function FormElementsSection() {
  return (
    <div style={SECTION_STYLE}>
      <div style={SECTION_TITLE_STYLE}>Form Elements</div>

      {/* Buttons */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Button</div>
        <div style={{ display: 'flex', gap: S.md, flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" size="sm">Small</Button>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Text Input</div>
        <div style={{ display: 'flex', gap: S.md, maxWidth: 600 }}>
          <div style={{ flex: 1 }}>
            <Input placeholder="Default input" />
          </div>
          <div style={{ flex: 1 }}>
            <Input placeholder="Disabled" disabled />
          </div>
          <div style={{ flex: 1 }}>
            <Input placeholder="Error state" error />
          </div>
        </div>
      </div>

      {/* Checkboxes & Radios */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Selection Controls</div>
        <div style={{ display: 'flex', gap: S.xxl }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            <Checkbox label="Unchecked" />
            <Checkbox checked label="Checked" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            <Radio label="Unselected" />
            <Radio selected label="Selected" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
            <Switch label="Off" />
            <Switch on label="On" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. FEEDBACK — Alert, Badge, Toast, Progress, Loading
   ═══════════════════════════════════════════════════════════════════════════ */

function Alert({ variant, children }: { variant: 'info' | 'success' | 'warning' | 'error'; children: React.ReactNode }) {
  const config = {
    info: { icon: Info, bg: 'oklch(0.95 0.02 250)', border: 'oklch(0.7 0.1 250)', color: 'oklch(0.4 0.1 250)' },
    success: { icon: CheckCircle, bg: 'oklch(0.95 0.03 145)', border: 'oklch(0.7 0.15 145)', color: 'oklch(0.4 0.15 145)' },
    warning: { icon: AlertCircle, bg: 'oklch(0.95 0.05 80)', border: 'oklch(0.7 0.15 80)', color: 'oklch(0.45 0.12 80)' },
    error: { icon: AlertCircle, bg: 'oklch(0.95 0.03 25)', border: 'oklch(0.7 0.15 25)', color: 'oklch(0.45 0.15 25)' },
  }
  const { icon: Icon, bg, border, color } = config[variant]

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: S.sm,
      padding: S.md, background: bg, border: `1px solid ${border}`,
      borderRadius: R.ui, fontFamily: FONT, fontSize: T.ui, color,
    }}>
      <Icon size={ICON.md} strokeWidth={1.5} />
      <div>{children}</div>
    </div>
  )
}

function Badge({ variant, children }: { variant: 'default' | 'success' | 'warning' | 'error'; children: React.ReactNode }) {
  const colors = {
    default: { bg: N.chrome, color: N.txtSec },
    success: { bg: 'oklch(0.92 0.05 145)', color: 'oklch(0.4 0.15 145)' },
    warning: { bg: 'oklch(0.92 0.08 80)', color: 'oklch(0.45 0.12 80)' },
    error: { bg: 'oklch(0.92 0.05 25)', color: 'oklch(0.45 0.15 25)' },
  }
  const { bg, color } = colors[variant]

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: `2px ${S.sm}px`,
      background: bg, color,
      borderRadius: R.pill,
      fontSize: 11, fontWeight: 500, fontFamily: FONT,
    }}>
      {children}
    </span>
  )
}

function Progress({ value }: { value: number }) {
  return (
    <div style={{ width: '100%', height: 4, background: N.border, borderRadius: R.pill, overflow: 'hidden' }}>
      <div style={{
        width: `${value}%`, height: '100%',
        background: A.accent, borderRadius: R.pill,
        transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </div>
  )
}

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <Loader2
      size={size}
      strokeWidth={2}
      color={A.accent}
      style={{ animation: 'spin 1s linear infinite' }}
    />
  )
}

function FeedbackSection() {
  return (
    <div style={SECTION_STYLE}>
      <div style={SECTION_TITLE_STYLE}>Feedback</div>

      {/* Alerts */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Alert</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm, maxWidth: 400 }}>
          <Alert variant="info">This is an informational message.</Alert>
          <Alert variant="success">Operation completed successfully.</Alert>
          <Alert variant="warning">Please review before continuing.</Alert>
          <Alert variant="error">Something went wrong.</Alert>
        </div>
      </div>

      {/* Badges */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Badge</div>
        <div style={{ display: 'flex', gap: S.sm }}>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Progress</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: S.md, maxWidth: 300 }}>
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={75} />
          <Progress value={100} />
        </div>
      </div>

      {/* Loading */}
      <div>
        <div style={SUBSECTION_TITLE_STYLE}>Loading</div>
        <div style={{ display: 'flex', gap: S.lg, alignItems: 'center' }}>
          <Spinner size={16} />
          <Spinner size={24} />
          <Spinner size={32} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. DISPLAY — Card, Divider, Avatar, List
   ═══════════════════════════════════════════════════════════════════════════ */

function Card({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div style={{
      padding: S.lg, background: N.card,
      border: `1px solid ${N.border}`, borderRadius: R.card,
      fontFamily: FONT,
    }}>
      {title && <div style={{ fontSize: T.ui, fontWeight: 600, color: N.txtPri, marginBottom: S.sm }}>{title}</div>}
      <div style={{ fontSize: T.ui, color: N.txtSec }}>{children}</div>
    </div>
  )
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: A.accent, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 600, fontFamily: FONT,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: N.border, margin: `${S.md}px 0` }} />
}

function DisplaySection() {
  return (
    <div style={SECTION_STYLE}>
      <div style={SECTION_TITLE_STYLE}>Display</div>

      {/* Cards */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Card</div>
        <div style={{ display: 'flex', gap: S.md }}>
          <Card title="Card Title">Card content goes here with supporting text.</Card>
          <Card>Card without title, just content.</Card>
        </div>
      </div>

      {/* Avatar */}
      <div style={{ marginBottom: S.xxl }}>
        <div style={SUBSECTION_TITLE_STYLE}>Avatar</div>
        <div style={{ display: 'flex', gap: S.md, alignItems: 'center' }}>
          <Avatar name="Alice" size={24} />
          <Avatar name="Bob" size={32} />
          <Avatar name="Carol" size={40} />
        </div>
      </div>

      {/* Divider */}
      <div>
        <div style={SUBSECTION_TITLE_STYLE}>Divider</div>
        <div style={{ maxWidth: 300 }}>
          <div style={{ fontSize: T.ui, color: N.txtSec, fontFamily: FONT }}>Content above</div>
          <Divider />
          <div style={{ fontSize: T.ui, color: N.txtSec, fontFamily: FONT }}>Content below</div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. INTERACTIVE — Dropdown, Tabs, Accordion
   ═══════════════════════════════════════════════════════════════════════════ */

function Dropdown() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState('Option 1')

  return (
    <div style={{ position: 'relative', width: 200 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: `${S.sm}px ${S.md}px`,
          background: N.card,
          border: `1px solid ${N.border}`,
          borderRadius: R.ui,
          fontSize: T.ui, fontFamily: FONT, color: N.txtPri,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'default',
        }}
      >
        {selected}
        <ChevronDown size={ICON.sm} color={N.txtSec} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          marginTop: S.xs,
          background: N.card, border: `1px solid ${N.border}`,
          borderRadius: R.ui, overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {['Option 1', 'Option 2', 'Option 3'].map(opt => (
            <div
              key={opt}
              onClick={() => { setSelected(opt); setOpen(false) }}
              style={{
                padding: `${S.sm}px ${S.md}px`,
                fontSize: T.ui, fontFamily: FONT,
                color: selected === opt ? A.accent : N.txtPri,
                background: selected === opt ? 'rgba(0,0,0,0.03)' : 'transparent',
                cursor: 'default',
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Tabs() {
  const [active, setActive] = useState(0)
  const tabs = ['Tab 1', 'Tab 2', 'Tab 3']

  return (
    <div>
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${N.border}` }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            style={{
              padding: `${S.sm}px ${S.md}px`,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${active === i ? A.accent : 'transparent'}`,
              marginBottom: -1,
              fontSize: T.ui, fontFamily: FONT,
              fontWeight: active === i ? 600 : 400,
              color: active === i ? N.txtPri : N.txtSec,
              cursor: 'default',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ padding: S.md, fontSize: T.ui, color: N.txtSec, fontFamily: FONT }}>
        Content for {tabs[active]}
      </div>
    </div>
  )
}

function Accordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const items = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ]

  return (
    <div style={{ border: `1px solid ${N.border}`, borderRadius: R.ui, overflow: 'hidden' }}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: '100%',
              padding: `${S.sm}px ${S.md}px`,
              background: N.card,
              border: 'none',
              borderTop: i > 0 ? `1px solid ${N.border}` : 'none',
              fontSize: T.ui, fontFamily: FONT, color: N.txtPri,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'default',
            }}
          >
            {item.title}
            <ChevronRight
              size={ICON.sm}
              color={N.txtSec}
              style={{
                transform: `rotate(${openIndex === i ? 90 : 0}deg)`,
                transition: 'transform 150ms',
              }}
            />
          </button>
          {openIndex === i && (
            <div style={{
              padding: S.md, background: N.chrome,
              fontSize: T.ui, color: N.txtSec, fontFamily: FONT,
              borderTop: `1px solid ${N.border}`,
            }}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function InteractiveSection() {
  return (
    <div style={SECTION_STYLE}>
      <div style={SECTION_TITLE_STYLE}>Interactive</div>

      <div style={{ display: 'flex', gap: S.xxl }}>
        <div style={{ flex: 1 }}>
          <div style={SUBSECTION_TITLE_STYLE}>Dropdown</div>
          <Dropdown />
        </div>
        <div style={{ flex: 1 }}>
          <div style={SUBSECTION_TITLE_STYLE}>Tabs</div>
          <Tabs />
        </div>
        <div style={{ flex: 1 }}>
          <div style={SUBSECTION_TITLE_STYLE}>Accordion</div>
          <Accordion />
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
      <div style={{
        fontSize: 24, fontWeight: 600, color: N.txtPri,
        marginBottom: S.xs, fontFamily: FONT,
      }}>
        Canvai Design System
      </div>
      <div style={{
        fontSize: T.ui, color: N.txtSec,
        marginBottom: S.xxl * 2, fontFamily: FONT,
      }}>
        Consistent components following the Design Systems Checklist
      </div>

      <FoundationsSection />
      <FormElementsSection />
      <FeedbackSection />
      <DisplaySection />
      <InteractiveSection />
    </div>
  )
}
