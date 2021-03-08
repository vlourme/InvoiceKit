import jsPDF from 'jspdf'
import { RenderingSignature, Team } from '~/types/team'
import { Address } from '~/types/address'
import { Customer } from '~/types/customer'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import DataURI from '~/helpers/DataURI'
import { InvoiceType } from '~/types/invoice'

export default abstract class Template {
  /**
   * Document
   */
  doc = new jsPDF()

  /**
   * Default color (RGB)
   */
  defaultColor = '#6366F1'

  /**
   * Computed accent color
   */
  accentColor: string

  /**
   * Team logo as DataURI
   */
  dataURI: string | null = null

  /**
   * If dataURI is valid
   */
  hasImage = false

  /**
   * Get all data
   *
   * @param invoice
   * @param customer
   * @param address
   * @param team
   * @param teamLogo
   */
  constructor(
    public invoice: InvoiceImpl,
    public customer: Customer,
    public address: Address,
    public team: Team,
    public teamLogo: string | null
  ) {
    // Get accent color
    this.accentColor = this.getAccentColor()
  }

  /**
   * Get accent color as HEX value
   */
  private getAccentColor(): string {
    // If not defined
    if (!this.team.accent || !this.team.accentEnabled) {
      return this.defaultColor
    }

    // Return hex
    return this.team.accent.hex
  }

  /**
   * Is document an Invoice
   */
  get isInvoice(): boolean {
    return this.invoice.data.type === InvoiceType.Invoice
  }

  /**
   * Check if signature must be displayed
   */
  get hasSignature(): boolean {
    const signature = this.team.signature
    const document = this.invoice.data.type

    return (
      signature === RenderingSignature.Both ||
      (signature === RenderingSignature.Invoice &&
        document === InvoiceType.Invoice) ||
      (signature === RenderingSignature.Quote &&
        document === InvoiceType.Estimation)
    )
  }

  /**
   * Get lines corresponding this scheme:
   * Description | Quantity | Price | Tax | Total
   */
  getLines(): (string | number)[][] {
    const lines = []

    for (const [idx, field] of this.invoice.data.fields.entries()) {
      lines.push([
        field.description,
        field.quantity,
        field.price + ' €',
        field.tax + ' %',
        this.invoice?.getPriceAtIndex(idx) + ' €',
      ])
    }

    return lines
  }

  /**
   * Configure the document
   */
  abstract configure(): void

  /**
   * Draw and render document
   */
  abstract draw(): void

  /**
   * Return ready jsPDF instance
   */
  async render(): Promise<jsPDF> {
    // Get team logo
    if (this.teamLogo) {
      this.dataURI = await DataURI(this.teamLogo)
      this.hasImage = true
    }

    // Configure
    this.configure()

    // Draw
    this.draw()

    return this.doc
  }
}
