import { chromium } from 'playwright'
import { join } from 'path'

const OUT = join(import.meta.dirname, '../src/projects/landing-page/screenshots')

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  const PORT = process.env.CANVAI_VITE_PORT || '5173'
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(4000)

  // Switch to pulse project
  const projectTrigger = page.locator('text=canvai-ui-system').first()
  if (await projectTrigger.count() > 0) {
    await projectTrigger.click()
    await page.waitForTimeout(1000)
    const pulseOption = page.locator('text=pulse').first()
    if (await pulseOption.count() > 0) {
      await pulseOption.click()
      await page.waitForTimeout(3000)
      console.log('Switched to pulse project')
    } else {
      console.log('pulse project not found')
    }
  }

  // Should be on "All Directions" page (first page)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: join(OUT, 'product-directions.png') })
  console.log('✓ product-directions.png (All Directions — 4 dashboards side by side)')

  // Also try the Dashboard page for a single clean shot
  const dashLink = page.locator('text=Dashboard').first()
  if (await dashLink.count() > 0) {
    await dashLink.click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: join(OUT, 'product-dashboard.png') })
    console.log('✓ product-dashboard.png (single dashboard)')
  }

  // Components page
  const compLink = page.locator('text=Components').first()
  if (await compLink.count() > 0) {
    await compLink.click()
    await page.waitForTimeout(2000)
    await page.screenshot({ path: join(OUT, 'product-components.png') })
    console.log('✓ product-components.png')
  }

  await browser.close()
  console.log('\nDone!')
}

main().catch(console.error)
