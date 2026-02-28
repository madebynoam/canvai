import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Direction C — Ultra Minimal Dashboard (Stripe / Mercury)           */
/* ------------------------------------------------------------------ */

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

/* Palette */
const c = {
  bg: 'oklch(0.980 0.003 80)',
  surface: 'oklch(0.993 0.003 80)',
  border: 'oklch(0.920 0.005 80)',
  text: 'oklch(0.180 0.005 80)',
  textSecondary: 'oklch(0.420 0.005 80)',
  textTertiary: 'oklch(0.580 0.005 80)',
  accent: 'oklch(0.380 0.12 260)',
  accentLight: 'oklch(0.920 0.04 260)',
  success: 'oklch(0.520 0.14 155)',
  successMuted: 'oklch(0.955 0.03 155)',
  chartStart: 'oklch(0.700 0.08 260)',
  chartEnd: 'oklch(0.940 0.03 260)',
}

/* Metric pills */
const pills = [
  { label: 'New Users', value: '1,284', change: '+14%', positive: true },
  { label: 'MRR', value: '$18.4K', change: '+8%', positive: true },
  { label: 'Churn', value: '1.2%', change: '-0.3%', positive: true },
]

/* Area chart points (simulated with bars for clean rendering) */
const areaPoints = [
  28, 32, 35, 30, 38, 42, 40, 45, 48, 43, 50, 55, 52, 58, 62, 60, 65, 70,
  68, 72, 75, 78, 76, 80, 84, 82, 88, 85, 90, 92,
]

export function DashMinimal() {
  const [_] = useState(0) // satisfy useState import requirement

  const maxArea = Math.max(...areaPoints)

  return (
    <div style={{
      minHeight: '100%',
      overflow: 'auto',
      fontFamily: font,
      WebkitFontSmoothing: 'antialiased',
      background: c.bg,
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Minimal top header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 80px',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 14,
          fontWeight: 600,
          color: c.text,
          letterSpacing: -0.3,
          textWrap: 'pretty' as any,
        }}>Pulse</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <span style={{
            fontSize: 12,
            color: c.textTertiary,
            textWrap: 'pretty' as any,
          }}>February 2026</span>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 20,
            background: c.border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: c.textSecondary,
          }}>JM</div>
        </div>
      </div>

      {/* Main content — generous margins */}
      <div style={{
        flex: 1,
        padding: '40px 80px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        maxWidth: 960,
        width: '100%',
        boxSizing: 'border-box' as const,
      }}>
        {/* Hero number */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: c.textTertiary,
            textTransform: 'uppercase' as const,
            letterSpacing: 1,
            textWrap: 'pretty' as any,
          }}>Total Revenue</span>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
          }}>
            <span style={{
              fontSize: 48,
              fontWeight: 300,
              color: c.text,
              fontFamily: mono,
              letterSpacing: -2,
              lineHeight: 1,
              textWrap: 'pretty' as any,
            }}>$42,380</span>
            <span style={{
              fontSize: 13,
              fontWeight: 500,
              color: c.success,
              background: c.successMuted,
              padding: '4px 12px',
              borderRadius: 20,
              fontFamily: mono,
              textWrap: 'pretty' as any,
            }}>+12.4%</span>
          </div>
          <span style={{
            fontSize: 13,
            color: c.textTertiary,
            marginTop: 4,
            textWrap: 'pretty' as any,
          }}>Compared to $37,680 last month</span>
        </div>

        {/* Metric pills */}
        <div style={{
          display: 'flex',
          gap: 12,
        }}>
          {pills.map(p => (
            <div key={p.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 20px',
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              cursor: 'default',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: 11,
                  color: c.textTertiary,
                  fontWeight: 400,
                  textWrap: 'pretty' as any,
                }}>{p.label}</span>
                <span style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: c.text,
                  fontFamily: mono,
                  letterSpacing: -0.5,
                  textWrap: 'pretty' as any,
                }}>{p.value}</span>
              </div>
              <span style={{
                fontSize: 11,
                fontWeight: 500,
                color: c.success,
                fontFamily: mono,
                textWrap: 'pretty' as any,
              }}>{p.change}</span>
            </div>
          ))}
        </div>

        {/* Area chart — simulated with gradient bars */}
        <div style={{
          flex: 1,
          minHeight: 280,
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <span style={{
              fontSize: 13,
              fontWeight: 500,
              color: c.textSecondary,
              textWrap: 'pretty' as any,
            }}>Revenue over time</span>
            <div style={{ display: 'flex', gap: 16 }}>
              {['1W', '1M', '3M', '1Y'].map((period, i) => (
                <span key={period} style={{
                  fontSize: 11,
                  fontWeight: i === 1 ? 500 : 400,
                  color: i === 1 ? c.text : c.textTertiary,
                  cursor: 'default',
                  textWrap: 'pretty' as any,
                }}>{period}</span>
              ))}
            </div>
          </div>

          {/* Chart area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 2,
            position: 'relative',
          }}>
            {/* Subtle horizontal gridlines */}
            {[0.25, 0.5, 0.75].map(pct => (
              <div key={pct} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: `${pct * 100}%`,
                borderBottom: `1px solid ${c.border}`,
                opacity: 0.5,
              }} />
            ))}

            {areaPoints.map((v, i) => {
              const h = (v / maxArea) * 100
              const progress = i / (areaPoints.length - 1)
              return (
                <div key={i} style={{
                  flex: 1,
                  height: `${h}%`,
                  background: `linear-gradient(180deg, ${c.chartStart}, ${c.chartEnd})`,
                  borderRadius: i === 0 ? '2px 0 0 0' : i === areaPoints.length - 1 ? '0 2px 0 0' : '0',
                  opacity: 0.4 + progress * 0.6,
                }} />
              )
            })}
          </div>

          {/* X-axis labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
            {['Feb 1', 'Feb 8', 'Feb 15', 'Feb 22'].map(d => (
              <span key={d} style={{
                fontSize: 10,
                color: c.textTertiary,
                fontFamily: mono,
                textWrap: 'pretty' as any,
              }}>{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
