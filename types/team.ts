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

export interface Identity {
  title: string | null
  juridicalTitle: string | null
  email: string | null
  phone: string | null
  website: string | null
}

export interface Localization {
  street: string | null
  zip: string | null
  city: string | null
  country: string | null
}

export interface Rendering {
  signature: RenderingSignature
  accent: ColorPicker | null
  accentEnabled: boolean
  quantityEnabled: boolean
}
export interface Team extends Model {
  // Team details
  name: string
  owner: string
  members: {
    [key: string]: MemberPermission
  }

  // Society Identity
  identity: Identity

  // Society Localization
  localization: Localization

  // Invoice and PDF rendering
  rendering: Rendering

  // Distributed counter
  counter: { [key: string]: number }

  // Society fields
  fields: Array<string>
}

export const defaultIdentity = (): Identity => ({
  email: '',
  juridicalTitle: '',
  phone: '',
  title: '',
  website: '',
})

export const defaultLocalization = (): Localization => ({
  city: '',
  country: '',
  street: '',
  zip: '',
})

export const defaultRendering = (): Rendering => ({
  accent: null,
  accentEnabled: false,
  quantityEnabled: true,
  signature: RenderingSignature.Both,
})

export const defaultTeam = (): Team => ({
  $key: null,
  name: '',
  owner: '',
  members: {},
  identity: defaultIdentity(),
  localization: defaultLocalization(),
  rendering: defaultRendering(),
  counter: {},
  fields: [],
})
