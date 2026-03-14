import { useState, useCallback, useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import type { CanvasFrame } from './types'
import { relayoutFrames } from './layout'

const FRAME_GAP = 40
const ORIGIN_X = 100
const ORIGIN_Y = 100
const SERVER_ENDPOINT = `http://localhost:${typeof __BRYLLEN_HTTP_PORT__ !== 'undefined' ? __BRYLLEN_HTTP_PORT__ : 4748}`

async function savePositionsServer(project: string, page: string, frames: CanvasFrame[]) {
  const positions: Record<string, { x: number; y: number; manuallyPositioned?: boolean }> = {}
  for (const f of frames) positions[f.id] = { x: f.x, y: f.y, manuallyPositioned: f.manuallyPositioned }
  try {
    await fetch(`${SERVER_ENDPOINT}/frame-positions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, page, positions }),
    })
  } catch {}
}

interface DbFrame {
  id: string
  title: string
  componentKey: string | null
  src: string | null
  props: Record<string, unknown>
  width: number | null
  height: number | null
  sortOrder: number
}

async function loadDbFrames(project: string): Promise<DbFrame[]> {
  try {
    const res = await fetch(`${SERVER_ENDPOINT}/frames?project=${encodeURIComponent(project)}`)
    return await res.json()
  } catch {
    return []
  }
}

function resolveDbFrames(dbFrames: DbFrame[], components: Record<string, ComponentType<any>>): CanvasFrame[] {
  const resolved: CanvasFrame[] = []
  for (const f of dbFrames) {
    if (f.src) {
      resolved.push({
        type: 'image',
        id: f.id,
        title: f.title,
        src: f.src,
        x: 0,
        y: 0,
        width: f.width ?? 300,
        height: f.height ?? 300,
      })
    } else if (f.componentKey && components[f.componentKey]) {
      resolved.push({
        type: 'component',
        id: f.id,
        title: f.title,
        component: components[f.componentKey],
        componentKey: f.componentKey,
        props: f.props,
        x: 0,
        y: 0,
        width: f.width ?? 1440,
        height: f.height ?? 900,
      })
    } else if (f.componentKey) {
      // Show error placeholder instead of silently dropping unresolvable frames
      const missingKey = f.componentKey
      resolved.push({
        type: 'component',
        id: f.id,
        title: `${f.title} (missing)`,
        component: () => (
          <div style={{ padding: 40, color: '#c00', fontFamily: 'monospace', fontSize: 14 }}>
            <strong>Component not found</strong><br/>
            <code>{missingKey}</code> is registered in the database but missing from manifest.components.<br/>
            Add the import to manifest.ts or delete this frame.
          </div>
        ),
        componentKey: f.componentKey,
        props: {},
        x: 0,
        y: 0,
        width: f.width ?? 1440,
        height: f.height ?? 200,
      })
      console.warn(`[bryllen] Frame "${f.title}": componentKey "${f.componentKey}" not in registry`)
    }
  }
  return resolved
}

/** Infer column count from frame x positions when gridConfig is not provided */
function inferColumns(frames: CanvasFrame[]): number {
  if (frames.length === 0) return 4
  const uniqueX = new Set(frames.map(f => Math.round(f.x)))
  return Math.max(1, uniqueX.size)
}

/** Apply horizontal grid layout to frames that have no position (x=0, y=0) and aren't manually positioned.
 *  New frames are placed after existing positioned frames to avoid overlap. */
function applyInitialLayout(frames: CanvasFrame[], columns: number = 4): CanvasFrame[] {
  const gap = FRAME_GAP

  // Check if ALL frames need layout (fresh load) vs some are already positioned (incremental)
  const positioned = frames.filter(f => f.manuallyPositioned || (f.x !== 0 || f.y !== 0))
  const unpositioned = frames.filter(f => !f.manuallyPositioned && f.x === 0 && f.y === 0)

  if (unpositioned.length === 0) return frames

  // If ALL frames are unpositioned, do a clean grid layout
  if (positioned.length === 0) {
    let currentX = ORIGIN_X
    let currentY = ORIGIN_Y
    let colIndex = 0
    let rowMaxHeight = 0

    return frames.map(f => {
      const x = currentX
      const y = currentY
      const w = f.width || 1440
      const h = f.height || 900

      currentX += w + gap
      if (h > rowMaxHeight) rowMaxHeight = h
      colIndex++

      if (colIndex >= columns) {
        colIndex = 0
        currentX = ORIGIN_X
        currentY += rowMaxHeight + gap
        rowMaxHeight = 0
      }

      return { ...f, x, y }
    })
  }

  // Some frames already have positions — place new ones after the rightmost existing frame
  let maxRight = ORIGIN_X
  let rightY = ORIGIN_Y
  for (const f of positioned) {
    const right = f.x + (f.width || 1440)
    if (right > maxRight) {
      maxRight = right
      rightY = f.y
    }
  }

  let currentX = maxRight + gap
  const currentY = rightY

  return frames.map(f => {
    if (f.manuallyPositioned || (f.x !== 0 || f.y !== 0)) return f

    const x = currentX
    currentX += (f.width || 1440) + gap

    return { ...f, x, y: currentY }
  })
}

export interface FramePersistenceConfig {
  project: string
  page: string
}

export function useFrames(
  gridConfig?: { columns?: number; rowHeight?: number; gap?: number },
  persistConfig?: FramePersistenceConfig,
  componentsRegistry?: Record<string, ComponentType<any>>,
) {
  const [frames, setFrames] = useState<CanvasFrame[]>([])
  const measuredHeightsRef = useRef<Record<string, number>>({})
  const rafRef = useRef<number>(0)
  const gridConfigRef = useRef(gridConfig)
  gridConfigRef.current = gridConfig
  const effectiveConfigRef = useRef<{ columns?: number; rowHeight?: number; gap?: number }>({})
  const persistConfigRef = useRef(persistConfig)
  persistConfigRef.current = persistConfig
  const positionsLoadedRef = useRef(false)
  const componentsRegistryRef = useRef(componentsRegistry)
  componentsRegistryRef.current = componentsRegistry
  const initialLoadCompleteRef = useRef(false)

  // Effective grid config: use provided grid config
  if (gridConfig) {
    effectiveConfigRef.current = gridConfig
  }

  // Stable key derived from component registry — triggers re-registration when components change
  const registryKey = componentsRegistry ? Object.keys(componentsRegistry).sort().join(',') : ''

  // Load frames from server, auto-register missing components, listen for SSE updates
  useEffect(() => {
    if (!persistConfig?.project) return

    let cancelled = false

    async function autoRegisterMissingFrames(project: string, dbFrames: DbFrame[], registry: Record<string, ComponentType<any>>) {
      // Find registry keys that have no matching DB frame
      const dbComponentKeys = new Set(dbFrames.map(f => f.componentKey).filter(Boolean))
      const missing = Object.keys(registry).filter(key => !dbComponentKeys.has(key))

      if (missing.length === 0) return false

      // Auto-create DB frame records for missing components
      for (const key of missing) {
        try {
          await fetch(`${SERVER_ENDPOINT}/frames`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project,
              id: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: key.replace(/([A-Z])/g, ' $1').trim(),
              componentKey: key,
              width: 1440,
              height: 900,
            }),
          })
          console.log(`[bryllen] Auto-registered frame for "${key}" — was in manifest.components but had no DB record`)
        } catch {
          console.warn(`[bryllen] Failed to auto-register frame for "${key}"`)
        }
      }
      return true
    }

    async function loadFromDb() {
      const project = persistConfigRef.current!.project
      let dbFrames = await loadDbFrames(project)
      if (cancelled) return

      const registry = componentsRegistryRef.current ?? {}

      // Auto-register any components in the manifest that don't have DB frame records
      const didRegister = await autoRegisterMissingFrames(project, dbFrames, registry)
      if (cancelled) return

      // Re-fetch if we created new records
      if (didRegister) {
        dbFrames = await loadDbFrames(project)
        if (cancelled) return
      }

      const resolved = resolveDbFrames(dbFrames, registry)

      // Load positions from server to restore manual positions
      let savedPositions: Record<string, { x: number; y: number; manuallyPositioned?: boolean }> | null = null
      try {
        const res = await fetch(`${SERVER_ENDPOINT}/frame-positions?project=${encodeURIComponent(project)}&page=canvas`)
        const data = await res.json()
        savedPositions = data.positions || null
      } catch {}
      if (cancelled) return

      const withPositions = savedPositions
        ? resolved.map(f => {
            const savedPos = savedPositions![f.id]
            if (savedPos && savedPos.manuallyPositioned) {
              return { ...f, x: savedPos.x, y: savedPos.y, manuallyPositioned: true }
            }
            return f
          })
        : resolved

      // Apply grid layout to frames that have no position (all at 0,0)
      const columns = gridConfigRef.current?.columns || Math.min(withPositions.length, 4)
      const layouted = applyInitialLayout(withPositions, columns)

      setFrames(layouted)
      measuredHeightsRef.current = {}
      positionsLoadedRef.current = true
      initialLoadCompleteRef.current = true
    }

    initialLoadCompleteRef.current = false
    loadFromDb()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistConfig?.project, registryKey])

  // SSE listener for frame-created / frame-deleted / frame-updated
  useEffect(() => {
    if (!persistConfig?.project) return

    const project = persistConfig.project
    const source = new EventSource(`${SERVER_ENDPOINT}/annotations/events?project=${encodeURIComponent(project)}`)

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'frame-created' || data.type === 'frame-deleted' || data.type === 'frame-updated') {
          // Skip SSE events until initial load completes to avoid race conditions
          if (!initialLoadCompleteRef.current) return
          // Re-fetch all frames from DB
          loadDbFrames(project).then(dbFrames => {
            const registry = componentsRegistryRef.current ?? {}
            const resolved = resolveDbFrames(dbFrames, registry)
            setFrames(prev => {
              // Preserve existing positions (manual or previously laid out)
              const merged = resolved.map(f => {
                const existing = prev.find(p => p.id === f.id)
                if (existing) {
                  return { ...f, x: existing.x, y: existing.y, manuallyPositioned: existing.manuallyPositioned }
                }
                return f
              })
              // Apply grid layout for any new frames that landed at (0,0)
              const columns = gridConfigRef.current?.columns || Math.min(merged.length, 4)
              return applyInitialLayout(merged, columns)
            })
          })
        }
      } catch { /* ignore */ }
    }

    return () => source.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistConfig?.project])

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

  // Persist frame positions (debounced) — server only (SQLite)
  const persistRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    // Don't save until initial load completes — prevents overwriting saved positions
    if (!positionsLoadedRef.current) return
    clearTimeout(persistRef.current)
    persistRef.current = setTimeout(() => {
      const config = persistConfigRef.current
      if (config?.project) {
        // Persist positions using 'canvas' as page key
        savePositionsServer(config.project, config?.page ?? 'canvas', frames)
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
      prev.map(f => {
        if (f.id !== id) return f
        // If position changed, mark as manually positioned
        const positionChanged = ('x' in updates && updates.x !== f.x) || ('y' in updates && updates.y !== f.y)
        const updated = { ...f, ...updates } as CanvasFrame
        if (positionChanged) updated.manuallyPositioned = true
        return updated
      })
    )
  }, [])

  const removeFrame = useCallback((id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id))
    delete measuredHeightsRef.current[id]
    const config = persistConfigRef.current
    if (config?.project) {
      // Soft-delete via API
      fetch(`${SERVER_ENDPOINT}/frames/${encodeURIComponent(id)}?project=${encodeURIComponent(config.project)}`, {
        method: 'DELETE',
      }).catch(() => {})
    }
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

  // Duplicate a frame: adds in-memory immediately, persists to DB.
  // Returns the new frame's ID.
  const duplicateFrame = useCallback((source: CanvasFrame, x: number, y: number): string => {
    const newId = crypto.randomUUID()
    const copy = { ...source, id: newId, x, y, manuallyPositioned: true }
    // Add in-memory immediately for instant visual feedback
    setFrames(prev => [...prev, copy])
    const config = persistConfigRef.current
    if (config?.project) {
      // Call /frames/duplicate for independent component copy
      fetch(`${SERVER_ENDPOINT}/frames/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: config.project,
          sourceId: source.id,
          x,
          y,
        }),
      }).then(r => r.json()).then(result => {
        // Update the in-memory frame with the server-assigned ID and componentKey
        if (result?.id && result.id !== newId) {
          setFrames(prev => prev.map(f =>
            f.id === newId ? { ...f, id: result.id, componentKey: result.newComponentKey } : f
          ))
        }
      }).catch(() => {})
    }
    return newId
  }, [])

  return { frames, addFrame, updateFrame, removeFrame, duplicateFrame, getNextPosition, handleResize }
}
