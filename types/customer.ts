import Model from './model'

export interface Customer extends Model {
  fullName: string
  society: string
  email: string
  phone: string
  notes: string
}

export const defaultCustomer = (): Customer => ({
  $key: '',
  email: '',
  society: '',
  fullName: '',
  phone: '',
  notes: '',
})
