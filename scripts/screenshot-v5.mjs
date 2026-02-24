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

  // Switch to landing-page project
  const projectTrigger = page.locator('text=canvai-ui-system').first()
  if (await projectTrigger.count() > 0) {
    await projectTrigger.click()
    await page.waitForTimeout(1000)
    const lpOption = page.locator('text=landing-page').first()
    if (await lpOption.count() > 0) {
      await lpOption.click()
      await page.waitForTimeout(3000)
    }
  }

  // Navigate to V5
  const v5Tab = page.locator('text=V5').first()
  if (await v5Tab.count() > 0) {
    await v5Tab.click()
    await page.waitForTimeout(2000)
  }

  // Navigate to "Rams Catalog" page
  const ramsLink = page.locator('text=Rams Catalog').first()
  if (await ramsLink.count() > 0) {
    await ramsLink.click()
    await page.waitForTimeout(3000)
  }

  await page.screenshot({ path: join(OUT, 'v5-rams-catalog.png') })
  console.log('✓ v5-rams-catalog.png')

  await browser.close()
  console.log('Done!')
}

main().catch(console.error)
