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

  const PORT = process.env.CANVAI_VITE_PORT || '5173'
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)

  // Navigate to landing-page project
  // Click the project picker to switch to landing-page
  const projectPicker = await page.$('text=landing-page')
  if (!projectPicker) {
    // Try clicking the dropdown first
    const dropdowns = await page.$$('button')
    for (const btn of dropdowns) {
      const text = await btn.textContent()
      if (text?.includes('canvai-ui-system') || text?.includes('project')) {
        await btn.click()
        await page.waitForTimeout(500)
        break
      }
    }
    // Look for landing-page in dropdown
    const lpOption = await page.$('text=landing-page')
    if (lpOption) {
      await lpOption.click()
      await page.waitForTimeout(1500)
    }
  }

  // Screenshot each page tab
  const pages = ['Noir', 'Aurora', 'Canvas', 'Bento', 'Shift']
  for (const pageName of pages) {
    const tabs = await page.$$('button, [role="tab"], a')
    for (const tab of tabs) {
      const text = await tab.textContent()
      if (text?.trim() === pageName) {
        await tab.click()
        await page.waitForTimeout(1500)
        break
      }
    }
    await page.screenshot({ path: join(OUT, `lp-${pageName.toLowerCase()}.png`) })
    console.log(`✓ lp-${pageName.toLowerCase()}.png`)
  }

  await browser.close()
  console.log('\nDone!')
}

main().catch(console.error)
