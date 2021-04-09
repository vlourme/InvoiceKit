import firebase from 'firebase'
import { Customer } from './customer'
import { Model } from './model'

export enum InvoiceType {
  Invoice = 'INVOICE',
  Estimation = 'QUOTE',
}

export enum InvoiceStatus {
  None = 'NONE',
  Unpaid = 'UNPAID',
  Pending = 'PENDING',
  Paid = 'PAID',
}

export interface Field {
  description: string
  quantity: number
  price: number
  tax: number
}

export interface Invoice extends Model {
  id: string
  date: string
  type: InvoiceType
  status: InvoiceStatus
  address: string
  fields: Field[]
  promotion: number
  deposit: number
  note: string
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

export interface InvoiceIndex extends Model {
  id: string
  link: string
  type: InvoiceType
  status: InvoiceStatus
  customer: Customer
  createdAt: firebase.firestore.Timestamp
  updatedAt: firebase.firestore.Timestamp
}

export const defaultField = (): Field => ({
  description: '',
  quantity: 1,
  price: 0,
  tax: 0,
})

export const defaultInvoice = (): Invoice => ({
  $key: null,
  id: '',
  date: new Date().toISOString().substr(0, 10),
  status: InvoiceStatus.None,
  type: InvoiceType.Invoice,
  address: '',
  fields: [],
  promotion: 0,
  deposit: 0,
  note: '',
  createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
  updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
})
