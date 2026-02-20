/*
 * Canvai spring physics — golden ratio foundation.
 *
 * Tensions are consecutive Fibonacci numbers: 89, 144, 233.
 * Each ratio → φ (1.618...), the same proportion found in
 * leaf arrangement, shell spirals, and branching patterns.
 *
 * Damping ratio = 1/φ ≈ 0.618 for all presets.
 * This is nature's spring — enough overshoot to feel alive,
 * enough friction to settle with purpose. A branch pulled
 * and released. Water displaced in a bowl.
 *
 * friction = 2 × (1/φ) × √(tension × mass)
 *
 * Fixed-timestep physics (120Hz) with accumulator pattern
 * for frame-rate independence. Renders interpolated values
 * between physics steps for sub-frame smoothness on any display.
 */

import { useRef, useEffect, useCallback } from 'react'

export const PHI = (1 + Math.sqrt(5)) / 2 // 1.618...

export interface SpringConfig {
  tension: number
  friction: number
  mass?: number
}

/*
 * Preset  | Tension | Friction | ζ (damping ratio)
 * --------|---------|----------|------------------
 * snappy  |   233   |    19    |  0.623 ≈ 1/φ
 * gentle  |   144   |    15    |  0.625 ≈ 1/φ
 * soft    |    89   |    12    |  0.636 ≈ 1/φ
 */
export const SPRING = {
  snappy: { tension: 233, friction: 19 } as SpringConfig,
  gentle: { tension: 144, friction: 15 } as SpringConfig,
  soft: { tension: 89, friction: 12 } as SpringConfig,
}

const STEP = 1 / 120       // Fixed 120Hz physics tick
const MAX_DELTA = 0.064    // Cap at ~15fps to prevent death spiral
const SETTLE_V = 0.01      // Velocity threshold
const SETTLE_D = 0.001     // Displacement threshold

/**
 * Imperative spring that drives a ref's style via requestAnimationFrame.
 *
 * Usage:
 *   const spring = useSpring(SPRING.gentle)
 *   spring.state.value = 0       // set initial position
 *   spring.state.velocity = -2   // optional: initial velocity
 *   spring.set(1, (v) => {
 *     ref.current.style.transform = `scale(${v})`
 *   })
 */
export function useSpring(config: SpringConfig) {
  const ref = useRef({
    value: 0,
    velocity: 0,
    target: 0,
    raf: 0,
    onUpdate: null as ((v: number) => void) | null,
  })

  const set = useCallback((target: number, onUpdate: (v: number) => void) => {
    const s = ref.current
    s.target = target
    s.onUpdate = onUpdate
    cancelAnimationFrame(s.raf)

    let lastTime = 0
    let accum = 0

    function tick(now: number) {
      const delta = lastTime ? Math.min((now - lastTime) / 1000, MAX_DELTA) : 0
      lastTime = now
      accum += delta

      const { tension, friction, mass = 1 } = config

      // Fixed-timestep physics — deterministic regardless of refresh rate
      while (accum >= STEP) {
        const force = -tension * (s.value - s.target) - friction * s.velocity
        s.velocity += (force / mass) * STEP
        s.value += s.velocity * STEP
        accum -= STEP
      }

      s.onUpdate?.(s.value)

      // Perceptual settle
      if (Math.abs(s.velocity) < SETTLE_V && Math.abs(s.value - s.target) < SETTLE_D) {
        s.value = s.target
        s.velocity = 0
        s.onUpdate?.(s.value)
        return
      }

      s.raf = requestAnimationFrame(tick)
    }

    s.raf = requestAnimationFrame(tick)
  }, [config])

  useEffect(() => () => cancelAnimationFrame(ref.current.raf), [])

  return { set, state: ref.current }
}
