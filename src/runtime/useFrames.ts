import { useState, useCallback, useEffect, useRef } from 'react'
import type { CanvasFrame } from './types'
import { relayoutFrames } from './layout'

const FRAME_GAP = 40
const STORAGE_KEY = 'bryllen:pos:'
const STORAGE_KEY_LEGACY = 'canvai:pos:'
const SERVER_ENDPOINT = 'http://localhost:4748'
// Layout version - increment to invalidate old saved positions
const LAYOUT_VERSION = 2

function frameIdsKey(frames: CanvasFrame[]): string {
  return frames.map(f => f.id).join(',')
}

interface StoredPositions {
  version: number
  positions: Record<string, { x: number; y: number }>
}

function loadPositionsLocal(key: string): Record<string, { x: number; y: number }> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + key)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Check version - ignore old positions from broken layout
      if (parsed.version === LAYOUT_VERSION) {
        return parsed.positions
      }
      // Old format or old version - clear it
      localStorage.removeItem(STORAGE_KEY + key)
    }
    // Also clear legacy keys
    localStorage.removeItem(STORAGE_KEY_LEGACY + key)
  } catch {}
  return null
}

function savePositionsLocal(key: string, frames: CanvasFrame[]) {
  if (frames.length === 0) return
  const positions: Record<string, { x: number; y: number }> = {}
  for (const f of frames) positions[f.id] = { x: f.x, y: f.y }
  try {
    const data: StoredPositions = { version: LAYOUT_VERSION, positions }
    localStorage.setItem(STORAGE_KEY + key, JSON.stringify(data))
  } catch {}
}

async function loadPositionsServer(project: string, page: string): Promise<Record<string, { x: number; y: number }> | null> {
  try {
    const res = await fetch(`${SERVER_ENDPOINT}/frame-positions?project=${encodeURIComponent(project)}&page=${encodeURIComponent(page)}`)
    const data = await res.json()
    // Check version - ignore old positions from broken layout
    if (data.version === LAYOUT_VERSION) {
      return data.positions || null
    }
    return null
  } catch {
    return null
  }
}

async function savePositionsServer(project: string, page: string, frames: CanvasFrame[]) {
  if (frames.length === 0) return
  const positions: Record<string, { x: number; y: number }> = {}
  for (const f of frames) positions[f.id] = { x: f.x, y: f.y }
  try {
    await fetch(`${SERVER_ENDPOINT}/frame-positions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, page, positions, version: LAYOUT_VERSION }),
    })
  } catch {}
}

/** Infer column count from frame x positions when gridConfig is not provided */
function inferColumns(frames: CanvasFrame[]): number {
  if (frames.length === 0) return 4
  const uniqueX = new Set(frames.map(f => Math.round(f.x)))
  return Math.max(1, uniqueX.size)
}

export interface FramePersistenceConfig {
  project: string
  page: string
}

export function useFrames(
  sourceFrames: CanvasFrame[] = [],
  gridConfig?: { columns?: number; rowHeight?: number; gap?: number },
  persistConfig?: FramePersistenceConfig,
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
  const persistConfigRef = useRef(persistConfig)
  persistConfigRef.current = persistConfig

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
    let cancelled = false

    async function load() {
      const base = sourceFramesRef.current
      let saved: Record<string, { x: number; y: number }> | null = null

      // Try server first if persist config available
      if (persistConfigRef.current?.project && persistConfigRef.current?.page) {
        saved = await loadPositionsServer(persistConfigRef.current.project, persistConfigRef.current.page)
      }

      // Fall back to localStorage
      if (!saved) {
        saved = loadPositionsLocal(sourceKey)
      }

      if (cancelled) return

      const merged = saved
        ? base.map(f => saved![f.id] ? { ...f, x: saved![f.id].x, y: saved![f.id].y } : f)
        : base

      setFrames(merged)
      measuredHeightsRef.current = {}
    }

    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey, persistConfig?.project, persistConfig?.page])

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
    window.addEventListener('bryllen:frame-resize', onFrameResize)
    return () => window.removeEventListener('bryllen:frame-resize', onFrameResize)
  }, [])

  // Persist frame positions (debounced) — server + localStorage fallback
  const persistRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    clearTimeout(persistRef.current)
    persistRef.current = setTimeout(() => {
      // Always save to localStorage as fallback
      savePositionsLocal(sourceKeyRef.current, frames)

      // Also save to server if config available
      if (persistConfigRef.current?.project && persistConfigRef.current?.page) {
        savePositionsServer(persistConfigRef.current.project, persistConfigRef.current.page, frames)
      }
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
