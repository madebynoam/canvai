#!/usr/bin/env node

import { spawn } from 'child_process'
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

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
        console.log('\nReady! Run `npx canvai dev` to start.')
      } else {
        console.error('\nnpm install failed. Install manually and try again.')
      }
      process.exit(code ?? 0)
    })
  } else {
    console.log('\nReady! Run `npx canvai dev` to start.')
  }
}

function update() {
  const cwd = process.cwd()
  console.log('Updating canvai to latest...\n')
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
        console.log('\nUpdated! Restart `npx canvai dev` to use the latest.')
        process.exit(0)
      })
    } else {
      console.error('\nUpdate failed. Try running: npm install github:madebynoam/canvai')
      process.exit(code ?? 1)
    }
  })
}

function startDev() {
  const cwd = process.cwd()

  // Run migrations before starting
  const applied = runMigrations(cwd)
  if (applied > 0) {
    console.log(`Applied ${applied} migration${applied === 1 ? '' : 's'}.\n`)
  }

  // Start Vite dev server
  const vite = spawn('npx', ['vite', '--open'], {
    cwd,
    stdio: 'inherit',
    shell: true,
  })

  // Start annotation HTTP server
  const httpServerPath = join(__dirname, '..', 'mcp', 'http-server.js')
  const httpSrv = spawn('node', [httpServerPath], {
    cwd,
    stdio: 'inherit',
  })

  // Clean up on exit
  function cleanup() {
    vite.kill()
    httpSrv.kill()
    process.exit()
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  vite.on('exit', (code) => {
    httpSrv.kill()
    process.exit(code ?? 0)
  })
}

switch (command) {
  case 'init':
    scaffold()
    break
  case 'dev':
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
    console.log('  canvai init      Scaffold project files')
    console.log('  canvai dev       Start dev server + annotation server')
    console.log('  canvai update    Update canvai to latest')
    console.log('  canvai doctor    Check and fix project files')
    console.log('  canvai help      Show this message')
    process.exit(command === 'help' ? 0 : 1)
}
