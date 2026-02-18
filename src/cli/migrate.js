/**
 * Migration runner.
 *
 * Runs migrations in two passes:
 * 1. Version-gated: migrations newer than the consumer's marker (normal upgrades)
 * 2. Self-healing: ALL migrations checked via applies() regardless of marker
 *    (catches partial runs, stale code, bugfixed migrations)
 *
 * The marker is only bumped after verified success — if applies() still
 * returns true after running, the marker stays put and a warning is logged.
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

/** Read all files a migration might need, including dynamically discovered manifests. */
function readMigrationFiles(cwd, migration) {
  const fileContents = {}

  for (const filepath of migration.files) {
    const abs = join(cwd, filepath)
    if (existsSync(abs)) {
      fileContents[filepath] = readFileSync(abs, 'utf-8')
    }
  }

  // Discover manifest files — migrations may need them
  const projectsDir = join(cwd, 'src/projects')
  if (existsSync(projectsDir)) {
    for (const d of readdirSync(projectsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue
      const rel = `src/projects/${d.name}/manifest.ts`
      const abs = join(cwd, rel)
      if (existsSync(abs) && !fileContents[rel]) {
        fileContents[rel] = readFileSync(abs, 'utf-8')
      }

      // Discover token pages in each iteration (v1/, v2/, etc.)
      const projDir = join(projectsDir, d.name)
      for (const v of readdirSync(projDir, { withFileTypes: true })) {
        if (!v.isDirectory() || !/^v\d+$/.test(v.name)) continue
        const tokRel = `src/projects/${d.name}/${v.name}/pages/tokens.tsx`
        const tokAbs = join(cwd, tokRel)
        if (existsSync(tokAbs) && !fileContents[tokRel]) {
          fileContents[tokRel] = readFileSync(tokAbs, 'utf-8')
        }
      }
    }
  }

  return fileContents
}

/**
 * Run a single migration. Returns true if it applied.
 * After running, verifies applies() returns false. If not, logs a warning.
 */
function runMigration(cwd, migration) {
  const fileContents = readMigrationFiles(cwd, migration)

  if (!migration.applies(fileContents)) return false

  const results = migration.migrate(fileContents)

  // Write results
  for (const [filepath, content] of Object.entries(results)) {
    writeFileSync(join(cwd, filepath), content)
  }

  // Verify: re-read files and check applies() returns false
  const afterContents = readMigrationFiles(cwd, migration)
  if (migration.applies(afterContents)) {
    console.warn(`  WARNING: migration ${migration.version} still applies after running — files may be partially fixed`)
  }

  console.log(`  migrated: ${migration.description} (${migration.version})`)
  return true
}

/**
 * Run all pending migrations for a consumer project.
 * Returns the number of migrations applied.
 */
export function runMigrations(cwd) {
  const canvaiVersion = getCanvaiVersion()
  let applied = 0

  // Run ALL migrations whose applies() returns true.
  // This handles both normal upgrades AND recovery from partial/stale runs.
  // Sorted by version so they run in order.
  for (const migration of migrations) {
    if (runMigration(cwd, migration)) {
      applied++
    }
  }

  // Only bump marker if everything is clean
  if (applied > 0) {
    // Re-verify no migration still applies
    let allClean = true
    for (const migration of migrations) {
      const fileContents = readMigrationFiles(cwd, migration)
      if (migration.applies(fileContents)) {
        console.warn(`  WARNING: migration ${migration.version} still needs attention after run`)
        allClean = false
      }
    }

    if (allClean) {
      writeMarker(cwd, canvaiVersion)
    } else {
      console.warn('  Marker NOT bumped — some migrations still apply. Run `npx canvai doctor` to diagnose.')
    }
  } else {
    // No migrations needed, but ensure marker is at current version
    writeMarker(cwd, canvaiVersion)
  }

  return applied
}
