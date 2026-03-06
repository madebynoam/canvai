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

    CREATE INDEX IF NOT EXISTS idx_frame_positions_project_page
      ON frame_positions(project, page);
    CREATE INDEX IF NOT EXISTS idx_context_positions_project
      ON context_positions(project, iteration);
  `)

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
    SELECT frame_id, x, y FROM frame_positions
    WHERE project = ? AND page = ?
  `).all(project, page)

  if (rows.length === 0) return null

  const positions = {}
  for (const row of rows) {
    positions[row.frame_id] = { x: row.x, y: row.y }
  }
  return positions
}

export function saveFramePositions(project, page, positions) {
  const db = getDb()
  const upsert = db.prepare(`
    INSERT INTO frame_positions (project, page, frame_id, x, y, updated_at)
    VALUES (?, ?, ?, ?, ?, strftime('%s', 'now'))
    ON CONFLICT(project, page, frame_id) DO UPDATE SET
      x = excluded.x,
      y = excluded.y,
      updated_at = excluded.updated_at
  `)

  const transaction = db.transaction(() => {
    for (const [frameId, pos] of Object.entries(positions)) {
      upsert.run(project, page, frameId, pos.x, pos.y)
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

/**
 * Close the database connection.
 */
export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}
