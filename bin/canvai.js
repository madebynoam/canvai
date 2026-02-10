#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { fork } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const cli = join(__dirname, '..', 'src', 'cli', 'index.ts')

fork(cli, process.argv.slice(2), {
  execArgv: ['--experimental-strip-types', '--no-warnings'],
  stdio: 'inherit',
})
