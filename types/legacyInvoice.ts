export interface Acompte {
  enabled: boolean
  amount: number
}

export interface Amount {
  // eslint-disable-next-line camelcase
  no_tax: number
  tax: number
  total: number
}

export interface Client {
  name: string
  address: string
}

export interface Details {
  enabled: boolean
  text: string
}

export interface Display {
  payment: boolean
  date: boolean
  signature: boolean
  attestation: boolean
}

export interface Entry {
  name: string
  price: number
  tva: number
}

export interface Promotion {
  enabled: boolean
  percentage: number
  amount: number
}

export interface LegacyInvoice {
  number: string
  type: string
  date: string
  client: Client
  promotion: Promotion
  acompte: Acompte
  amount: Amount
  details: Details
  display: Display
  entries: Entry[]
}
