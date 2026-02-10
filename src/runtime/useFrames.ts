import { useState, useCallback, useEffect, useRef } from 'react'
import type { CanvasFrame } from './types'
import { relayoutFrames } from './layout'

const FRAME_GAP = 40
const STORAGE_KEY = 'canvai:pos:'

function frameIdsKey(frames: CanvasFrame[]): string {
  return frames.map(f => f.id).join(',')
}

function loadPositions(key: string): Record<string, { x: number; y: number }> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function savePositions(key: string, frames: CanvasFrame[]) {
  if (frames.length === 0) return
  const positions: Record<string, { x: number; y: number }> = {}
  for (const f of frames) positions[f.id] = { x: f.x, y: f.y }
  try {
    localStorage.setItem(STORAGE_KEY + key, JSON.stringify(positions))
  } catch {}
}

/** Infer column count from frame x positions when gridConfig is not provided */
function inferColumns(frames: CanvasFrame[]): number {
  if (frames.length === 0) return 4
  const uniqueX = new Set(frames.map(f => Math.round(f.x)))
  return Math.max(1, uniqueX.size)
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
  const sourceKeyRef = useRef('')
  const effectiveConfigRef = useRef<{ columns?: number; rowHeight?: number; gap?: number }>({})

  const sourceKey = frameIdsKey(sourceFrames)
  sourceKeyRef.current = sourceKey

  // Effective grid config: use provided or infer columns from layout
  if (gridConfig) {
    effectiveConfigRef.current = gridConfig
  } else if (sourceFrames.length > 0) {
    effectiveConfigRef.current = { columns: inferColumns(sourceFrames) }
  }

  // Sync when source frames actually change (page switch = different IDs)
  useEffect(() => {
    const saved = loadPositions(sourceKey)
    const base = sourceFramesRef.current
    const merged = saved
      ? base.map(f => saved[f.id] ? { ...f, x: saved[f.id].x, y: saved[f.id].y } : f)
      : base

    setFrames(merged)
    measuredHeightsRef.current = {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey])

  // Listen for frame resize events (works without onResize prop)
  useEffect(() => {
    function onFrameResize(e: Event) {
      const { id, height } = (e as CustomEvent).detail
      const prev = measuredHeightsRef.current[id]
      if (prev != null && Math.abs(prev - height) < 1) return

      measuredHeightsRef.current[id] = height

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        setFrames(current =>
          relayoutFrames(current, measuredHeightsRef.current, effectiveConfigRef.current)
        )
      })
    }
    window.addEventListener('canvai:frame-resize', onFrameResize)
    return () => window.removeEventListener('canvai:frame-resize', onFrameResize)
  }, [])

  // Persist frame positions to localStorage (debounced)
  const persistRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    clearTimeout(persistRef.current)
    persistRef.current = setTimeout(() => {
      savePositions(sourceKeyRef.current, frames)
    }, 300)
  }, [frames])

  // handleResize kept for backward compat (consumers passing onResize prop)
  const handleResize = useCallback((id: string, height: number) => {
    const prev = measuredHeightsRef.current[id]
    if (prev != null && Math.abs(prev - height) < 1) return

    measuredHeightsRef.current[id] = height

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      setFrames(current =>
        relayoutFrames(current, measuredHeightsRef.current, effectiveConfigRef.current)
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
