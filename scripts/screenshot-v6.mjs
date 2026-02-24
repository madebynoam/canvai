import { chromium } from 'playwright'
import { join } from 'path'

const OUT = join(import.meta.dirname, '../src/projects/landing-page/screenshots')
const PORT = process.env.CANVAI_VITE_PORT || '5173'

const V6_FRAMES = [
  'drift', 'lumen', 'meridian', 'threshold', 'flux',
  'parallel', 'zenith', 'carbon', 'aperture', 'harmonic',
]

async function main() {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({
    viewport: { width: 2560, height: 1440 },
    deviceScaleFactor: 2,
  })
  const page = await ctx.newPage()

  // Suppress console errors from font loads etc
  page.on('pageerror', (err) => console.log('  Page error:', err.message.slice(0, 100)))

  console.log(`Navigating to http://localhost:${PORT}/...`)
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.waitForTimeout(5000)

  // Switch to landing-page project
  console.log('Switching to landing-page project...')
  const projectTrigger = page.locator('button').filter({ hasText: /canvai-ui-system|pulse|landing/ }).first()
  if (await projectTrigger.count() > 0) {
    await projectTrigger.click()
    await page.waitForTimeout(1000)
    const lpOption = page.locator('text=landing-page').first()
    if (await lpOption.count() > 0) {
      await lpOption.click()
      await page.waitForTimeout(3000)
    }
  }

  // Navigate to V6
  console.log('Navigating to V6...')
  const v6Tab = page.locator('button, [role="tab"]').filter({ hasText: 'V6' }).first()
  if (await v6Tab.count() > 0) {
    await v6Tab.click()
    await page.waitForTimeout(2000)
  }

  // Navigate to Expressive page
  const expressiveLink = page.locator('text=Expressive').first()
  if (await expressiveLink.count() > 0) {
    await expressiveLink.click()
    await page.waitForTimeout(3000)
  }

  // Screenshot the full canvas view with all 10 V6 LPs
  await page.screenshot({ path: join(OUT, 'v6-expressive-canvas.png') })
  console.log('✓ v6-expressive-canvas.png')

  // Now screenshot individual frames by looking for frame containers
  for (const name of V6_FRAMES) {
    const frameId = `v6-${name}`
    // Try to find the frame element by data attribute or ID
    const frame = page.locator(`[data-frame-id="${frameId}"], #${frameId}`).first()
    if (await frame.count() > 0) {
      try {
        await frame.scrollIntoViewIfNeeded({ timeout: 5000 })
        await page.waitForTimeout(1000)
        await frame.screenshot({ path: join(OUT, `lp-${name}.png`), timeout: 10000 })
        console.log(`✓ lp-${name}.png`)
      } catch (e) {
        console.log(`✗ lp-${name}.png (${e.message.slice(0, 80)})`)
      }
    } else {
      console.log(`✗ lp-${name}.png (frame not found)`)
    }
  }

  await browser.close()
  console.log('\nDone!')
}

main().catch(console.error)
