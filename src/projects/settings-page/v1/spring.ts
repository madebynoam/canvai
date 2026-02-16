import { useRef, useCallback } from 'react'

export const PHI = 1.618033988749895

export interface SpringConfig {
  tension: number
  friction: number
}

export const SPRING = {
  snappy:  { tension: 300, friction: 20 } as SpringConfig,
  gentle:  { tension: 170, friction: 18 } as SpringConfig,
  soft:    { tension: 120, friction: 14 } as SpringConfig,
}

export function useSpring(config: SpringConfig) {
  const state = useRef({ value: 0, velocity: 0 })
  const raf = useRef(0)

  const set = useCallback((target: number, onUpdate: (v: number) => void) => {
    cancelAnimationFrame(raf.current)
    const DT = 1 / 120
    let accum = 0
    let prev = performance.now()
    const s = state.current

    function step(now: number) {
      accum += Math.min((now - prev) / 1000, 0.064)
      prev = now
      while (accum >= DT) {
        const spring = -config.tension * (s.value - target)
        const damp = -config.friction * s.velocity
        s.velocity += (spring + damp) * DT
        s.value += s.velocity * DT
        accum -= DT
      }
      onUpdate(s.value)
      if (Math.abs(s.value - target) > 0.001 || Math.abs(s.velocity) > 0.001) {
        raf.current = requestAnimationFrame(step)
      } else {
        s.value = target
        s.velocity = 0
        onUpdate(target)
      }
    }
    raf.current = requestAnimationFrame(step)
  }, [config.tension, config.friction])

  return { state: state.current, set }
}
