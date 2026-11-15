interface FooterLink {
  label: string
  href: string
  /** Present when the link is a placeholder (`href="#"`); keeps the accessible name meaningful. */
  ariaLabel?: string
}

const SHOP_LINKS: FooterLink[] = [
  { label: 'Shoes', href: '#shop' },
  { label: 'Apparel', href: '#shop' },
  { label: 'Accessories', href: '#shop' },
]

const HELP_LINKS: FooterLink[] = [
  { label: 'Shipping', href: '#', ariaLabel: 'Shipping information' },
  { label: 'Returns', href: '#', ariaLabel: 'Returns information' },
  { label: 'Size guide', href: '#', ariaLabel: 'Size guide' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__wordmark">
            NIKE<span className="site-footer__wordmark-accent">*</span>
          </p>
          <p className="site-footer__tag">Just do it. Then move again.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Shop</h3>
            <ul className="site-footer__list">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__col">
            <h3 className="site-footer__heading">Help</h3>
            <ul className="site-footer__list">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} aria-label={link.ariaLabel}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <p className="site-footer__legal">
            © 2026 Nike Clone — a portfolio/practice project. Not affiliated with Nike, Inc.
          </p>
          <p className="site-footer__credit">Built with React + three.js</p>
        </div>
      </div>
    </footer>
  )
}
