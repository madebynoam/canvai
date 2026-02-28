import { useState } from 'react'
import { tokens as t } from '../tokens'

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
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
/*  Stat Card                                                          */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, change, positive }: { label: string; value: string; change: string; positive: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        background: t.colors.surface,
        borderRadius: t.radius.lg,
        padding: t.spacing[5],
        boxShadow: t.shadow.card,
        cursor: 'default',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: `transform 300ms ${t.spring.cubic}, box-shadow 300ms ${t.spring.ease}`,
        boxSizing: 'border-box' as const,
      }}
    >
      <div style={{
        fontSize: t.fontSize.sm,
        color: t.colors.textSecondary,
        fontFamily: t.font.family,
        fontWeight: t.fontWeight.medium,
        marginBottom: t.spacing[2],
        textWrap: 'pretty' as any,
      }}>{label}</div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: t.spacing[2],
      }}>
        <span style={{
          fontSize: t.fontSize['2xl'],
          fontWeight: t.fontWeight.bold,
          color: t.colors.text,
          fontFamily: t.font.family,
          letterSpacing: -0.5,
          textWrap: 'pretty' as any,
        }}>{value}</span>
        <span style={{
          fontSize: t.fontSize.xs,
          fontWeight: t.fontWeight.medium,
          color: positive ? t.colors.success : t.colors.danger,
          fontFamily: t.font.family,
          background: positive ? t.colors.successMuted : t.colors.dangerMuted,
          padding: `2px ${t.spacing[2]}px`,
          borderRadius: t.radius.pill,
          textWrap: 'pretty' as any,
        }}>{change}</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Bar Chart                                                          */
/* ------------------------------------------------------------------ */

const chartData = [
  { day: 'Mon', value: 68, amount: '$6,840' },
  { day: 'Tue', value: 85, amount: '$8,520' },
  { day: 'Wed', value: 72, amount: '$7,200' },
  { day: 'Thu', value: 91, amount: '$9,140' },
  { day: 'Fri', value: 56, amount: '$5,620' },
  { day: 'Sat', value: 42, amount: '$4,200' },
  { day: 'Sun', value: 78, amount: '$7,840' },
]

function BarChart() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const maxVal = Math.max(...chartData.map(d => d.value))

  return (
    <div style={{
      flex: 1,
      background: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: t.spacing[5],
      boxShadow: t.shadow.card,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: t.spacing[5],
      }}>
        <div>
          <div style={{
            fontSize: t.fontSize.md,
            fontWeight: t.fontWeight.semibold,
            color: t.colors.text,
            fontFamily: t.font.family,
            textWrap: 'pretty' as any,
          }}>Revenue</div>
          <div style={{
            fontSize: t.fontSize.sm,
            color: t.colors.textSecondary,
            fontFamily: t.font.family,
            marginTop: 2,
            textWrap: 'pretty' as any,
          }}>Daily breakdown for the last 7 days</div>
        </div>
        <div style={{
          display: 'flex',
          gap: t.spacing[3],
        }}>
          {['Week', 'Month', 'Year'].map((period, i) => (
            <span key={period} style={{
              fontSize: t.fontSize.sm,
              color: i === 0 ? t.colors.accent : t.colors.textTertiary,
              fontWeight: i === 0 ? t.fontWeight.medium : t.fontWeight.normal,
              fontFamily: t.font.family,
              cursor: 'default',
              padding: `${t.spacing[1]}px ${t.spacing[2]}px`,
              borderRadius: t.radius.sm,
              background: i === 0 ? t.colors.accentSubtle : 'transparent',
              textWrap: 'pretty' as any,
            }}>{period}</span>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: t.spacing[3],
        height: 180,
        paddingTop: t.spacing[4],
        position: 'relative',
      }}>
        {/* Y-axis lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <div key={pct} style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: pct * 160 + 20,
            borderBottom: `1px solid ${t.colors.borderSubtle}`,
          }} />
        ))}

        {chartData.map((d, i) => {
          const barHeight = (d.value / maxVal) * 160
          const isHovered = hoveredBar === i
          return (
            <div
              key={d.day}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: t.spacing[2],
                position: 'relative',
                zIndex: 1,
                cursor: 'default',
              }}
            >
              {/* Tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: barHeight + 32,
                  background: t.colors.sidebar,
                  color: t.colors.textInverse,
                  fontSize: t.fontSize.xs,
                  fontWeight: t.fontWeight.medium,
                  fontFamily: t.font.family,
                  padding: `${t.spacing[1]}px ${t.spacing[2]}px`,
                  borderRadius: t.radius.sm,
                  whiteSpace: 'nowrap',
                  textWrap: 'pretty' as any,
                }}>{d.amount}</div>
              )}

              {/* Bar */}
              <div style={{
                width: '100%',
                maxWidth: 48,
                height: barHeight,
                borderRadius: `${t.radius.sm}px ${t.radius.sm}px 0 0`,
                background: isHovered
                  ? `linear-gradient(180deg, ${t.colors.accent}, #8B5CF6)`
                  : `linear-gradient(180deg, ${t.colors.accent}dd, ${t.colors.accent}88)`,
                transition: `transform 200ms ${t.spring.cubic}, opacity 150ms`,
                transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                transformOrigin: 'bottom',
              }} />

              {/* Label */}
              <span style={{
                fontSize: t.fontSize.xs,
                color: t.colors.textTertiary,
                fontFamily: t.font.family,
                textWrap: 'pretty' as any,
              }}>{d.day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Activity Feed                                                      */
/* ------------------------------------------------------------------ */

const activities = [
  { initials: 'SM', name: 'Sarah Miller', action: 'created a new project', project: 'Brand Refresh', time: '2m ago', color: '#EC4899' },
  { initials: 'JD', name: 'Jake Davis', action: 'completed review on', project: 'Q4 Report', time: '8m ago', color: '#8B5CF6' },
  { initials: 'LK', name: 'Li Kim', action: 'shared dashboard with', project: 'Marketing Team', time: '15m ago', color: '#10B981' },
  { initials: 'RN', name: 'Ryan Novak', action: 'updated metrics for', project: 'Conversion Funnel', time: '32m ago', color: '#F59E0B' },
  { initials: 'AM', name: 'Ava Mitchell', action: 'deployed changes to', project: 'Analytics v2.1', time: '1h ago', color: '#3B82F6' },
]

function ActivityFeed() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <div style={{
      width: 320,
      background: t.colors.surface,
      borderRadius: t.radius.lg,
      padding: t.spacing[5],
      boxShadow: t.shadow.card,
      flexShrink: 0,
    }}>
      <div style={{
        fontSize: t.fontSize.md,
        fontWeight: t.fontWeight.semibold,
        color: t.colors.text,
        fontFamily: t.font.family,
        marginBottom: t.spacing[4],
        textWrap: 'pretty' as any,
      }}>Recent Activity</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {activities.map((a, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: 'flex',
              gap: t.spacing[3],
              padding: `${t.spacing[2]}px ${t.spacing[1]}px`,
              borderRadius: t.radius.md,
              background: hoveredRow === i ? t.colors.surfaceHover : 'transparent',
              transition: `background 150ms ${t.spring.ease}`,
              cursor: 'default',
            }}
          >
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
              flexShrink: 0,
              marginTop: 2,
            }}>{a.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: t.fontSize.sm,
                color: t.colors.text,
                fontFamily: t.font.family,
                lineHeight: 1.4,
                textWrap: 'pretty' as any,
              }}>
                <span style={{ fontWeight: t.fontWeight.medium }}>{a.name}</span>
                {' '}{a.action}{' '}
                <span style={{ fontWeight: t.fontWeight.medium, color: t.colors.accent }}>{a.project}</span>
              </div>
              <div style={{
                fontSize: t.fontSize.xs,
                color: t.colors.textTertiary,
                fontFamily: t.font.family,
                marginTop: 2,
                textWrap: 'pretty' as any,
              }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Dashboard (exported)                                               */
/* ------------------------------------------------------------------ */

export function Dashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [exportHovered, setExportHovered] = useState(false)

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
            }}>Overview</h1>
            <p style={{
              fontSize: t.fontSize.sm,
              color: t.colors.textSecondary,
              margin: 0,
              marginTop: 2,
              textWrap: 'pretty' as any,
            }}>Track your team's analytics and performance metrics</p>
          </div>
          <div style={{ display: 'flex', gap: t.spacing[3], alignItems: 'center' }}>
            {/* Date range pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: t.spacing[2],
              padding: `${t.spacing[2]}px ${t.spacing[3]}px`,
              borderRadius: t.radius.md,
              border: `1px solid ${t.colors.border}`,
              background: t.colors.surface,
              fontSize: t.fontSize.sm,
              color: t.colors.textSecondary,
              fontFamily: t.font.family,
              cursor: 'default',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={t.colors.textTertiary} strokeWidth="1.3" strokeLinecap="round">
                <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" />
                <path d="M1.5 5.5h11M4.5 1v2.5M9.5 1v2.5" />
              </svg>
              <span style={{ textWrap: 'pretty' as any }}>Feb 18 - Feb 24, 2026</span>
            </div>

            {/* Export button */}
            <div
              onMouseEnter={() => setExportHovered(true)}
              onMouseLeave={() => setExportHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: t.spacing[2],
                padding: `${t.spacing[2]}px ${t.spacing[4]}px`,
                borderRadius: t.radius.md,
                background: exportHovered ? t.colors.accentHover : t.colors.accent,
                color: '#FEFDFB',
                fontSize: t.fontSize.sm,
                fontWeight: t.fontWeight.medium,
                fontFamily: t.font.family,
                cursor: 'default',
                transition: `background 150ms ${t.spring.ease}, transform 200ms ${t.spring.cubic}`,
                transform: exportHovered ? 'scale(0.98)' : 'scale(1)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                <path d="M7 2v8M4 7l3 3 3-3M2.5 11.5h9" />
              </svg>
              <span style={{ textWrap: 'pretty' as any }}>Export</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: `${t.spacing[6]}px ${t.spacing[8]}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: t.spacing[6],
        }}>
          {/* Stat cards */}
          <div style={{
            display: 'flex',
            gap: t.spacing[5],
          }}>
            <StatCard label="Revenue" value="$48.2K" change="+12.3%" positive />
            <StatCard label="Users" value="2,847" change="+8.1%" positive />
            <StatCard label="Sessions" value="12.4K" change="-3.2%" positive={false} />
            <StatCard label="Conversion" value="3.2%" change="+0.4%" positive />
          </div>

          {/* Charts + Activity */}
          <div style={{
            display: 'flex',
            gap: t.spacing[5],
          }}>
            <BarChart />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
