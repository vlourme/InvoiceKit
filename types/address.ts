export interface Address {
  $key: string | null
  street: string
  zip: string
  city: string
  country: string
}

export const AddressHeaders = [
  {
    text: 'Adresse',
    value: 'street',
  },
  {
    text: 'Ville',
    value: 'city',
  },
  {
    text: 'Code postal',
    value: 'zip',
  },
  {
    text: 'Pays',
    value: 'country',
  },
  {
    value: 'actions',
    align: 'right',
  },
]
