/**
 * Legacy Import from HCInvoice
 */

import { NuxtAppOptions } from '@nuxt/types'
import { format, parse } from 'date-fns'
import firebase from 'firebase'
import { Customer } from '~/types/customer'
import { Invoice, InvoiceStatus, InvoiceType } from '~/types/invoice'
import { LegacyInvoice } from '~/types/legacyInvoice'

export const importLegacy = async (
  app: NuxtAppOptions,
  customer: Customer,
  addressId: string,
  file: File
): Promise<string> => {
  // Parse file
  const text = await file.text()
  const json = JSON.parse(text) as LegacyInvoice

  // Parse date
  json.date = json.date.trim().replaceAll('-', '/')
  const date = new Date()
  const invoiceDate = format(parse(json.date, 'dd/MM/yyyy', date), 'yyyy-MM-dd')

  // Create invoice
  const invoice: Invoice = {
    $key: null,
    id: json.number.trim(),
    address: addressId,
    createdAt: firebase.firestore.Timestamp.fromDate(date),
    updatedAt: firebase.firestore.Timestamp.fromDate(date),
    date: invoiceDate,
    deposit: json.acompte.amount ?? 0,
    promotion: json.promotion.percentage ?? 0,
    note: json.details.text.trim() ?? '',
    status: InvoiceStatus.Pending,
    type:
      json.type === 'Facture' ? InvoiceType.Invoice : InvoiceType.Estimation,
    fields: [],
  }

  // Add fields
  for (const field of json.entries) {
    invoice.fields.push({
      description: field.name.replaceAll('<br />', '\n'),
      price: field.price,
      tax: field.tva,
      quantity: 1,
    })
  }

  // Send to Firestore
  const state = app.store?.state

  // Create invoice
  const doc = await app.$fire.firestore
    .collection('teams')
    .doc(state.auth.user.team)
    .collection('customers')
    .doc(customer.$key!)
    .collection('invoices')
    .add(invoice)

  return doc.id
}
