import { useState } from 'react'

import { categoryFilters, products, type CategoryFilter } from '../data/products'
import ProductCard from './ProductCard'

export default function Shop() {
  const [filter, setFilter] = useState<CategoryFilter>('All')

  const visibleProducts =
    filter === 'All' ? products : products.filter((product) => product.category === filter)

  return (
    <section id="shop" className="shop">
      <div className="container">
        <div className="shop__head">
          <p className="eyebrow">The Collection</p>
          <h2 className="shop__title">Gear for the dare.</h2>
        </div>

        <div className="shop__filters" role="group" aria-label="Filter products by category">
          {categoryFilters.map((category) => (
            <button
              key={category}
              type="button"
              className={`shop__filter${filter === category ? ' is-active' : ''}`}
              aria-pressed={filter === category}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="shop__grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
