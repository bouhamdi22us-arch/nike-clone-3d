import { useEffect, useId, useRef, useState, type MouseEvent } from 'react'

import { defaultSizeFor, productMonogram, type Product } from '../data/products'
import { useCart } from '../cart/CartContext'

const SHOE_SIZES = ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'] as const
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const

interface ProductModalProps {
  product: Product
  onClose: () => void
}

function sizesFor(product: Product): string[] {
  if (product.category === 'Shoes') {
    return [...SHOE_SIZES]
  }
  if (product.category === 'Apparel') {
    return [...APPAREL_SIZES]
  }
  return []
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { add } = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const sizeLabelId = useId()
  const [selectedSize, setSelectedSize] = useState<string | undefined>(() => defaultSizeFor(product))
  const [quantity, setQuantity] = useState(1)

  const sizes = sizesFor(product)
  const hasSize = sizes.length > 0

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const panel = panelRef.current
        if (!panel) return

        const focusable = panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement

        if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const handleAddToBag = () => {
    add(product.id, product.name, product.price, selectedSize, quantity)
    onClose()
  }

  const handleBackdropClick = () => {
    onClose()
  }

  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div className="product-modal">
      <div className="product-modal__backdrop" onClick={handleBackdropClick} />
      <div
        ref={panelRef}
        className="product-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onClick={handlePanelClick}
      >
        <div className="product-modal__art" style={{ background: product.gradient }}>
          <button
            ref={closeRef}
            type="button"
            className="product-modal__close"
            onClick={onClose}
            aria-label="Close product details"
          >
            <span aria-hidden="true">×</span>
          </button>
          <span className="product-modal__art-monogram">{productMonogram(product)}</span>
        </div>

        <div className="product-modal__body">
          <div className="product-modal__heading">
            <p className="eyebrow">{product.category}</p>
            <h3 className="product-modal__name" id={headingId}>
              {product.name}
            </h3>
            <p className="product-modal__price">${product.price.toFixed(2)}</p>
          </div>

          <p className="product-modal__tagline">{product.tagline}</p>

          {hasSize ? (
            <div className="product-modal__field">
              <span className="product-modal__label" id={sizeLabelId}>
                Size
              </span>
              <div
                className="product-modal__sizes"
                role="group"
                aria-labelledby={sizeLabelId}
              >
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`product-modal__size${selectedSize === size ? ' is-selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="product-modal__field">
            <span className="product-modal__label">Quantity</span>
            <div className="product-modal__qty">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                −
              </button>
              <span className="product-modal__qty-value">{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => current + 1)}>
                +
              </button>
            </div>
          </div>

          <button type="button" className="btn btn--ink product-modal__add" onClick={handleAddToBag}>
            ADD TO BAG
          </button>
        </div>
      </div>
    </div>
  )
}
