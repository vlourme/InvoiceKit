import Model from './model'

export interface Customer extends Model {
  // Extensible structure
  [key: string]: any
}

export const defaultCustomer = (): Customer => ({
  $key: '',
})
