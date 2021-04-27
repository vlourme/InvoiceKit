import { ExtensibleModel } from './model'

export interface Customer extends ExtensibleModel {}

export const defaultCustomer = (): Customer => ({})
