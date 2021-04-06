import { Invoice } from '~/types/invoice'

/**
 * Get total price for an index
 *
 * @param { Invoice } invoice
 * @param { number } idx
 */
export const getPriceAtIndex = (invoice: Invoice, idx: number): number => {
  // Get index
  const field = invoice.fields[idx]

  // Get price
  const price = field.price * (1 + field.tax / 100) * field.quantity

  // Return rounded price
  return round(price)
}

/**
 * Get taxes for an index
 *
 * @param { Invoice } invoice
 * @param { number } idx
 */
export const getTaxesAtIndex = (invoice: Invoice, idx: number): number => {
  // Get index
  const field = invoice.fields[idx]

  // Get price
  const price = field.price * (field.tax / 100) * field.quantity

  // Return rounded price
  return round(price)
}

/**
 * Get total price without any taxes
 *
 * @param { Invoice } invoice
 * @return number
 */
export const getTotalPrice = (invoice: Invoice): number => {
  // Prepare response
  let price = 0

  // Sum
  for (const field of invoice.fields) {
    price += field.price
  }

  // Return price
  return price
}

/**
 * Get total taxes
 *
 * @param { Invoice } invoice
 * @return number
 */
export const getTotalTaxes = (invoice: Invoice): number => {
  // Prepare response
  let tax = 0

  // Sum
  for (const [idx] of invoice.fields.entries()) {
    tax += getTaxesAtIndex(invoice, idx)
  }

  // Return price
  return tax
}

/**
 * Get final total price with taxes
 *
 * @param { Invoice } invoice
 */
export const getFinalPrice = (invoice: Invoice): number => {
  let price = getTotalPrice(invoice) + getTotalTaxes(invoice)

  // Set promotion
  price = price * (1 - invoice.promotion / 100)

  // Remove deposit
  price -= invoice.deposit

  return price
}

/**
 * Round a number at 2 decimals
 *
 * @param { number } num
 * @private
 */
const round = (num: number): number => {
  return Math.round((num + Number.EPSILON) * 100) / 100
}
