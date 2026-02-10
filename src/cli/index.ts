#!/usr/bin/env node

import { spawn } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
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
} from './templates.ts'

const command = process.argv[2]

function scaffold() {
  const cwd = process.cwd()

  const files: [string, string][] = [
    ['index.html', indexHtml],
    ['vite.config.ts', viteConfig],
    ['tsconfig.json', tsconfigJson],
    ['tsconfig.app.json', tsconfigAppJson],
    ['tsconfig.node.json', tsconfigNodeJson],
    ['src/main.tsx', mainTsx],
    ['src/App.tsx', appTsx],
    ['src/index.css', indexCss],
    ['src/vite-env.d.ts', viteEnvDts],
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
    'agentation', 'agentation-mcp',
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

function startDev() {
  const cwd = process.cwd()

  // Start Vite dev server
  const vite = spawn('npx', ['vite', '--open'], {
    cwd,
    stdio: 'inherit',
    shell: true,
  })

  // Start Agentation MCP server
  const mcp = spawn('npx', ['agentation-mcp', 'server'], {
    cwd,
    stdio: 'pipe',
    shell: true,
  })

  mcp.stdout?.on('data', (data: Buffer) => {
    const msg = data.toString().trim()
    if (msg) console.log(`[agentation] ${msg}`)
  })

  mcp.stderr?.on('data', (data: Buffer) => {
    const msg = data.toString().trim()
    if (msg) console.error(`[agentation] ${msg}`)
  })

  // Clean up on exit
  function cleanup() {
    vite.kill()
    mcp.kill()
    process.exit()
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  vite.on('exit', (code) => {
    mcp.kill()
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
  default:
    console.log('Canvai — design studio on an infinite canvas\n')
    console.log('Usage:')
    console.log('  canvai init    Scaffold project files')
    console.log('  canvai dev     Start dev server + Agentation MCP')
    console.log('  canvai help    Show this message')
    process.exit(command === 'help' ? 0 : 1)
}
