import { useState } from 'react'
import { tokens as t } from '../tokens'

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4] }}>
      <div>
        <h2 style={{
          fontSize: t.fontSize.lg,
          fontWeight: t.fontWeight.semibold,
          color: t.colors.text,
          fontFamily: t.font.family,
          margin: 0,
          letterSpacing: -0.2,
          textWrap: 'pretty' as any,
        }}>{title}</h2>
        <p style={{
          fontSize: t.fontSize.sm,
          color: t.colors.textSecondary,
          fontFamily: t.font.family,
          margin: 0,
          marginTop: 4,
          textWrap: 'pretty' as any,
        }}>{description}</p>
      </div>
      <div style={{
        background: t.colors.surface,
        borderRadius: t.radius.lg,
        padding: t.spacing[6],
        boxShadow: t.shadow.card,
      }}>
        {children}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  1. Buttons                                                         */
/* ------------------------------------------------------------------ */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

function Button({ variant = 'primary', size = 'md', children }: { variant?: ButtonVariant; size?: ButtonSize; children: React.ReactNode }) {
  const [state, setState] = useState<'idle' | 'hover' | 'active'>('idle')

  const sizeMap: Record<ButtonSize, { padding: string; fontSize: number; height: number; borderRadius: number }> = {
    sm: { padding: `0 ${t.spacing[3]}px`, fontSize: t.fontSize.sm, height: 28, borderRadius: t.radius.sm },
    md: { padding: `0 ${t.spacing[4]}px`, fontSize: t.fontSize.base, height: 32, borderRadius: t.radius.md },
    lg: { padding: `0 ${t.spacing[5]}px`, fontSize: t.fontSize.md, height: 40, borderRadius: t.radius.lg },
  }

  const variantStyles: Record<ButtonVariant, Record<string, any>> = {
    primary: {
      background: state === 'active' ? '#4F52D9' : state === 'hover' ? t.colors.accentHover : t.colors.accent,
      color: '#FEFDFB',
      border: 'none',
    },
    secondary: {
      background: state === 'active' ? t.colors.surfaceActive : state === 'hover' ? t.colors.surfaceHover : t.colors.bgSubtle,
      color: t.colors.text,
      border: `1px solid ${t.colors.border}`,
    },
    outline: {
      background: state === 'active' ? t.colors.surfaceActive : state === 'hover' ? t.colors.surfaceHover : 'transparent',
      color: t.colors.text,
      border: `1px solid ${state === 'hover' ? t.colors.borderStrong : t.colors.border}`,
    },
    ghost: {
      background: state === 'active' ? 'rgba(0,0,0,0.06)' : state === 'hover' ? 'rgba(0,0,0,0.03)' : 'transparent',
      color: t.colors.textSecondary,
      border: '1px solid transparent',
    },
    danger: {
      background: state === 'active' ? '#DC2626' : state === 'hover' ? '#E53E3E' : t.colors.danger,
      color: '#FEFDFB',
      border: 'none',
    },
  }

  const s = sizeMap[size]
  const v = variantStyles[variant]

  return (
    <div
      onMouseEnter={() => setState('hover')}
      onMouseLeave={() => setState('idle')}
      onMouseDown={() => setState('active')}
      onMouseUp={() => setState('hover')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: s.height,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: t.fontWeight.medium,
        fontFamily: t.font.family,
        borderRadius: s.borderRadius,
        cursor: 'default',
        transition: `all 150ms ${t.spring.ease}`,
        transform: state === 'active' ? 'scale(0.96)' : 'scale(1)',
        userSelect: 'none',
        textWrap: 'pretty' as any,
        boxSizing: 'border-box' as const,
        ...v,
      }}
    >
      {children}
    </div>
  )
}

function ButtonsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[5] }}>
      {/* Variants */}
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>Variants</div>
        <div style={{ display: 'flex', gap: t.spacing[3], alignItems: 'center', flexWrap: 'wrap' as const }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>Sizes</div>
        <div style={{ display: 'flex', gap: t.spacing[3], alignItems: 'center' }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>

      {/* With icons */}
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>With Icons</div>
        <div style={{ display: 'flex', gap: t.spacing[3], alignItems: 'center' }}>
          <Button variant="primary">
            <span style={{ display: 'flex', alignItems: 'center', gap: t.spacing[2] }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M7 3v8M3 7h8" /></svg>
              New Project
            </span>
          </Button>
          <Button variant="secondary">
            <span style={{ display: 'flex', alignItems: 'center', gap: t.spacing[2] }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M7 2v8M4 7l3 3 3-3M2.5 11.5h9" /></svg>
              Export
            </span>
          </Button>
          <Button variant="outline">
            <span style={{ display: 'flex', alignItems: 'center', gap: t.spacing[2] }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7Z" /></svg>
              Edit
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  2. Inputs                                                          */
/* ------------------------------------------------------------------ */

function TextInput({ placeholder, defaultValue, icon }: { placeholder?: string; defaultValue?: string; icon?: boolean }) {
  const [value, setValue] = useState(defaultValue || '')
  const [focused, setFocused] = useState(false)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: t.spacing[2],
      height: 36,
      padding: `0 ${t.spacing[3]}px`,
      borderRadius: t.radius.md,
      border: `1px solid ${focused ? t.colors.accent : t.colors.border}`,
      background: t.colors.surface,
      transition: `border-color 150ms ${t.spring.ease}, box-shadow 150ms ${t.spring.ease}`,
      boxShadow: focused ? `0 0 0 3px ${t.colors.accentMuted}` : 'none',
      boxSizing: 'border-box' as const,
    }}>
      {icon && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.colors.textTertiary} strokeWidth="1.3" strokeLinecap="round">
          <circle cx="6" cy="6" r="4" />
          <path d="M9 9l3 3" />
        </svg>
      )}
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: t.fontSize.base,
          color: t.colors.text,
          fontFamily: t.font.family,
          cursor: 'default',
        }}
      />
    </div>
  )
}

function SelectInput({ options, defaultValue }: { options: string[]; defaultValue?: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue || options[0])
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 36,
          padding: `0 ${t.spacing[3]}px`,
          borderRadius: t.radius.md,
          border: `1px solid ${open ? t.colors.accent : t.colors.border}`,
          background: t.colors.surface,
          fontSize: t.fontSize.base,
          color: t.colors.text,
          fontFamily: t.font.family,
          cursor: 'default',
          transition: `border-color 150ms ${t.spring.ease}`,
          boxShadow: open ? `0 0 0 3px ${t.colors.accentMuted}` : 'none',
          boxSizing: 'border-box' as const,
        }}
      >
        <span style={{ textWrap: 'pretty' as any }}>{selected}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={t.colors.textTertiary} strokeWidth="1.3" strokeLinecap="round">
          <path d="M3 4.5l3 3 3-3" />
        </svg>
      </div>
      {open && (
        <div style={{
          position: 'absolute',
          top: 40,
          left: 0,
          right: 0,
          background: t.colors.surface,
          border: `1px solid ${t.colors.border}`,
          borderRadius: t.radius.md,
          boxShadow: t.shadow.lg,
          padding: t.spacing[1],
          zIndex: 10,
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onMouseEnter={() => setHovered(opt)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { setSelected(opt); setOpen(false) }}
              style={{
                padding: `${t.spacing[2]}px ${t.spacing[3]}px`,
                borderRadius: t.radius.sm,
                fontSize: t.fontSize.base,
                color: selected === opt ? t.colors.accent : t.colors.text,
                fontWeight: selected === opt ? t.fontWeight.medium : t.fontWeight.normal,
                fontFamily: t.font.family,
                background: hovered === opt ? t.colors.surfaceHover : 'transparent',
                cursor: 'default',
                textWrap: 'pretty' as any,
              }}
            >{opt}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function TextareaInput({ placeholder, defaultValue }: { placeholder?: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue || '')
  const [focused, setFocused] = useState(false)

  return (
    <textarea
      value={value}
      onChange={e => setValue(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: '100%',
        padding: `${t.spacing[2]}px ${t.spacing[3]}px`,
        borderRadius: t.radius.md,
        border: `1px solid ${focused ? t.colors.accent : t.colors.border}`,
        background: t.colors.surface,
        fontSize: t.fontSize.base,
        color: t.colors.text,
        fontFamily: t.font.family,
        outline: 'none',
        resize: 'vertical' as const,
        cursor: 'default',
        transition: `border-color 150ms ${t.spring.ease}, box-shadow 150ms ${t.spring.ease}`,
        boxShadow: focused ? `0 0 0 3px ${t.colors.accentMuted}` : 'none',
        boxSizing: 'border-box' as const,
        lineHeight: 1.5,
      }}
    />
  )
}

function InputsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4], maxWidth: 400 }}>
      <div>
        <label style={{
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          color: t.colors.text,
          fontFamily: t.font.family,
          display: 'block',
          marginBottom: t.spacing[2],
          textWrap: 'pretty' as any,
        }}>Text Input</label>
        <TextInput placeholder="Enter your name..." />
      </div>
      <div>
        <label style={{
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          color: t.colors.text,
          fontFamily: t.font.family,
          display: 'block',
          marginBottom: t.spacing[2],
          textWrap: 'pretty' as any,
        }}>Search</label>
        <TextInput placeholder="Search anything..." icon />
      </div>
      <div>
        <label style={{
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          color: t.colors.text,
          fontFamily: t.font.family,
          display: 'block',
          marginBottom: t.spacing[2],
          textWrap: 'pretty' as any,
        }}>Select</label>
        <SelectInput options={['Admin', 'Editor', 'Viewer', 'Guest']} defaultValue="Admin" />
      </div>
      <div>
        <label style={{
          fontSize: t.fontSize.sm,
          fontWeight: t.fontWeight.medium,
          color: t.colors.text,
          fontFamily: t.font.family,
          display: 'block',
          marginBottom: t.spacing[2],
          textWrap: 'pretty' as any,
        }}>Textarea</label>
        <TextareaInput placeholder="Write a description..." />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  3. Cards                                                           */
/* ------------------------------------------------------------------ */

function CardsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', gap: t.spacing[4] }}>
      {/* Info card */}
      <div
        onMouseEnter={() => setHoveredCard(0)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          flex: 1,
          padding: t.spacing[5],
          borderRadius: t.radius.lg,
          border: `1px solid ${t.colors.border}`,
          background: t.colors.surface,
          cursor: 'default',
          transform: hoveredCard === 0 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 300ms ${t.spring.cubic}, box-shadow 300ms ${t.spring.ease}`,
          boxShadow: hoveredCard === 0 ? t.shadow.md : t.shadow.sm,
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: t.radius.md,
          background: t.colors.accentMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: t.spacing[3],
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={t.colors.accent} strokeWidth="1.4" strokeLinecap="round">
            <path d="M2 14V5l6-3 6 3v9" /><rect x="5" y="8" width="6" height="6" rx="0.5" />
          </svg>
        </div>
        <div style={{
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.semibold,
          color: t.colors.text,
          fontFamily: t.font.family,
          textWrap: 'pretty' as any,
        }}>Quick Setup</div>
        <div style={{
          fontSize: t.fontSize.sm,
          color: t.colors.textSecondary,
          fontFamily: t.font.family,
          marginTop: t.spacing[1],
          lineHeight: 1.5,
          textWrap: 'pretty' as any,
        }}>Get your workspace configured in under 5 minutes with guided onboarding.</div>
      </div>

      {/* Stat card */}
      <div
        onMouseEnter={() => setHoveredCard(1)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          flex: 1,
          padding: t.spacing[5],
          borderRadius: t.radius.lg,
          border: `1px solid ${t.colors.border}`,
          background: t.colors.surface,
          cursor: 'default',
          transform: hoveredCard === 1 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 300ms ${t.spring.cubic}, box-shadow 300ms ${t.spring.ease}`,
          boxShadow: hoveredCard === 1 ? t.shadow.md : t.shadow.sm,
        }}
      >
        <div style={{
          fontSize: t.fontSize.sm,
          color: t.colors.textSecondary,
          fontFamily: t.font.family,
          fontWeight: t.fontWeight.medium,
          textWrap: 'pretty' as any,
        }}>Monthly Revenue</div>
        <div style={{
          fontSize: t.fontSize['2xl'],
          fontWeight: t.fontWeight.bold,
          color: t.colors.text,
          fontFamily: t.font.family,
          marginTop: t.spacing[2],
          letterSpacing: -0.5,
          textWrap: 'pretty' as any,
        }}>$127,840</div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: t.spacing[1],
          marginTop: t.spacing[2],
        }}>
          <span style={{
            fontSize: t.fontSize.xs,
            fontWeight: t.fontWeight.medium,
            color: t.colors.success,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
          }}>+14.2%</span>
          <span style={{
            fontSize: t.fontSize.xs,
            color: t.colors.textTertiary,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
          }}>vs last month</span>
        </div>
        {/* Mini spark line */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, marginTop: t.spacing[3], height: 32 }}>
          {[40, 55, 48, 62, 70, 65, 80, 72, 88, 82, 92, 96].map((v, i) => (
            <div key={i} style={{
              flex: 1,
              height: `${v}%`,
              borderRadius: 1,
              background: i >= 10 ? t.colors.accent : `${t.colors.accent}44`,
            }} />
          ))}
        </div>
      </div>

      {/* User card */}
      <div
        onMouseEnter={() => setHoveredCard(2)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          flex: 1,
          padding: t.spacing[5],
          borderRadius: t.radius.lg,
          border: `1px solid ${t.colors.border}`,
          background: t.colors.surface,
          cursor: 'default',
          transform: hoveredCard === 2 ? 'translateY(-2px)' : 'translateY(0)',
          transition: `transform 300ms ${t.spring.cubic}, box-shadow 300ms ${t.spring.ease}`,
          boxShadow: hoveredCard === 2 ? t.shadow.md : t.shadow.sm,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center' as const,
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: t.radius.pill,
          background: 'linear-gradient(135deg, #6366F1, #EC4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: t.fontSize.lg,
          fontWeight: t.fontWeight.semibold,
          color: '#FEFDFB',
          fontFamily: t.font.family,
          marginBottom: t.spacing[3],
        }}>AC</div>
        <div style={{
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.semibold,
          color: t.colors.text,
          fontFamily: t.font.family,
          textWrap: 'pretty' as any,
        }}>Alex Chen</div>
        <div style={{
          fontSize: t.fontSize.sm,
          color: t.colors.textSecondary,
          fontFamily: t.font.family,
          marginTop: 2,
          textWrap: 'pretty' as any,
        }}>Product Designer</div>
        <div style={{
          display: 'flex',
          gap: t.spacing[4],
          marginTop: t.spacing[4],
        }}>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text, fontFamily: t.font.family, textWrap: 'pretty' as any }}>142</div>
            <div style={{ fontSize: t.fontSize.xs, color: t.colors.textTertiary, fontFamily: t.font.family, textWrap: 'pretty' as any }}>Projects</div>
          </div>
          <div style={{ width: 1, background: t.colors.border }} />
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: t.fontSize.md, fontWeight: t.fontWeight.bold, color: t.colors.text, fontFamily: t.font.family, textWrap: 'pretty' as any }}>8.4K</div>
            <div style={{ fontSize: t.fontSize.xs, color: t.colors.textTertiary, fontFamily: t.font.family, textWrap: 'pretty' as any }}>Followers</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  4. Badges                                                          */
/* ------------------------------------------------------------------ */

type BadgeStatus = 'active' | 'pending' | 'closed' | 'draft'
type BadgeSize = 'sm' | 'md'

function Badge({ status, size = 'md' }: { status: BadgeStatus; size?: BadgeSize }) {
  const colorMap: Record<BadgeStatus, { bg: string; text: string; dot: string; label: string }> = {
    active: { bg: t.colors.successMuted, text: '#059669', dot: t.colors.success, label: 'Active' },
    pending: { bg: t.colors.warningMuted, text: '#D97706', dot: t.colors.warning, label: 'Pending' },
    closed: { bg: t.colors.dangerMuted, text: '#DC2626', dot: t.colors.danger, label: 'Closed' },
    draft: { bg: 'rgba(156,155,153,0.12)', text: t.colors.textSecondary, dot: t.colors.textTertiary, label: 'Draft' },
  }

  const c = colorMap[status]
  const isSmall = size === 'sm'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isSmall ? 4 : 6,
      padding: isSmall ? `1px ${t.spacing[2]}px` : `2px ${t.spacing[3]}px`,
      borderRadius: t.radius.pill,
      background: c.bg,
      fontSize: isSmall ? 10 : t.fontSize.xs,
      fontWeight: t.fontWeight.medium,
      color: c.text,
      fontFamily: t.font.family,
      textWrap: 'pretty' as any,
    }}>
      <span style={{
        width: isSmall ? 5 : 6,
        height: isSmall ? 5 : 6,
        borderRadius: t.radius.pill,
        background: c.dot,
      }} />
      {c.label}
    </span>
  )
}

function BadgesSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4] }}>
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>Default</div>
        <div style={{ display: 'flex', gap: t.spacing[3], flexWrap: 'wrap' as const }}>
          <Badge status="active" />
          <Badge status="pending" />
          <Badge status="closed" />
          <Badge status="draft" />
        </div>
      </div>
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>Small</div>
        <div style={{ display: 'flex', gap: t.spacing[3], flexWrap: 'wrap' as const }}>
          <Badge status="active" size="sm" />
          <Badge status="pending" size="sm" />
          <Badge status="closed" size="sm" />
          <Badge status="draft" size="sm" />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  5. Avatars                                                         */
/* ------------------------------------------------------------------ */

function Avatar({ initials, size = 32, color, online }: { initials: string; size?: number; color: string; online?: boolean }) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: t.radius.pill,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: t.fontWeight.semibold,
        color: '#FEFDFB',
        fontFamily: t.font.family,
      }}>{initials}</div>
      {online !== undefined && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: t.radius.pill,
          background: online ? t.colors.success : t.colors.textTertiary,
          border: `2px solid ${t.colors.surface}`,
          boxSizing: 'border-box' as const,
        }} />
      )}
    </div>
  )
}

function AvatarsSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[4] }}>
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>Sizes</div>
        <div style={{ display: 'flex', gap: t.spacing[4], alignItems: 'center' }}>
          <Avatar initials="AC" size={24} color="#6366F1" />
          <Avatar initials="SM" size={32} color="#EC4899" />
          <Avatar initials="JD" size={40} color="#8B5CF6" />
        </div>
      </div>
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>With Status</div>
        <div style={{ display: 'flex', gap: t.spacing[4], alignItems: 'center' }}>
          <Avatar initials="AC" size={32} color="#6366F1" online />
          <Avatar initials="SM" size={32} color="#EC4899" online />
          <Avatar initials="JD" size={32} color="#8B5CF6" online={false} />
          <Avatar initials="LK" size={32} color="#10B981" online />
          <Avatar initials="RN" size={32} color="#F59E0B" online={false} />
        </div>
      </div>
      <div>
        <div style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: t.colors.textTertiary,
          fontFamily: t.font.family,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.8,
          marginBottom: t.spacing[3],
          textWrap: 'pretty' as any,
        }}>Stack</div>
        <div style={{ display: 'flex' }}>
          {[
            { initials: 'AC', color: '#6366F1' },
            { initials: 'SM', color: '#EC4899' },
            { initials: 'JD', color: '#8B5CF6' },
            { initials: 'LK', color: '#10B981' },
            { initials: '+3', color: t.colors.textTertiary },
          ].map((a, i) => (
            <div key={i} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: t.radius.pill,
                background: a.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: t.fontWeight.semibold,
                color: '#FEFDFB',
                fontFamily: t.font.family,
                border: `2px solid ${t.colors.surface}`,
                boxSizing: 'border-box' as const,
              }}>{a.initials}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  6. Table                                                           */
/* ------------------------------------------------------------------ */

const tableRows = [
  { name: 'Brand Refresh', owner: 'Sarah M.', status: 'active' as BadgeStatus, progress: 72, updated: 'Feb 23' },
  { name: 'Q4 Analytics', owner: 'Jake D.', status: 'active' as BadgeStatus, progress: 89, updated: 'Feb 22' },
  { name: 'Mobile Redesign', owner: 'Li K.', status: 'pending' as BadgeStatus, progress: 34, updated: 'Feb 21' },
  { name: 'API Migration', owner: 'Ryan N.', status: 'closed' as BadgeStatus, progress: 100, updated: 'Feb 18' },
  { name: 'Design System v3', owner: 'Ava M.', status: 'draft' as BadgeStatus, progress: 12, updated: 'Feb 17' },
]

function TableSection() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null)
  const headers = ['Project', 'Owner', 'Status', 'Progress', 'Updated']

  return (
    <div style={{
      borderRadius: t.radius.md,
      border: `1px solid ${t.colors.border}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr',
        background: t.colors.bgSubtle,
        borderBottom: `1px solid ${t.colors.border}`,
      }}>
        {headers.map(h => (
          <div
            key={h}
            onMouseEnter={() => setHoveredHeader(h)}
            onMouseLeave={() => setHoveredHeader(null)}
            style={{
              padding: `${t.spacing[2]}px ${t.spacing[4]}px`,
              fontSize: t.fontSize.xs,
              fontWeight: t.fontWeight.medium,
              color: t.colors.textSecondary,
              fontFamily: t.font.family,
              textTransform: 'uppercase' as const,
              letterSpacing: 0.5,
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing[1],
              background: hoveredHeader === h ? 'rgba(0,0,0,0.02)' : 'transparent',
              transition: `background 100ms`,
              textWrap: 'pretty' as any,
            }}
          >
            {h}
            {hoveredHeader === h && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={t.colors.textTertiary} strokeWidth="1.2" strokeLinecap="round">
                <path d="M3 4l2 2 2-2" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Rows */}
      {tableRows.map((row, i) => (
        <div
          key={i}
          onMouseEnter={() => setHoveredRow(i)}
          onMouseLeave={() => setHoveredRow(null)}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr',
            borderBottom: i < tableRows.length - 1 ? `1px solid ${t.colors.borderSubtle}` : 'none',
            background: hoveredRow === i ? t.colors.surfaceHover : t.colors.surface,
            transition: `background 100ms`,
            cursor: 'default',
          }}
        >
          <div style={{
            padding: `${t.spacing[3]}px ${t.spacing[4]}px`,
            fontSize: t.fontSize.base,
            fontWeight: t.fontWeight.medium,
            color: t.colors.text,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
          }}>{row.name}</div>
          <div style={{
            padding: `${t.spacing[3]}px ${t.spacing[4]}px`,
            fontSize: t.fontSize.base,
            color: t.colors.textSecondary,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
          }}>{row.owner}</div>
          <div style={{
            padding: `${t.spacing[3]}px ${t.spacing[4]}px`,
            display: 'flex',
            alignItems: 'center',
          }}>
            <Badge status={row.status} size="sm" />
          </div>
          <div style={{
            padding: `${t.spacing[3]}px ${t.spacing[4]}px`,
            display: 'flex',
            alignItems: 'center',
            gap: t.spacing[2],
          }}>
            <div style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: t.colors.bgSubtle,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${row.progress}%`,
                borderRadius: 2,
                background: row.progress === 100 ? t.colors.success : t.colors.accent,
                transition: `width 400ms ${t.spring.cubic}`,
              }} />
            </div>
            <span style={{
              fontSize: t.fontSize.xs,
              color: t.colors.textTertiary,
              fontFamily: t.font.family,
              fontWeight: t.fontWeight.medium,
              minWidth: 28,
              textAlign: 'right' as const,
              fontVariantNumeric: 'tabular-nums',
              textWrap: 'pretty' as any,
            }}>{row.progress}%</span>
          </div>
          <div style={{
            padding: `${t.spacing[3]}px ${t.spacing[4]}px`,
            fontSize: t.fontSize.sm,
            color: t.colors.textTertiary,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
          }}>{row.updated}</div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Components (exported)                                              */
/* ------------------------------------------------------------------ */

export function Components() {
  return (
    <div style={{
      width: 1440,
      height: 1200,
      background: t.colors.bg,
      fontFamily: t.font.family,
      cursor: 'default',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: `${t.spacing[8]}px ${t.spacing[10]}px ${t.spacing[4]}px`,
      }}>
        <h1 style={{
          fontSize: t.fontSize['3xl'],
          fontWeight: t.fontWeight.bold,
          color: t.colors.text,
          margin: 0,
          letterSpacing: -0.8,
          textWrap: 'pretty' as any,
        }}>Components</h1>
        <p style={{
          fontSize: t.fontSize.md,
          color: t.colors.textSecondary,
          margin: 0,
          marginTop: t.spacing[1],
          textWrap: 'pretty' as any,
        }}>Pulse design system UI building blocks. Every component is interactive.</p>
      </div>

      {/* Component grid */}
      <div style={{
        padding: `${t.spacing[4]}px ${t.spacing[10]}px ${t.spacing[10]}px`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: t.spacing[8],
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[8] }}>
          <Section title="Buttons" description="Interactive buttons with variant and size options">
            <ButtonsSection />
          </Section>
          <Section title="Cards" description="Versatile container components with hover lift">
            <CardsSection />
          </Section>
          <Section title="Table" description="Data table with sortable headers and row highlights">
            <TableSection />
          </Section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[8] }}>
          <Section title="Inputs" description="Form controls for text, search, select, and multiline">
            <InputsSection />
          </Section>
          <Section title="Badges" description="Status indicators in multiple variants and sizes">
            <BadgesSection />
          </Section>
          <Section title="Avatars" description="User representations with initials and status indicators">
            <AvatarsSection />
          </Section>
        </div>
      </div>
    </div>
  )
}
