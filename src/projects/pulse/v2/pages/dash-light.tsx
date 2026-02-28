import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Direction A — Light Sidebar Dashboard (Linear / Notion)            */
/* ------------------------------------------------------------------ */

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

/* Palette */
const c = {
  bg: 'oklch(0.985 0 90)',
  surface: 'oklch(0.997 0.002 80)',
  sidebar: 'oklch(0.975 0.002 80)',
  sidebarActive: 'oklch(0.955 0.003 80)',
  border: 'oklch(0.910 0.005 80)',
  borderSubtle: 'oklch(0.940 0.004 80)',
  text: 'oklch(0.180 0.005 80)',
  textSecondary: 'oklch(0.380 0.005 80)',
  textTertiary: 'oklch(0.540 0.005 80)',
  accent: 'oklch(0.480 0.12 260)',
  accentMuted: 'oklch(0.920 0.03 260)',
  success: 'oklch(0.520 0.14 155)',
  successMuted: 'oklch(0.940 0.04 155)',
  danger: 'oklch(0.520 0.14 25)',
  dangerMuted: 'oklch(0.940 0.04 25)',
}

/* Nav items */
const navItems = [
  { label: 'Dashboard', active: true },
  { label: 'Analytics', active: false },
  { label: 'Customers', active: false },
  { label: 'Products', active: false },
  { label: 'Settings', active: false },
]

/* Stat data */
const stats = [
  { label: 'Revenue', value: '$52,430', change: '+12.5%', positive: true },
  { label: 'Active Users', value: '3,284', change: '+8.2%', positive: true },
  { label: 'Sessions', value: '18.9K', change: '-2.1%', positive: false },
  { label: 'Conversion', value: '4.3%', change: '+0.7%', positive: true },
]

/* Bar chart data */
const bars = [
  { label: 'Mon', value: 72 },
  { label: 'Tue', value: 88 },
  { label: 'Wed', value: 65 },
  { label: 'Thu', value: 94 },
  { label: 'Fri', value: 80 },
  { label: 'Sat', value: 48 },
  { label: 'Sun', value: 76 },
]

export function DashLight() {
  const [activeNav] = useState('Dashboard')

  const maxBar = Math.max(...bars.map(b => b.value))

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
      {/* Sidebar */}
      <div style={{
        width: 200,
        height: '100%',
        minHeight: 900,
        background: c.sidebar,
        borderRight: `1px solid ${c.border}`,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        flexShrink: 0,
        boxSizing: 'border-box' as const,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 8px',
          marginBottom: 20,
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            background: c.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="3" fill="oklch(0.97 0.003 80)" />
            </svg>
          </div>
          <span style={{
            fontSize: 14,
            fontWeight: 600,
            color: c.text,
            letterSpacing: -0.3,
            textWrap: 'pretty' as any,
          }}>Pulse</span>
        </div>

        {/* Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => {
            const isActive = activeNav === item.label
            return (
              <div key={item.label} style={{
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? c.text : c.textSecondary,
                background: isActive ? c.sidebarActive : 'transparent',
                cursor: 'default',
                textWrap: 'pretty' as any,
              }}>{item.label}</div>
            )
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 8px',
          borderTop: `1px solid ${c.border}`,
        }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 20,
            background: c.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: 'oklch(0.97 0.003 80)',
          }}>JM</div>
          <span style={{
            fontSize: 13,
            color: c.text,
            fontWeight: 500,
            textWrap: 'pretty' as any,
          }}>Jane Miller</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        overflow: 'auto',
      }}>
        {/* Header */}
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            color: c.text,
            margin: 0,
            letterSpacing: -0.5,
            textWrap: 'pretty' as any,
          }}>Dashboard</h1>
          <p style={{
            fontSize: 13,
            color: c.textSecondary,
            margin: 0,
            marginTop: 4,
            textWrap: 'pretty' as any,
          }}>Welcome back, Jane. Here is what is happening today.</p>
        </div>

        {/* Stat cards — 2x2 grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              padding: 24,
              cursor: 'default',
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 500,
                color: c.textTertiary,
                textTransform: 'uppercase' as const,
                letterSpacing: 0.5,
                marginBottom: 8,
                textWrap: 'pretty' as any,
              }}>{s.label}</div>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
              }}>
                <span style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: c.text,
                  fontFamily: mono,
                  letterSpacing: -0.5,
                  textWrap: 'pretty' as any,
                }}>{s.value}</span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: s.positive ? c.success : c.danger,
                  background: s.positive ? c.successMuted : c.dangerMuted,
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontFamily: mono,
                  textWrap: 'pretty' as any,
                }}>{s.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: 24,
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: c.text,
            marginBottom: 4,
            textWrap: 'pretty' as any,
          }}>Weekly Revenue</div>
          <div style={{
            fontSize: 12,
            color: c.textTertiary,
            marginBottom: 24,
            textWrap: 'pretty' as any,
          }}>Revenue per day for the last 7 days</div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            height: 180,
          }}>
            {bars.map(b => {
              const h = (b.value / maxBar) * 160
              return (
                <div key={b.label} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{
                    width: '100%',
                    height: h,
                    borderRadius: '6px 6px 0 0',
                    background: c.accent,
                    opacity: 0.85,
                  }} />
                  <span style={{
                    fontSize: 11,
                    color: c.textTertiary,
                    textWrap: 'pretty' as any,
                  }}>{b.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
