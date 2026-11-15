import { useState, type FormEvent } from 'react'

import { EMAIL_PATTERN } from '../checkout/validation'

const SUCCESS_MESSAGE = 'WELCOME TO THE CLUB.'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const value = email.trim()
    if (!EMAIL_PATTERN.test(value)) {
      setError('Enter a valid email address.')
      return
    }

    // Simulated signup — nothing is stored or sent anywhere.
    setError(null)
    setSubscribed(true)
  }

  if (subscribed) {
    return (
      <section className="newsletter">
        <div className="container newsletter__inner">
          <p className="eyebrow">The Club</p>
          <h2 className="newsletter__title" role="status">{SUCCESS_MESSAGE}</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div className="newsletter__copy">
          <p className="eyebrow">The Club</p>
          <h2 className="newsletter__title">Get the drop first.</h2>
          <p className="newsletter__sub">
            Early access to new drops, member-only stories and first looks. No noise, no spam —
            just the next move.
          </p>
        </div>

        <form className="newsletter__form" onSubmit={handleSubmit} noValidate>
          <label className="newsletter__label" htmlFor="newsletter-email">
            Email address
          </label>
          <div className="newsletter__form-row">
            <input
              id="newsletter-email"
              className="newsletter__input"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError(null)
              }}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'newsletter-email-error' : undefined}
            />
            <button className="btn btn--volt newsletter__submit" type="submit">
              Sign up
            </button>
          </div>
          {error ? (
            <p className="newsletter__error" id="newsletter-email-error">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
