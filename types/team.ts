import { ColorPicker } from './accentColor'
import { Model } from './model'
import { SelectItem } from './UI'

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

export enum FieldType {
  Text,
  Number,
  Date,
  Select,
  Email,
  Textarea,
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

export interface ExtensibleField {
  value: string
  name: string
  placeholder: string
  type: FieldType
  selects: SelectItem[]
  featured: boolean
  primary: boolean
  required: boolean
}

export interface Extension {
  formatting: string
  fields: ExtensibleField[]
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

  // Customer fields
  extensions: { [key: string]: Extension }
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

export const defaultExtensionField = (): ExtensibleField => ({
  name: '',
  placeholder: '',
  featured: false,
  primary: false,
  type: FieldType.Text,
  selects: [],
  value: '',
  required: false,
})

export const defaultTeam = (): Team => ({
  name: '',
  owner: '',
  members: {},
  identity: defaultIdentity(),
  localization: defaultLocalization(),
  rendering: defaultRendering(),
  counter: {},
  fields: [],
  extensions: {
    customers: {
      formatting: '%{fullName}% (%{society}%)',
      fields: [
        {
          name: 'Nom complet',
          value: 'fullName',
          selects: [],
          placeholder: '',
          type: FieldType.Text,
          featured: true,
          primary: true,
          required: true,
        },
        {
          name: 'Entreprise',
          value: 'society',
          selects: [],
          placeholder: '',
          type: FieldType.Text,
          featured: true,
          primary: false,
          required: false,
        },
        {
          name: 'Email',
          value: 'email',
          selects: [],
          placeholder: '',
          type: FieldType.Email,
          featured: true,
          primary: false,
          required: false,
        },
        {
          name: 'Téléphone',
          value: 'phone',
          selects: [],
          placeholder: '',
          type: FieldType.Text,
          featured: false,
          primary: false,
          required: false,
        },
        {
          name: 'Notes',
          value: 'notes',
          selects: [],
          placeholder: '',
          type: FieldType.Textarea,
          featured: true,
          primary: false,
          required: false,
        },
      ],
    },
  },
})
