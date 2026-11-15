import Sneaker3D from './Sneaker3D'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">NIKE — CLONE EXPERIENCE</p>
          <h1 className="display-1 hero__title">
            JUST DO <span className="hero__accent">IT.</span>
            <br />
            <span className="hero__accent">IF YOU DARE.</span>
          </h1>
          <p className="hero__sub">A procedural 3D sneaker engineered without limits.</p>
          <div className="hero__ctas">
            <a className="btn btn--volt" href="#shop">
              Shop now
            </a>
            <a className="btn btn--ghost" href="#shop">
              Find your size
            </a>
          </div>
          <p className="hero__micro">Free shipping over $150 — 30-day returns</p>
        </div>
        <div className="hero__stage" aria-hidden="true">
          <Sneaker3D />
        </div>
      </div>
      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="hero__marquee-item" aria-hidden="true">
              JUST DO IT <span className="hero__marquee-sep">·</span> MOVE FAST <span className="hero__marquee-sep">·</span> BREAK BARRIERS
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
