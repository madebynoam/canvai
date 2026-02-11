/**
 * Migration 0.0.10: PageTabs/ProjectSidebar → TopBar/IterationSidebar
 *
 * In v0.0.10, PageTabs and ProjectSidebar were removed from the runtime.
 * TopBar replaced PageTabs, IterationSidebar replaced ProjectSidebar.
 * AnnotationOverlay gained an `annotateMode` prop.
 */

export const version = '0.0.10'

export const description =
  'Replace PageTabs/ProjectSidebar imports with TopBar/IterationSidebar'

export const files = ['src/App.tsx']

export function applies(fileContents) {
  const app = fileContents['src/App.tsx']
  if (!app) return false
  return app.includes('PageTabs') || app.includes('ProjectSidebar')
}

export function migrate(fileContents) {
  let app = fileContents['src/App.tsx']
  if (!app) return {}

  // Replace import symbols
  app = app.replace(/\bPageTabs\b/g, 'TopBar')
  app = app.replace(/\bProjectSidebar\b/g, 'IterationSidebar')

  return { 'src/App.tsx': app }
}
