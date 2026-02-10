#!/usr/bin/env node

import { spawn } from 'child_process'
import { resolve } from 'path'

const command = process.argv[2]

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
  case 'dev':
    startDev()
    break
  default:
    console.log('Canvai — design studio on an infinite canvas\n')
    console.log('Usage:')
    console.log('  canvai dev     Start dev server + Agentation MCP')
    console.log('  canvai help    Show this message')
    process.exit(command === 'help' ? 0 : 1)
}
