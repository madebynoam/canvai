import { useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Direction G — Planner Style (Todo App Inspiration)                  */
/*  Soft light theme, analog clock, calendar, rounded cards             */
/* ------------------------------------------------------------------ */

const font = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'
const mono = '"SF Mono", "Fira Code", Menlo, monospace'

/* Soft light palette */
const c = {
  bg: 'oklch(0.955 0.008 240)',
  surface: 'oklch(0.985 0.003 240)',
  surfaceAlt: 'oklch(0.965 0.006 240)',
  border: 'oklch(0.920 0.008 240)',
  borderSubtle: 'oklch(0.940 0.005 240)',
  text: 'oklch(0.25 0.01 240)',
  textSecondary: 'oklch(0.45 0.01 240)',
  textTertiary: 'oklch(0.60 0.008 240)',
  accent: 'oklch(0.55 0.12 250)',
  accentMuted: 'oklch(0.92 0.03 250)',
  tag1: 'oklch(0.70 0.12 250)',
  tag2: 'oklch(0.65 0.10 180)',
  tag3: 'oklch(0.70 0.12 60)',
}

/* Sidebar nav */
const navItems = [
  { icon: '📋', label: 'Unplanned', count: 8 },
  { icon: '📅', label: 'Planned', count: 12 },
  { icon: '✓', label: 'All', count: 20 },
]

/* Todos */
const todos = [
  { text: 'Review dashboard designs', tag: 'Hi-1', done: false },
  { text: 'Update component library', tag: 'Hi-1', done: false },
  { text: 'Schedule team sync', tag: 'Hi-2', done: true },
  { text: 'Prepare presentation', tag: 'Med', done: false },
]

/* Calendar data */
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
const today = 17

export function DashPlanner() {
  const [activeNav, setActiveNav] = useState('Unplanned')
  const [selectedDay, setSelectedDay] = useState(today)

  // Clock hands for 4:00 PM
  const hourAngle = (16 / 12) * 360 - 90
  const minuteAngle = 0 - 90

  return (
    <div style={{
      minHeight: '100%',
      overflow: 'auto',
      fontFamily: font,
      WebkitFontSmoothing: 'antialiased',
      background: c.bg,
      padding: 32,
      cursor: 'default',
      display: 'flex',
      gap: 24,
    }}>
      {/* Left sidebar */}
      <div style={{
        width: 240,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 0',
        }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: c.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
          }}>📊</div>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: c.text,
          }}>Pulse Main</span>
        </div>

        {/* Planner card */}
        <div style={{
          background: c.surface,
          borderRadius: 16,
          padding: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: c.text,
            marginBottom: 16,
          }}>Planner</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navItems.map(item => {
              const isActive = activeNav === item.label
              return (
                <div
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: isActive ? c.surfaceAlt : 'transparent',
                    cursor: 'default',
                  }}
                >
                  <span>{item.icon}</span>
                  <span style={{
                    flex: 1,
                    fontSize: 13,
                    color: isActive ? c.text : c.textSecondary,
                    fontWeight: isActive ? 500 : 400,
                  }}>{item.label}</span>
                  <span style={{
                    fontSize: 11,
                    color: c.textTertiary,
                    fontFamily: mono,
                  }}>{item.count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Clock card */}
        <div style={{
          background: c.surface,
          borderRadius: 16,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          {/* Analog clock */}
          <div style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: c.surfaceAlt,
            border: `2px solid ${c.border}`,
            position: 'relative',
            marginBottom: 16,
          }}>
            {/* Hour markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
              <div key={deg} style={{
                position: 'absolute',
                width: 2,
                height: 6,
                background: c.textTertiary,
                left: '50%',
                top: 4,
                transform: `translateX(-50%) rotate(${deg}deg)`,
                transformOrigin: '50% 46px',
                borderRadius: 1,
              }} />
            ))}
            {/* Hour hand */}
            <div style={{
              position: 'absolute',
              width: 4,
              height: 28,
              background: c.text,
              left: '50%',
              top: '50%',
              transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              transformOrigin: '50% 0%',
              borderRadius: 2,
            }} />
            {/* Minute hand */}
            <div style={{
              position: 'absolute',
              width: 2,
              height: 36,
              background: c.textSecondary,
              left: '50%',
              top: '50%',
              transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              transformOrigin: '50% 0%',
              borderRadius: 1,
            }} />
            {/* Center dot */}
            <div style={{
              position: 'absolute',
              width: 8,
              height: 8,
              background: c.accent,
              borderRadius: '50%',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }} />
          </div>

          <div style={{
            fontSize: 24,
            fontWeight: 600,
            color: c.text,
          }}>4pm</div>
          <div style={{
            fontSize: 12,
            color: c.textTertiary,
            marginTop: 4,
          }}>Wed, 17th July</div>
        </div>

        {/* Calendar card */}
        <div style={{
          background: c.surface,
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>July 2024</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: c.textTertiary, cursor: 'default' }}>‹</span>
              <span style={{ color: c.textTertiary, cursor: 'default' }}>›</span>
            </div>
          </div>

          {/* Day headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
            marginBottom: 8,
          }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} style={{
                fontSize: 9,
                color: c.textTertiary,
                textAlign: 'center',
                fontWeight: 500,
              }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 4,
          }}>
            {calendarDays.map(day => {
              const isToday = day === today
              const isSelected = day === selectedDay
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: isToday ? 600 : 400,
                    color: isSelected ? 'white' : isToday ? c.accent : c.textSecondary,
                    background: isSelected ? c.accent : 'transparent',
                    cursor: 'default',
                  }}
                >{day}</div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main content - Todos */}
      <div style={{
        flex: 1,
        background: c.surface,
        borderRadius: 20,
        padding: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 600,
            color: c.text,
            margin: 0,
          }}>Todo's</h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            color: c.textTertiary,
          }}>
            <span>📋</span>
            <span>ToDo: Unplanned</span>
          </div>
        </div>

        {/* Add todo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          background: c.surfaceAlt,
          borderRadius: 12,
          marginBottom: 20,
        }}>
          <span style={{ color: c.textTertiary }}>+</span>
          <span style={{ fontSize: 13, color: c.textTertiary }}>Add todo, press</span>
          <span style={{
            fontSize: 11,
            padding: '2px 8px',
            background: c.border,
            borderRadius: 4,
            color: c.textSecondary,
          }}>⏎ ENTER to save</span>
        </div>

        {/* Todo sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Unplanned section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 12, color: c.textTertiary }}>▼</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: c.textSecondary }}>Unplanned</span>
              <div style={{
                display: 'flex',
                gap: 4,
              }}>
                <span style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  background: c.accentMuted,
                  color: c.tag1,
                  borderRadius: 4,
                  fontWeight: 500,
                }}>Hi-1</span>
                <span style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  background: 'oklch(0.92 0.03 180)',
                  color: c.tag2,
                  borderRadius: 4,
                  fontWeight: 500,
                }}>Hi-1</span>
              </div>
            </div>

            {todos.filter(t => !t.done).map((todo, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: `1px solid ${c.borderSubtle}`,
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  border: `2px solid ${c.border}`,
                }} />
                <span style={{ flex: 1, fontSize: 13, color: c.text }}>{todo.text}</span>
                <span style={{
                  fontSize: 10,
                  padding: '3px 10px',
                  background: todo.tag === 'Hi-1' ? c.accentMuted : 'oklch(0.94 0.03 60)',
                  color: todo.tag === 'Hi-1' ? c.tag1 : c.tag3,
                  borderRadius: 4,
                  fontWeight: 500,
                }}>{todo.tag}</span>
              </div>
            ))}
          </div>

          {/* Scheduled section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 12, color: c.textTertiary }}>▶</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: c.textSecondary }}>Scheduled</span>
            </div>
          </div>

          {/* Done section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 12, color: c.textTertiary }}>▼</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: c.textSecondary }}>Done</span>
            </div>

            {todos.filter(t => t.done).map((todo, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: `1px solid ${c.borderSubtle}`,
                opacity: 0.6,
              }}>
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: 5,
                  background: c.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 10,
                }}>✓</div>
                <span style={{
                  flex: 1,
                  fontSize: 13,
                  color: c.textSecondary,
                  textDecoration: 'line-through',
                }}>{todo.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
