#!/usr/bin/env node

/**
 * PreToolUse hook — frozen iteration guard.
 *
 * Runs before Edit/Write tool calls. Checks if the target file
 * is inside a frozen iteration folder and blocks the edit if so.
 * Also reminds the agent to use components when editing page files.
 *
 * Input: JSON on stdin with { tool_name, tool_input: { file_path } }
 * Output: JSON on stdout with { decision, reason? }
 *   - decision: "allow" | "block"
 *   - reason: string (shown to the agent when blocked)
 */

import { readFileSync } from 'fs'
import { resolve, relative } from 'path'

const cwd = process.cwd()

// Read tool input from stdin
let input = ''
process.stdin.setEncoding('utf-8')
for await (const chunk of process.stdin) {
  input += chunk
}

let parsed
try {
  parsed = JSON.parse(input)
} catch {
  // Not valid JSON — allow silently
  process.exit(0)
}

const filePath = parsed?.tool_input?.file_path
if (!filePath) process.exit(0)

// Resolve to relative path from cwd
const absPath = resolve(filePath)
const rel = relative(cwd, absPath)

// Match pattern: src/projects/<name>/v<N>/...
const match = rel.match(/^src\/projects\/([^/]+)\/v(\d+)\/(.*)$/)
if (!match) process.exit(0) // Not a project iteration file — allow

const [, projectName, iterNum, subPath] = match

// Read the project's manifest to check frozen status
const manifestPath = resolve(cwd, 'src', 'projects', projectName, 'manifest.ts')
let manifestContent
try {
  manifestContent = readFileSync(manifestPath, 'utf-8')
} catch {
  // Can't read manifest — allow (might be creating a new project)
  process.exit(0)
}

// Parse frozen status from manifest
// Look for pattern: { name: 'V<N>', frozen: true, ... }
// or: name: 'V<N>',\n      frozen: true
const iterName = `V${iterNum}`
const frozenPattern = new RegExp(
  `name:\\s*['"\`]${iterName}['"\`][\\s\\S]*?frozen:\\s*(true|false)`,
)
const frozenMatch = manifestContent.match(frozenPattern)

if (frozenMatch && frozenMatch[1] === 'true') {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `Iteration ${iterName} of "${projectName}" is frozen. Create a new iteration with /canvai-iterate instead of editing frozen files.`,
  }))
  process.exit(0)
}

// If editing a page file, remind about component hierarchy
if (subPath.startsWith('pages/')) {
  console.log(JSON.stringify({
    decision: 'allow',
    reason: `Editing a page file (${subPath}). Remember: pages must import ONLY from ../components/. No raw styled HTML — use components.`,
  }))
  process.exit(0)
}

// Allow silently
process.exit(0)
