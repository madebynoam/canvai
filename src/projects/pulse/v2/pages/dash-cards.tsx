import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Direction F — Dark Cards (Analytics Dashboard Inspiration)          */
/*  Dark theme, blue/purple accent, cards with illustrations, big stats */
/* ------------------------------------------------------------------ */

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

/* Dark palette with blue accent */
const c = {
  bg: 'oklch(0.16 0.01 260)',
  surface: 'oklch(0.20 0.015 260)',
  surfaceHover: 'oklch(0.24 0.018 260)',
  border: 'oklch(0.28 0.02 260)',
  text: 'oklch(0.96 0 0)',
  textSecondary: 'oklch(0.70 0.01 260)',
  textTertiary: 'oklch(0.50 0.01 260)',
  accent: 'oklch(0.58 0.20 265)', // Blue/purple
  accentMuted: 'oklch(0.30 0.10 265)',
  success: 'oklch(0.65 0.18 155)',
  warning: 'oklch(0.70 0.16 80)',
  danger: 'oklch(0.60 0.18 25)',
}

/* Big stats */
const mainStats = [
  { label: 'Total Sales', value: '15,984.12', prefix: '$', icon: '📊' },
  { label: 'Orders', value: '246', prefix: '', icon: '📦' },
  { label: 'Visitors', value: '8.4K', prefix: '', icon: '👥' },
]

/* Delivery breakdown */
const deliveryStats = [
  { label: 'Delivery', value: '$4,549.05', pct: 55 },
  { label: 'Pickup', value: '$3,438.94', pct: 35 },
  { label: 'Other', value: '$2,327.83', pct: 10 },
]

/* Task list */
const tasks = [
  { label: 'Connect delivery partners', done: true },
  { label: 'Setup menu', done: true },
  { label: 'Add team members', done: false },
  { label: 'Setup order management', done: false },
]

/* Bar chart data */
const chartData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 58 },
  { month: 'Mar', value: 42 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 62 },
  { month: 'Jun', value: 88 },
]

export function DashCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const maxChart = Math.max(...chartData.map(d => d.value))

  return (
    <div style={{
      minHeight: '100%',
      overflow: 'auto',
      fontFamily: font,
      WebkitFontSmoothing: 'antialiased',
      background: c.bg,
      padding: 32,
      cursor: 'default',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: c.text,
            margin: 0,
            letterSpacing: -0.5,
          }}>Dashboard</h1>
          <p style={{
            fontSize: 14,
            color: c.textSecondary,
            margin: 0,
            marginTop: 4,
          }}>Track your business performance</p>
        </div>
        <div style={{
          padding: '10px 20px',
          background: c.accent,
          borderRadius: 8,
          color: c.text,
          fontSize: 13,
          fontWeight: 600,
        }}>View Report</div>
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 0.8fr',
        gridTemplateRows: 'auto auto',
        gap: 20,
      }}>
        {/* Big stat card - spans 2 columns */}
        <div style={{
          gridColumn: '1 / 3',
          background: c.surface,
          borderRadius: 16,
          padding: 28,
          display: 'flex',
          gap: 32,
        }}>
          {mainStats.map((stat, i) => (
            <div key={stat.label} style={{
              flex: 1,
              borderRight: i < mainStats.length - 1 ? `1px solid ${c.border}` : 'none',
              paddingRight: i < mainStats.length - 1 ? 32 : 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 18 }}>{stat.icon}</span>
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: c.textSecondary,
                  textTransform: 'uppercase' as const,
                  letterSpacing: 0.5,
                }}>{stat.label}</span>
              </div>
              <div style={{
                fontSize: 36,
                fontWeight: 700,
                color: c.text,
                fontFamily: mono,
                letterSpacing: -1,
              }}>
                {stat.prefix && <span style={{ color: c.textSecondary }}>{stat.prefix}</span>}
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Delivery breakdown card */}
        <div style={{
          background: c.surface,
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 600,
            color: c.text,
            marginBottom: 20,
          }}>Revenue by Channel</div>

          {/* Donut placeholder */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `conic-gradient(${c.accent} 0% 55%, oklch(0.50 0.15 265) 55% 90%, oklch(0.40 0.10 265) 90% 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: c.surface,
              }} />
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {deliveryStats.map((s, i) => (
              <div key={s.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: i === 0 ? c.accent : i === 1 ? 'oklch(0.50 0.15 265)' : 'oklch(0.40 0.10 265)',
                  }} />
                  <span style={{ color: c.textSecondary }}>{s.label}</span>
                </div>
                <span style={{ color: c.text, fontFamily: mono }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart card */}
        <div style={{
          gridColumn: '1 / 2',
          background: c.surface,
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Cancellations</div>
              <div style={{ fontSize: 12, color: c.textSecondary, marginTop: 4 }}>
                Rate <span style={{ color: c.success }}>0.84%</span> · Sales <span style={{ color: c.danger }}>-$1,912.50</span>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            height: 120,
          }}>
            {chartData.map(d => {
              const h = (d.value / maxChart) * 100
              return (
                <div key={d.month} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{
                    width: '100%',
                    height: `${h}%`,
                    borderRadius: 4,
                    background: c.accent,
                  }} />
                  <span style={{
                    fontSize: 10,
                    color: c.textTertiary,
                  }}>{d.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tasks card */}
        <div style={{
          background: c.surface,
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>
              {tasks.filter(t => t.done).length} Tasks
            </div>
            <div style={{
              fontSize: 12,
              color: c.textSecondary,
            }}>Setup</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tasks.map(t => (
              <div
                key={t.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  background: t.done ? c.accentMuted : 'transparent',
                  borderRadius: 8,
                  border: `1px solid ${t.done ? c.accent : c.border}`,
                }}
              >
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: `2px solid ${t.done ? c.accent : c.border}`,
                  background: t.done ? c.accent : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  color: c.text,
                }}>
                  {t.done && '✓'}
                </div>
                <span style={{
                  fontSize: 13,
                  color: t.done ? c.text : c.textSecondary,
                  textDecoration: t.done ? 'none' : 'none',
                }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating card */}
        <div style={{
          background: c.surface,
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center' as const,
        }}>
          <div style={{
            fontSize: 48,
            fontWeight: 700,
            color: c.text,
            fontFamily: mono,
          }}>4.9</div>
          <div style={{
            fontSize: 16,
            marginTop: 4,
            marginBottom: 8,
          }}>⭐⭐⭐⭐⭐</div>
          <div style={{
            fontSize: 12,
            color: c.textSecondary,
          }}>Average Rating</div>

          <div style={{
            marginTop: 16,
            padding: '8px 16px',
            background: c.accentMuted,
            borderRadius: 20,
            fontSize: 24,
            fontWeight: 700,
            color: c.accent,
            fontFamily: mono,
          }}>80%</div>
          <div style={{
            fontSize: 11,
            color: c.textTertiary,
            marginTop: 4,
          }}>Positions Filled</div>
        </div>
      </div>
    </div>
  )
}
