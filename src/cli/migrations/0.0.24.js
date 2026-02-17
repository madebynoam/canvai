/**
 * Migration 0.0.24: Add rules-guard hook + commit discipline
 *
 * Patches:
 * - .claude/settings.json — adds rules-guard.js hook alongside frozen-guard.js
 * - CLAUDE.md — adds commit-after-each-change step to "Before any edit"
 */

export const version = '0.0.24'

export const description = 'Add rules-guard hook + commit discipline'

export const files = ['.claude/settings.json', 'CLAUDE.md']

export function applies(fileContents) {
  const settings = fileContents['.claude/settings.json']
  const claudeMd = fileContents['CLAUDE.md']

  // Needs migration if settings exists but doesn't have rules-guard
  if (settings && !settings.includes('rules-guard')) return true

  // Needs migration if CLAUDE.md exists, has "Before any edit", but no commit step
  if (claudeMd && claudeMd.includes('Before any edit') && !claudeMd.includes('Commit after each change')) return true

  return false
}

export function migrate(fileContents) {
  const result = {}

  // --- Patch .claude/settings.json ---
  let settings = fileContents['.claude/settings.json']
  if (settings && !settings.includes('rules-guard')) {
    try {
      const parsed = JSON.parse(settings)
      const preToolUse = parsed?.hooks?.PreToolUse
      if (Array.isArray(preToolUse)) {
        // Find the Edit|Write matcher entry
        const editWriteEntry = preToolUse.find(e => e.matcher === 'Edit|Write')
        if (editWriteEntry && Array.isArray(editWriteEntry.hooks)) {
          // Add rules-guard alongside frozen-guard
          const hasRulesGuard = editWriteEntry.hooks.some(h =>
            h.command && h.command.includes('rules-guard')
          )
          if (!hasRulesGuard) {
            editWriteEntry.hooks.push({
              type: 'command',
              command: 'node node_modules/canvai/src/cli/hooks/rules-guard.js',
            })
          }
        }
      }
      result['.claude/settings.json'] = JSON.stringify(parsed, null, 2) + '\n'
    } catch {
      // Can't parse — leave as-is
      result['.claude/settings.json'] = settings
    }
  } else if (settings) {
    result['.claude/settings.json'] = settings
  }

  // --- Patch CLAUDE.md ---
  let claudeMd = fileContents['CLAUDE.md']
  if (claudeMd && claudeMd.includes('Before any edit') && !claudeMd.includes('Commit after each change')) {
    // Add step 6 after step 5 (Log to CHANGELOG.md)
    // Match "5. Log to `CHANGELOG.md`." or "5. **Log to `CHANGELOG.md`**." (with or without bold)
    claudeMd = claudeMd.replace(
      /(5\..*(?:Log to|CHANGELOG\.md).*)/,
      `$1\n6. **Commit after each change** — After completing the requested changes, stage and commit project files:\n   \`git add src/projects/ && git commit -m 'style: <brief description of change>'\`\n   Every change gets its own commit so the designer can rewind with \`/canvai-undo\`.`
    )
    result['CLAUDE.md'] = claudeMd
  } else if (claudeMd) {
    result['CLAUDE.md'] = claudeMd
  }

  return result
}
