import { useCart } from '../cart/CartContext'

interface HeaderProps {
  onCartOpen: () => void
}

export default function Header({ onCartOpen }: HeaderProps) {
  const { count } = useCart()

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="site-header__wordmark">
          NIKE<span className="site-header__wordmark-accent">*</span>
        </div>

        <nav className="site-header__nav" aria-label="Primary">
          <a href="#shop">Shop</a>
          <a href="#story">Story</a>
        </nav>

        <button
          type="button"
          className="site-header__bag"
          onClick={onCartOpen}
          aria-label={`Open shopping bag${count > 0 ? `, ${count} items` : ''}`}
        >
          BAG
          {count > 0 ? <span className="site-header__bag-count">{count}</span> : null}
        </button>
      </div>
    </header>
  )
}
