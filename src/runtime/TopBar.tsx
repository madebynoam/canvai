import { useState, useEffect, useRef, useCallback } from 'react'
import { ProjectPicker } from './ProjectPicker'
import { IterationPills } from './IterationPills'
import { PanelLeft } from 'lucide-react'
import { useReducedMotion } from './useReducedMotion'

interface TopBarProps {
  projects: { project: string }[]
  activeProjectIndex: number
  onSelectProject: (index: number) => void
  iterations: { name: string }[]
  activeIterationIndex: number
  onSelectIteration: (index: number) => void
  pendingCount: number
  mode: 'manual' | 'watch'
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

const ACCENT = '#E8590C'
const BORDER = '#E5E7EB'
const TEXT_TERTIARY = '#9CA3AF'
const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

function SidebarIcon() {
  return <PanelLeft size={16} strokeWidth={1.5} />
}

/* ── Tiny spring for the watch pill ── */

function useWatchPillSpring(visible: boolean, reducedMotion: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const stateRef = useRef({ value: 0, velocity: 0 })

  const animate = useCallback((target: number) => {
    cancelAnimationFrame(animRef.current)

    // Reduced motion: snap to target
    if (reducedMotion) {
      stateRef.current = { value: target, velocity: 0 }
      if (ref.current) {
        ref.current.style.opacity = `${target}`
        ref.current.style.transform = `scale(${0.92 + 0.08 * target})`
      }
      return
    }

    // Golden ratio spring: tension 144, damping 1/phi
    const tension = 144
    const friction = 15
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      const s = stateRef.current
      while (accum >= DT) {
        const spring = -tension * (s.value - target)
        const damp = -friction * s.velocity
        s.velocity += (spring + damp) * DT
        s.value += s.velocity * DT
        accum -= DT
      }
      if (ref.current) {
        ref.current.style.opacity = `${Math.max(0, Math.min(1, s.value))}`
        ref.current.style.transform = `scale(${0.92 + 0.08 * Math.max(0, Math.min(1, s.value))})`
      }
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        animRef.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        if (ref.current) {
          ref.current.style.opacity = `${target}`
          ref.current.style.transform = `scale(${0.92 + 0.08 * target})`
        }
      }
    }
    animRef.current = requestAnimationFrame(step)
  }, [reducedMotion])

  useEffect(() => {
    animate(visible ? 1 : 0)
    return () => cancelAnimationFrame(animRef.current)
  }, [visible, animate])

  return ref
}

export function TopBar({
  projects,
  activeProjectIndex,
  onSelectProject,
  iterations,
  activeIterationIndex,
  onSelectIteration,
  pendingCount,
  mode,
  sidebarOpen,
  onToggleSidebar,
}: TopBarProps) {
  const reducedMotion = useReducedMotion()
  const [focused, setFocused] = useState(() => document.hasFocus())

  useEffect(() => {
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  const showWatch = mode === 'watch' && focused
  const pillRef = useWatchPillSpring(showWatch, reducedMotion)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
        padding: '0 12px',
        backgroundColor: '#FFFFFF',
        borderBottom: `1px solid ${BORDER}`,
        fontFamily: FONT,
        flexShrink: 0,
      }}
    >
      {/* Left section: sidebar toggle + project picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            width: 24,
            height: 24,
            border: 'none',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: sidebarOpen ? '#374151' : TEXT_TERTIARY,
            borderRadius: 4,
          }}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <SidebarIcon />
        </button>
        <ProjectPicker
          projects={projects}
          activeIndex={activeProjectIndex}
          onSelect={onSelectProject}
        />
      </div>

      {/* Center section: iteration pills */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '1 1 auto' }}>
        {iterations.length > 0 && (
          <IterationPills
            items={iterations.map(iter => iter.name)}
            activeIndex={activeIterationIndex}
            onSelect={onSelectIteration}
          />
        )}
      </div>

      {/* Right section — annotation UI hidden in production builds */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
        {/* Pending count */}
        {import.meta.env.DEV && pendingCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: ACCENT,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 600,
              }}
            >
              {pendingCount}
            </div>
            <span style={{ fontSize: 11, color: ACCENT, fontWeight: 500 }}>pending</span>
          </div>
        )}

        {/* Watch mode pill — springs in when watch + window focused */}
        {import.meta.env.DEV && mode === 'watch' && (
          <div
            ref={pillRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 12px',
              borderRadius: 12,
              backgroundColor: '#ECFDF5',
              fontSize: 11,
              fontWeight: 500,
              color: '#059669',
              opacity: 0,
              transform: 'scale(0.92)',
              willChange: 'opacity, transform',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 4px rgba(16, 185, 129, 0.4)',
              }}
            />
            Watch
          </div>
        )}
      </div>
    </div>
  )
}
