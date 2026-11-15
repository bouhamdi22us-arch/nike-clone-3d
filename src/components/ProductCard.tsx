import { useState } from 'react'

import { defaultSizeFor, productMonogram, type Product } from '../data/products'
import { useCart } from '../cart/CartContext'
import ProductModal from './ProductModal'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleAddToBag = () => {
    add(product.id, product.name, product.price, defaultSizeFor(product))
  }

  return (
    <article className="product-card">
      <button
        type="button"
        className="product-card__visual"
        style={{ background: product.gradient }}
        onClick={handleOpenModal}
        aria-label={`View ${product.name}`}
      >
        {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
        <span className="product-card__monogram" aria-hidden="true">{productMonogram(product)}</span>
        <span className="product-card__tile-name">
          <span className="product-card__category">{product.category}</span>
          <span className="product-card__name">{product.name}</span>
        </span>
      </button>

      <div className="product-card__meta">
        <p className="product-card__price">${product.price.toFixed(2)}</p>
      </div>

      <button type="button" className="btn btn--ink product-card__add" onClick={handleAddToBag}>
        ADD TO BAG
      </button>

      {isModalOpen ? <ProductModal product={product} onClose={handleCloseModal} /> : null}
    </article>
  )
}
