import Database from 'better-sqlite3'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from 'fs'
import { join } from 'path'

let db = null
let storeDir = null

/**
 * Initialize the SQLite database.
 * Creates tables if they don't exist and migrates old JSON files.
 */
export function initDb(bryllenDir) {
  storeDir = bryllenDir
  if (!existsSync(bryllenDir)) {
    mkdirSync(bryllenDir, { recursive: true })
  }

  const dbPath = join(bryllenDir, 'bryllen.db')
  db = new Database(dbPath)

  // Enable WAL mode for better concurrency
  db.pragma('journal_mode = WAL')

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS frame_positions (
      project TEXT NOT NULL,
      page TEXT NOT NULL,
      frame_id TEXT NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      manually_positioned INTEGER DEFAULT 0,
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (project, page, frame_id)
    );

    CREATE TABLE IF NOT EXISTS context_positions (
      project TEXT NOT NULL,
      iteration TEXT NOT NULL,
      page TEXT,
      filename TEXT NOT NULL,
      x REAL NOT NULL,
      y REAL NOT NULL,
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (project, iteration, page, filename)
    );

    CREATE TABLE IF NOT EXISTS viewports (
      project TEXT NOT NULL,
      page TEXT NOT NULL,
      pan_x REAL NOT NULL DEFAULT 0,
      pan_y REAL NOT NULL DEFAULT 0,
      zoom REAL NOT NULL DEFAULT 1,
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (project, page)
    );

    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS frame_status (
      project TEXT NOT NULL,
      frame_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'none',
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (project, frame_id)
    );

    CREATE TABLE IF NOT EXISTS frames (
      id TEXT NOT NULL,
      project TEXT NOT NULL,
      title TEXT NOT NULL,
      component_key TEXT,
      src TEXT,
      props TEXT DEFAULT '{}',
      width INTEGER,
      height INTEGER,
      sort_order INTEGER DEFAULT 0,
      deleted_at INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (project, id)
    );

    CREATE TABLE IF NOT EXISTS stickies (
      id TEXT NOT NULL,
      project TEXT NOT NULL,
      parent_frame_id TEXT NOT NULL,
      content TEXT NOT NULL,
      offset_x REAL NOT NULL DEFAULT 0,
      offset_y REAL NOT NULL DEFAULT -40,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      PRIMARY KEY (project, id)
    );

    CREATE INDEX IF NOT EXISTS idx_stickies_project
      ON stickies(project);

    CREATE INDEX IF NOT EXISTS idx_stickies_parent_frame
      ON stickies(project, parent_frame_id);

    CREATE INDEX IF NOT EXISTS idx_frames_project
      ON frames(project, deleted_at);

    CREATE INDEX IF NOT EXISTS idx_frame_positions_project_page
      ON frame_positions(project, page);
    CREATE INDEX IF NOT EXISTS idx_context_positions_project
      ON context_positions(project, iteration);
    CREATE INDEX IF NOT EXISTS idx_frame_status_project
      ON frame_status(project);
  `)

  // Add manually_positioned column if it doesn't exist (migration for existing DBs)
  try {
    db.exec(`ALTER TABLE frame_positions ADD COLUMN manually_positioned INTEGER DEFAULT 0`)
  } catch {
    // Column already exists, ignore
  }

  // Migrate old JSON files if they exist
  migrateOldData(bryllenDir)

  return db
}

/**
 * Get the database instance.
 */
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }
  return db
}

// ─── Frame Positions ─────────────────────────────────────────────────────────

export function getFramePositions(project, page) {
  const rows = getDb().prepare(`
    SELECT frame_id, x, y, manually_positioned FROM frame_positions
    WHERE project = ? AND page = ?
  `).all(project, page)

  if (rows.length === 0) return null

  const positions = {}
  for (const row of rows) {
    positions[row.frame_id] = {
      x: row.x,
      y: row.y,
      manuallyPositioned: row.manually_positioned === 1,
    }
  }
  return positions
}

export function saveFramePositions(project, page, positions) {
  const db = getDb()
  const upsert = db.prepare(`
    INSERT INTO frame_positions (project, page, frame_id, x, y, manually_positioned, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
    ON CONFLICT(project, page, frame_id) DO UPDATE SET
      x = excluded.x,
      y = excluded.y,
      manually_positioned = excluded.manually_positioned,
      updated_at = excluded.updated_at
  `)

  const transaction = db.transaction(() => {
    for (const [frameId, pos] of Object.entries(positions)) {
      upsert.run(project, page, frameId, pos.x, pos.y, pos.manuallyPositioned ? 1 : 0)
    }
  })
  transaction()
}

export function clearFramePositions(project, page) {
  getDb().prepare(`
    DELETE FROM frame_positions WHERE project = ? AND page = ?
  `).run(project, page)
}

// ─── Context Positions ───────────────────────────────────────────────────────

export function getContextPositions(project, iteration, page) {
  const pageVal = page || ''
  const rows = getDb().prepare(`
    SELECT filename, x, y FROM context_positions
    WHERE project = ? AND iteration = ? AND (page = ? OR page IS NULL)
  `).all(project, iteration, pageVal)

  if (rows.length === 0) return null

  const positions = {}
  for (const row of rows) {
    positions[row.filename] = { x: row.x, y: row.y }
  }
  return positions
}

export function saveContextPositions(project, iteration, page, positions) {
  const db = getDb()
  const pageVal = page || ''
  const upsert = db.prepare(`
    INSERT INTO context_positions (project, iteration, page, filename, x, y, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, strftime('%s', 'now'))
    ON CONFLICT(project, iteration, page, filename) DO UPDATE SET
      x = excluded.x,
      y = excluded.y,
      updated_at = excluded.updated_at
  `)

  const transaction = db.transaction(() => {
    for (const [filename, pos] of Object.entries(positions)) {
      upsert.run(project, iteration, pageVal, filename, pos.x, pos.y)
    }
  })
  transaction()
}

// ─── Viewports ───────────────────────────────────────────────────────────────

export function getViewport(project, page) {
  return getDb().prepare(`
    SELECT pan_x, pan_y, zoom FROM viewports
    WHERE project = ? AND page = ?
  `).get(project, page) || null
}

export function saveViewport(project, page, panX, panY, zoom) {
  getDb().prepare(`
    INSERT INTO viewports (project, page, pan_x, pan_y, zoom, updated_at)
    VALUES (?, ?, ?, ?, ?, strftime('%s', 'now'))
    ON CONFLICT(project, page) DO UPDATE SET
      pan_x = excluded.pan_x,
      pan_y = excluded.pan_y,
      zoom = excluded.zoom,
      updated_at = excluded.updated_at
  `).run(project, page, panX, panY, zoom)
}

// ─── Frame Status ─────────────────────────────────────────────────────────────

export function getFrameStatuses(project) {
  const rows = getDb().prepare(`
    SELECT frame_id, status FROM frame_status
    WHERE project = ?
  `).all(project)

  if (rows.length === 0) return {}

  const statuses = {}
  for (const row of rows) {
    statuses[row.frame_id] = row.status
  }
  return statuses
}

export function getFrameStatus(project, frameId) {
  const row = getDb().prepare(`
    SELECT status FROM frame_status
    WHERE project = ? AND frame_id = ?
  `).get(project, frameId)
  return row ? row.status : 'none'
}

export function setFrameStatus(project, frameId, status) {
  if (status === 'none') {
    // Remove the row if status is 'none' (default)
    getDb().prepare(`
      DELETE FROM frame_status WHERE project = ? AND frame_id = ?
    `).run(project, frameId)
  } else {
    getDb().prepare(`
      INSERT INTO frame_status (project, frame_id, status, updated_at)
      VALUES (?, ?, ?, strftime('%s', 'now'))
      ON CONFLICT(project, frame_id) DO UPDATE SET
        status = excluded.status,
        updated_at = excluded.updated_at
    `).run(project, frameId, status)
  }
}

export function saveFrameStatuses(project, statuses) {
  const db = getDb()
  const upsert = db.prepare(`
    INSERT INTO frame_status (project, frame_id, status, updated_at)
    VALUES (?, ?, ?, strftime('%s', 'now'))
    ON CONFLICT(project, frame_id) DO UPDATE SET
      status = excluded.status,
      updated_at = excluded.updated_at
  `)
  const remove = db.prepare(`
    DELETE FROM frame_status WHERE project = ? AND frame_id = ?
  `)

  const transaction = db.transaction(() => {
    for (const [frameId, status] of Object.entries(statuses)) {
      if (status === 'none') {
        remove.run(project, frameId)
      } else {
        upsert.run(project, frameId, status)
      }
    }
  })
  transaction()
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export function getPreference(key) {
  const row = getDb().prepare(`
    SELECT value FROM preferences WHERE key = ?
  `).get(key)
  return row ? JSON.parse(row.value) : null
}

export function setPreference(key, value) {
  getDb().prepare(`
    INSERT INTO preferences (key, value, updated_at)
    VALUES (?, ?, strftime('%s', 'now'))
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updated_at = excluded.updated_at
  `).run(key, JSON.stringify(value))
}

// ─── Migration from old JSON files ───────────────────────────────────────────

function migrateOldData(bryllenDir) {
  const framePositionsDir = join(bryllenDir, 'frame-positions')

  if (!existsSync(framePositionsDir)) return

  console.log('[bryllen] Migrating old frame positions to SQLite...')

  let migratedCount = 0
  const projects = readdirSync(framePositionsDir).filter(f => {
    try {
      return statSync(join(framePositionsDir, f)).isDirectory()
    } catch {
      return false
    }
  })

  for (const project of projects) {
    const projectDir = join(framePositionsDir, project)
    if (!existsSync(projectDir)) continue

    let files
    try {
      files = readdirSync(projectDir).filter(f => f.endsWith('.json'))
    } catch {
      continue
    }

    for (const file of files) {
      try {
        const filePath = join(projectDir, file)
        const data = JSON.parse(readFileSync(filePath, 'utf8'))

        // Handle both old format (raw positions) and new format ({ positions, version })
        const positions = data.positions || data

        // Extract page name from filename (remove .json)
        const page = file.replace('.json', '').replace(/__/g, '/')

        saveFramePositions(project, page, positions)
        migratedCount++
      } catch (err) {
        console.warn(`[bryllen] Failed to migrate ${project}/${file}:`, err.message)
      }
    }
  }

  if (migratedCount > 0) {
    console.log(`[bryllen] Migrated ${migratedCount} position files to SQLite`)

    // Delete old frame-positions directory
    try {
      rmSync(framePositionsDir, { recursive: true })
      console.log('[bryllen] Removed old frame-positions directory')
    } catch (err) {
      console.warn('[bryllen] Could not remove old frame-positions directory:', err.message)
    }
  }
}

// ─── Frames ───────────────────────────────────────────────────────────────────

export function createFrame(project, { id, title, componentKey, src, props, width, height, sortOrder }) {
  const now = Math.floor(Date.now() / 1000)
  getDb().prepare(`
    INSERT INTO frames (id, project, title, component_key, src, props, width, height, sort_order, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(project, id) DO UPDATE SET
      title = excluded.title,
      component_key = excluded.component_key,
      src = excluded.src,
      props = excluded.props,
      width = excluded.width,
      height = excluded.height,
      sort_order = excluded.sort_order,
      deleted_at = NULL,
      updated_at = excluded.updated_at
  `).run(id, project, title, componentKey || null, src || null, JSON.stringify(props || {}), width || null, height || null, sortOrder || 0, now, now)

  return getFrame(project, id)
}

export function getFrames(project) {
  const rows = getDb().prepare(`
    SELECT id, title, component_key, src, props, width, height, sort_order, created_at, updated_at
    FROM frames
    WHERE project = ? AND deleted_at IS NULL
    ORDER BY sort_order ASC, created_at ASC
  `).all(project)

  return rows.map(rowToFrame)
}

export function getFrame(project, id) {
  const row = getDb().prepare(`
    SELECT id, title, component_key, src, props, width, height, sort_order, created_at, updated_at
    FROM frames WHERE project = ? AND id = ? AND deleted_at IS NULL
  `).get(project, id)
  return row ? rowToFrame(row) : null
}

export function updateFrame(project, id, updates) {
  const now = Math.floor(Date.now() / 1000)
  const fields = []
  const values = []

  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title) }
  if (updates.componentKey !== undefined) { fields.push('component_key = ?'); values.push(updates.componentKey) }
  if (updates.src !== undefined) { fields.push('src = ?'); values.push(updates.src) }
  if (updates.props !== undefined) { fields.push('props = ?'); values.push(JSON.stringify(updates.props)) }
  if (updates.width !== undefined) { fields.push('width = ?'); values.push(updates.width) }
  if (updates.height !== undefined) { fields.push('height = ?'); values.push(updates.height) }
  if (updates.sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(updates.sortOrder) }

  if (fields.length === 0) return getFrame(project, id)

  fields.push('updated_at = ?')
  values.push(now)
  values.push(project, id)

  getDb().prepare(`
    UPDATE frames SET ${fields.join(', ')} WHERE project = ? AND id = ? AND deleted_at IS NULL
  `).run(...values)

  return getFrame(project, id)
}

export function getDeletedComponentKeys(project) {
  return getDb().prepare(`
    SELECT DISTINCT component_key
    FROM frames
    WHERE project = ? AND deleted_at IS NOT NULL AND component_key IS NOT NULL
  `).all(project).map(r => r.component_key)
}

export function softDeleteFrame(project, id) {
  const now = Math.floor(Date.now() / 1000)
  getDb().prepare(`
    UPDATE frames SET deleted_at = ?, updated_at = ? WHERE project = ? AND id = ?
  `).run(now, now, project, id)
  return { id, project, deletedAt: now }
}

function rowToFrame(row) {
  return {
    id: row.id,
    title: row.title,
    componentKey: row.component_key || null,
    src: row.src || null,
    props: JSON.parse(row.props || '{}'),
    width: row.width || null,
    height: row.height || null,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/**
 * Close the database connection.
 */
export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}

// ─── Per-Project Annotation Databases ─────────────────────────────────────────

const projectDbs = new Map()

/**
 * Get or create a per-project annotation database.
 * Databases are stored in src/projects/<projectName>/.bryllen/annotations.db
 * @param {string} projectsDir - Path to src/projects directory
 * @param {string} projectName - Name of the project folder
 */
export function getProjectAnnotationDb(projectsDir, projectName) {
  const cacheKey = `${projectsDir}:${projectName}`
  if (projectDbs.has(cacheKey)) {
    return projectDbs.get(cacheKey)
  }

  const projectBryllenDir = join(projectsDir, projectName, '.bryllen')
  if (!existsSync(projectBryllenDir)) {
    mkdirSync(projectBryllenDir, { recursive: true })
  }

  const dbPath = join(projectBryllenDir, 'annotations.db')
  const projectDb = new Database(dbPath)

  // Enable WAL mode for better concurrency
  projectDb.pragma('journal_mode = WAL')

  // Create annotations table
  projectDb.exec(`
    CREATE TABLE IF NOT EXISTS annotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT DEFAULT 'annotation',
      frame_id TEXT,
      frame_ids TEXT,
      component_name TEXT,
      props TEXT,
      selector TEXT,
      element_tag TEXT,
      element_classes TEXT,
      element_text TEXT,
      computed_styles TEXT,
      comment TEXT,
      image TEXT,
      timestamp INTEGER,
      status TEXT DEFAULT 'draft',
      mode TEXT DEFAULT 'refine',
      progress TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_annotations_status ON annotations(status);
  `)

  projectDbs.set(cacheKey, projectDb)
  return projectDb
}

/**
 * Add an annotation to a project's database.
 */
export function addProjectAnnotation(projectDb, data) {
  const stmt = projectDb.prepare(`
    INSERT INTO annotations (
      type, frame_id, frame_ids, component_name, props, selector,
      element_tag, element_classes, element_text, computed_styles,
      comment, image, timestamp, status, mode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const isImmediate = data.type === 'iteration' || data.type === 'project' ||
    data.type === 'prompt-request' || data.type === 'share' || data.type === 'pick'

  const frameIds = data.frameIds ?? (data.frameId ? [data.frameId] : [])

  const result = stmt.run(
    isImmediate ? data.type : 'annotation',
    data.frameId ?? '',
    JSON.stringify(frameIds),
    data.componentName ?? '',
    JSON.stringify(data.props ?? {}),
    data.selector ?? '',
    data.elementTag ?? '',
    data.elementClasses ?? '',
    data.elementText ?? '',
    JSON.stringify(data.computedStyles ?? {}),
    data.comment ?? '',
    data.images ? JSON.stringify(data.images) : data.image ?? null,
    Date.now(),
    isImmediate ? 'pending' : 'draft',
    data.mode ?? 'refine'
  )

  return {
    id: String(result.lastInsertRowid),
    type: isImmediate ? data.type : 'annotation',
    frameId: data.frameId ?? '',
    frameIds,
    componentName: data.componentName ?? '',
    props: data.props ?? {},
    selector: data.selector ?? '',
    elementTag: data.elementTag ?? '',
    elementClasses: data.elementClasses ?? '',
    elementText: data.elementText ?? '',
    computedStyles: data.computedStyles ?? {},
    comment: data.comment ?? '',
    images: data.images ?? (data.image ? [data.image] : []),
    timestamp: Date.now(),
    status: isImmediate ? 'pending' : 'draft',
    mode: data.mode ?? 'refine',
  }
}

/**
 * Get all annotations from a project's database.
 */
export function getProjectAnnotations(projectDb, status = null) {
  let query = 'SELECT * FROM annotations'
  const params = []

  if (status) {
    query += ' WHERE status = ?'
    params.push(status)
  }

  query += ' ORDER BY id ASC'

  const rows = projectDb.prepare(query).all(...params)
  return rows.map(rowToAnnotation)
}

/**
 * Get a single annotation by ID from a project's database.
 */
export function getProjectAnnotation(projectDb, id) {
  const row = projectDb.prepare('SELECT * FROM annotations WHERE id = ?').get(id)
  return row ? rowToAnnotation(row) : null
}

/**
 * Update an annotation's status.
 */
export function updateProjectAnnotationStatus(projectDb, id, status) {
  projectDb.prepare('UPDATE annotations SET status = ? WHERE id = ?').run(status, id)
  return getProjectAnnotation(projectDb, id)
}

/**
 * Update an annotation's progress message.
 */
export function updateProjectAnnotationProgress(projectDb, id, progress) {
  projectDb.prepare('UPDATE annotations SET progress = ? WHERE id = ?').run(progress, id)
  return getProjectAnnotation(projectDb, id)
}

/**
 * Delete an annotation from a project's database.
 */
export function deleteProjectAnnotation(projectDb, id) {
  const annotation = getProjectAnnotation(projectDb, id)
  if (annotation) {
    projectDb.prepare('DELETE FROM annotations WHERE id = ?').run(id)
  }
  return annotation
}

/**
 * Close all project annotation databases.
 */
export function closeProjectDbs() {
  for (const [, projectDb] of projectDbs) {
    projectDb.close()
  }
  projectDbs.clear()
}

// ─── Stickies ─────────────────────────────────────────────────────────────────

export function createSticky(project, { id, parentFrameId, content, offsetX, offsetY }) {
  const now = Math.floor(Date.now() / 1000)
  getDb().prepare(`
    INSERT INTO stickies (id, project, parent_frame_id, content, offset_x, offset_y, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(project, id) DO UPDATE SET
      parent_frame_id = excluded.parent_frame_id,
      content = excluded.content,
      offset_x = excluded.offset_x,
      offset_y = excluded.offset_y
  `).run(id, project, parentFrameId, content, offsetX ?? 0, offsetY ?? -40, now)

  return getSticky(project, id)
}

export function getStickies(project) {
  const rows = getDb().prepare(`
    SELECT id, project, parent_frame_id, content, offset_x, offset_y
    FROM stickies WHERE project = ?
    ORDER BY created_at ASC
  `).all(project)
  return rows.map(rowToSticky)
}

export function getSticky(project, id) {
  const row = getDb().prepare(`
    SELECT id, project, parent_frame_id, content, offset_x, offset_y
    FROM stickies WHERE project = ? AND id = ?
  `).get(project, id)
  return row ? rowToSticky(row) : null
}

export function deleteSticky(project, id) {
  const sticky = getSticky(project, id)
  if (sticky) {
    getDb().prepare('DELETE FROM stickies WHERE project = ? AND id = ?').run(project, id)
  }
  return sticky
}

export function deleteStickyByParentFrame(project, parentFrameId) {
  const rows = getDb().prepare(`
    SELECT id, project, parent_frame_id, content, offset_x, offset_y
    FROM stickies WHERE project = ? AND parent_frame_id = ?
  `).all(project, parentFrameId)
  if (rows.length > 0) {
    getDb().prepare('DELETE FROM stickies WHERE project = ? AND parent_frame_id = ?').run(project, parentFrameId)
  }
  return rows.map(rowToSticky)
}

function rowToSticky(row) {
  return {
    id: row.id,
    parentFrameId: row.parent_frame_id,
    content: row.content,
    offsetX: row.offset_x,
    offsetY: row.offset_y,
  }
}

/**
 * Convert a database row to an annotation object.
 */
function rowToAnnotation(row) {
  return {
    id: String(row.id),
    type: row.type,
    frameId: row.frame_id,
    frameIds: JSON.parse(row.frame_ids || '[]'),
    componentName: row.component_name,
    props: JSON.parse(row.props || '{}'),
    selector: row.selector,
    elementTag: row.element_tag,
    elementClasses: row.element_classes,
    elementText: row.element_text,
    computedStyles: JSON.parse(row.computed_styles || '{}'),
    comment: row.comment,
    images: row.image ? (row.image.startsWith('[') ? JSON.parse(row.image) : [row.image]) : [],
    timestamp: row.timestamp,
    status: row.status,
    mode: row.mode,
    progress: row.progress,
  }
}
