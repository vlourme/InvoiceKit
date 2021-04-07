import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { ColumnInput } from 'jspdf-autotable'
import { RenderingSignature, Team } from '~/types/team'
import { Address } from '~/types/address'
import { Customer } from '~/types/customer'
import DataURI from '~/helpers/dataURI'
import { Invoice, InvoiceType } from '~/types/invoice'
import { getPriceAtIndex } from '~/composables/useInvoicePricing'

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
    public invoice: Invoice,
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
    if (!this.team.rendering.accent || !this.team.rendering.accentEnabled) {
      return this.defaultColor
    }

    // Return hex
    return this.team.rendering.accent.hex
  }

  /**
   * Is document an Invoice
   */
  get isInvoice(): boolean {
    return this.invoice.type === InvoiceType.Invoice
  }

  get date(): string {
    return format(new Date(this.invoice.date), 'dd/MM/yyyy')
  }

  /**
   * Check if signature must be displayed
   */
  get hasSignature(): boolean {
    const signature = this.team.rendering.signature
    const document = this.invoice.type

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
  getLines(): string[][] {
    const lines = []

    for (const [idx, field] of this.invoice.fields.entries()) {
      const line = [
        field.description,
        field.price + ' €',
        field.tax + ' %',
        getPriceAtIndex(this.invoice, idx) + ' €',
      ]

      if (this.team.rendering.quantityEnabled) {
        line.splice(1, 0, field.quantity.toString())
      }

      lines.push(line)
    }

    return lines
  }

  get headerItems(): string[] {
    const header = ['Description', 'Prix HT', 'TVA', 'Prix TTC']

    if (this.team.rendering.quantityEnabled) {
      header.splice(1, 0, 'Quantité')
    }

    return header
  }

  get dataKeys(): ColumnInput[] {
    const keys: ColumnInput[] = [
      { dataKey: 'description', header: 'Description' },
      { dataKey: 'price', header: 'Prix HT' },
      { dataKey: 'tax', header: 'TVA' },
      { dataKey: 'total', header: 'Prix TTC' },
    ]

    if (this.team.rendering.quantityEnabled) {
      keys.splice(1, 0, { dataKey: 'quantity', header: 'Quantité' })
    }

    return keys
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
