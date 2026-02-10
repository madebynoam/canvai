import { useState, useCallback, useEffect, useRef } from 'react'
import type { CanvasFrame } from './types'
import { relayoutFrames } from './layout'

const FRAME_GAP = 40

function frameIdsKey(frames: CanvasFrame[]): string {
  return frames.map(f => f.id).join(',')
}

export function useFrames(
  sourceFrames: CanvasFrame[] = [],
  gridConfig?: { columns?: number; rowHeight?: number; gap?: number },
) {
  const [frames, setFrames] = useState<CanvasFrame[]>(sourceFrames)
  const measuredHeightsRef = useRef<Record<string, number>>({})
  const rafRef = useRef<number>(0)
  const gridConfigRef = useRef(gridConfig)
  gridConfigRef.current = gridConfig
  const sourceFramesRef = useRef(sourceFrames)
  sourceFramesRef.current = sourceFrames

  // Sync when source frames actually change (page switch = different IDs)
  // Using ID-based key avoids resetting on every render (layoutFrames creates new arrays)
  const sourceKey = frameIdsKey(sourceFrames)
  useEffect(() => {
    setFrames(sourceFramesRef.current)
    measuredHeightsRef.current = {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey])

  const handleResize = useCallback((id: string, height: number) => {
    const prev = measuredHeightsRef.current[id]
    if (prev != null && Math.abs(prev - height) < 1) return

    measuredHeightsRef.current[id] = height

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setFrames(current =>
        relayoutFrames(current, measuredHeightsRef.current, gridConfigRef.current)
      )
    })
  }, [])

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
