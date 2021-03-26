import _ from 'lodash'
import { DataTableHeader } from 'vuetify'
import { Timestamp } from '@google-cloud/firestore'
import { Customer } from './customer'
import Model from './model'

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
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InvoiceIndex extends Model {
  id: string
  link: string
  type: InvoiceType
  status: InvoiceStatus
  customer: Customer
  createdAt: Timestamp
  updatedAt: Timestamp
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
  createdAt: Timestamp.fromDate(new Date()),
  updatedAt: Timestamp.fromDate(new Date()),
})

export const InvoiceHeaders: Array<DataTableHeader> = [
  {
    text: 'ID',
    value: 'id',
  },
  {
    text: 'Type',
    value: 'type',
  },
  {
    text: 'Client',
    value: 'customer.fullName',
  },
  {
    text: 'Status',
    value: 'status',
  },
  {
    text: 'Dernière mise à jour',
    value: 'updatedAt',
  },
]

export const FieldHeaders: Array<DataTableHeader> = [
  {
    text: '',
    value: 'sort',
    width: 50,
    sortable: false,
  },
  {
    text: 'Description',
    value: 'description',
    sortable: false,
  },
  {
    text: 'Prix',
    value: 'price',
    width: 125,
  },
  {
    text: 'Total',
    value: 'total',
    width: 150,
  },
]

export const FieldHeadersWithQuantity = _.clone(FieldHeaders)

FieldHeadersWithQuantity.splice(2, 0, {
  text: 'Quantité',
  value: 'quantity',
  width: 100,
})
