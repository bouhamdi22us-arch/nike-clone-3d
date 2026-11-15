import { describe, expect, it } from 'vitest'

import {
  firstErrorField,
  generateOrderNumber,
  normalizeCardNumber,
  validateCheckout,
  type CheckoutValues,
} from './validation'

const validValues = (overrides: Partial<CheckoutValues> = {}): CheckoutValues => ({
  fullName: 'Alex Runner',
  email: 'alex@example.com',
  address: '1 Speedway Blvd',
  city: 'Portland',
  zip: '97201',
  cardNumber: '4242 4242 4242 4242',
  expiry: '09/28',
  cvc: '123',
  cardName: 'Alex Runner',
  ...overrides,
})

describe('validateCheckout', () => {
  it('accepts a fully valid form', () => {
    expect(validateCheckout(validValues())).toEqual({})
  })

  it('rejects an empty form and flags every required field', () => {
    const errors = validateCheckout({
      fullName: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      cardName: '',
    })

    expect(Object.keys(errors).sort()).toEqual(
      ['address', 'cardNumber', 'email', 'expiry', 'fullName', 'zip'].sort(),
    )
  })

  it('requires a full name of at least two characters', () => {
    expect(validateCheckout(validValues({ fullName: ' A ' })).fullName).toBeDefined()
    expect(validateCheckout(validValues({ fullName: ' Al ' })).fullName).toBeUndefined()
  })

  it('rejects malformed emails and accepts normal ones', () => {
    const invalid = ['', 'alex', 'alex@', 'alex@example', '@example.com', 'a b@example.com']

    for (const email of invalid) {
      expect(validateCheckout(validValues({ email })).email, email).toBeDefined()
    }

    expect(validateCheckout(validValues({ email: 'alex+shop@sub.example.co' })).email).toBeUndefined()
  })

  it('requires address and ZIP but not city', () => {
    expect(validateCheckout(validValues({ address: '   ' })).address).toBeDefined()
    expect(validateCheckout(validValues({ zip: '   ' })).zip).toBeDefined()
    expect(validateCheckout(validValues({ city: '' })).city).toBeUndefined()
  })

  it('accepts 16 digits with or without spaces and rejects anything else', () => {
    expect(validateCheckout(validValues({ cardNumber: '4242424242424242' })).cardNumber).toBeUndefined()
    expect(validateCheckout(validValues({ cardNumber: '4242 4242 4242 4242' })).cardNumber).toBeUndefined()
    expect(validateCheckout(validValues({ cardNumber: '4242 4242 4242 424' })).cardNumber).toBeDefined()
    expect(validateCheckout(validValues({ cardNumber: '4242 4242 4242 4242 4' })).cardNumber).toBeDefined()
    expect(validateCheckout(validValues({ cardNumber: '4242-4242-4242-4242' })).cardNumber).toBeDefined()
    expect(validateCheckout(validValues({ cardNumber: 'abcd efgh ijkl mnop' })).cardNumber).toBeDefined()
  })

  it('only accepts MM/YY expiry with a real month', () => {
    for (const expiry of ['', '9/28', '13/28', '00/28', '09-28', '09/2']) {
      expect(validateCheckout(validValues({ expiry })).expiry, expiry).toBeDefined()
    }

    for (const expiry of ['01/28', '09/28', '12/99']) {
      expect(validateCheckout(validValues({ expiry })).expiry, expiry).toBeUndefined()
    }
  })

  it('treats CVC as optional but validates its length when entered', () => {
    expect(validateCheckout(validValues({ cvc: '' })).cvc).toBeUndefined()
    expect(validateCheckout(validValues({ cvc: '123' })).cvc).toBeUndefined()
    expect(validateCheckout(validValues({ cvc: '1234' })).cvc).toBeUndefined()
    expect(validateCheckout(validValues({ cvc: '12' })).cvc).toBeDefined()
    expect(validateCheckout(validValues({ cvc: '12345' })).cvc).toBeDefined()
    expect(validateCheckout(validValues({ cvc: '12a' })).cvc).toBeDefined()
  })

  it('does not require the name on card', () => {
    expect(validateCheckout(validValues({ cardName: '' })).cardName).toBeUndefined()
  })
})

describe('normalizeCardNumber', () => {
  it('strips spaces only', () => {
    expect(normalizeCardNumber('4242 4242 4242 4242')).toBe('4242424242424242')
    expect(normalizeCardNumber('4242-4242')).toBe('4242-4242')
  })
})

describe('firstErrorField', () => {
  it('returns the first invalid field in form order', () => {
    expect(firstErrorField({})).toBeNull()
    expect(firstErrorField({ zip: 'x', fullName: 'x' })).toBe('fullName')
    expect(firstErrorField({ expiry: 'x' })).toBe('expiry')
  })
})

describe('generateOrderNumber', () => {
  it('formats NK- plus six digits', () => {
    expect(generateOrderNumber(() => 0)).toBe('NK-000000')
    expect(generateOrderNumber(() => 0.123456)).toBe('NK-123456')
    expect(generateOrderNumber(() => 0.9999999)).toBe('NK-999999')
    expect(generateOrderNumber()).toMatch(/^NK-\d{6}$/)
  })
})
