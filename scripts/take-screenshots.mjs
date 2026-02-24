import { chromium } from 'playwright'
import { join } from 'path'

const OUT = join(import.meta.dirname, '../src/projects/landing-page/screenshots')

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  // Navigate to canvas
  const PORT = process.env.CANVAI_VITE_PORT || '5173'
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)

  // 1. Full canvas overview — the shell with frames visible
  await page.screenshot({ path: join(OUT, 'canvas-full.png') })
  console.log('✓ canvas-full.png')

  // 2. Try navigating to latest iteration (V10) Shell page for a nice view
  // Click on the iteration pill or sidebar to get to a good view
  // First, let's see what's on screen and zoom to fit

  // Take a screenshot of just the shell area (topbar + sidebar + canvas)
  const shell = await page.$('[data-testid="canvai-shell"]') || await page.$('#root')
  if (shell) {
    await shell.screenshot({ path: join(OUT, 'shell-chrome.png') })
    console.log('✓ shell-chrome.png')
  }

  // 3. Navigate to see component frames — scroll/pan to show frames
  // Try clicking on V10 iteration if visible
  const pills = await page.$$('button')
  for (const pill of pills) {
    const text = await pill.textContent()
    if (text?.includes('V10')) {
      await pill.click()
      await page.waitForTimeout(1000)
      break
    }
  }
  await page.screenshot({ path: join(OUT, 'canvas-v10.png') })
  console.log('✓ canvas-v10.png')

  // 4. Click on Shell page tab if available
  const tabs = await page.$$('[role="tab"], button')
  for (const tab of tabs) {
    const text = await tab.textContent()
    if (text?.includes('Shell')) {
      await tab.click()
      await page.waitForTimeout(1000)
      break
    }
  }
  await page.screenshot({ path: join(OUT, 'canvas-shell.png') })
  console.log('✓ canvas-shell.png')

  // 5. Click on Components page
  const tabs2 = await page.$$('[role="tab"], button')
  for (const tab of tabs2) {
    const text = await tab.textContent()
    if (text?.includes('Components')) {
      await tab.click()
      await page.waitForTimeout(1000)
      break
    }
  }
  await page.screenshot({ path: join(OUT, 'canvas-components.png') })
  console.log('✓ canvas-components.png')

  // 6. Click on Tokens page
  const tabs3 = await page.$$('[role="tab"], button')
  for (const tab of tabs3) {
    const text = await tab.textContent()
    if (text?.includes('Tokens')) {
      await tab.click()
      await page.waitForTimeout(1000)
      break
    }
  }
  await page.screenshot({ path: join(OUT, 'canvas-tokens.png') })
  console.log('✓ canvas-tokens.png')

  // 7. Wider viewport for hero shots
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.waitForTimeout(500)
  await page.screenshot({ path: join(OUT, 'canvas-wide.png') })
  console.log('✓ canvas-wide.png')

  // 8. Dark/moody crop — just the canvas area without chrome for overlay use
  // Evaluate to get canvas bounds
  const canvasEl = await page.$('canvas, [data-canvas], .canvas-container, [style*="overflow"]')
  if (canvasEl) {
    await canvasEl.screenshot({ path: join(OUT, 'canvas-area.png') })
    console.log('✓ canvas-area.png')
  }

  await browser.close()
  console.log('\nDone! Screenshots saved to:', OUT)
}

main().catch(console.error)
