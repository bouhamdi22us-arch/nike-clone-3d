import { describe, expect, it } from 'vitest'

import {
  addToCart,
  cartTotal,
  loadCart,
  removeFromCart,
  saveCart,
  setQty,
  type CartItem,
} from './cart'

const runner = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: 'air-volt-runner',
  name: 'Air Volt Runner',
  price: 149.99,
  qty: 1,
  size: '9',
  ...overrides,
})

describe('addToCart', () => {
  it('merges a second add of the same id + size into one line', () => {
    const first = addToCart([], runner())
    const second = addToCart(first, runner({ qty: 2 }))

    expect(second).toHaveLength(1)
    expect(second[0]).toMatchObject({ id: 'air-volt-runner', size: '9', qty: 3 })
  })

  it('keeps different sizes of the same product on separate lines', () => {
    const items = addToCart(addToCart([], runner()), runner({ size: '10' }))

    expect(items).toHaveLength(2)
    expect(items.map((item) => item.size)).toEqual(['9', '10'])
  })

  it('appends a new line for a different product', () => {
    const items = addToCart(
      addToCart([], runner()),
      runner({ id: 'pro-dri-fit-tee', name: 'Pro Dri-FIT Tee', price: 34.99, size: 'M' }),
    )

    expect(items).toHaveLength(2)
    expect(items[1]).toMatchObject({ id: 'pro-dri-fit-tee', qty: 1 })
  })

  it('does not mutate the input array', () => {
    const original: CartItem[] = [runner()]
    const snapshot = [...original]

    addToCart(original, runner({ qty: 4 }))

    expect(original).toEqual(snapshot)
    expect(original[0].qty).toBe(1)
  })
})

describe('setQty', () => {
  it('sets the quantity of a matching line', () => {
    const items = setQty(addToCart([], runner()), 'air-volt-runner', '9', 5)

    expect(items[0].qty).toBe(5)
  })

  it('removes the line when qty is 0', () => {
    const items = setQty(addToCart([], runner()), 'air-volt-runner', '9', 0)

    expect(items).toEqual([])
  })

  it('removes the line when qty is negative', () => {
    const items = setQty(addToCart([], runner()), 'air-volt-runner', '9', -3)

    expect(items).toEqual([])
  })

  it('only touches the matching size', () => {
    const items = addToCart(addToCart([], runner()), runner({ size: '10' }))
    const next = setQty(items, 'air-volt-runner', '10', 2)

    expect(next).toHaveLength(2)
    expect(next.find((item) => item.size === '9')?.qty).toBe(1)
    expect(next.find((item) => item.size === '10')?.qty).toBe(2)
  })
})

describe('removeFromCart', () => {
  it('removes the line matching id + size', () => {
    const items = removeFromCart(addToCart([], runner()), 'air-volt-runner', '9')

    expect(items).toEqual([])
  })

  it('leaves the cart untouched when nothing matches', () => {
    const items = removeFromCart(addToCart([], runner()), 'nope', '9')

    expect(items).toHaveLength(1)
  })
})

describe('cartTotal', () => {
  it('is 0 for an empty cart', () => {
    expect(cartTotal([])).toBe(0)
  })

  it('rounds to cents (129.99 x 2 → 259.98)', () => {
    const items: CartItem[] = [
      { id: 'tempo-track-spike', name: 'Tempo Track Spike', price: 129.99, qty: 2 },
    ]

    expect(cartTotal(items)).toBe(259.98)
  })

  it('survives fractional float drift across several lines', () => {
    const items: CartItem[] = [
      { id: 'a', name: 'A', price: 0.1, qty: 1 },
      { id: 'b', name: 'B', price: 0.2, qty: 1 },
    ]

    expect(cartTotal(items)).toBe(0.3)
  })
})

describe('loadCart', () => {
  it('returns an empty cart for null', () => {
    expect(loadCart(null)).toEqual([])
  })

  it('returns an empty cart for corrupt JSON', () => {
    expect(loadCart('{not json')).toEqual([])
  })

  it('returns an empty cart when the payload is not an array', () => {
    expect(loadCart('{"items":[]}')).toEqual([])
  })

  it('drops entries with missing or non-numeric price/qty', () => {
    const json = JSON.stringify([
      runner(),
      { id: 'no-price', name: 'No Price', qty: 1 },
      { id: 'string-price', name: 'String Price', price: '149.99', qty: 1 },
      { id: 'string-qty', name: 'String Qty', price: 10, qty: '2' },
      { name: 'Missing Id', price: 10, qty: 1 },
      { id: '', name: 'Empty Id', price: 10, qty: 1 },
      null,
      'nope',
      42,
    ])

    const items = loadCart(json)

    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({ id: 'air-volt-runner', qty: 1 })
  })

  it('clamps stored quantities to at least 1', () => {
    const json = JSON.stringify([runner({ qty: 0 }), runner({ id: 'b', qty: -5 })])

    const items = loadCart(json)

    expect(items.map((item) => item.qty)).toEqual([1, 1])
  })

  it('round-trips through saveCart', () => {
    const items = addToCart(addToCart([], runner()), runner({ size: '10', qty: 2 }))

    expect(loadCart(saveCart(items))).toEqual(items)
  })
})
