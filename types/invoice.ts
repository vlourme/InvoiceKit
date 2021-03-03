import { DataTableHeader } from 'vuetify'
import { Customer } from './customer'
import Model from './model'
import { Address } from '~/types/address'

export enum Type {
  Invoice = 'INVOICE',
  Estimation = 'QUOTE',
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
  type: Type
  address: Address | null
  fields: Field[]
  promotion: number
  deposit: number
  createdAt: Date
  updatedAt: Date
}

export interface InvoiceIndex extends Model {
  id: string
  link: string
  customer: Customer
  createdAt: Date
  updatedAt: Date
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
  type: Type.Invoice,
  address: null,
  fields: [],
  promotion: 0,
  deposit: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const InvoiceHeaders: Array<DataTableHeader> = [
  {
    text: 'ID',
    value: 'id',
  },
  {
    text: 'Client',
    value: 'customer.fullName',
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
    text: 'Quantité',
    value: 'quantity',
    width: 100,
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
