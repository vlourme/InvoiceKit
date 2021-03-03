export interface Customer {
  id: string | null
  fullName: string
  society: string
  email: string
  phone: string
  note: string
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
