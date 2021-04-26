import { Model } from './model'

export interface ContractModel {
  title: string
  description: string
  revisions: number
  price: number
}

export interface ContractEvent {
  name: string
  date: string
}

export interface Contract extends Model {
  model: ContractModel
  [key: string]: any
  events: ContractEvent[]
}

export const defaultContractModel = (): ContractModel => ({
  title: '',
  description: '',
  revisions: -1,
  price: 0,
})

export const defaultContractEvent = (): ContractEvent => ({
  name: '',
  date: new Date().toISOString().split('T')[0],
})

export const defaultContract = (): Contract => ({
  model: defaultContractModel(),
  events: [],
})
