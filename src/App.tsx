import { useState } from 'react'

import { CartProvider } from './cart/CartContext'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Newsletter from './components/Newsletter'
import Shop from './components/Shop'
import Story from './components/Story'

export default function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)

  const handleCheckout = () => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  return (
    <CartProvider>
      <Header onCartOpen={openCart} />
      <main>
        <Hero />
        <Shop />
        <Story />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} onCheckout={handleCheckout} />
      {checkoutOpen ? <Checkout onClose={() => setCheckoutOpen(false)} /> : null}
    </CartProvider>
  )
}
