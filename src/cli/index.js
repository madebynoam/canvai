#!/usr/bin/env node

import { spawn, execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs'
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
  mcpJson,
} from './templates.js'
import { runMigrations, writeMarker, getCanvaiVersion } from './migrate.js'

const command = process.argv[2]

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
    ['.mcp.json', mcpJson],
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

  // Write .canvai version marker
  writeMarker(cwd, getCanvaiVersion())
  console.log('  created .canvai')

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
        console.log('\nReady! Run `npx canvai design` to start.')
      } else {
        console.error('\nnpm install failed. Install manually and try again.')
      }
      process.exit(code ?? 0)
    })
  } else {
    console.log('\nReady! Run `npx canvai design` to start.')
  }
}

function update() {
  const cwd = process.cwd()
  console.log('Updating canvai to latest...\n')

  // Remove cached canvai so npm re-resolves from GitHub instead of using the locked SHA.
  // Both node_modules AND the lockfile entry must be cleared — npm uses the lockfile
  // resolved commit SHA even when node_modules is deleted.
  const cachedPkg = join(cwd, 'node_modules', 'canvai')
  if (existsSync(cachedPkg)) {
    rmSync(cachedPkg, { recursive: true, force: true })
  }
  try {
    const lockPath = join(cwd, 'package-lock.json')
    if (existsSync(lockPath)) {
      const lock = JSON.parse(readFileSync(lockPath, 'utf8'))
      let changed = false
      if (lock.packages?.['node_modules/canvai']) { delete lock.packages['node_modules/canvai']; changed = true }
      if (lock.dependencies?.canvai) { delete lock.dependencies.canvai; changed = true }
      if (changed) writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n')
    }
  } catch {}

  const install = spawn('npm', ['install', 'github:madebynoam/canvai'], {
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
      const migratePath = join(cwd, 'node_modules', 'canvai', 'src', 'cli', 'index.js')
      const migrate = spawn('node', [migratePath, 'migrate'], {
        cwd,
        stdio: 'inherit',
      })
      migrate.on('exit', () => {
        console.log('\nUpdated! Restart `npx canvai design` to use the latest.')
        process.exit(0)
      })
    } else {
      console.error('\nUpdate failed. Try running: npm install github:madebynoam/canvai')
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
  writeFileSync(join(cwd, '.canvai-ports.json'), JSON.stringify({ http: httpPort, vite: vitePort, vitePid, httpPid, pid: process.pid }) + '\n')
}

async function startDev() {
  const cwd = process.cwd()

  // Clear Vite dep cache so updated canvai code is re-bundled
  const viteCache = join(cwd, 'node_modules', '.vite')
  if (existsSync(viteCache)) {
    rmSync(viteCache, { recursive: true, force: true })
  }

  // Run migrations before starting
  const applied = runMigrations(cwd)
  if (applied > 0) {
    console.log(`Applied ${applied} migration${applied === 1 ? '' : 's'}.\n`)
  }

  // Find free ports — never kill existing servers
  const httpPort = await findFreePort(4748)
  const vitePort = await findFreePort(5173)

  // Write ports BEFORE spawning so Vite's config() can read them
  writePorts(cwd, httpPort, vitePort, null, null)
  console.log(`[canvai] HTTP server → :${httpPort}  Vite → :${vitePort}`)

  // Start Vite dev server on the chosen port
  const vite = spawn('npx', ['vite', '--open', '--port', String(vitePort), '--strictPort'], {
    cwd,
    stdio: 'inherit',
    shell: true,
  })

  // Start annotation HTTP server with the chosen port
  const httpServerPath = join(__dirname, '..', 'mcp', 'http-server.js')
  const httpSrv = spawn('node', [httpServerPath], {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, CANVAI_HTTP_PORT: String(httpPort), CANVAI_VITE_PORT: String(vitePort) },
  })

  // Update ports file with PIDs for safe cleanup
  writePorts(cwd, httpPort, vitePort, vite.pid, httpSrv.pid)

  // Clean up on exit — remove ports file so stale info doesn't linger
  function cleanup() {
    try { rmSync(join(cwd, '.canvai-ports.json'), { force: true }) } catch {}
    vite.kill()
    httpSrv.kill()
    process.exit()
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  vite.on('exit', (code) => {
    try { rmSync(join(cwd, '.canvai-ports.json'), { force: true }) } catch {}
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
      console.log('Running canvai doctor — checking all migrations...\n')
    }
    const applied = runMigrations(cwd)
    if (applied > 0) {
      console.log(`\nApplied ${applied} migration${applied === 1 ? '' : 's'}.`)
    } else {
      console.log('All files are healthy — no migrations needed.')
    }
    break
  }
  default:
    console.log('Canvai — design studio on an infinite canvas\n')
    console.log('Usage:')
    console.log('  canvai new       Scaffold project files')
    console.log('  canvai design    Start dev server + annotation server')
    console.log('  canvai update    Update canvai to latest')
    console.log('  canvai doctor    Check and fix project files')
    console.log('  canvai help      Show this message')
    process.exit(command === 'help' ? 0 : 1)
}
