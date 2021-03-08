import { ColorPicker } from './accentColor'
import Model from './model'

export enum RenderingSignature {
  None = 'NONE',
  Quote = 'QUOTE',
  Invoice = 'INVOICE',
  Both = 'BOTH',
}

export interface Team extends Model {
  // Team details
  name: string
  owner: string
  members: string[]

  // Society Identity
  title: string | null
  email: string | null
  phone: string | null
  website: string | null

  // Society Localization
  street: string | null
  zip: string | null
  city: string | null
  country: string | null

  // Invoice customization
  signature: RenderingSignature
  accent: ColorPicker | null
  enableAccent: boolean

  // Society fields
  fields: Array<string>
}
