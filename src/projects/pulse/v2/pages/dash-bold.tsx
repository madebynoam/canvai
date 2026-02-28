import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Direction E — Bold Contrast (Radio App Inspiration)                 */
/*  High contrast black/white, bold typography, red accent, grid lines  */
/* ------------------------------------------------------------------ */

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

/* High contrast palette */
const c = {
  bg: 'oklch(0.97 0 0)',
  surface: 'oklch(1 0 0)',
  sidebar: 'oklch(0.12 0 0)',
  sidebarText: 'oklch(0.65 0 0)',
  sidebarTextActive: 'oklch(0.98 0 0)',
  border: 'oklch(0.88 0 0)',
  borderStrong: 'oklch(0.12 0 0)',
  text: 'oklch(0.12 0 0)',
  textSecondary: 'oklch(0.45 0 0)',
  textTertiary: 'oklch(0.60 0 0)',
  accent: 'oklch(0.55 0.22 25)', // Red accent
  accentMuted: 'oklch(0.95 0.04 25)',
  success: 'oklch(0.52 0.14 155)',
  danger: 'oklch(0.55 0.20 25)',
}

/* Nav items */
const navItems = [
  { label: 'Overview', active: true },
  { label: 'Analytics', active: false },
  { label: 'Reports', active: false },
  { label: 'Customers', active: false },
  { label: 'Settings', active: false },
]

/* Stat data - big bold numbers */
const stats = [
  { label: 'Total Revenue', value: '52,430', prefix: '$', change: '+12.5%', positive: true },
  { label: 'Active Users', value: '3,284', prefix: '', change: '+8.2%', positive: true },
  { label: 'Conversion', value: '4.3', prefix: '', suffix: '%', change: '-0.3%', positive: false },
]

/* Weekly data with grid lines */
const weekData = [
  { day: 'Mon', value: 72 },
  { day: 'Tue', value: 88 },
  { day: 'Wed', value: 65 },
  { day: 'Thu', value: 94 },
  { day: 'Fri', value: 80 },
  { day: 'Sat', value: 48 },
  { day: 'Sun', value: 76 },
]

export function DashBold() {
  const [activeNav, setActiveNav] = useState('Overview')
  const maxVal = Math.max(...weekData.map(d => d.value))

  return (
    <div style={{
      minHeight: '100%',
      overflow: 'auto',
      fontFamily: font,
      WebkitFontSmoothing: 'antialiased',
      display: 'flex',
      background: c.bg,
      cursor: 'default',
    }}>
      {/* Black sidebar */}
      <div style={{
        width: 220,
        minHeight: 900,
        background: c.sidebar,
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxSizing: 'border-box' as const,
      }}>
        {/* Logo - bold wordmark */}
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: c.sidebarTextActive,
          letterSpacing: -1.5,
          marginBottom: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          Pulse
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: c.accent,
          }} />
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(item => {
            const isActive = activeNav === item.label
            return (
              <div
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  padding: '12px 0',
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? c.sidebarTextActive : c.sidebarText,
                  cursor: 'default',
                  borderBottom: `1px solid ${isActive ? c.sidebarTextActive : 'transparent'}`,
                  transition: 'all 150ms',
                }}
              >{item.label}</div>
            )
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User - minimal */}
        <div style={{
          fontSize: 13,
          color: c.sidebarText,
          borderTop: `1px solid oklch(0.25 0 0)`,
          paddingTop: 24,
        }}>
          <div style={{ fontWeight: 500, color: c.sidebarTextActive }}>Jane Miller</div>
          <div style={{ marginTop: 4 }}>jane@pulse.io</div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        overflow: 'auto',
      }}>
        {/* Header - extra bold */}
        <div>
          <h1 style={{
            fontSize: 48,
            fontWeight: 800,
            color: c.text,
            margin: 0,
            letterSpacing: -2,
            lineHeight: 1,
          }}>Dashboard</h1>
        </div>

        {/* Big number stats */}
        <div style={{
          display: 'flex',
          gap: 48,
          borderTop: `2px solid ${c.borderStrong}`,
          paddingTop: 32,
        }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              flex: 1,
              borderRight: i < stats.length - 1 ? `1px solid ${c.border}` : 'none',
              paddingRight: i < stats.length - 1 ? 48 : 0,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: c.textTertiary,
                textTransform: 'uppercase' as const,
                letterSpacing: 1.5,
                marginBottom: 12,
              }}>{s.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                {s.prefix && (
                  <span style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: c.textSecondary,
                    fontFamily: mono,
                  }}>{s.prefix}</span>
                )}
                <span style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: c.text,
                  fontFamily: mono,
                  letterSpacing: -3,
                  lineHeight: 1,
                }}>{s.value}</span>
                {s.suffix && (
                  <span style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: c.textSecondary,
                    fontFamily: mono,
                  }}>{s.suffix}</span>
                )}
              </div>
              <div style={{
                marginTop: 12,
                fontSize: 13,
                fontWeight: 600,
                color: s.positive ? c.success : c.danger,
              }}>{s.change} from last week</div>
            </div>
          ))}
        </div>

        {/* Chart with grid lines */}
        <div style={{
          borderTop: `2px solid ${c.borderStrong}`,
          paddingTop: 32,
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: c.text,
            marginBottom: 24,
            textTransform: 'uppercase' as const,
            letterSpacing: 1,
          }}>Weekly Performance</div>

          <div style={{ position: 'relative', height: 200 }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(pct => (
              <div key={pct} style={{
                position: 'absolute',
                left: 40,
                right: 0,
                top: `${100 - pct}%`,
                borderTop: `1px solid ${pct === 0 ? c.borderStrong : c.border}`,
              }}>
                <span style={{
                  position: 'absolute',
                  left: -40,
                  top: -6,
                  fontSize: 10,
                  color: c.textTertiary,
                  fontFamily: mono,
                }}>{pct}</span>
              </div>
            ))}

            {/* Bars */}
            <div style={{
              position: 'absolute',
              left: 40,
              right: 0,
              bottom: 0,
              top: 0,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 16,
            }}>
              {weekData.map(d => {
                const h = (d.value / maxVal) * 100
                return (
                  <div key={d.day} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                    <div style={{
                      width: '100%',
                      height: `${h}%`,
                      background: c.text,
                    }} />
                    <span style={{
                      marginTop: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      color: c.textTertiary,
                      textTransform: 'uppercase' as const,
                    }}>{d.day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
