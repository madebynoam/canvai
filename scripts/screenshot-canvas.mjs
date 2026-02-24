import { chromium } from 'playwright'
import { join } from 'path'

const OUT = join(import.meta.dirname, '../src/projects/landing-page/screenshots')
const PORT = process.env.CANVAI_VITE_PORT || process.argv[2] || '5173'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  console.log(`Opening http://localhost:${PORT}/...`)
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(4000)

  // Find and click the project picker to switch to landing-page
  console.log('Looking for project picker...')

  // The project picker shows the current project name in the topbar
  // Click the project name/dropdown trigger
  const projectTrigger = page.locator('text=canvai-ui-system').first()
  if (await projectTrigger.count() > 0) {
    await projectTrigger.click()
    await page.waitForTimeout(1000)
    console.log('Clicked project picker')

    // Now click landing-page in the dropdown
    const lpOption = page.locator('text=landing-page').first()
    if (await lpOption.count() > 0) {
      await lpOption.click()
      await page.waitForTimeout(3000)
      console.log('Selected landing-page project')
    } else {
      console.log('landing-page not found in dropdown')
      // Try screenshot anyway
    }
  } else {
    console.log('Project picker not found, trying alternative...')
  }

  await page.screenshot({ path: join(OUT, 'canvas-lp-initial.png') })
  console.log('✓ canvas-lp-initial.png')

  // Now try to navigate to V4 iteration
  const v4Tab = page.locator('text=V4').first()
  if (await v4Tab.count() > 0) {
    await v4Tab.click()
    await page.waitForTimeout(2000)
    console.log('Switched to V4')
  }

  // Try to click "Rams" page in the sidebar
  const ramsLink = page.locator('text=Rams').first()
  if (await ramsLink.count() > 0) {
    await ramsLink.click()
    await page.waitForTimeout(3000)
    console.log('Navigated to Rams page')
  }

  await page.screenshot({ path: join(OUT, 'canvas-rams-grid.png') })
  console.log('✓ canvas-rams-grid.png')

  // Try V3 Directions
  const v3Link = page.locator('text=V3 Directions').first()
  if (await v3Link.count() > 0) {
    await v3Link.click()
    await page.waitForTimeout(3000)
    await page.screenshot({ path: join(OUT, 'canvas-v3-directions.png') })
    console.log('✓ canvas-v3-directions.png')
  }

  // Try Originals
  const origLink = page.locator('text=Originals').first()
  if (await origLink.count() > 0) {
    await origLink.click()
    await page.waitForTimeout(3000)
    await page.screenshot({ path: join(OUT, 'canvas-originals.png') })
    console.log('✓ canvas-originals.png')
  }

  await browser.close()
  console.log('\nDone!')
}

main().catch(console.error)
