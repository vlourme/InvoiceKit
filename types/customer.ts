import Model from './Model'

export interface Customer extends Model {
  fullName: string
  society: string
  email: string
  phone: string
  notes: string
}

export const CustomerHeaders = [
  {
    text: 'Nom',
    value: 'fullName',
  },
  {
    text: 'Entreprise',
    value: 'society',
  },
  {
    text: 'Email',
    value: 'email',
  },
  {
    text: 'Téléphone',
    value: 'Phone',
  },
]
