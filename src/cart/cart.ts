/** localStorage key that holds the serialized cart. */
export const CART_STORAGE_KEY = 'nike-clone-cart'

export interface CartItem {
  id: string
  qty: number
  size?: string
  price: number
  name: string
}

/** Quantities are always whole numbers, at least 1. */
function normalizeQty(qty: number): number {
  const floored = Math.floor(qty)
  if (!Number.isFinite(floored) || floored < 1) return 1
  return floored
}

/** A cart line is identified by product id + size (a size-less line has `undefined`). */
function isSameLine(item: CartItem, id: string, size?: string): boolean {
  return item.id === id && (item.size ?? undefined) === (size ?? undefined)
}

/** Adds an item, merging into the existing line when id + size already exist. */
export function addToCart(items: CartItem[], item: CartItem): CartItem[] {
  const qty = normalizeQty(item.qty)
  const index = items.findIndex((existing) => isSameLine(existing, item.id, item.size))

  if (index === -1) {
    return [...items, { ...item, qty }]
  }

  return items.map((existing, i) =>
    i === index ? { ...existing, qty: normalizeQty(existing.qty + qty) } : existing,
  )
}

/** Sets a line's quantity; `qty <= 0` removes the line. */
export function setQty(
  items: CartItem[],
  id: string,
  size: string | undefined,
  qty: number,
): CartItem[] {
  if (!Number.isFinite(qty)) return items

  if (qty <= 0) return removeFromCart(items, id, size)

  const index = items.findIndex((item) => isSameLine(item, id, size))
  if (index === -1) return items

  return items.map((item, i) => (i === index ? { ...item, qty: normalizeQty(qty) } : item))
}

/** Removes the line matching id + size. */
export function removeFromCart(
  items: CartItem[],
  id: string,
  size?: string,
): CartItem[] {
  return items.filter((item) => !isSameLine(item, id, size))
}

/** Cart subtotal in currency units, rounded to whole cents. */
export function cartTotal(items: CartItem[]): number {
  const sum = items.reduce((acc, item) => acc + item.price * item.qty, 0)
  return Math.round(sum * 100) / 100
}

/** Total number of units in the cart. */
export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, item) => acc + item.qty, 0)
}

function parseCartItem(value: unknown): CartItem | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null

  const record = value as Record<string, unknown>

  if (typeof record.id !== 'string' || record.id.trim() === '') return null
  if (typeof record.name !== 'string' || record.name.trim() === '') return null
  if (typeof record.price !== 'number' || !Number.isFinite(record.price)) return null
  if (record.price < 0) return null
  if (typeof record.qty !== 'number' || !Number.isFinite(record.qty)) return null

  const item: CartItem = {
    id: record.id,
    name: record.name,
    price: record.price,
    qty: normalizeQty(record.qty),
  }

  if (typeof record.size === 'string' && record.size.trim() !== '') {
    item.size = record.size
  }

  return item
}

/**
 * Parses a persisted cart. Anything unparseable (missing key, corrupt JSON,
 * wrong shape, bad lines) degrades to an empty / partial cart rather than throwing.
 */
export function loadCart(json: string | null): CartItem[] {
  if (!json) return []

  try {
    const parsed: unknown = JSON.parse(json)
    if (!Array.isArray(parsed)) return []

    const items: CartItem[] = []
    for (const entry of parsed) {
      const item = parseCartItem(entry)
      if (item) items.push(item)
    }
    return items
  } catch {
    return []
  }
}

/** Serializes the cart for localStorage. */
export function saveCart(items: CartItem[]): string {
  return JSON.stringify(items)
}
