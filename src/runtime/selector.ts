// cssEscape polyfill for environments that don't have it (jsdom)
const cssEscape = typeof CSS !== 'undefined' && cssEscape
  ? cssEscape
  : (str: string) => str.replace(/([^\w-])/g, '\\$1')

/**
 * Build a CSS selector path from element up to a boundary element.
 * Used to identify which element was clicked within a frame.
 */
export function buildSelector(el: Element, boundary: Element): string {
  const parts: string[] = []
  let current: Element | null = el

  while (current && current !== boundary) {
    const tag = current.tagName.toLowerCase()
    const parent = current.parentElement

    if (parent) {
      // Check for id first - most specific
      const id = current.id
      if (id && !id.startsWith('radix-') && !id.startsWith(':r')) {
        // Has a meaningful id - use it and stop (ids should be unique)
        parts.unshift(`#${cssEscape(id)}`)
        break
      }

      // Check for data-testid - very specific
      const testId = current.getAttribute('data-testid')
      if (testId) {
        parts.unshift(`[data-testid="${cssEscape(testId)}"]`)
        break
      }

      // Check for meaningful classes (skip utility classes)
      const classes = Array.from(current.classList).filter(c =>
        !c.startsWith('_') && // CSS module hashes
        !c.match(/^[a-z]{1,3}-/) && // Tailwind-style utilities
        c.length > 2
      )

      if (classes.length > 0) {
        // Use first meaningful class + nth-of-type for disambiguation
        const siblings = Array.from(parent.children).filter(c =>
          c.tagName === current!.tagName && c.classList.contains(classes[0])
        )
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1
          parts.unshift(`${tag}.${cssEscape(classes[0])}:nth-of-type(${index})`)
        } else {
          parts.unshift(`${tag}.${cssEscape(classes[0])}`)
        }
      } else {
        // Fallback to tag + nth-of-type
        const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName)
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1
          parts.unshift(`${tag}:nth-of-type(${index})`)
        } else {
          parts.unshift(tag)
        }
      }
    } else {
      parts.unshift(tag)
    }
    current = parent
  }

  return parts.join(' > ')
}

/**
 * Test if a selector uniquely identifies an element within a boundary.
 */
export function isSelectorUnique(selector: string, boundary: Element): boolean {
  try {
    const matches = boundary.querySelectorAll(selector)
    return matches.length === 1
  } catch {
    return false
  }
}
