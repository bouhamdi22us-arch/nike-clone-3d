import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type Ref,
} from 'react'

import { useCart } from '../cart/CartContext'
import { products } from '../data/products'
import {
  firstErrorField,
  generateOrderNumber,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutValues,
} from '../checkout/validation'

const EMPTY_VALUES: CheckoutValues = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
  cardName: '',
}

const PROCESSING_MS = 800

interface FieldProps {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
  inputRef?: Ref<HTMLInputElement>
  type?: 'text' | 'email'
  inputMode?: 'text' | 'email' | 'numeric'
  autoComplete?: string
  placeholder?: string
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
  inputRef,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
}: FieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="checkout__field">
      <label className="checkout__label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        className="checkout__input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p className="checkout__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface CheckoutProps {
  onClose: () => void
}

export default function Checkout({ onClose }: CheckoutProps) {
  const { items, total, clear } = useCart()
  const [values, setValues] = useState<CheckoutValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const panelRef = useRef<HTMLDivElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)
  const continueRef = useRef<HTMLButtonElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const headingId = useId()

  // Lock background scrolling while the overlay is open.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Restore focus to whatever opened checkout when the overlay closes.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    return () => {
      previouslyFocused?.focus?.()
    }
  }, [])

  // Move focus into the panel on open and after moving to the confirmation.
  useEffect(() => {
    if (confirmed) {
      continueRef.current?.focus()
    } else {
      firstFieldRef.current?.focus()
    }
  }, [confirmed])

  // Clear a pending fake-processing timer if the overlay unmounts early.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Escape closes (except while processing) and Tab stays inside the dialog.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!processing) {
          onClose()
        }
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const panel = panelRef.current
      if (!panel) {
        return
      }

      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), [href], select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) {
        return
      }

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

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, processing])

  const updateField = (field: CheckoutField, value: string) => {
    const next = { ...values, [field]: value }
    setValues(next)
    // Re-validate live only after the first submit attempt, so typing a fresh
    // form doesn't scream at the user before they've had a chance to finish.
    if (submitted) {
      setErrors(validateCheckout(next))
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (processing) {
      return
    }

    setSubmitted(true)
    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)

    const firstInvalid = firstErrorField(nextErrors)
    if (firstInvalid) {
      document.getElementById(`checkout-${firstInvalid}`)?.focus()
      return
    }

    setProcessing(true)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setOrderNumber(generateOrderNumber())
      clear()
      setProcessing(false)
      setConfirmed(true)
    }, PROCESSING_MS)
  }

  return (
    <div className="checkout">
      <div className="checkout__scrim" aria-hidden="true" />
      <div
        ref={panelRef}
        className={`checkout__panel${confirmed ? ' is-confirmed' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-busy={processing || undefined}
      >
        {confirmed ? (
          <div className="checkout__confirmation">
            <span className="checkout__check" aria-hidden="true">
              ✓
            </span>
            <h2 className="checkout__confirmed-title" id={headingId}>
              ORDER CONFIRMED
            </h2>
            <p className="checkout__order">
              Order
              <strong>{orderNumber}</strong>
            </p>
            <p className="checkout__email">
              A confirmation email was sent to {values.email.trim()}.
            </p>
            <button
              ref={continueRef}
              type="button"
              className="btn btn--volt"
              onClick={onClose}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <div className="checkout__layout">
            <aside className="checkout__summary" aria-label="Order summary">
              <div className="checkout__summary-top">
                <p className="eyebrow checkout__summary-eyebrow">Order summary</p>
                <button
                  type="button"
                  className="checkout__close"
                  onClick={onClose}
                  aria-label="Close checkout"
                  disabled={processing}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <h2 className="checkout__title" id={headingId}>
                CHECKOUT
              </h2>

              {items.length === 0 ? (
                <p className="checkout__empty">Your bag is empty.</p>
              ) : (
                <ul className="checkout__lines">
                  {items.map((item) => {
                    const product = products.find((candidate) => candidate.id === item.id)

                    return (
                      <li
                        key={`${item.id}-${item.size ?? 'default'}`}
                        className="checkout__line"
                      >
                        <span
                          className="checkout__swatch"
                          style={{
                            background:
                              product?.gradient ??
                              'linear-gradient(135deg, #cccccc, #888888)',
                          }}
                          aria-hidden="true"
                        />
                        <span className="checkout__line-info">
                          <span className="checkout__line-name">{item.name}</span>
                          <span className="checkout__line-meta">
                            {item.size ? `${item.size} · ` : ''}Qty {item.qty}
                          </span>
                        </span>
                        <span className="checkout__line-price">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}

              <dl className="checkout__totals">
                <div className="checkout__total-row">
                  <dt>Subtotal</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>
                <div className="checkout__total-row">
                  <dt>Shipping</dt>
                  <dd className="checkout__free">FREE</dd>
                </div>
                <div className="checkout__total-row checkout__total-row--grand">
                  <dt>Total</dt>
                  <dd>${total.toFixed(2)}</dd>
                </div>
              </dl>
            </aside>

            <form className="checkout__form" onSubmit={handleSubmit} noValidate>
              <section className="checkout__section" aria-labelledby={`${headingId}-shipping`}>
                <h3 className="checkout__section-title" id={`${headingId}-shipping`}>
                  Shipping
                </h3>
                <Field
                  id="checkout-fullName"
                  label="Full name"
                  value={values.fullName}
                  error={errors.fullName}
                  onChange={(value) => updateField('fullName', value)}
                  inputRef={firstFieldRef}
                  autoComplete="name"
                />
                <Field
                  id="checkout-email"
                  label="Email"
                  type="email"
                  inputMode="email"
                  value={values.email}
                  error={errors.email}
                  onChange={(value) => updateField('email', value)}
                  autoComplete="email"
                />
                <Field
                  id="checkout-address"
                  label="Address"
                  value={values.address}
                  error={errors.address}
                  onChange={(value) => updateField('address', value)}
                  autoComplete="street-address"
                />
                <div className="checkout__row">
                  <Field
                    id="checkout-city"
                    label="City"
                    value={values.city}
                    error={errors.city}
                    onChange={(value) => updateField('city', value)}
                    autoComplete="address-level2"
                  />
                  <Field
                    id="checkout-zip"
                    label="ZIP"
                    value={values.zip}
                    error={errors.zip}
                    onChange={(value) => updateField('zip', value)}
                    inputMode="numeric"
                    autoComplete="postal-code"
                  />
                </div>
              </section>

              <section className="checkout__section" aria-labelledby={`${headingId}-payment`}>
                <h3 className="checkout__section-title" id={`${headingId}-payment`}>
                  Payment
                </h3>
                <p className="checkout__note">
                  Simulated checkout. Use any 16-digit card number — no real payment is
                  processed.
                </p>
                <Field
                  id="checkout-cardNumber"
                  label="Card number"
                  value={values.cardNumber}
                  error={errors.cardNumber}
                  onChange={(value) => updateField('cardNumber', value)}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                />
                <div className="checkout__row">
                  <Field
                    id="checkout-expiry"
                    label="Expiry (MM/YY)"
                    value={values.expiry}
                    error={errors.expiry}
                    onChange={(value) => updateField('expiry', value)}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="09/28"
                  />
                  <Field
                    id="checkout-cvc"
                    label="CVC"
                    value={values.cvc}
                    error={errors.cvc}
                    onChange={(value) => updateField('cvc', value)}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                  />
                </div>
                <Field
                  id="checkout-cardName"
                  label="Name on card"
                  value={values.cardName}
                  error={errors.cardName}
                  onChange={(value) => updateField('cardName', value)}
                  autoComplete="cc-name"
                />
              </section>

              <button
                type="submit"
                className="btn btn--volt checkout__submit"
                disabled={processing}
              >
                {processing ? 'PROCESSING…' : 'PLACE ORDER'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
