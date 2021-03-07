/**
 * Basic Template for Invoice
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Template from './template'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { Address } from '~/types/address'
import { Customer } from '~/types/customer'
import Team from '~/types/team'
import DataURI from '~/helpers/DataURI'

export default class BasicInvoiceTemplate implements Template {
  invoice: InvoiceImpl | null = null
  customer: Customer | null = null
  address: Address | null = null
  team: Team | null = null
  teamLogo: string | null = null
  doc: jsPDF = new jsPDF()
  dataURI: string | null = null

  init(
    invoice: InvoiceImpl,
    customer: Customer,
    address: Address,
    team: Team,
    teamLogo: string | null
  ): void {
    this.invoice = invoice
    this.customer = customer
    this.address = address
    this.team = team
    this.teamLogo = teamLogo
  }

  /**
   * Default configuration for the file
   * This can be: background color, font family, font size, etc.
   */
  configure(): void {
    this.doc.setFont('Helvetica')
  }

  /**
   * Draw the header area
   */
  drawHeader(): void {
    if (!this.teamLogo || !this.team || !this.invoice) {
      return
    }

    // Set data
    this.doc
      .setFillColor(249, 250, 251)
      .rect(0, 0, 210, 70, 'F')
      .setFontSize(16)
      .setTextColor(99, 102, 241)
      .setFont('Helvetica', 'Bold')
      .text(this.team.title ?? '', 15, 42)
      .setFont('Helvetica', 'normal')
      .setFontSize(12)
      .setTextColor(107, 114, 128)
      .text(this.team.email ?? '', 15, 48)
      .text(this.team.phone ?? '', 15, 54)
      .text(this.team.website ?? '', 15, 60)
      .setFontSize(10)
      .setTextColor(99, 102, 241)
      .setFont('Helvetica', 'Bold')
      .text('FACTURE', 195, 15, { align: 'right' })
      .setFont('Helvetica', 'normal')
      .setFontSize(14)
      .setTextColor(107, 114, 128)
      .text(`# ${this.invoice.data.id}`, 195, 21, { align: 'right' })
      .setFontSize(10)
      .setTextColor(99, 102, 241)
      .setFont('Helvetica', 'Bold')
      .text('DATE', 195, 30, { align: 'right' })
      .setFont('Helvetica', 'normal')
      .setFontSize(14)
      .setTextColor(107, 114, 128)
      .text(this.invoice.data.date, 195, 36, { align: 'right' })

    // Append the image
    if (this.dataURI) {
      this.doc.addImage(this.dataURI, 'JPEG', 15, 10, 25, 25)
    }
  }

  /**
   * Draw the customer area
   */
  drawCustomer(): void {
    if (!this.customer || !this.address) {
      return
    }

    let fullName = this.customer.fullName

    if (this.customer.society) {
      fullName += ` (${this.customer.society})`
    }

    this.doc
      .setFillColor(229, 231, 235)
      .rect(0, 70, 210, 35, 'F')
      .setFont('Helvetica', 'normal', 700)
      .setFontSize(12)
      .setTextColor(107, 114, 128)
      .text(fullName, 15, 80)
      .setFont('Helvetica', 'normal')
      .setFontSize(11)
      .text(this.address.street, 15, 86)
      .text(`${this.address.zip} ${this.address.city}`, 15, 92)
      .text(this.address.country, 15, 98)
  }

  /**
   * Draw the pricing area
   */
  drawTotalPricing(): void {
    if (!this.invoice) {
      return
    }

    // Calculate prices
    const total = this.invoice.getTotalPrice()
    const tax = this.invoice.getTotalTaxes()
    const noTax = total - tax

    this.doc
      .setFontSize(11)
      .text(`Total HT: ${noTax} €`, 195, 235, { align: 'right' })
      .text(`Total TVA: ${tax} €`, 195, 242, { align: 'right' })
      .setFont('Helvetica', 'normal', '700')
      .setFontSize(12)
      .text(`Total TTC: ${total} €`, 195, 249, { align: 'right' })
  }

  /**
   * Draw the footer area
   */
  drawFooter(): void {
    if (!this.team) {
      return
    }

    const informations = this.team.fields.join(' • ')

    this.doc
      .setFillColor(249, 250, 261)
      .rect(0, 258, 210, 40, 'F')
      .setFontSize(10)
      .setTextColor(99, 102, 241)
      .setFont('Helvetica', 'Bold')
      .text(this.team.title?.toUpperCase() ?? '', 15, 267)
      .setFont('Helvetica', 'normal')
      .setFontSize(10)
      .setTextColor(107, 114, 128)
      .text(this.team.street ?? '', 15, 273)
      .text(`${this.team.zip} ${this.team.city}`, 15, 279)
      .text(this.team.country ?? '', 15, 285)
      .setFontSize(10)
      .setTextColor(99, 102, 241)
      .setFont('Helvetica', 'Bold')
      .text('INFORMATIONS', 195, 267, { align: 'right' })
      .setFont('Helvetica', 'normal')
      .setFontSize(8)
      .setTextColor(107, 114, 128)
      .text(informations, 195, 272, {
        align: 'right',
        maxWidth: 100,
        lineHeightFactor: 1.4,
      })
  }

  /**
   * Final rendering
   */
  async render(): Promise<jsPDF> {
    if (!this.invoice) {
      return this.doc
    }

    // Configure
    this.configure()

    // Get image
    if (!this.dataURI || !this.teamLogo) {
      this.dataURI = await DataURI(this.teamLogo!)
    }

    const body = []

    for (const [idx, field] of this.invoice.data.fields.entries()) {
      body.push([
        field.description,
        field.quantity,
        field.price + ' €',
        field.tax + ' %',
        this.invoice?.getPriceAtIndex(idx) + ' €',
      ])
    }

    // Generate table
    autoTable(this.doc, {
      head: [['Description', 'Quantité', 'Prix HT', 'TVA', 'Prix TTC']],
      body,
      // Fill empty footer lines to
      // keep space for real footer
      foot: [[''], [''], ['']],
      didDrawPage: () => {
        // Draw components on every pages
        this.drawHeader()
        this.drawCustomer()
        this.drawFooter()
      },
      headStyles: {
        fillColor: '#fff',
        textColor: '#6B7280',
        cellPadding: {
          horizontal: 7,
          vertical: 5,
        },
        lineWidth: 0.1,
        lineColor: [229, 231, 235],
      },
      bodyStyles: {
        cellPadding: {
          horizontal: 5,
          vertical: 3,
        },
      },
      rowPageBreak: 'avoid',
      columns: [
        { dataKey: 'description', header: 'Description' },
        { dataKey: 'quantity', header: 'Quantité' },
        { dataKey: 'price', header: 'Prix HT' },
        { dataKey: 'tax', header: 'TVA' },
        { dataKey: 'total', header: 'Prix TTC' },
      ],
      columnStyles: {
        quantity: {
          halign: 'right',
        },
        price: {
          halign: 'right',
          cellWidth: 30,
        },
        tax: {
          halign: 'right',
        },
        total: {
          halign: 'right',
          cellWidth: 30,
        },
      },
      showFoot: 'lastPage',
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [255, 255, 255],
      },
      theme: 'striped',
      margin: {
        top: 105,
        left: 0,
        right: 0,
        bottom: 40,
      },
    })

    // Draw pricing on final page
    this.drawTotalPricing()

    return this.doc
  }
}
