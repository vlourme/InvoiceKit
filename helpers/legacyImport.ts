/**
 * Legacy Import from old invoice system
 */

import { useContext, useStore } from '@nuxtjs/composition-api'
import { format, parse } from 'date-fns'
import firebase from 'firebase'
import RootState from '~/store'
import { Customer } from '~/types/customer'
import { Invoice, InvoiceStatus, InvoiceType } from '~/types/invoice'
import { LegacyInvoice } from '~/types/legacyInvoice'

export const importLegacy = async (
  customer: Customer,
  addressId: string,
  file: File
): Promise<string> => {
  // Context
  const { $fire } = useContext()
  const store = useStore<RootState>()

  // Parse file
  const text = await file.text()
  const json = JSON.parse(text) as LegacyInvoice

  // Parse date
  json.date = json.date.trim().replaceAll('-', '/')
  const date = new Date()
  const invoiceDate = format(parse(json.date, 'dd/MM/yyyy', date), 'yyyy-MM-dd')

  // Create invoice
  const invoice: Invoice = {
    id: json.number.trim(),
    address: addressId,
    createdAt: firebase.firestore.Timestamp.fromDate(date),
    updatedAt: firebase.firestore.Timestamp.fromDate(date),
    date: invoiceDate,
    deposit: json.acompte.amount ?? 0,
    promotion: {
      percent: json.promotion.percentage ?? 0,
      fixed: 0,
    },
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

  // Create invoice
  const doc = await $fire.firestore
    .collection('teams')
    .doc(store.state.team.team?.$key)
    .collection('customers')
    .doc(customer.$key!)
    .collection('invoices')
    .add(invoice)

  return doc.id
}
