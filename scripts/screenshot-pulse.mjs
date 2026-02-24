import { chromium } from 'playwright'
import { join } from 'path'
import { mkdirSync } from 'fs'

const OUT = join(import.meta.dirname, '../src/projects/landing-page/screenshots')
mkdirSync(OUT, { recursive: true })

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  // Enable console logging for debugging
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text())
  })

  const PORT = process.env.CANVAI_VITE_PORT || '5173'
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(3000)

  // The ProjectPicker is a PickerDropdown with the project name as trigger text.
  // We need to:
  // 1. Click the project name trigger (currently "canvai-ui-system") to open dropdown
  // 2. Click "pulse" in the dropdown list

  // Find and click the project picker trigger — it shows the current project name
  // The trigger contains a span with the project name
  const trigger = await page.$('text=canvai-ui-system')
  if (trigger) {
    console.log('Found project trigger, clicking...')
    await trigger.click()
    await page.waitForTimeout(500)

    // Now find "pulse" in the opened dropdown
    const pulseRow = await page.$('text=pulse')
    if (pulseRow) {
      console.log('Found pulse in dropdown, clicking...')
      await pulseRow.click()
      await page.waitForTimeout(2000)
    } else {
      console.log('Could not find pulse in dropdown')
      // Take a debug screenshot
      await page.screenshot({ path: join(OUT, 'debug-dropdown.png') })

      // List all visible text
      const allText = await page.evaluate(() => document.body.innerText)
      console.log('Visible text includes "pulse":', allText.includes('pulse'))
      console.log('All projects:', allText.match(/[a-z-]+(?=\n|$)/g)?.slice(0, 10))
    }
  } else {
    console.log('Could not find project trigger')
  }

  // Screenshot the canvas with Pulse project visible
  await page.screenshot({ path: join(OUT, 'pulse-canvas.png') })
  console.log('✓ pulse-canvas.png')

  // Navigate to each page and screenshot
  const pages = ['Dashboard', 'Components', 'Settings']
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
    await page.screenshot({ path: join(OUT, `pulse-${pageName.toLowerCase()}.png`) })
    console.log(`✓ pulse-${pageName.toLowerCase()}.png`)
  }

  await browser.close()
  console.log('\nDone! Screenshots saved to:', OUT)
}

main().catch(console.error)
