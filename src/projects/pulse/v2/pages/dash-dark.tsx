import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Direction B — Dark Dense Dashboard (Vercel / Grafana)              */
/* ------------------------------------------------------------------ */

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

/* Palette */
const c = {
  bg: 'oklch(0.130 0.005 80)',
  surface: 'oklch(0.175 0.005 80)',
  surfaceRaised: 'oklch(0.210 0.005 80)',
  border: 'oklch(0.240 0.005 80)',
  borderSubtle: 'oklch(0.200 0.005 80)',
  text: 'oklch(0.930 0.003 80)',
  textSecondary: 'oklch(0.650 0.005 80)',
  textTertiary: 'oklch(0.480 0.005 80)',
  green: 'oklch(0.55 0.14 155)',
  greenMuted: 'oklch(0.22 0.04 155)',
  red: 'oklch(0.55 0.14 25)',
  redMuted: 'oklch(0.22 0.04 25)',
  accent: 'oklch(0.55 0.14 155)',
  rowEven: 'oklch(0.155 0.005 80)',
  rowOdd: 'oklch(0.145 0.005 80)',
}

/* Tabs */
const tabs = ['Overview', 'Analytics', 'Reports', 'Logs', 'Alerts']

/* Metrics */
const metrics = [
  { label: 'Total Revenue', value: '$127,480', change: '+18.3%', positive: true, spark: [40, 55, 48, 62, 70, 65, 78] },
  { label: 'Monthly Users', value: '84,291', change: '+12.1%', positive: true, spark: [30, 35, 42, 38, 50, 55, 60] },
  { label: 'Requests/min', value: '2,847', change: '+4.7%', positive: true, spark: [60, 55, 70, 65, 72, 68, 75] },
  { label: 'Error Rate', value: '0.12%', change: '-0.03%', positive: true, spark: [20, 18, 22, 15, 12, 14, 10] },
  { label: 'Avg. Latency', value: '142ms', change: '+8ms', positive: false, spark: [50, 52, 48, 55, 58, 54, 60] },
  { label: 'Uptime', value: '99.98%', change: '+0.01%', positive: true, spark: [95, 96, 95, 97, 96, 98, 98] },
]

/* Table rows */
const tableRows = [
  { endpoint: '/api/v2/users', method: 'GET', status: '200', latency: '45ms', requests: '12,480', error: '0.02%' },
  { endpoint: '/api/v2/analytics', method: 'POST', status: '200', latency: '128ms', requests: '8,312', error: '0.08%' },
  { endpoint: '/api/v2/billing', method: 'GET', status: '200', latency: '67ms', requests: '4,891', error: '0.01%' },
  { endpoint: '/api/v2/webhooks', method: 'POST', status: '201', latency: '312ms', requests: '2,104', error: '0.24%' },
  { endpoint: '/api/v2/search', method: 'GET', status: '200', latency: '89ms', requests: '6,723', error: '0.05%' },
]

/* Mini sparkline */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const h = 24
  const w = 56
  const step = w / (data.length - 1)

  return (
    <div style={{ width: w, height: h, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: (v / max) * h,
          borderRadius: '2px 2px 0 0',
          background: color,
          opacity: 0.5 + (i / data.length) * 0.5,
        }} />
      ))}
    </div>
  )
}

export function DashDark() {
  const [activeTab] = useState('Overview')

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
      {/* Top nav bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 48,
        borderBottom: `1px solid ${c.border}`,
        background: c.surface,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: c.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5L5 2L8 5L5 8Z" fill="oklch(0.130 0.005 80)" />
              </svg>
            </div>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: c.text,
              letterSpacing: -0.3,
              textWrap: 'pretty' as any,
            }}>Pulse</span>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab
              return (
                <div key={tab} style={{
                  padding: '12px 12px',
                  fontSize: 12,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? c.text : c.textTertiary,
                  borderBottom: isActive ? `2px solid ${c.green}` : '2px solid transparent',
                  cursor: 'default',
                  textWrap: 'pretty' as any,
                }}>{tab}</div>
              )
            })}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 11,
            color: c.textTertiary,
            fontFamily: mono,
            textWrap: 'pretty' as any,
          }}>Last updated: 2m ago</span>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: c.green,
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        overflow: 'auto',
      }}>
        {/* Metric cards — 3x2 grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
        }}>
          {metrics.map(m => (
            <div key={m.label} style={{
              background: c.surface,
              border: `1px solid ${c.borderSubtle}`,
              borderRadius: 8,
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              cursor: 'default',
            }}>
              <div>
                <div style={{
                  fontSize: 11,
                  color: c.textTertiary,
                  fontWeight: 400,
                  marginBottom: 4,
                  textWrap: 'pretty' as any,
                }}>{m.label}</div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: c.text,
                  fontFamily: mono,
                  letterSpacing: -0.5,
                  marginBottom: 4,
                  textWrap: 'pretty' as any,
                }}>{m.value}</div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: m.positive ? c.green : c.red,
                  fontFamily: mono,
                  textWrap: 'pretty' as any,
                }}>{m.change}</span>
              </div>
              <Sparkline data={m.spark} color={m.positive ? c.green : c.red} />
            </div>
          ))}
        </div>

        {/* Data table */}
        <div style={{
          background: c.surface,
          border: `1px solid ${c.borderSubtle}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          {/* Table header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${c.border}`,
          }}>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: c.text,
              textWrap: 'pretty' as any,
            }}>API Endpoints</span>
            <span style={{
              fontSize: 11,
              color: c.textTertiary,
              fontFamily: mono,
              textWrap: 'pretty' as any,
            }}>Last 24h</span>
          </div>

          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 0.7fr 0.6fr 0.8fr 1fr 0.8fr',
            padding: '8px 16px',
            borderBottom: `1px solid ${c.borderSubtle}`,
            gap: 8,
          }}>
            {['Endpoint', 'Method', 'Status', 'Latency', 'Requests', 'Error %'].map(h => (
              <span key={h} style={{
                fontSize: 10,
                fontWeight: 500,
                color: c.textTertiary,
                textTransform: 'uppercase' as const,
                letterSpacing: 0.5,
                textWrap: 'pretty' as any,
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {tableRows.map((row, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 0.7fr 0.6fr 0.8fr 1fr 0.8fr',
              padding: '10px 16px',
              background: i % 2 === 0 ? c.rowEven : c.rowOdd,
              gap: 8,
              cursor: 'default',
            }}>
              <span style={{
                fontSize: 12,
                color: c.text,
                fontFamily: mono,
                fontWeight: 400,
                textWrap: 'pretty' as any,
              }}>{row.endpoint}</span>
              <span style={{
                fontSize: 11,
                color: row.method === 'POST' ? 'oklch(0.55 0.12 260)' : c.green,
                fontFamily: mono,
                fontWeight: 500,
                textWrap: 'pretty' as any,
              }}>{row.method}</span>
              <span style={{
                fontSize: 11,
                color: c.green,
                fontFamily: mono,
                textWrap: 'pretty' as any,
              }}>{row.status}</span>
              <span style={{
                fontSize: 11,
                color: c.textSecondary,
                fontFamily: mono,
                textWrap: 'pretty' as any,
              }}>{row.latency}</span>
              <span style={{
                fontSize: 11,
                color: c.textSecondary,
                fontFamily: mono,
                textWrap: 'pretty' as any,
              }}>{row.requests}</span>
              <span style={{
                fontSize: 11,
                color: parseFloat(row.error) > 0.1 ? c.red : c.textTertiary,
                fontFamily: mono,
                textWrap: 'pretty' as any,
              }}>{row.error}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
