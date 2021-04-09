/**
 * Basic Template for Invoice
 */

import autoTable from 'jspdf-autotable'
import Template from './template'
import {
  getFinalPrice,
  getTotalPrice,
  getTotalTaxes,
} from '~/composables/useInvoicePricing'
import useExtensibleField from '~/composables/useExtensibleField'

export default class BasicInvoiceTemplate extends Template {
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
    // Calculate startY and box height
    let startY = 42
    let height = 70

    // Reduce height if image is empty
    if (!this.dataURI) {
      startY = 15
      height = 45
    }

    // Set data
    this.doc
      .setFillColor(249, 250, 251)
      .rect(0, 0, 210, height, 'F')
      .setFontSize(16)
      .setTextColor(this.accentColor)
      .setFont('Helvetica', 'Bold')
      .text(this.team.identity.title ?? '', 15, startY)
      .setFont('Helvetica', 'normal')
      .setFontSize(12)
      .setTextColor(107, 114, 128)
      .text(
        [
          this.team.identity.email ?? '',
          this.team.identity.phone ?? '',
          this.team.identity.website ?? '',
        ],
        15,
        startY + 8,
        { lineHeightFactor: 1.4 }
      )
      .setFontSize(10)
      .setTextColor(this.accentColor)
      .setFont('Helvetica', 'Bold')
      .text(this.isInvoice ? 'FACTURE' : 'DEVIS', 195, 15, { align: 'right' })
      .setFont('Helvetica', 'normal')
      .setFontSize(14)
      .setTextColor(107, 114, 128)
      .text(`# ${this.invoice.id}`, 195, 21, { align: 'right' })
      .setFontSize(10)
      .setTextColor(this.accentColor)
      .setFont('Helvetica', 'Bold')
      .text('DATE', 195, 30, { align: 'right' })
      .setFont('Helvetica', 'normal')
      .setFontSize(14)
      .setTextColor(107, 114, 128)
      .text(this.date, 195, 36, { align: 'right' })

    // Append the image
    if (this.dataURI) {
      this.doc.addImage(this.dataURI, 'JPEG', 15, 10, 25, 25)
    }
  }

  /**
   * Draw the customer area
   */
  drawCustomer(): void {
    // Calculate startY
    let startY = 70

    if (!this.dataURI) {
      startY = 45
    }

    const primary = this.team.extensions.customers.find(
      (value) => value.primary
    )

    this.doc
      .setFillColor(229, 231, 235)
      .rect(0, startY, 210, 35, 'F')
      .setFont('Helvetica', 'normal', 700)
      .setFontSize(12)
      .setTextColor(107, 114, 128)
      .text(this.customer[primary?.value!], 15, startY + 10)
      .setFont('Helvetica', 'normal')
      .setFontSize(11)
      .text(
        [
          this.address.street,
          `${this.address.zip} ${this.address.city}`,
          this.address.country,
        ],
        15,
        startY + 16,
        {
          lineHeightFactor: 1.6,
        }
      )
  }

  /**
   * Draw the pricing area
   */
  drawTotalPricing(): void {
    // Calculate prices
    const noTax = getTotalPrice(this.invoice)
    const tax = getTotalTaxes(this.invoice)
    const total = getFinalPrice(this.invoice)

    // Get text
    const text = [
      ['Total HT', `${noTax} €`],
      ['Total TVA', `${tax} €`],
    ]

    let startY = 233

    // Check for promotion
    if (this.invoice.promotion) {
      text.splice(text.length, 0, [
        'Réduction',
        `- ${this.invoice.promotion} %`,
      ])

      startY -= 6
    }

    // Check for deposit
    if (this.invoice.deposit) {
      text.splice(text.length, 0, ['Acompte', `- ${this.invoice.deposit} €`])

      startY -= 6
    }

    autoTable(this.doc, {
      body: text,
      foot: [['Total TTC', `${total} €`]],
      theme: 'plain',
      startY,
      styles: {
        halign: 'right',
        cellPadding: {
          horizontal: 0,
          vertical: 1,
        },
        cellWidth: 30,
      },
      bodyStyles: {
        fontSize: 10,
      },
      footStyles: {
        fontSize: 11,
        font: 'Helvetica',
        fontStyle: 'Bold',
      },
      margin: {
        top: 0,
        left: 135,
        right: 15,
        bottom: 0,
      },
    })
  }

  drawSignature(): void {
    this.doc
      .setFillColor(156, 163, 175)
      .setTextColor(156, 163, 175)
      .setLineWidth(0.4)
      .setFont('Helvetica')
      .setFontSize(9)
      .roundedRect(15, 230, 35, 20, 1, 1, 'S')
      .text('Signature', 17, 235)
  }

  drawNotes(): void {
    this.doc
      .setFont('Helvetica', 'normal')
      .setFontSize(9)
      .setTextColor(107, 114, 128)
      .text(this.invoice.note, this.hasSignature ? 55 : 15, 233, {
        maxWidth: 65,
      })
  }

  /**
   * Draw the footer area
   */
  drawFooter(): void {
    const informations = this.team.fields.join(' • ')

    this.doc
      .setFillColor(249, 250, 261)
      .rect(0, 258, 210, 40, 'F')
      .setFontSize(10)
      .setTextColor(this.accentColor)
      .setFont('Helvetica', 'Bold')
      .text(
        (
          this.team.identity.juridicalTitle ??
          this.team.identity.title ??
          ''
        ).toUpperCase(),
        15,
        267
      )
      .setFont('Helvetica', 'normal')
      .setFontSize(10)
      .setTextColor(107, 114, 128)
      .text(
        [
          this.team.localization.street ?? '',
          `${this.team.localization.zip} ${this.team.localization.city}`,
          this.team.localization.country ?? '',
        ],
        15,
        273,
        {
          lineHeightFactor: 1.5,
        }
      )
      .setFontSize(10)
      .setTextColor(this.accentColor)
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
  draw(): void {
    // Get footer size
    const footer = [[''], [''], ['']]

    if (this.invoice.promotion || this.invoice.deposit) {
      footer.push([''])
    }

    // Generate table
    autoTable(this.doc, {
      head: [this.headerItems],
      body: this.getLines(),
      // Fill empty footer lines to
      // keep space for real footer
      foot: footer,
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
      columns: this.dataKeys,
      columnStyles: {
        quantity: {
          halign: 'right',
          cellWidth: 30,
        },
        price: {
          halign: 'right',
          cellWidth: 35,
        },
        tax: {
          halign: 'right',
          cellWidth: 25,
        },
        total: {
          halign: 'right',
          cellWidth: 35,
        },
      },
      showFoot: 'lastPage',
      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [255, 255, 255],
      },
      theme: 'striped',
      margin: {
        top: this.dataURI ? 105 : 80,
        left: 0,
        right: 0,
        bottom: 40,
      },
    })

    // Show signature
    if (this.hasSignature) {
      this.drawSignature()
    }

    // Draw notes
    if (this.invoice.note) {
      this.drawNotes()
    }

    // Draw pricing on final page
    this.drawTotalPricing()
  }
}
