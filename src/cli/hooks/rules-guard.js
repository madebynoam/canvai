#!/usr/bin/env node

/**
 * PreToolUse hook — component hierarchy guard.
 *
 * Runs before Edit/Write tool calls. Checks if the new content
 * violates the token → component → page hierarchy and blocks if so.
 *
 * Input: JSON on stdin with { tool_name, tool_input }
 * Output: JSON on stdout with { decision, reason? }
 *   - decision: "allow" | "block"
 *   - reason: string (shown to the agent when blocked)
 */

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
  process.exit(0)
}

const toolName = parsed?.tool_name
const toolInput = parsed?.tool_input
if (!toolName || !toolInput) process.exit(0)

const filePath = toolInput.file_path
if (!filePath) process.exit(0)

// Normalize to forward slashes for matching
const normPath = filePath.replace(/\\/g, '/')

// Only check files inside src/projects/*/v*/
const match = normPath.match(/src\/projects\/[^/]+\/v\d+\/(.*)$/)
if (!match) process.exit(0)

const subPath = match[1]

// Determine what content is being introduced
let newContent = ''
if (toolName === 'Write') {
  newContent = toolInput.content ?? ''
} else if (toolName === 'Edit') {
  newContent = toolInput.new_string ?? ''
}

if (!newContent) process.exit(0)

// --- tokens.css rules ---
if (subPath === 'tokens.css') {
  // Token values must be OKLCH — no hex, rgb, or hsl
  if (/#[0-9a-fA-F]{3,8}\b/.test(newContent)) {
    emit('block', 'All token values must be in OKLCH format. No hex colors (#...). Convert to oklch().')
  }
  if (/\brgba?\s*\(/.test(newContent)) {
    emit('block', 'All token values must be in OKLCH format. No rgb/rgba. Convert to oklch().')
  }
  if (/\bhsla?\s*\(/.test(newContent)) {
    emit('block', 'All token values must be in OKLCH format. No hsl/hsla. Convert to oklch().')
  }
  process.exit(0)
}

// --- components/*.tsx rules (skip index.ts barrel) ---
if (subPath.startsWith('components/') && subPath !== 'components/index.ts' && subPath.endsWith('.tsx')) {
  // Components must not use hardcoded colors — must use var(--token)
  if (/#[0-9a-fA-F]{3,8}\b/.test(newContent)) {
    emit('block', 'Components must use var(--token) for colors, not hardcoded hex values. Define colors as tokens in tokens.css and reference them with var(--token-name).')
  }
  if (/\brgba?\s*\(/.test(newContent)) {
    emit('block', 'Components must use var(--token) for colors, not hardcoded rgb/rgba values. Use tokens from tokens.css.')
  }
  if (/\bhsla?\s*\(/.test(newContent)) {
    emit('block', 'Components must use var(--token) for colors, not hardcoded hsl/hsla values. Use tokens from tokens.css.')
  }
  // Check for raw oklch() in style props (should use var(--token) instead)
  // Allow oklch() only in CSS string contexts (tokens.css import), not in inline styles
  if (/(?:color|background|backgroundColor|borderColor|border|fill|stroke)\s*:\s*['"`]?\s*oklch\s*\(/.test(newContent)) {
    emit('block', 'Components must reference tokens via var(--token), not hardcoded oklch() in style properties. Define the color in tokens.css and use var(--token-name).')
  }
  process.exit(0)
}

// --- pages/*.tsx rules ---
if (subPath.startsWith('pages/') && subPath.endsWith('.tsx')) {
  // Pages must not import from ../tokens or ../tokens.css
  if (/from\s+['"]\.\.\/tokens(?:\.css)?['"]/.test(newContent)) {
    emit('block', 'Pages must import ONLY from ../components/, not from tokens directly. Move token usage into a component.')
  }
  // Pages must not have hardcoded color values in style objects
  if (/#[0-9a-fA-F]{3,8}\b/.test(newContent)) {
    emit('block', 'Pages must use components, not raw styled elements with hardcoded colors. Create a component in components/ first.')
  }
  if (/\brgba?\s*\(/.test(newContent)) {
    emit('block', 'Pages must use components, not raw styled elements with hardcoded rgb colors. Create a component in components/ first.')
  }
  if (/\bhsla?\s*\(/.test(newContent)) {
    emit('block', 'Pages must use components, not raw styled elements with hardcoded hsl colors. Create a component in components/ first.')
  }
  process.exit(0)
}

// Allow everything else
process.exit(0)

function emit(decision, reason) {
  console.log(JSON.stringify({ decision, reason }))
  process.exit(0)
}
