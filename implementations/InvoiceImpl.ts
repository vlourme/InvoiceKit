import { defaultInvoice, Invoice } from '~/types/invoice'

export default class InvoiceImpl {
  /**
   * Invoice
   */
  public data: Invoice = defaultInvoice()

  /**
   * Get total price for an index
   *
   * @param { number } idx
   */
  public getPriceAtIndex(idx: number): number {
    // Get index
    const field = this.data.fields[idx]

    // Get price
    const price = field.price * (1 + field.tax / 100) * field.quantity

    // Return rounded price
    return InvoiceImpl.round(price)
  }

  /**
   * Get taxes for an index
   *
   * @param { number } idx
   */
  public getTaxesAtIndex(idx: number): number {
    // Get index
    const field = this.data.fields[idx]

    // Get price
    const price = field.price * (field.tax / 100) * field.quantity

    // Return rounded price
    return InvoiceImpl.round(price)
  }

  /**
   * Get total price
   *
   * @return number
   */
  public getTotalPrice(): number {
    // Prepare response
    let price = 0

    // Sum
    for (const [idx] of this.data.fields.entries()) {
      price += this.getPriceAtIndex(idx)
    }

    // Set promotion
    price = price * (1 - this.data.promotion / 100)

    // Remove deposit
    price -= this.data.deposit

    // Return price
    return price
  }

  /**
   * Get total taxes
   *
   * @return number
   */
  public getTotalTaxes(): number {
    // Prepare response
    let tax = 0

    // Sum
    for (const [idx] of this.data.fields.entries()) {
      tax += this.getTaxesAtIndex(idx)
    }

    // Return price
    return tax
  }

  /**
   * Round a number at 2 decimals
   *
   * @param { number } num
   * @private
   */
  private static round(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}
