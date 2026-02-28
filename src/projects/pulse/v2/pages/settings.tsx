import { useState } from 'react'
import { tokens as t } from '../tokens'

/* ------------------------------------------------------------------ */
/*  Sidebar (shared with dashboard)                                    */
/* ------------------------------------------------------------------ */

const navItems = [
  { label: 'Dashboard', icon: 'grid' },
  { label: 'Projects', icon: 'folder' },
  { label: 'Team', icon: 'users' },
  { label: 'Reports', icon: 'chart' },
  { label: 'Settings', icon: 'gear' },
]

function NavIcon({ type, size = 16, color }: { type: string; size?: number; color: string }) {
  const s = { width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' } as const
  const svgProps = { width: size, height: size, viewBox: '0 0 16 16', fill: 'none', stroke: color, strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  if (type === 'grid') return <span style={s}><svg {...svgProps}><rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" /><rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" /></svg></span>
  if (type === 'folder') return <span style={s}><svg {...svgProps}><path d="M2 4.5C2 3.67 2.67 3 3.5 3H6l1.5 1.5h5c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-9C2.67 13.5 2 12.83 2 12V4.5Z" /></svg></span>
  if (type === 'users') return <span style={s}><svg {...svgProps}><circle cx="6" cy="5.5" r="2.5" /><path d="M1.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" /><circle cx="11.5" cy="5" r="2" /><path d="M14.5 13.5c0-2 -1.5-3.2-3-3.6" /></svg></span>
  if (type === 'chart') return <span style={s}><svg {...svgProps}><path d="M2 14h12" /><rect x="3" y="7" width="2" height="7" rx="0.5" /><rect x="7" y="4" width="2" height="10" rx="0.5" /><rect x="11" y="2" width="2" height="12" rx="0.5" /></svg></span>
  if (type === 'gear') return <span style={s}><svg {...svgProps}><circle cx="8" cy="8" r="2.5" /><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" /></svg></span>
  return null
}

function Sidebar({ activeNav, onNav }: { activeNav: string; onNav: (n: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{
      width: 220,
      height: '100%',
      background: t.colors.sidebar,
      display: 'flex',
      flexDirection: 'column',
      padding: `${t.spacing[4]}px ${t.spacing[3]}px`,
      gap: t.spacing[1],
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: t.spacing[2],
        padding: `${t.spacing[2]}px ${t.spacing[2]}px`,
        marginBottom: t.spacing[4],
      }}>
        <div style={{
          width: 24,
          height: 24,
          borderRadius: t.radius.md,
          background: `linear-gradient(135deg, ${t.colors.accent}, #8B5CF6)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7C2 4 4 2 7 2s5 2.5 5 5.5c0 1.5-.5 2.8-1.5 3.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="7" cy="7.5" r="1.5" fill="#fff" />
          </svg>
        </div>
        <span style={{
          fontSize: t.fontSize.md,
          fontWeight: t.fontWeight.semibold,
          color: t.colors.sidebarTextActive,
          fontFamily: t.font.family,
          letterSpacing: -0.3,
          textWrap: 'pretty' as any,
        }}>Pulse</span>
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {navItems.map(item => {
          const isActive = activeNav === item.label
          const isHovered = hovered === item.label
          return (
            <div
              key={item.label}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNav(item.label)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: t.spacing[2],
                padding: `${t.spacing[2]}px ${t.spacing[2]}px`,
                borderRadius: t.radius.md,
                cursor: 'default',
                background: isActive ? t.colors.sidebarActive : isHovered ? t.colors.sidebarHover : 'transparent',
                transition: `background 150ms ${t.spring.ease}`,
              }}
            >
              <NavIcon type={item.icon} color={isActive ? t.colors.sidebarTextActive : t.colors.sidebarText} />
              <span style={{
                fontSize: t.fontSize.base,
                fontWeight: isActive ? t.fontWeight.medium : t.fontWeight.normal,
                color: isActive ? t.colors.sidebarTextActive : t.colors.sidebarText,
                fontFamily: t.font.family,
                textWrap: 'pretty' as any,
              }}>{item.label}</span>
            </div>
          )
        })}
      </div>

      {/* User */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: t.spacing[2],
        padding: `${t.spacing[2]}px ${t.spacing[2]}px`,
        borderTop: `1px solid ${t.colors.sidebarBorder}`,
        paddingTop: t.spacing[3],
        marginTop: t.spacing[2],
      }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: t.radius.pill,
          background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.semibold,
          color: '#FEFDFB',
          fontFamily: t.font.family,
        }}>AC</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: t.fontSize.sm,
            fontWeight: t.fontWeight.medium,
            color: t.colors.sidebarTextActive,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
            lineHeight: 1.3,
          }}>Alex Chen</span>
          <span style={{
            fontSize: t.fontSize.xs,
            color: t.colors.sidebarText,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
            lineHeight: 1.3,
          }}>Admin</span>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Form components                                                    */
/* ------------------------------------------------------------------ */

function FormInput({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) {
  const [value, setValue] = useState(defaultValue)
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[2] }}>
      <label style={{
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.medium,
        color: t.colors.text,
        fontFamily: t.font.family,
        textWrap: 'pretty' as any,
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height: 36,
          padding: `0 ${t.spacing[3]}px`,
          borderRadius: t.radius.md,
          border: `1px solid ${focused ? t.colors.accent : t.colors.border}`,
          background: t.colors.surface,
          fontSize: t.fontSize.base,
          color: t.colors.text,
          fontFamily: t.font.family,
          outline: 'none',
          cursor: 'default',
          transition: `border-color 150ms ${t.spring.ease}, box-shadow 150ms ${t.spring.ease}`,
          boxShadow: focused ? `0 0 0 3px ${t.colors.accentMuted}` : 'none',
          boxSizing: 'border-box' as const,
        }}
      />
    </div>
  )
}

function FormSelect({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue)
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.spacing[2], position: 'relative' }}>
      <label style={{
        fontSize: t.fontSize.sm,
        fontWeight: t.fontWeight.medium,
        color: t.colors.text,
        fontFamily: t.font.family,
        textWrap: 'pretty' as any,
      }}>{label}</label>
      <div
        onClick={() => setOpen(!open)}
        style={{
          height: 36,
          padding: `0 ${t.spacing[3]}px`,
          borderRadius: t.radius.md,
          border: `1px solid ${open ? t.colors.accent : t.colors.border}`,
          background: t.colors.surface,
          fontSize: t.fontSize.base,
          color: t.colors.text,
          fontFamily: t.font.family,
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          top: 68,
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

/* ------------------------------------------------------------------ */
/*  Toggle switch                                                      */
/* ------------------------------------------------------------------ */

function Toggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${t.spacing[3]}px 0`,
        cursor: 'default',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: t.fontSize.base,
          fontWeight: t.fontWeight.medium,
          color: t.colors.text,
          fontFamily: t.font.family,
          textWrap: 'pretty' as any,
        }}>{label}</div>
        <div style={{
          fontSize: t.fontSize.sm,
          color: t.colors.textSecondary,
          fontFamily: t.font.family,
          marginTop: 2,
          textWrap: 'pretty' as any,
        }}>{description}</div>
      </div>

      {/* Switch track */}
      <div
        onClick={() => setOn(!on)}
        style={{
          width: 40,
          height: 24,
          borderRadius: t.radius.pill,
          background: on ? t.colors.accent : t.colors.borderStrong,
          padding: 2,
          cursor: 'default',
          transition: `background 200ms ${t.spring.ease}`,
          flexShrink: 0,
          marginLeft: t.spacing[4],
          position: 'relative',
        }}
      >
        {/* Thumb */}
        <div style={{
          width: 20,
          height: 20,
          borderRadius: t.radius.pill,
          background: '#FEFDFB',
          boxShadow: t.shadow.sm,
          transform: on ? 'translateX(16px)' : 'translateX(0)',
          transition: `transform 250ms ${t.spring.cubic}`,
        }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: t.spacing[6],
      boxShadow: t.shadow.card,
    }}>
      <h3 style={{
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        color: t.colors.text,
        fontFamily: t.font.family,
        margin: 0,
        marginBottom: t.spacing[5],
        textWrap: 'pretty' as any,
      }}>{title}</h3>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Theme selector                                                     */
/* ------------------------------------------------------------------ */

function ThemeSelector() {
  const [selected, setSelected] = useState<'light' | 'dark' | 'system'>('light')
  const [hovered, setHovered] = useState<string | null>(null)

  const themes = [
    { id: 'light' as const, label: 'Light', bgPreview: '#F8F7F6', barPreview: '#FEFDFB', textPreview: '#1C1B1A' },
    { id: 'dark' as const, label: 'Dark', bgPreview: '#1C1B1A', barPreview: '#2A2928', textPreview: '#FEFDFB' },
    { id: 'system' as const, label: 'System', bgPreview: 'linear-gradient(135deg, #F8F7F6 50%, #1C1B1A 50%)', barPreview: '', textPreview: '' },
  ]

  return (
    <div style={{ display: 'flex', gap: t.spacing[3] }}>
      {themes.map(theme => {
        const isSelected = selected === theme.id
        const isHovered = hovered === theme.id
        return (
          <div
            key={theme.id}
            onClick={() => setSelected(theme.id)}
            onMouseEnter={() => setHovered(theme.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              padding: t.spacing[3],
              borderRadius: t.radius.lg,
              border: `2px solid ${isSelected ? t.colors.accent : isHovered ? t.colors.borderStrong : t.colors.border}`,
              cursor: 'default',
              transition: `border-color 200ms ${t.spring.ease}, transform 200ms ${t.spring.cubic}`,
              transform: isHovered ? 'scale(1.01)' : 'scale(1)',
              background: t.colors.surface,
            }}
          >
            {/* Preview */}
            <div style={{
              height: 64,
              borderRadius: t.radius.md,
              background: theme.bgPreview,
              marginBottom: t.spacing[3],
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              padding: t.spacing[2],
              gap: t.spacing[1],
            }}>
              {theme.id !== 'system' && (
                <>
                  <div style={{ height: 8, borderRadius: 2, background: theme.barPreview, width: '60%' }} />
                  <div style={{ height: 4, borderRadius: 2, background: theme.textPreview, width: '80%', opacity: 0.2 }} />
                  <div style={{ height: 4, borderRadius: 2, background: theme.textPreview, width: '50%', opacity: 0.15 }} />
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ height: 12, borderRadius: 2, background: t.colors.accent, width: 24, opacity: 0.6 }} />
                    <div style={{ height: 12, borderRadius: 2, background: theme.barPreview, width: 24 }} />
                  </div>
                </>
              )}
              {theme.id === 'system' && (
                <div style={{
                  flex: 1,
                  borderRadius: t.radius.sm,
                  background: 'linear-gradient(135deg, #F8F7F6 50%, #1C1B1A 50%)',
                }} />
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                fontSize: t.fontSize.sm,
                fontWeight: isSelected ? t.fontWeight.medium : t.fontWeight.normal,
                color: isSelected ? t.colors.accent : t.colors.text,
                fontFamily: t.font.family,
                textWrap: 'pretty' as any,
              }}>{theme.label}</span>
              {isSelected && (
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: t.radius.pill,
                  background: t.colors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#FEFDFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 5l2.5 2.5L8 3" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Settings (exported)                                                */
/* ------------------------------------------------------------------ */

export function Settings() {
  const [activeNav, setActiveNav] = useState('Settings')
  const [deleteHovered, setDeleteHovered] = useState(false)
  const [saveHovered, setSaveHovered] = useState(false)

  return (
    <div style={{
      width: 1440,
      height: 900,
      display: 'flex',
      fontFamily: t.font.family,
      background: t.colors.bg,
      overflow: 'hidden',
      cursor: 'default',
    }}>
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNav={setActiveNav} />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${t.spacing[5]}px ${t.spacing[8]}px`,
          borderBottom: `1px solid ${t.colors.border}`,
          background: t.colors.surface,
        }}>
          <div>
            <h1 style={{
              fontSize: t.fontSize.xl,
              fontWeight: t.fontWeight.bold,
              color: t.colors.text,
              margin: 0,
              letterSpacing: -0.4,
              textWrap: 'pretty' as any,
            }}>Settings</h1>
            <p style={{
              fontSize: t.fontSize.sm,
              color: t.colors.textSecondary,
              margin: 0,
              marginTop: 2,
              textWrap: 'pretty' as any,
            }}>Manage your account preferences and workspace configuration</p>
          </div>
          <div
            onMouseEnter={() => setSaveHovered(true)}
            onMouseLeave={() => setSaveHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing[2],
              padding: `${t.spacing[2]}px ${t.spacing[4]}px`,
              borderRadius: t.radius.md,
              background: saveHovered ? t.colors.accentHover : t.colors.accent,
              color: '#FEFDFB',
              fontSize: t.fontSize.sm,
              fontWeight: t.fontWeight.medium,
              fontFamily: t.font.family,
              cursor: 'default',
              transition: `background 150ms ${t.spring.ease}, transform 200ms ${t.spring.cubic}`,
              transform: saveHovered ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
              <path d="M2 5l4 4L12 3" />
            </svg>
            <span style={{ textWrap: 'pretty' as any }}>Save Changes</span>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: `${t.spacing[6]}px ${t.spacing[8]}px`,
        }}>
          <div style={{
            maxWidth: 680,
            display: 'flex',
            flexDirection: 'column',
            gap: t.spacing[6],
          }}>
            {/* Profile */}
            <SettingsSection title="Profile">
              <div style={{ display: 'flex', gap: t.spacing[5], marginBottom: t.spacing[5] }}>
                {/* Avatar upload area */}
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: t.radius.pill,
                  background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: t.fontSize.xl,
                  fontWeight: t.fontWeight.bold,
                  color: '#FEFDFB',
                  fontFamily: t.font.family,
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  AC
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 24,
                    height: 24,
                    borderRadius: t.radius.pill,
                    background: t.colors.surface,
                    border: `2px solid ${t.colors.surface}`,
                    boxShadow: t.shadow.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={t.colors.textSecondary} strokeWidth="1.3" strokeLinecap="round">
                      <path d="M6 1v4M6 1L4 3M6 1l2 2" />
                      <path d="M1 8v2a1 1 0 001 1h8a1 1 0 001-1V8" />
                    </svg>
                  </div>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{
                    fontSize: t.fontSize.md,
                    fontWeight: t.fontWeight.semibold,
                    color: t.colors.text,
                    fontFamily: t.font.family,
                    textWrap: 'pretty' as any,
                  }}>Profile Photo</div>
                  <div style={{
                    fontSize: t.fontSize.sm,
                    color: t.colors.textSecondary,
                    fontFamily: t.font.family,
                    marginTop: 2,
                    textWrap: 'pretty' as any,
                  }}>JPG, PNG or GIF. Max 2MB.</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: `${t.spacing[4]}px`,
              }}>
                <FormInput label="Full Name" defaultValue="Alex Chen" />
                <FormInput label="Email" defaultValue="alex@pulse.app" type="email" />
                <FormSelect label="Role" options={['Admin', 'Editor', 'Viewer']} defaultValue="Admin" />
                <FormInput label="Team" defaultValue="Engineering" />
              </div>
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection title="Notifications">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: `1px solid ${t.colors.borderSubtle}`,
              }}>
                <Toggle
                  label="Email Notifications"
                  description="Receive email alerts for important updates and mentions"
                  defaultOn
                />
                <div style={{ borderTop: `1px solid ${t.colors.borderSubtle}` }} />
                <Toggle
                  label="Push Notifications"
                  description="Get push notifications on your devices for real-time updates"
                  defaultOn
                />
                <div style={{ borderTop: `1px solid ${t.colors.borderSubtle}` }} />
                <Toggle
                  label="Weekly Digest"
                  description="Receive a summary of your team's activity every Monday"
                  defaultOn={false}
                />
                <div style={{ borderTop: `1px solid ${t.colors.borderSubtle}` }} />
                <Toggle
                  label="Marketing Emails"
                  description="Occasional product updates and feature announcements"
                  defaultOn={false}
                />
              </div>
            </SettingsSection>

            {/* Appearance */}
            <SettingsSection title="Appearance">
              <div style={{
                fontSize: t.fontSize.sm,
                color: t.colors.textSecondary,
                fontFamily: t.font.family,
                marginBottom: t.spacing[4],
                marginTop: -t.spacing[2],
                textWrap: 'pretty' as any,
              }}>Choose your preferred color scheme for the interface</div>
              <ThemeSelector />
            </SettingsSection>

            {/* Danger Zone */}
            <div style={{
              background: t.colors.surface,
              borderRadius: t.radius.lg,
              padding: t.spacing[6],
              border: `1px solid ${t.colors.danger}33`,
              boxShadow: t.shadow.card,
            }}>
              <h3 style={{
                fontSize: t.fontSize.md,
                fontWeight: t.fontWeight.semibold,
                color: t.colors.danger,
                fontFamily: t.font.family,
                margin: 0,
                marginBottom: t.spacing[2],
                textWrap: 'pretty' as any,
              }}>Danger Zone</h3>
              <p style={{
                fontSize: t.fontSize.sm,
                color: t.colors.textSecondary,
                fontFamily: t.font.family,
                margin: 0,
                marginBottom: t.spacing[4],
                textWrap: 'pretty' as any,
                lineHeight: 1.5,
              }}>Permanently delete your account and all associated data. This action cannot be undone.</p>
              <div
                onMouseEnter={() => setDeleteHovered(true)}
                onMouseLeave={() => setDeleteHovered(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: t.spacing[2],
                  padding: `${t.spacing[2]}px ${t.spacing[4]}px`,
                  borderRadius: t.radius.md,
                  background: deleteHovered ? t.colors.danger : 'transparent',
                  color: deleteHovered ? '#FEFDFB' : t.colors.danger,
                  border: `1px solid ${t.colors.danger}`,
                  fontSize: t.fontSize.sm,
                  fontWeight: t.fontWeight.medium,
                  fontFamily: t.font.family,
                  cursor: 'default',
                  transition: `all 150ms ${t.spring.ease}`,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <path d="M2.5 4h9M5.5 4V2.5h3V4M3.5 4v8a1 1 0 001 1h5a1 1 0 001-1V4" />
                  <path d="M5.5 6.5v4M8.5 6.5v4" />
                </svg>
                <span style={{ textWrap: 'pretty' as any }}>Delete Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
