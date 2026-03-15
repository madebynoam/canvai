#!/usr/bin/env node

import { spawn, execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync, cpSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'net'
import { homedir } from 'os'
import { createHash } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
import {
  indexHtml,
  viteConfig,
  mainTsx,
  appTsx,
  indexCss,
  viteEnvDts,
  tsconfigJson,
  tsconfigAppJson,
  tsconfigNodeJson,
  claudeSettingsJson,
  claudeMd,
  gitignore,
} from './templates.js'
import { runMigrations, writeMarker, getBryllenVersion } from './migrate.js'

const command = process.argv[2]
const subcommand = process.argv[3]

// ─── HTTP helpers ───────────────────────────────────────────────────────────

function getHttpPort() {
  try {
    const ports = JSON.parse(readFileSync(join(process.cwd(), '.bryllen-ports.json'), 'utf8'))
    return ports.http || 4748
  } catch {
    return 4748
  }
}

async function httpGet(path) {
  const port = getHttpPort()
  const res = await fetch(`http://localhost:${port}${path}`)
  return res.json()
}

async function httpPost(path) {
  const port = getHttpPort()
  const res = await fetch(`http://localhost:${port}${path}`, { method: 'POST' })
  return res.json()
}

async function httpPostJson(path, body) {
  const port = getHttpPort()
  const res = await fetch(`http://localhost:${port}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

// ─── Annotation CLI commands ────────────────────────────────────────────────

/**
 * Detect the active project from src/projects/
 * Returns project name if exactly one exists, null if none, or errors if multiple.
 */
function detectProject(args) {
  // Check for explicit --project flag
  const projectIdx = args.indexOf('--project')
  if (projectIdx !== -1 && args[projectIdx + 1]) {
    return args[projectIdx + 1]
  }

  // Auto-detect from src/projects/
  const projectsDir = join(process.cwd(), 'src', 'projects')
  if (!existsSync(projectsDir)) return null

  const projects = readdirSync(projectsDir).filter(f => {
    try {
      const p = join(projectsDir, f)
      return existsSync(p) && statSync(p).isDirectory() && !f.startsWith('.')
    } catch { return false }
  })

  if (projects.length === 1) return projects[0]
  if (projects.length > 1) {
    // Check if the browser is open on a specific project (written by HTTP server on SSE connect)
    try {
      const activeFile = join(process.cwd(), '.bryllen-active-project')
      if (existsSync(activeFile)) {
        const active = readFileSync(activeFile, 'utf8').trim()
        if (active && projects.includes(active)) return active
      }
    } catch {}
    console.error(JSON.stringify({ error: 'Multiple projects. Use --project <name>', projects }))
    process.exit(1)
  }
  return null
}

async function watchAnnotations() {
  const args = process.argv.slice(3)
  let timeout = 15000
  const timeoutIdx = args.indexOf('--timeout')
  if (timeoutIdx !== -1 && args[timeoutIdx + 1]) {
    timeout = parseInt(args[timeoutIdx + 1], 10) * 1000
  }

  // For watch: explicit --project wins; otherwise watch ALL projects (no error on multiple)
  const projectIdx = args.indexOf('--project')
  const project = (projectIdx !== -1 && args[projectIdx + 1]) ? args[projectIdx + 1] : null

  const params = new URLSearchParams()
  params.set('timeout', String(timeout))
  if (project) params.set('projectId', project)

  try {
    const result = await httpGet(`/annotations/next?${params}`)

    if (result.timeout) {
      console.log(JSON.stringify({ timeout: true }))
      return
    }

    // Output the annotation as JSON for Claude to parse
    console.log(JSON.stringify(result, null, 2))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, hint: 'Is bryllen design running?' }))
    process.exit(1)
  }
}

async function resolveAnnotation() {
  const args = process.argv.slice(3)
  const id = args.find(a => !a.startsWith('--'))
  if (!id) {
    console.error('Usage: bryllen resolve <id> [--navigate <iteration>] [--project <name>]')
    process.exit(1)
  }

  // Parse --navigate flag
  const navIdx = args.indexOf('--navigate')
  const navigate = navIdx !== -1 && args[navIdx + 1] ? args[navIdx + 1] : null

  const project = detectProject(args)
  const params = new URLSearchParams()
  if (project) params.set('projectId', project)
  const qs = params.toString() ? `?${params}` : ''

  try {
    const body = navigate ? { navigate } : {}
    const result = await httpPostJson(`/annotations/${id}/resolve${qs}`, body)
    if (result.error) {
      console.error(JSON.stringify({ error: `Annotation #${id} not found` }))
      process.exit(1)
    }
    console.log(JSON.stringify({ resolved: true, id, comment: result.comment }))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }))
    process.exit(1)
  }
}

async function progressAnnotation() {
  const args = process.argv.slice(3)
  // Find id (first non-flag argument)
  const id = args.find(a => !a.startsWith('--') && args.indexOf(a) === args.findIndex(x => !x.startsWith('--')))
  // Get message (remaining non-flag arguments after id, excluding --project value)
  const projectIdx = args.indexOf('--project')
  const filteredArgs = args.filter((a, i) => {
    if (a.startsWith('--')) return false
    if (projectIdx !== -1 && i === projectIdx + 1) return false
    return true
  })
  const message = filteredArgs.slice(1).join(' ')

  if (!id || !message) {
    console.error('Usage: bryllen progress <id> <message> [--project <name>]')
    process.exit(1)
  }

  const project = detectProject(args)
  const params = new URLSearchParams()
  if (project) params.set('projectId', project)
  const qs = params.toString() ? `?${params}` : ''

  try {
    const result = await httpPostJson(`/annotations/${id}/progress${qs}`, { message })
    if (result.error) {
      console.error(JSON.stringify({ error: result.error }))
      process.exit(1)
    }
    console.log(JSON.stringify({ id, progress: message }))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message }))
    process.exit(1)
  }
}

async function pendingAnnotations() {
  const args = process.argv.slice(3)
  const project = detectProject(args)
  const params = new URLSearchParams()
  params.set('status', 'pending')
  if (project) params.set('projectId', project)

  try {
    const pending = await httpGet(`/annotations?${params}`)
    console.log(JSON.stringify(pending, null, 2))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, hint: 'Is bryllen design running?' }))
    process.exit(1)
  }
}

async function listAnnotations() {
  const args = process.argv.slice(3)
  const project = detectProject(args)
  const params = new URLSearchParams()
  if (project) params.set('projectId', project)
  const qs = params.toString() ? `?${params}` : ''

  try {
    const all = await httpGet(`/annotations${qs}`)
    console.log(JSON.stringify(all, null, 2))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, hint: 'Is bryllen design running?' }))
    process.exit(1)
  }
}

async function screenshotCanvas() {
  const args = process.argv.slice(3)
  const params = new URLSearchParams()

  const frameIdx = args.indexOf('--frame')
  if (frameIdx !== -1 && args[frameIdx + 1]) {
    params.set('frame', args[frameIdx + 1])
  }

  const projectIdx = args.indexOf('--project')
  if (projectIdx !== -1 && args[projectIdx + 1]) {
    params.set('project', args[projectIdx + 1])
  }

  const iterIdx = args.indexOf('--iteration')
  if (iterIdx !== -1 && args[iterIdx + 1]) {
    params.set('iteration', args[iterIdx + 1])
  }

  const pageIdx = args.indexOf('--page')
  if (pageIdx !== -1 && args[pageIdx + 1]) {
    params.set('page', args[pageIdx + 1])
  }

  const delayIdx = args.indexOf('--delay')
  if (delayIdx !== -1 && args[delayIdx + 1]) {
    params.set('delay', args[delayIdx + 1])
  }

  try {
    const qs = params.toString()
    const result = await httpGet(`/screenshot${qs ? '?' + qs : ''}`)

    if (result.error) {
      if (result.install) {
        console.log(JSON.stringify({ error: 'Playwright not installed', install: result.install }))
      } else {
        console.error(JSON.stringify({ error: result.error, available: result.available }))
        process.exit(1)
      }
      return
    }

    console.log(JSON.stringify({ path: result.path }))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, hint: 'Is bryllen design running?' }))
    process.exit(1)
  }
}

async function createIteration() {
  const args = process.argv.slice(3)
  const cwd = process.cwd()

  // Find project
  let project = null
  const projectIdx = args.indexOf('--project')
  if (projectIdx !== -1 && args[projectIdx + 1]) {
    project = args[projectIdx + 1]
  }

  // Auto-detect if single project
  if (!project) {
    const projectsDir = join(cwd, 'src', 'projects')
    if (existsSync(projectsDir)) {
      const dirs = readdirSync(projectsDir).filter(f => {
        const p = join(projectsDir, f)
        try {
          return existsSync(p) && statSync(p).isDirectory() && !f.startsWith('.')
        } catch { return false }
      })
      if (dirs.length === 1) project = dirs[0]
      else if (dirs.length > 1) {
        console.error(JSON.stringify({ error: 'Multiple projects. Use --project <name>', projects: dirs }))
        process.exit(1)
      }
    }
  }

  if (!project) {
    console.error(JSON.stringify({ error: 'No project found' }))
    process.exit(1)
  }

  const projectDir = join(cwd, 'src', 'projects', project)
  const manifestPath = join(projectDir, 'manifest.ts')

  if (!existsSync(manifestPath)) {
    console.error(JSON.stringify({ error: `No manifest.ts in ${project}` }))
    process.exit(1)
  }

  // Read manifest to find iterations
  let manifestContent = readFileSync(manifestPath, 'utf8')

  // Parse iterations by finding top-level iteration blocks
  // Iterations have pattern: { name: 'V1', frozen?: bool, pages: [...] }
  // We look for "name: 'VN'" followed by either "frozen:" or "pages:" (not "grid:")
  const iterationPattern = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*(frozen:\s*(true|false)\s*,\s*)?pages:/g
  const iterations = []
  let match
  while ((match = iterationPattern.exec(manifestContent)) !== null) {
    iterations.push({
      name: match[1],
      frozen: match[3] === 'true',
    })
  }

  if (iterations.length === 0) {
    console.error(JSON.stringify({ error: 'Could not parse iterations from manifest' }))
    process.exit(1)
  }

  // Find active iteration (last one with frozen: false or no frozen field)
  let activeName = ''
  for (const iter of iterations) {
    if (!iter.frozen) {
      activeName = iter.name
    }
  }

  if (!activeName) {
    console.error(JSON.stringify({ error: 'No active (unfrozen) iteration found' }))
    process.exit(1)
  }

  // Determine new iteration name (v1 → v2, V1 → V2)
  const numMatch = activeName.match(/(\d+)/)
  if (!numMatch) {
    console.error(JSON.stringify({ error: `Cannot parse iteration number from ${activeName}` }))
    process.exit(1)
  }
  const num = parseInt(numMatch[1], 10)
  const newName = activeName.replace(/\d+/, String(num + 1))
  const activeDir = join(projectDir, activeName.toLowerCase())
  const newDir = join(projectDir, newName.toLowerCase())

  if (existsSync(newDir)) {
    console.error(JSON.stringify({ error: `${newName} already exists` }))
    process.exit(1)
  }

  // 1. Freeze active iteration in manifest
  // Find the iteration block and add frozen: true
  const frozenPattern = new RegExp(`(name:\\s*['"]${activeName}['"][^}]*?)(\n\\s*frozen:\\s*false)?(\n\\s*pages:)`, 'i')
  if (manifestContent.match(frozenPattern)) {
    manifestContent = manifestContent.replace(frozenPattern, '$1\n      frozen: true,$3')
  } else {
    // No frozen field, add it
    const addFrozenPattern = new RegExp(`(name:\\s*['"]${activeName}['"])`, 'i')
    manifestContent = manifestContent.replace(addFrozenPattern, '$1,\n      frozen: true')
  }

  // 2. Copy folder
  cpSync(activeDir, newDir, { recursive: true })

  // 3. Rename CSS scope in tokens.css
  const tokensPath = join(newDir, 'tokens.css')
  if (existsSync(tokensPath)) {
    let tokens = readFileSync(tokensPath, 'utf8')
    const oldScope = `.iter-${activeName.toLowerCase()}`
    const newScope = `.iter-${newName.toLowerCase()}`
    tokens = tokens.replace(new RegExp(oldScope.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newScope)
    writeFileSync(tokensPath, tokens)
  }

  // 4. Add new iteration to manifest (copy structure from active, change name, remove frozen)
  // Find where iterations array ends and add new iteration
  const newIterBlock = `
    {
      name: '${newName}',
      frozen: false,
      pages: [], // Agent will populate
    },`

  // Insert before the closing ] of iterations array
  manifestContent = manifestContent.replace(
    /(iterations:\s*\[[\s\S]*?)(\n\s*\])/,
    `$1${newIterBlock}$2`
  )

  // 5. Add import for new tokens.css at top
  const tokenImport = `import './${newName.toLowerCase()}/tokens.css'\n`
  if (!manifestContent.includes(tokenImport)) {
    // Add after last tokens.css import or at top
    const lastTokenImport = manifestContent.lastIndexOf("/tokens.css'")
    if (lastTokenImport !== -1) {
      const insertPos = manifestContent.indexOf('\n', lastTokenImport) + 1
      manifestContent = manifestContent.slice(0, insertPos) + tokenImport + manifestContent.slice(insertPos)
    } else {
      manifestContent = tokenImport + manifestContent
    }
  }

  writeFileSync(manifestPath, manifestContent)

  console.log(JSON.stringify({
    success: true,
    project,
    frozenIteration: activeName,
    newIteration: newName,
    path: newDir,
  }))
}

async function contextImages() {
  const args = process.argv.slice(3)

  let project = null
  let iteration = 'v1'
  let page = null

  const projectIdx = args.indexOf('--project')
  if (projectIdx !== -1 && args[projectIdx + 1]) {
    project = args[projectIdx + 1]
  }

  const iterIdx = args.indexOf('--iteration')
  if (iterIdx !== -1 && args[iterIdx + 1]) {
    iteration = args[iterIdx + 1]
  }

  const pageIdx = args.indexOf('--page')
  if (pageIdx !== -1 && args[pageIdx + 1]) {
    page = args[pageIdx + 1]
  }

  // Auto-detect project if not specified
  if (!project) {
    const projectsDir = join(process.cwd(), 'src', 'projects')
    if (existsSync(projectsDir)) {
      const projects = readdirSync(projectsDir).filter(f => {
        try {
          return statSync(join(projectsDir, f)).isDirectory() && !f.startsWith('.')
        } catch { return false }
      })
      if (projects.length === 1) {
        project = projects[0]
      } else if (projects.length > 1) {
        console.error(JSON.stringify({ error: 'Multiple projects found. Use --project <name>', projects }))
        process.exit(1)
      }
    }
  }

  if (!project) {
    console.error(JSON.stringify({ error: 'No project specified. Use --project <name>' }))
    process.exit(1)
  }

  // If no --page given, scan all subdirectories too so images in context/canvas/ are found
  const baseDir = join(process.cwd(), 'src', 'projects', project, iteration, 'context')

  if (!existsSync(baseDir)) {
    console.log(JSON.stringify({ images: [], message: 'No context images found' }))
    return
  }

  const collectImages = (dir) => {
    return readdirSync(dir)
      .filter(f => {
        const fpath = join(dir, f)
        return statSync(fpath).isFile() && /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
      })
      .map(f => ({ filename: f, path: join(dir, f) }))
  }

  let allImages = []
  if (page) {
    // Specific page subdirectory
    const pageDir = join(baseDir, page)
    if (existsSync(pageDir)) allImages = collectImages(pageDir)
  } else {
    // Root context/ files
    allImages = collectImages(baseDir)
    // Also scan page subdirectories (e.g. context/canvas/)
    const subdirs = readdirSync(baseDir).filter(f => {
      try { return statSync(join(baseDir, f)).isDirectory() } catch { return false }
    })
    for (const sub of subdirs) {
      allImages = allImages.concat(collectImages(join(baseDir, sub)))
    }
  }

  // Sort newest-first by timestamp in filename
  allImages.sort((a, b) => {
    const tsA = parseInt(a.filename.match(/(\d{10,})/)?.[1] ?? '0', 10)
    const tsB = parseInt(b.filename.match(/(\d{10,})/)?.[1] ?? '0', 10)
    return tsB - tsA
  })

  if (allImages.length === 0) {
    console.log(JSON.stringify({ images: [], message: 'No context images found' }))
    return
  }

  console.log(JSON.stringify({ images: allImages }, null, 2))
}

// Idempotent core — writes boilerplate files, creates src/projects/, writes version marker.
// Returns { wrote, skipped, missingDeps } without side effects or process.exit().
function ensureScaffold(cwd) {
  const files = [
    ['index.html', indexHtml],
    ['vite.config.ts', viteConfig],
    ['tsconfig.json', tsconfigJson],
    ['tsconfig.app.json', tsconfigAppJson],
    ['tsconfig.node.json', tsconfigNodeJson],
    ['src/main.tsx', mainTsx],
    ['src/App.tsx', appTsx],
    ['src/index.css', indexCss],
    ['src/vite-env.d.ts', viteEnvDts],
    ['.claude/settings.json', claudeSettingsJson],
    ['CLAUDE.md', claudeMd],
    ['.gitignore', gitignore],
  ]

  let wrote = 0
  let skipped = 0

  for (const [relative, content] of files) {
    const abs = join(cwd, relative)
    if (existsSync(abs)) {
      skipped++
      continue
    }
    mkdirSync(join(abs, '..'), { recursive: true })
    writeFileSync(abs, content)
    wrote++
    console.log(`  created ${relative}`)
  }

  // Ensure src/projects/ exists
  const projectsDir = join(cwd, 'src/projects')
  if (!existsSync(projectsDir)) {
    mkdirSync(projectsDir, { recursive: true })
    console.log('  created src/projects/')
  }

  // Write .bryllen-version marker
  writeMarker(cwd, getBryllenVersion())

  if (wrote > 0) {
    console.log(`\nScaffolded ${wrote} file${wrote === 1 ? '' : 's'}${skipped ? ` (${skipped} already existed)` : ''}.`)
  }

  // Check for missing peer deps
  const needed = [
    'react', 'react-dom',
    '@vitejs/plugin-react', 'vite', 'typescript',
    '@types/react', '@types/react-dom',
  ]
  const missingDeps = needed.filter(dep => !existsSync(join(cwd, 'node_modules', dep)))

  return { wrote, skipped, missingDeps }
}

// `bryllen new` — thin wrapper around ensureScaffold that also installs deps and exits.
function scaffold() {
  const cwd = process.cwd()
  const { missingDeps } = ensureScaffold(cwd)

  if (missingDeps.length > 0) {
    console.log(`\nInstalling dependencies: ${missingDeps.join(', ')}`)
    const install = spawn('npm', ['install', '--save-dev', ...missingDeps], {
      cwd,
      stdio: 'inherit',
      shell: true,
    })
    install.on('exit', (code) => {
      if (code === 0) {
        console.log('\nReady! Run `npx bryllen design` to start.')
      } else {
        console.error('\nnpm install failed. Install manually and try again.')
      }
      process.exit(code ?? 0)
    })
  } else {
    console.log('\nReady! Run `npx bryllen design` to start.')
  }
}

function update() {
  const cwd = process.cwd()
  console.log('Updating bryllen to latest...\n')

  // Remove cached bryllen so npm re-resolves from GitHub instead of using the locked SHA.
  // Both node_modules AND the lockfile entry must be cleared — npm uses the lockfile
  // resolved commit SHA even when node_modules is deleted.
  const cachedPkg = join(cwd, 'node_modules', 'bryllen')
  if (existsSync(cachedPkg)) {
    rmSync(cachedPkg, { recursive: true, force: true })
  }
  try {
    const lockPath = join(cwd, 'package-lock.json')
    if (existsSync(lockPath)) {
      const lock = JSON.parse(readFileSync(lockPath, 'utf8'))
      let changed = false
      if (lock.packages?.['node_modules/bryllen']) { delete lock.packages['node_modules/bryllen']; changed = true }
      if (lock.dependencies?.bryllen) { delete lock.dependencies.bryllen; changed = true }
      if (changed) writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n')
    }
  } catch {}

  // Clear npm's global cache for bryllen to force fresh fetch from GitHub
  try {
    execSync('npm cache clean --force 2>/dev/null', { cwd, stdio: 'ignore' })
  } catch {}

  const install = spawn('npm', ['install', 'github:madebynoam/bryllen', '--force'], {
    cwd,
    stdio: 'inherit',
    shell: true,
  })
  install.on('exit', (code) => {
    if (code === 0) {
      // Clear Vite cache so stale bundled deps don't linger
      const viteCache = join(cwd, 'node_modules', '.vite')
      if (existsSync(viteCache)) {
        rmSync(viteCache, { recursive: true, force: true })
        console.log('Cleared Vite cache.')
      }
      // Run migrations in a NEW process so the freshly-installed code is used.
      // The current process still has the old modules loaded from before npm install.
      const migratePath = join(cwd, 'node_modules', 'bryllen', 'src', 'cli', 'index.js')
      const migrate = spawn('node', [migratePath, 'migrate'], {
        cwd,
        stdio: 'inherit',
      })
      migrate.on('exit', () => {
        console.log('\nUpdated! Restart `npx bryllen design` to use the latest.')
        process.exit(0)
      })
    } else {
      console.error('\nUpdate failed. Try running: npm install github:madebynoam/bryllen')
      process.exit(code ?? 1)
    }
  })
}

/** Check if a port is free (uses localhost to match Vite/Node defaults). */
function isPortFree(port) {
  return new Promise((resolve) => {
    const srv = createServer()
    srv.once('error', () => resolve(false))
    srv.once('listening', () => { srv.close(); resolve(true) })
    srv.listen(port, 'localhost')
  })
}

/** Find a free port starting from `start`, incrementing until one is available. */
async function findFreePort(start) {
  for (let port = start; port < start + 100; port++) {
    if (await isPortFree(port)) return port
  }
  throw new Error(`No free port found in range ${start}–${start + 99}`)
}

/** Write port info so MCP server and Vite plugin can discover them. */
function writePorts(cwd, httpPort, vitePort, vitePid, httpPid) {
  writeFileSync(join(cwd, '.bryllen-ports.json'), JSON.stringify({ http: httpPort, vite: vitePort, vitePid, httpPid, pid: process.pid }) + '\n')
}

async function startDev() {
  const cwd = process.cwd()

  // Kill any existing servers from previous sessions (prevents orphans)
  const portsFile = join(cwd, '.bryllen-ports.json')
  if (existsSync(portsFile)) {
    try {
      const ports = JSON.parse(readFileSync(portsFile, 'utf8'))
      for (const pid of [ports.vitePid, ports.httpPid].filter(Boolean)) {
        try { process.kill(pid, 'SIGTERM') } catch {}
      }
      rmSync(portsFile, { force: true })
      console.log('[bryllen] Cleaned up previous servers')
    } catch {}
  }

  // Fallback: kill by port in case of zombie processes from previous sessions
  // (covers the case where .bryllen-ports.json is stale or missing)
  try {
    const { execSync } = await import('child_process')
    for (const port of [4748, 5173]) {
      try {
        const pid = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim()
        if (pid) {
          for (const p of pid.split('\n').filter(Boolean)) {
            try { process.kill(Number(p), 'SIGTERM') } catch {}
          }
        }
      } catch {}
    }
  } catch {}

  // Clear Vite dep cache so updated bryllen code is re-bundled
  const viteCache = join(cwd, 'node_modules', '.vite')
  if (existsSync(viteCache)) {
    rmSync(viteCache, { recursive: true, force: true })
  }

  // Run migrations before starting
  const applied = runMigrations(cwd)
  if (applied > 0) {
    console.log(`Applied ${applied} migration${applied === 1 ? '' : 's'}.\n`)
  }

  // Auto-scaffold on fresh installs (idempotent — safe to run every time)
  const { wrote: scaffoldWrote, missingDeps } = ensureScaffold(cwd)
  if (scaffoldWrote > 0) console.log(`[bryllen] Scaffolded ${scaffoldWrote} file(s).`)
  if (missingDeps.length > 0) {
    console.log(`[bryllen] Installing dependencies: ${missingDeps.join(' ')}`)
    execSync(`npm install --save-dev ${missingDeps.join(' ')}`, { cwd, stdio: 'inherit' })
  }

  // Find free ports (cleanup above should free the preferred ones)
  const httpPort = await findFreePort(4748)
  const vitePort = await findFreePort(5173)

  // Write ports BEFORE spawning so Vite's config() can read them
  writePorts(cwd, httpPort, vitePort, null, null)
  console.log(`[bryllen] HTTP server → :${httpPort}  Vite → :${vitePort}`)

  // Start Vite dev server on the chosen port
  const vite = spawn('npx', ['vite', '--port', String(vitePort), '--strictPort'], {
    cwd,
    stdio: 'inherit',
    shell: true,
  })

  // Start annotation HTTP server with the chosen port
  const httpServerPath = join(__dirname, '..', 'server', 'http-server.js')
  const httpSrv = spawn('node', [httpServerPath], {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, CANVAI_HTTP_PORT: String(httpPort), CANVAI_VITE_PORT: String(vitePort) },
  })

  // Update ports file with PIDs for safe cleanup
  writePorts(cwd, httpPort, vitePort, vite.pid, httpSrv.pid)

  // Clean up on exit — remove ports file so stale info doesn't linger
  function cleanup() {
    try { rmSync(join(cwd, '.bryllen-ports.json'), { force: true }) } catch {}
    vite.kill()
    httpSrv.kill()
    process.exit()
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('SIGHUP', cleanup)

  vite.on('exit', (code) => {
    try { rmSync(join(cwd, '.bryllen-ports.json'), { force: true }) } catch {}
    httpSrv.kill()
    process.exit(code ?? 0)
  })

  // Poll for update requests from the canvas UI
  const updateRequestFile = join(cwd, '.bryllen-update-requested')
  const updatePollInterval = setInterval(async () => {
    if (!existsSync(updateRequestFile)) return

    try { unlinkSync(updateRequestFile) } catch {} // consume the request
    clearInterval(updatePollInterval)

    console.log('\n[bryllen] Update requested from canvas...')

    // 1. Run npm install (same logic as update())
    try {
      const bryllenDir = join(cwd, 'node_modules', 'bryllen')
      if (existsSync(bryllenDir)) execSync(`rm -rf "${bryllenDir}"`, { stdio: 'inherit' })

      const lockPath = join(cwd, 'package-lock.json')
      if (existsSync(lockPath)) {
        const lock = JSON.parse(readFileSync(lockPath, 'utf8'))
        if (lock.packages?.['node_modules/bryllen']) delete lock.packages['node_modules/bryllen']
        if (lock.dependencies?.bryllen) delete lock.dependencies.bryllen
        writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n')
      }

      execSync('npm cache clean --force', { cwd, stdio: 'ignore' })
      execSync('npm install github:madebynoam/bryllen --force', { cwd, stdio: 'inherit' })

      const viteCacheDir = join(cwd, 'node_modules', '.vite')
      if (existsSync(viteCacheDir)) execSync(`rm -rf "${viteCacheDir}"`, { stdio: 'ignore' })
    } catch (e) {
      console.error('[bryllen] npm install failed:', e.message)
      return
    }

    // 2. Update plugin skills via git pull, detect if CLAUDE.md changed
    const pluginPath = join(homedir(), '.claude', 'plugins', 'marketplaces', 'bryllen')
    let claudeMdChanged = false
    if (existsSync(pluginPath)) {
      const claudeMdFile = join(pluginPath, 'plugin', 'plugins', 'bryllen', 'CLAUDE.md')
      const hashBefore = existsSync(claudeMdFile)
        ? createHash('md5').update(readFileSync(claudeMdFile)).digest('hex') : 'none'
      try { execSync('git pull origin main', { cwd: pluginPath, stdio: 'ignore' }) } catch {}
      const hashAfter = existsSync(claudeMdFile)
        ? createHash('md5').update(readFileSync(claudeMdFile)).digest('hex') : 'none'
      claudeMdChanged = hashBefore !== hashAfter
    }

    // 3. Run migrations in new process (so freshly-installed code is used)
    await new Promise(resolve => {
      const migrate = spawn('node', [
        join(cwd, 'node_modules', 'bryllen', 'src', 'cli', 'index.js'), 'migrate'
      ], { cwd, stdio: 'inherit' })
      migrate.on('exit', resolve)
    })

    // 4. Write update result for canvas to read after reconnect
    const newVersion = JSON.parse(
      readFileSync(join(cwd, 'node_modules', 'bryllen', 'package.json'), 'utf8')
    ).version
    writeFileSync(join(cwd, '.bryllen-update-result.json'), JSON.stringify({
      version: newVersion,
      claudeMdChanged,
      timestamp: Date.now(),
    }))

    // 5. Kill old servers
    for (const pid of [vite.pid, httpSrv.pid].filter(Boolean)) {
      try { process.kill(pid, 'SIGTERM') } catch {}
    }
    for (const port of [httpPort, vitePort]) {
      try {
        const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim()
        for (const p of pids.split('\n').filter(Boolean)) {
          try { process.kill(Number(p), 'SIGTERM') } catch {}
        }
      } catch {}
    }

    // 6. Wait for ports to free, then restart with freshly-installed servers
    await new Promise(r => setTimeout(r, 500))

    const newHttpPort = await findFreePort(4748)
    const newVitePort = await findFreePort(5173)
    writePorts(cwd, newHttpPort, newVitePort, null, null)

    const newHttpPath = join(cwd, 'node_modules', 'bryllen', 'src', 'server', 'http-server.js')

    const newVite = spawn('npx', ['vite', '--port', String(newVitePort), '--strictPort'], {
      cwd, stdio: 'ignore', shell: true, detached: true,
    })
    newVite.unref()

    const newHttp = spawn('node', [newHttpPath], {
      cwd, stdio: 'ignore', detached: true,
      env: { ...process.env, CANVAI_HTTP_PORT: String(newHttpPort), CANVAI_VITE_PORT: String(newVitePort) },
    })
    newHttp.unref()

    writePorts(cwd, newHttpPort, newVitePort, newVite.pid, newHttp.pid)
    console.log('[bryllen] Updated! Canvas reloading...')

    // Exit this parent process — detached servers keep running
    process.exit(0)
  }, 1000)
}

switch (command) {
  case 'new':
    scaffold()
    break
  case 'design':
    startDev()
    break
  case 'update':
    update()
    break
  case 'migrate':
  case 'doctor': {
    const cwd = process.cwd()
    if (command === 'doctor') {
      console.log('Running bryllen doctor — checking all migrations...\n')
    }
    const applied = runMigrations(cwd)
    if (applied > 0) {
      console.log(`\nApplied ${applied} migration${applied === 1 ? '' : 's'}.`)
    } else {
      console.log('All files are healthy — no migrations needed.')
    }
    break
  }

  // ─── Annotation CLI commands (replaces MCP) ─────────────────────────────────
  case 'watch':
    watchAnnotations()
    break
  case 'resolve':
    resolveAnnotation()
    break
  case 'progress':
    progressAnnotation()
    break
  case 'pending':
    pendingAnnotations()
    break
  case 'list':
    listAnnotations()
    break
  case 'screenshot':
    screenshotCanvas()
    break
  case 'context':
    contextImages()
    break
  case 'iterate':
    createIteration()
    break

  default:
    console.log('Bryllen — design studio on an infinite canvas\n')
    console.log('Usage:')
    console.log('  bryllen design               Start dev server (auto-scaffolds on first run)')
    console.log('  bryllen new                  Scaffold project files only (backward compat)')
    console.log('  bryllen update               Update bryllen to latest')
    console.log('  bryllen doctor               Check and fix project files')
    console.log('')
    console.log('Annotation commands (for Claude Code agent):')
    console.log('  bryllen watch [--timeout N] [--project <name>]')
    console.log('                               Wait for annotation (default 15s)')
    console.log('  bryllen resolve <id> [--navigate <iter>] [--project <name>]')
    console.log('                               Mark resolved, optionally navigate UI')
    console.log('  bryllen progress <id> <msg> [--project <name>]')
    console.log('                               Update progress shown on canvas')
    console.log('  bryllen pending [--project <name>]')
    console.log('                               List pending annotations')
    console.log('  bryllen list [--project <name>]')
    console.log('                               List all annotations')
    console.log('  bryllen screenshot [--project <name>] [--iteration <v>] [--page <name>] [--frame <id>] [--delay <ms>]')
    console.log('  bryllen context [--project <name>] [--iteration <v>]')
    console.log('  bryllen iterate [--project <name>]  Create new iteration (freeze + copy)')
    console.log('')
    console.log('Note: --project auto-detects if only one project exists in src/projects/')
    console.log('')
    console.log('  bryllen help                 Show this message')
    process.exit(command === 'help' ? 0 : 1)
}
