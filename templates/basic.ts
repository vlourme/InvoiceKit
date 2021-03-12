/**
 * Basic Template for Invoice
 */

import autoTable from 'jspdf-autotable'
import Template from './template'

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
    // Set data
    this.doc
      .setFillColor(249, 250, 251)
      .rect(0, 0, 210, 70, 'F')
      .setFontSize(16)
      .setTextColor(this.accentColor)
      .setFont('Helvetica', 'Bold')
      .text(this.team.title ?? '', 15, 42)
      .setFont('Helvetica', 'normal')
      .setFontSize(12)
      .setTextColor(107, 114, 128)
      .text(
        [this.team.email ?? '', this.team.phone ?? '', this.team.website ?? ''],
        15,
        48,
        { lineHeightFactor: 1.4 }
      )
      .setFontSize(10)
      .setTextColor(this.accentColor)
      .setFont('Helvetica', 'Bold')
      .text(this.isInvoice ? 'FACTURE' : 'DEVIS', 195, 15, { align: 'right' })
      .setFont('Helvetica', 'normal')
      .setFontSize(14)
      .setTextColor(107, 114, 128)
      .text(`# ${this.invoice.data.id}`, 195, 21, { align: 'right' })
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
    // Calculate prices
    const noTax = this.invoice.getTotalPrice()
    const tax = this.invoice.getTotalTaxes()
    const total = this.invoice.getFinalPrice()

    // Get text
    const text = [
      ['Total HT', `${noTax} €`],
      ['Total TVA', `${tax} €`],
    ]

    let startY = 233

    // Check for promotion
    if (this.invoice.data.promotion) {
      text.splice(text.length, 0, [
        'Réduction',
        `- ${this.invoice.data.promotion} %`,
      ])

      startY -= 6
    }

    // Check for deposit
    if (this.invoice.data.deposit) {
      text.splice(text.length, 0, [
        'Acompte',
        `- ${this.invoice.data.deposit} €`,
      ])

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
      .text(this.invoice.data.note, this.hasSignature ? 55 : 15, 233, {
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
        (this.team.juridicalTitle ?? this.team.title ?? '').toUpperCase(),
        15,
        267
      )
      .setFont('Helvetica', 'normal')
      .setFontSize(10)
      .setTextColor(107, 114, 128)
      .text(
        [
          this.team.street ?? '',
          `${this.team.zip} ${this.team.city}`,
          this.team.country ?? '',
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

    if (this.invoice.data.promotion || this.invoice.data.deposit) {
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
        top: 105,
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
    if (this.invoice.data.note) {
      this.drawNotes()
    }

    // Draw pricing on final page
    this.drawTotalPricing()
  }
}
