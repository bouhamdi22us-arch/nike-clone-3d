import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import Checkout from './Checkout'
import { CartProvider } from '../cart/CartContext'

/**
 * Render-only smoke test: no jsdom in this project, so this verifies the
 * component mounts without throwing and exposes the expected form structure.
 * Behavioural validation lives in src/checkout/validation.test.ts.
 */
describe('Checkout', () => {
  const html = renderToStaticMarkup(
    <CartProvider>
      <Checkout onClose={() => {}} />
    </CartProvider>,
  )

  it('renders an accessible modal dialog', () => {
    expect(html).toContain('role="dialog"')
    expect(html).toContain('aria-modal="true"')
    expect(html).toContain('CHECKOUT')
  })

  it('renders the order summary with free shipping and a total', () => {
    expect(html).toContain('Order summary')
    expect(html).toContain('FREE')
    expect(html).toContain('Total')
  })

  it('renders every checkout field', () => {
    const fields = [
      'fullName',
      'email',
      'address',
      'city',
      'zip',
      'cardNumber',
      'expiry',
      'cvc',
      'cardName',
    ]

    for (const field of fields) {
      expect(html, field).toContain(`id="checkout-${field}"`)
    }
  })

  it('starts with no inline errors', () => {
    expect(html).not.toContain('checkout__error')
    expect(html).not.toContain('aria-invalid="true"')
  })
})
