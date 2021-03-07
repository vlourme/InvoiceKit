import jsPDF from 'jspdf'
import { Team } from '~/types/team'
import { Address } from '~/types/address'
import { Customer } from '~/types/customer'
import InvoiceImpl from '~/implementations/InvoiceImpl'

export default interface Template {
  doc: jsPDF
  invoice: InvoiceImpl | null
  customer: Customer | null
  address: Address | null
  team: Team | null
  teamLogo: string | null

  /**
   * Get all data
   *
   * @param invoice
   * @param customer
   * @param address
   * @param team
   * @param teamLogo
   */
  init(
    invoice: InvoiceImpl,
    customer: Customer,
    address: Address,
    team: Team,
    teamLogo: string | null
  ): void

  /**
   * Return ready jsPDF instance
   */
  render(): Promise<jsPDF>
}
