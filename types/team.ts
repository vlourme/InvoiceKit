import { ColorPicker } from './accentColor'
import Model from './model'

export enum RenderingSignature {
  None,
  Quote = 1 << 1,
  Invoice = 1 << 2,
  Both = Quote | Invoice,
}

export enum MemberPermission {
  Viewer,
  Editor,
  Admin,
}

export interface Team extends Model {
  // Team details
  name: string
  owner: string
  members: {
    [key: string]: MemberPermission
  }

  // Society Identity
  title: string | null
  juridicalTitle: string | null
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
  accentEnabled: boolean
  quantityEnabled: boolean

  // Distributed counter
  counter: { [key: string]: number }

  // Society fields
  fields: Array<string>
}
