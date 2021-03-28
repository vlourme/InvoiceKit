import Model from './model'

export interface Customer extends Model {
  fullName: string
  society: string
  email: string
  phone: string
  notes: string
}
