#!/usr/bin/env node

import { spawn, execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, readdirSync, statSync, cpSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'net'

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

async function watchAnnotations() {
  const args = process.argv.slice(3)
  let timeout = 15000
  const timeoutIdx = args.indexOf('--timeout')
  if (timeoutIdx !== -1 && args[timeoutIdx + 1]) {
    timeout = parseInt(args[timeoutIdx + 1], 10) * 1000
  }

  try {
    const result = await httpGet(`/annotations/next?timeout=${timeout}`)

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
    console.error('Usage: bryllen resolve <id> [--navigate <iteration>]')
    process.exit(1)
  }

  // Parse --navigate flag
  const navIdx = args.indexOf('--navigate')
  const navigate = navIdx !== -1 && args[navIdx + 1] ? args[navIdx + 1] : null

  try {
    const body = navigate ? { navigate } : {}
    const result = await httpPostJson(`/annotations/${id}/resolve`, body)
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
  const id = process.argv[3]
  const message = process.argv.slice(4).join(' ')
  if (!id || !message) {
    console.error('Usage: bryllen progress <id> <message>')
    process.exit(1)
  }

  try {
    const result = await httpPostJson(`/annotations/${id}/progress`, { message })
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
  try {
    const pending = await httpGet('/annotations?status=pending')
    console.log(JSON.stringify(pending, null, 2))
  } catch (err) {
    console.error(JSON.stringify({ error: err.message, hint: 'Is bryllen design running?' }))
    process.exit(1)
  }
}

async function listAnnotations() {
  try {
    const all = await httpGet('/annotations')
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

  const projectIdx = args.indexOf('--project')
  if (projectIdx !== -1 && args[projectIdx + 1]) {
    project = args[projectIdx + 1]
  }

  const iterIdx = args.indexOf('--iteration')
  if (iterIdx !== -1 && args[iterIdx + 1]) {
    iteration = args[iterIdx + 1]
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

  const contextDir = join(process.cwd(), 'src', 'projects', project, iteration, 'context')

  if (!existsSync(contextDir)) {
    console.log(JSON.stringify({ images: [], message: 'No context images found' }))
    return
  }

  const files = readdirSync(contextDir).filter(f =>
    /\.(png|jpg|jpeg|gif|webp)$/i.test(f)
  )

  if (files.length === 0) {
    console.log(JSON.stringify({ images: [], message: 'No context images found' }))
    return
  }

  // Return image paths (not base64 — Claude can read files directly)
  const images = files.map(filename => ({
    filename,
    path: join(contextDir, filename),
  }))

  console.log(JSON.stringify({ images }, null, 2))
}

function scaffold() {
  const cwd = process.cwd()

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
  console.log('  created .bryllen-version')

  if (wrote === 0) {
    console.log('All scaffold files already exist — nothing to write.')
  } else {
    console.log(`\nScaffolded ${wrote} file${wrote === 1 ? '' : 's'}${skipped ? ` (${skipped} already existed)` : ''}.`)
  }

  // Check for missing peer deps
  const needed = [
    'react', 'react-dom',
    '@vitejs/plugin-react', 'vite', 'typescript',
    '@types/react', '@types/react-dom',
  ]
  const missing = needed.filter(dep => !existsSync(join(cwd, 'node_modules', dep)))

  if (missing.length > 0) {
    console.log(`\nInstalling dependencies: ${missing.join(', ')}`)
    const install = spawn('npm', ['install', '--save-dev', ...missing], {
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

  const install = spawn('npm', ['install', 'github:madebynoam/bryllen'], {
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

  vite.on('exit', (code) => {
    try { rmSync(join(cwd, '.bryllen-ports.json'), { force: true }) } catch {}
    httpSrv.kill()
    process.exit(code ?? 0)
  })
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
    console.log('  bryllen new                  Scaffold project files')
    console.log('  bryllen design               Start dev server + annotation server')
    console.log('  bryllen update               Update bryllen to latest')
    console.log('  bryllen doctor               Check and fix project files')
    console.log('')
    console.log('Annotation commands (for Claude Code agent):')
    console.log('  bryllen watch [--timeout N]  Wait for annotation (default 15s)')
    console.log('  bryllen resolve <id> [--navigate <iter>]  Mark resolved, optionally navigate UI')
    console.log('  bryllen progress <id> <msg>  Update progress shown on canvas')
    console.log('  bryllen pending              List pending annotations')
    console.log('  bryllen list                 List all annotations')
    console.log('  bryllen screenshot [--project <name>] [--iteration <v>] [--page <name>] [--frame <id>] [--delay <ms>]')
    console.log('  bryllen context [--project <name>] [--iteration <v>]')
    console.log('  bryllen iterate [--project <name>]  Create new iteration (freeze + copy)')
    console.log('')
    console.log('  bryllen help                 Show this message')
    process.exit(command === 'help' ? 0 : 1)
}
