import { describe, it, expect, beforeEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { buildSelector, isSelectorUnique } from '../runtime/selector'

describe('buildSelector', () => {
  let dom: JSDOM
  let document: Document

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
    document = dom.window.document
  })

  function createElement(html: string): Element {
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    return container
  }

  describe('basic targeting', () => {
    it('returns tag name for single element', () => {
      const boundary = createElement('<button>Click me</button>')
      const button = boundary.querySelector('button')!
      const selector = buildSelector(button, boundary)
      expect(selector).toBe('button')
    })

    it('returns path for nested element', () => {
      const boundary = createElement('<div><span>Text</span></div>')
      const span = boundary.querySelector('span')!
      const selector = buildSelector(span, boundary)
      expect(selector).toBe('div > span')
    })
  })

  describe('sibling disambiguation with nth-of-type', () => {
    it('uses nth-of-type for multiple siblings of same tag', () => {
      const boundary = createElement(`
        <div>
          <button>First</button>
          <button>Second</button>
          <button>Third</button>
        </div>
      `)
      const buttons = boundary.querySelectorAll('button')

      expect(buildSelector(buttons[0], boundary)).toContain('button:nth-of-type(1)')
      expect(buildSelector(buttons[1], boundary)).toContain('button:nth-of-type(2)')
      expect(buildSelector(buttons[2], boundary)).toContain('button:nth-of-type(3)')
    })

    it('does not use nth-of-type for single element of its type', () => {
      const boundary = createElement(`
        <div>
          <button>Only button</button>
          <span>Some text</span>
        </div>
      `)
      const button = boundary.querySelector('button')!
      const selector = buildSelector(button, boundary)
      expect(selector).not.toContain('nth-of-type')
    })
  })

  describe('dashboard with multiple cards', () => {
    it('uniquely identifies each card in a grid', () => {
      const boundary = createElement(`
        <div class="dashboard">
          <div class="card" data-testid="revenue-card">
            <h3>Revenue</h3>
            <span class="value">$10,000</span>
          </div>
          <div class="card" data-testid="users-card">
            <h3>Users</h3>
            <span class="value">1,234</span>
          </div>
          <div class="card" data-testid="orders-card">
            <h3>Orders</h3>
            <span class="value">567</span>
          </div>
        </div>
      `)

      const cards = boundary.querySelectorAll('.card')
      const selectors = Array.from(cards).map(card => buildSelector(card, boundary))

      // Each selector should be unique
      const uniqueSelectors = new Set(selectors)
      expect(uniqueSelectors.size).toBe(3)

      // Each selector should work
      for (let i = 0; i < cards.length; i++) {
        expect(isSelectorUnique(selectors[i], boundary)).toBe(true)
        const found = boundary.querySelector(selectors[i])
        expect(found).toBe(cards[i])
      }
    })

    it('targets specific element within a card', () => {
      const boundary = createElement(`
        <div class="dashboard">
          <div class="card">
            <h3>Revenue</h3>
            <span class="value">$10,000</span>
          </div>
          <div class="card">
            <h3>Users</h3>
            <span class="value">1,234</span>
          </div>
        </div>
      `)

      const values = boundary.querySelectorAll('.value')
      const selector1 = buildSelector(values[0], boundary)
      const selector2 = buildSelector(values[1], boundary)

      // Selectors should be different
      expect(selector1).not.toBe(selector2)

      // Each should find the correct element
      expect(boundary.querySelector(selector1)).toBe(values[0])
      expect(boundary.querySelector(selector2)).toBe(values[1])
    })
  })

  describe('id-based targeting', () => {
    it('uses id when available and stops traversal', () => {
      const boundary = createElement(`
        <div>
          <div id="main-content">
            <button>Click</button>
          </div>
        </div>
      `)
      const mainContent = boundary.querySelector('#main-content')!
      const selector = buildSelector(mainContent, boundary)
      expect(selector).toBe('#main-content')
    })

    it('ignores radix-prefixed ids', () => {
      const boundary = createElement(`
        <div>
          <div id="radix-123">
            <button>Click</button>
          </div>
        </div>
      `)
      const div = boundary.querySelector('[id^="radix"]')!
      const selector = buildSelector(div, boundary)
      expect(selector).not.toContain('#radix')
    })
  })

  describe('data-testid targeting', () => {
    it('uses data-testid when available', () => {
      const boundary = createElement(`
        <div>
          <button data-testid="submit-btn">Submit</button>
        </div>
      `)
      const button = boundary.querySelector('button')!
      const selector = buildSelector(button, boundary)
      expect(selector).toBe('[data-testid="submit-btn"]')
    })
  })

  describe('class-based targeting', () => {
    it('uses meaningful class for disambiguation', () => {
      const boundary = createElement(`
        <div>
          <div class="card revenue-card">Revenue</div>
          <div class="card users-card">Users</div>
        </div>
      `)
      const cards = boundary.querySelectorAll('.card')
      const selector1 = buildSelector(cards[0], boundary)
      const selector2 = buildSelector(cards[1], boundary)

      expect(selector1).not.toBe(selector2)
      expect(boundary.querySelector(selector1)).toBe(cards[0])
      expect(boundary.querySelector(selector2)).toBe(cards[1])
    })
  })

  describe('deeply nested elements', () => {
    it('handles deeply nested structure', () => {
      const boundary = createElement(`
        <div class="app">
          <div class="sidebar">
            <nav>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>
      `)

      const links = boundary.querySelectorAll('a')
      const selectors = Array.from(links).map(link => buildSelector(link, boundary))

      // All selectors should be unique
      const uniqueSelectors = new Set(selectors)
      expect(uniqueSelectors.size).toBe(3)

      // Each should resolve to correct element
      for (let i = 0; i < links.length; i++) {
        const found = boundary.querySelector(selectors[i])
        expect(found).toBe(links[i])
      }
    })
  })

  describe('isSelectorUnique', () => {
    it('returns true for unique selector', () => {
      const boundary = createElement('<button id="unique">Click</button>')
      expect(isSelectorUnique('#unique', boundary)).toBe(true)
    })

    it('returns false for non-unique selector', () => {
      const boundary = createElement(`
        <div>
          <button>One</button>
          <button>Two</button>
        </div>
      `)
      expect(isSelectorUnique('button', boundary)).toBe(false)
    })

    it('returns false for invalid selector', () => {
      const boundary = createElement('<div></div>')
      expect(isSelectorUnique('[[[invalid', boundary)).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles element at boundary', () => {
      const boundary = createElement('<span>Direct child</span>')
      const span = boundary.querySelector('span')!
      const selector = buildSelector(span, boundary)
      expect(selector).toBe('span')
    })

    it('handles elements with special characters in classes', () => {
      const boundary = createElement('<div class="my-component__item--active">Text</div>')
      const div = boundary.querySelector('div')!
      const selector = buildSelector(div, boundary)
      expect(boundary.querySelector(selector)).toBe(div)
    })

    it('handles SVG elements', () => {
      const boundary = createElement(`
        <svg>
          <circle cx="50" cy="50" r="40"></circle>
          <rect x="10" y="10" width="80" height="80"></rect>
        </svg>
      `)
      const circle = boundary.querySelector('circle')!
      const selector = buildSelector(circle, boundary)
      expect(boundary.querySelector(selector)).toBe(circle)
    })
  })
})

describe('targeting integration', () => {
  let dom: JSDOM
  let document: Document

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
    document = dom.window.document
  })

  it('selector built from any card element is specific to that card', () => {
    const frame = document.createElement('div')
    frame.setAttribute('data-frame-content', 'true')
    frame.innerHTML = `
      <div class="dashboard">
        <div class="stat-card">
          <div class="stat-label">Total Revenue</div>
          <div class="stat-value">$45,231.89</div>
          <div class="stat-change positive">+20.1% from last month</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Subscriptions</div>
          <div class="stat-value">+2350</div>
          <div class="stat-change positive">+180.1% from last month</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Sales</div>
          <div class="stat-value">+12,234</div>
          <div class="stat-change positive">+19% from last month</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Active Now</div>
          <div class="stat-value">+573</div>
          <div class="stat-change positive">+201 since last hour</div>
        </div>
      </div>
    `
    document.body.appendChild(frame)

    const cards = frame.querySelectorAll('.stat-card')

    // Click on the value of the second card
    const targetValue = cards[1].querySelector('.stat-value')!
    const selector = buildSelector(targetValue, frame)

    // Selector should uniquely identify this element
    expect(isSelectorUnique(selector, frame)).toBe(true)

    // Selector should find the exact element we clicked
    const found = frame.querySelector(selector)
    expect(found).toBe(targetValue)
    expect(found?.textContent).toBe('+2350')
  })
})
