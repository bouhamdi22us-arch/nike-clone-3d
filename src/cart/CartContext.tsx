import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  CART_STORAGE_KEY,
  addToCart,
  cartCount,
  cartTotal,
  loadCart,
  removeFromCart,
  saveCart,
  setQty as setQtyInCart,
  type CartItem,
} from './cart'

interface CartContextValue {
  items: CartItem[]
  /** Adds a product by explicit id, merging into the existing line for the same product + size. */
  add: (id: string, name: string, price: number, size?: string, qty?: number) => void
  remove: (id: string, size?: string) => void
  setQty: (id: string, size: string | undefined, qty: number) => void
  clear: () => void
  /** Subtotal in currency units, rounded to cents. */
  total: number
  /** Total number of units. */
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

function readStoredCart(): CartItem[] {
  try {
    if (typeof window === 'undefined') return []
    return loadCart(window.localStorage.getItem(CART_STORAGE_KEY))
  } catch {
    // Storage blocked (private mode, disabled cookies, security error) — start empty.
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredCart)

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(CART_STORAGE_KEY, saveCart(items))
    } catch {
      // Quota exceeded or storage blocked — the in-memory cart still works.
    }
  }, [items])

  const add = useCallback((id: string, name: string, price: number, size?: string, qty?: number) => {
    setItems((current) =>
      addToCart(current, {
        id,
        name,
        price,
        size,
        qty: qty ?? 1,
      }),
    )
  }, [])

  const remove = useCallback((id: string, size?: string) => {
    setItems((current) => removeFromCart(current, id, size))
  }, [])

  const setQty = useCallback((id: string, size: string | undefined, qty: number) => {
    setItems((current) => setQtyInCart(current, id, size, qty))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const total = useMemo(() => cartTotal(items), [items])
  const count = useMemo(() => cartCount(items), [items])

  const value = useMemo<CartContextValue>(
    () => ({ items, add, remove, setQty, clear, total, count }),
    [items, add, remove, setQty, clear, total, count],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside a <CartProvider>')
  }

  return context
}
