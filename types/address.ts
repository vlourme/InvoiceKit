import Model from './model'

export interface Address extends Model {
  street: string
  zip: string
  city: string
  country: string
}
