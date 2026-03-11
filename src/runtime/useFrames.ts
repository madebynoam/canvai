import { useState, useCallback, useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import type { CanvasFrame } from './types'
import { relayoutFrames } from './layout'

const FRAME_GAP = 40
const ORIGIN_X = 100
const ORIGIN_Y = 100
const SERVER_ENDPOINT = `http://localhost:${typeof __BRYLLEN_HTTP_PORT__ !== 'undefined' ? __BRYLLEN_HTTP_PORT__ : 4748}`

function frameIdsKey(frames: CanvasFrame[]): string {
  return frames.map(f => f.id).join(',')
}

interface ClonedFrameMapping {
  cloneId: string
  sourceId: string
}

interface SavedFrameData {
  positions: Record<string, { x: number; y: number; manuallyPositioned?: boolean }> | null
  deletedIds: string[]
  clonedFrames: ClonedFrameMapping[]
}

async function loadFrameDataServer(project: string, page: string): Promise<SavedFrameData> {
  try {
    const res = await fetch(`${SERVER_ENDPOINT}/frame-positions?project=${encodeURIComponent(project)}&page=${encodeURIComponent(page)}`)
    const data = await res.json()
    return {
      positions: data.positions || null,
      deletedIds: data.deletedIds || [],
      clonedFrames: data.clonedFrames || [],
    }
  } catch {
    return { positions: null, deletedIds: [], clonedFrames: [] }
  }
}

async function savePositionsServer(project: string, page: string, frames: CanvasFrame[], deletedIds: string[]) {
  const positions: Record<string, { x: number; y: number; manuallyPositioned?: boolean }> = {}
  for (const f of frames) positions[f.id] = { x: f.x, y: f.y, manuallyPositioned: f.manuallyPositioned }
  try {
    await fetch(`${SERVER_ENDPOINT}/frame-positions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, page, positions, deletedIds }),
    })
  } catch {}
}

async function saveClonedFrameServer(project: string, page: string, cloneId: string, sourceId: string) {
  try {
    await fetch(`${SERVER_ENDPOINT}/frame-positions/clone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, page, cloneId, sourceId }),
    })
  } catch {}
}

async function deleteFrameServer(project: string, page: string, frameId: string) {
  try {
    await fetch(`${SERVER_ENDPOINT}/frame-positions/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, page, frameId }),
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
      const registryKeys = Object.keys(components)
      console.warn(
        `[bryllen] Frame "${f.title}" (id=${f.id}) dropped: componentKey "${f.componentKey}" not found in manifest.components. ` +
        `Registry has: [${registryKeys.join(', ') || 'EMPTY'}]. ` +
        `Did you forget to add the import to manifest.ts?`
      )
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
  sourceFrames: CanvasFrame[] | undefined,
  gridConfig?: { columns?: number; rowHeight?: number; gap?: number },
  persistConfig?: FramePersistenceConfig,
  componentsRegistry?: Record<string, ComponentType<any>>,
) {
  const isDbMode = sourceFrames === undefined
  const effectiveSource = sourceFrames ?? []

  const [frames, setFrames] = useState<CanvasFrame[]>(effectiveSource)
  const measuredHeightsRef = useRef<Record<string, number>>({})
  const deletedIdsRef = useRef<Set<string>>(new Set())
  const rafRef = useRef<number>(0)
  const gridConfigRef = useRef(gridConfig)
  gridConfigRef.current = gridConfig
  const sourceFramesRef = useRef(effectiveSource)
  sourceFramesRef.current = effectiveSource
  const sourceKeyRef = useRef('')
  const effectiveConfigRef = useRef<{ columns?: number; rowHeight?: number; gap?: number }>({})
  const persistConfigRef = useRef(persistConfig)
  persistConfigRef.current = persistConfig
  const positionsLoadedRef = useRef(false)
  const componentsRegistryRef = useRef(componentsRegistry)
  componentsRegistryRef.current = componentsRegistry

  const sourceKey = isDbMode ? '__db__' : frameIdsKey(effectiveSource)
  sourceKeyRef.current = sourceKey

  // Effective grid config: use provided or infer columns from layout
  if (gridConfig) {
    effectiveConfigRef.current = gridConfig
  } else if (effectiveSource.length > 0) {
    effectiveConfigRef.current = { columns: inferColumns(effectiveSource) }
  }

  // DB mode: load frames from server, auto-register missing components, listen for SSE updates
  useEffect(() => {
    if (!isDbMode || !persistConfig?.project) return

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
      const saved = await loadFrameDataServer(project, 'canvas')
      if (cancelled) return

      deletedIdsRef.current = new Set(saved.deletedIds)
      const withPositions = saved.positions
        ? resolved.map(f => {
            const savedPos = saved.positions![f.id]
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
    }

    loadFromDb()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDbMode, persistConfig?.project])

  // DB mode: SSE listener for frame-created / frame-deleted / frame-updated
  useEffect(() => {
    if (!isDbMode || !persistConfig?.project) return

    const project = persistConfig.project
    const source = new EventSource(`${SERVER_ENDPOINT}/annotations/events?project=${encodeURIComponent(project)}`)

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'frame-created' || data.type === 'frame-deleted' || data.type === 'frame-updated') {
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
  }, [isDbMode, persistConfig?.project])

  // Sync when source frames actually change (page switch = different IDs) — manifest mode only
  useEffect(() => {
    if (isDbMode) return

    let cancelled = false
    positionsLoadedRef.current = false

    async function load() {
      const base = sourceFramesRef.current
      let saved: SavedFrameData = { positions: null, deletedIds: [], clonedFrames: [] }

      // Load from server (SQLite)
      if (persistConfigRef.current?.project && persistConfigRef.current?.page) {
        saved = await loadFrameDataServer(persistConfigRef.current.project, persistConfigRef.current.page)
      }

      if (cancelled) return

      // Store deleted IDs for future saves
      deletedIdsRef.current = new Set(saved.deletedIds)

      // Filter out deleted frames
      const filtered = base.filter(f => !deletedIdsRef.current.has(f.id))

      // Reconstruct cloned frames from saved mappings
      const clones: CanvasFrame[] = []
      for (const { cloneId, sourceId } of saved.clonedFrames) {
        if (deletedIdsRef.current.has(cloneId)) continue
        const sourceFrame = base.find(f => f.id === sourceId)
        if (sourceFrame) {
          clones.push({ ...sourceFrame, id: cloneId })
        }
      }

      const withClones = [...filtered, ...clones]

      // Only apply saved positions for frames that were MANUALLY positioned by the user.
      // Non-manual frames should use the calculated layout position to avoid stale/bad positions.
      const merged = saved.positions
        ? withClones.map(f => {
            const savedPos = saved.positions![f.id]
            if (savedPos && savedPos.manuallyPositioned) {
              return {
                ...f,
                x: savedPos.x,
                y: savedPos.y,
                manuallyPositioned: true,
              }
            }
            return f
          })
        : withClones

      setFrames(merged)
      measuredHeightsRef.current = {}
      positionsLoadedRef.current = true
    }

    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDbMode, sourceKey, persistConfig?.project, persistConfig?.page])

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
      if (config?.project && config?.page) {
        savePositionsServer(
          config.project,
          config.page,
          frames,
          Array.from(deletedIdsRef.current)
        )
      } else if (config?.project && isDbMode) {
        // DB mode: persist positions using project as page key
        savePositionsServer(
          config.project,
          'canvas',
          frames,
          Array.from(deletedIdsRef.current)
        )
      }
    }, 300)
  }, [frames, isDbMode])

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
    if (isDbMode && config?.project) {
      // DB mode: soft-delete via API
      fetch(`${SERVER_ENDPOINT}/frames/${encodeURIComponent(id)}?project=${encodeURIComponent(config.project)}`, {
        method: 'DELETE',
      }).catch(() => {})
    } else {
      deletedIdsRef.current.add(id)
      if (config?.project && config?.page) {
        deleteFrameServer(config.project, config.page, id)
      }
    }
  }, [isDbMode])

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

  // Duplicate a frame: adds in-memory immediately, persists to DB or clone mapping.
  // Returns the new frame's ID.
  const duplicateFrame = useCallback((source: CanvasFrame, x: number, y: number): string => {
    const newId = crypto.randomUUID()
    const copy = { ...source, id: newId, x, y, manuallyPositioned: true }
    // Add in-memory immediately for instant visual feedback
    setFrames(prev => [...prev, copy])
    const config = persistConfigRef.current
    if (isDbMode && config?.project) {
      // DB mode: call /frames/duplicate for independent component copy
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
    } else if (config?.project && config?.page) {
      // Manifest mode: save clone mapping + position
      saveClonedFrameServer(config.project, config.page, newId, source.id)
      savePositionsServer(config.project, config.page, [copy], Array.from(deletedIdsRef.current))
    }
    return newId
  }, [isDbMode])

  return { frames, addFrame, updateFrame, removeFrame, duplicateFrame, getNextPosition, handleResize }
}
