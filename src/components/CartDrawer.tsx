import { useEffect, useRef } from 'react'

import { products } from '../data/products'
import { useCart } from '../cart/CartContext'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, setQty, remove, total, count } = useCart()
  const drawerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const previouslyFocused = document.activeElement as HTMLElement | null
    const closeButton = drawerRef.current?.querySelector<HTMLElement>('.cart-drawer__close')
    closeButton?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <>
      <div
        className={`cart-drawer__backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className={`cart-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <header className="cart-drawer__header">
          <h2 className="cart-drawer__title">BAG ({count})</h2>
          <button
            type="button"
            className="cart-drawer__close"
            onClick={onClose}
            aria-label="Close shopping bag"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {items.length === 0 ? (
          <p className="cart-drawer__empty">Your bag is empty.</p>
        ) : (
          <>
            <ul className="cart-drawer__lines">
              {items.map((item) => {
                const product = products.find((candidate) => candidate.id === item.id)

                return (
                  <li
                    key={`${item.id}-${item.size ?? 'default'}`}
                    className="cart-drawer__line"
                  >
                    <div
                      className="cart-drawer__swatch"
                      style={{ background: product?.gradient ?? 'linear-gradient(135deg, #cccccc, #888888)' }}
                    />
                    <div className="cart-drawer__line-info">
                      <p className="cart-drawer__line-name">{item.name}</p>
                      {item.size ? <p className="cart-drawer__line-size">Size {item.size}</p> : null}
                    </div>
                    <div className="cart-drawer__qty">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQty(item.id, item.size, item.qty - 1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty(item.id, item.size, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-drawer__line-price">${(item.price * item.qty).toFixed(2)}</p>
                    <button
                      type="button"
                      className="cart-drawer__remove"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.id, item.size)}
                    >
                      ×
                    </button>
                  </li>
                )
              })}
            </ul>

            <footer className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <p className="cart-drawer__promo">Members get free shipping</p>
              <button type="button" className="btn btn--ink cart-drawer__checkout" onClick={onCheckout}>
                CHECKOUT
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
