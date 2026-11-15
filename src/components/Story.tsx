export default function Story() {
  return (
    <section id="story" className="story">
      <div className="container story__inner">
        <div className="story__copy">
          <p className="eyebrow">The Story</p>
          <h2 className="display-1 story__title">
            <span>MOVE.</span>
            <br />
            <span>
              THEN <span className="story__title-accent">MOVE</span> AGAIN.
            </span>
          </h2>
          <p className="story__sub">
            A personal practice build. We wrote a story about movement and then built the whole
            thing: a procedural 3D sneaker, engineered without limits, inside a storefront that
            exists only on screen. The shoe is real. The clone is real.
          </p>
        </div>

        <div className="story__art" aria-hidden="true">
          <span className="story__art__word">AIR</span>
        </div>
      </div>

      <div className="container">
        <ul className="story__stats">
          <li className="story__stat">
            <p className="story__stat-value">40+</p>
            <p className="story__stat-label">Legendary lines</p>
          </li>
          <li className="story__stat">
            <p className="story__stat-value">12</p>
            <p className="story__stat-label">Silhouettes</p>
          </li>
          <li className="story__stat">
            <p className="story__stat-value">1</p>
            <p className="story__stat-label">One mission</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
