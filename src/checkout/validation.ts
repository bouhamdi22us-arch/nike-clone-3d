/**
 * Pure validation for the simulated checkout form.
 *
 * Kept out of the component so the rules can be unit-tested without a DOM and
 * reused by any future checkout surface (express checkout, saved cards, …).
 */

export interface CheckoutValues {
  fullName: string
  email: string
  address: string
  city: string
  zip: string
  cardNumber: string
  expiry: string
  cvc: string
  cardName: string
}

export type CheckoutField = keyof CheckoutValues

export type CheckoutErrors = Partial<Record<CheckoutField, string>>

/** Field order used for rendering, validation focus and error announcements. */
export const CHECKOUT_FIELDS: CheckoutField[] = [
  'fullName',
  'email',
  'address',
  'city',
  'zip',
  'cardNumber',
  'expiry',
  'cvc',
  'cardName',
]

export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
export const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/
export const CARD_NUMBER_PATTERN = /^\d{16}$/
export const CVC_PATTERN = /^\d{3,4}$/

/** Card numbers are entered with spaces; validation only cares about digits. */
export function normalizeCardNumber(value: string): string {
  return value.replace(/\s+/g, '')
}

export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {}

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name (at least 2 characters).'
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (values.address.trim() === '') {
    errors.address = 'Enter your shipping address.'
  }

  if (values.zip.trim() === '') {
    errors.zip = 'Enter your ZIP code.'
  }

  if (!CARD_NUMBER_PATTERN.test(normalizeCardNumber(values.cardNumber))) {
    errors.cardNumber = 'Enter a 16-digit card number.'
  }

  if (!EXPIRY_PATTERN.test(values.expiry.trim())) {
    errors.expiry = 'Use MM/YY, for example 09/28.'
  }

  // CVC is optional, but a partially entered CVC must be 3–4 digits.
  const cvc = values.cvc.trim()
  if (cvc !== '' && !CVC_PATTERN.test(cvc)) {
    errors.cvc = 'CVC must be 3 or 4 digits.'
  }

  return errors
}

/** Returns the first invalid field in form order, or null when the form is valid. */
export function firstErrorField(errors: CheckoutErrors): CheckoutField | null {
  for (const field of CHECKOUT_FIELDS) {
    if (errors[field]) return field
  }
  return null
}

/** `NK-` plus six random digits, e.g. `NK-042913`. */
export function generateOrderNumber(random: () => number = Math.random): string {
  const digits = Math.floor(random() * 1_000_000)
  return `NK-${String(digits).padStart(6, '0')}`
}
