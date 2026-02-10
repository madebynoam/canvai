#!/usr/bin/env node

// Canvai CLI — placeholder for Phase 4
// Usage: canvai dev    — starts Vite + Agentation MCP
//        canvai init   — scaffolds a new design project

const command = process.argv[2]

if (command === 'dev') {
  console.log('canvai dev — not yet implemented (Phase 4)')
  process.exit(1)
} else if (command === 'init') {
  console.log('canvai init — not yet implemented (Phase 4)')
  process.exit(1)
} else {
  console.log('Usage: canvai <dev|init>')
  process.exit(1)
}
