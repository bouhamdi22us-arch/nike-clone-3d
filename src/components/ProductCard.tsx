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
        <span className="product-card__monogram">{productMonogram(product)}</span>
      </button>

      <div className="product-card__meta">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
      </div>

      <button type="button" className="btn btn--ink product-card__add" onClick={handleAddToBag}>
        ADD TO BAG
      </button>

      {isModalOpen ? <ProductModal product={product} onClose={handleCloseModal} /> : null}
    </article>
  )
}
