/**
 * Migration 0.0.27: Add .mcp.json for annotation MCP
 *
 * Early consumers who ran `canvai init` before 0.0.27 don't have .mcp.json.
 * Without it, the annotation MCP tools (watch_annotations, get_pending_annotations)
 * are not available in Claude Code.
 *
 * This migration creates .mcp.json if it doesn't exist, or adds the
 * canvai-annotations entry if the file exists but is missing the entry.
 */

export const version = '0.0.27'

export const description = 'Add .mcp.json for annotation MCP (canvai-annotations server)'

export const files = ['.mcp.json']

const ENTRY = {
  command: 'node',
  args: ['node_modules/canvai/src/mcp/mcp-server.js'],
}

export function applies(fileContents) {
  const content = fileContents['.mcp.json']
  // Missing file — migration needed
  if (!content) return true
  // File exists but missing canvai-annotations entry
  try {
    const parsed = JSON.parse(content)
    return !parsed?.mcpServers?.['canvai-annotations']
  } catch {
    // Malformed JSON — don't touch
    return false
  }
}

export function migrate(fileContents) {
  const content = fileContents['.mcp.json']

  if (!content) {
    // Create from scratch
    return {
      '.mcp.json': JSON.stringify(
        { mcpServers: { 'canvai-annotations': ENTRY } },
        null,
        2,
      ) + '\n',
    }
  }

  // Merge the entry into the existing file
  try {
    const parsed = JSON.parse(content)
    parsed.mcpServers = parsed.mcpServers ?? {}
    parsed.mcpServers['canvai-annotations'] = ENTRY
    return { '.mcp.json': JSON.stringify(parsed, null, 2) + '\n' }
  } catch {
    // Malformed JSON — leave untouched
    return {}
  }
}
