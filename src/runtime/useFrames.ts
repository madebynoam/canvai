import { useState, useCallback, useEffect, useRef } from 'react'
import type { CanvasFrame } from './types'
import { relayoutFrames } from './layout'

const FRAME_GAP = 40

export function useFrames(
  sourceFrames: CanvasFrame[] = [],
  gridConfig?: { columns?: number; rowHeight?: number; gap?: number },
) {
  const [frames, setFrames] = useState<CanvasFrame[]>(sourceFrames)
  const prevSourceRef = useRef(sourceFrames)
  const measuredHeightsRef = useRef<Record<string, number>>({})
  const rafRef = useRef<number>(0)

  // Sync when source frames change (e.g. page switch)
  useEffect(() => {
    if (prevSourceRef.current !== sourceFrames) {
      setFrames(sourceFrames)
      measuredHeightsRef.current = {}
      prevSourceRef.current = sourceFrames
    }
  }, [sourceFrames])

  const handleResize = useCallback((id: string, height: number) => {
    const prev = measuredHeightsRef.current[id]
    if (prev != null && Math.abs(prev - height) < 1) return

    measuredHeightsRef.current[id] = height

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setFrames(current =>
        relayoutFrames(current, measuredHeightsRef.current, gridConfig)
      )
    })
  }, [gridConfig])

  const addFrame = useCallback((frame: CanvasFrame) => {
    setFrames(prev => [...prev, frame])
  }, [])

  const updateFrame = useCallback((id: string, updates: Partial<CanvasFrame>) => {
    setFrames(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    )
  }, [])

  const removeFrame = useCallback((id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id))
    delete measuredHeightsRef.current[id]
  }, [])

  const getNextPosition = useCallback(() => {
    if (frames.length === 0) return { x: 100, y: 100 }
    const rightmost = frames.reduce((max, f) =>
      f.x + f.width > max.x + max.width ? f : max
    )
    return {
      x: rightmost.x + rightmost.width + FRAME_GAP,
      y: rightmost.y,
    }
  }, [frames])

  return { frames, addFrame, updateFrame, removeFrame, getNextPosition, handleResize }
}
