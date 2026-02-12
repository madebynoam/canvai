/**
 * Migration runner.
 *
 * Reads the consumer's .canvai version marker, filters applicable migrations,
 * runs them in order, and updates the marker.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { migrations } from './migrations/index.js'

const MARKER = '.canvai'

/** Compare two semver-ish strings. Returns -1 | 0 | 1 */
export function compareSemver(a, b) {
  const pa = a.split('.').map(Number)
  const pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) < (pb[i] ?? 0)) return -1
    if ((pa[i] ?? 0) > (pb[i] ?? 0)) return 1
  }
  return 0
}

/** Read the consumer's .canvai version. Returns '0.0.0' if missing. */
export function readMarkerVersion(cwd) {
  const markerPath = join(cwd, MARKER)
  if (!existsSync(markerPath)) return '0.0.0'
  try {
    const data = JSON.parse(readFileSync(markerPath, 'utf-8'))
    return data.version ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

/** Write the .canvai version marker. */
export function writeMarker(cwd, version) {
  writeFileSync(join(cwd, MARKER), JSON.stringify({ version }, null, 2) + '\n')
}

/** Get the current canvai package version from package.json. */
export function getCanvaiVersion() {
  const pkgPath = new URL('../../package.json', import.meta.url)
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  return pkg.version
}

/**
 * Run all pending migrations for a consumer project.
 * Returns the number of migrations applied.
 */
export function runMigrations(cwd) {
  const consumerVersion = readMarkerVersion(cwd)
  const canvaiVersion = getCanvaiVersion()

  // Filter migrations newer than the consumer's version
  const pending = migrations.filter(
    m => compareSemver(m.version, consumerVersion) > 0,
  )

  if (pending.length === 0) return 0

  let applied = 0

  for (const migration of pending) {
    // Read all files this migration can touch
    const fileContents = {}
    for (const filepath of migration.files) {
      const abs = join(cwd, filepath)
      if (existsSync(abs)) {
        fileContents[filepath] = readFileSync(abs, 'utf-8')
      }
    }

    // Also discover manifest files for migrations that need them
    const projectsDir = join(cwd, 'src/projects')
    if (existsSync(projectsDir)) {
      for (const d of readdirSync(projectsDir, { withFileTypes: true })) {
        if (!d.isDirectory()) continue
        const rel = `src/projects/${d.name}/manifest.ts`
        const abs = join(cwd, rel)
        if (existsSync(abs) && !fileContents[rel]) {
          fileContents[rel] = readFileSync(abs, 'utf-8')
        }
      }
    }

    // Check if migration applies
    if (!migration.applies(fileContents)) continue

    // Run the migration
    const results = migration.migrate(fileContents)

    // Write results
    for (const [filepath, content] of Object.entries(results)) {
      writeFileSync(join(cwd, filepath), content)
    }

    console.log(`  migrated: ${migration.description} (${migration.version})`)
    applied++
  }

  // Update marker to current canvai version
  writeMarker(cwd, canvaiVersion)

  return applied
}
