import Model from './Model'

export default interface Team extends Model {
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

  // Society fields
  fields: Array<string>
}
