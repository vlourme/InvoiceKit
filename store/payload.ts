import { ActionTree, MutationTree } from 'vuex/types/index'
import { AuthModuleState } from './auth'
import { mapDocument } from '~/helpers/DocumentMapper'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { Address } from '~/types/address'
import { Customer } from '~/types/customer'
import { Invoice } from '~/types/invoice'

export const state = () => ({
  customer: null as Customer | null,
  address: null as Address | null,
  invoice: new InvoiceImpl(),
})

export type PayloadModuleState = ReturnType<typeof state>

export const mutations: MutationTree<PayloadModuleState> = {
  SET_CUSTOMER: (state, customer: Customer) => {
    state.customer = customer
  },

  SET_ADDRESS: (state, address: Address) => {
    state.address = address
  },

  SET_INVOICE: (state, invoice: Invoice) => {
    state.invoice.data = invoice
  },
}

export const actions: ActionTree<PayloadModuleState, AuthModuleState> = {
  /**
   * Load a customer in the store
   *
   * @param context
   * @param customerID
   * @returns
   */
  fetchCustomer({ commit, rootState }, customerID: string) {
    if (!rootState.user?.team) {
      return
    }

    this.$fire.firestore
      .collection('teams')
      .doc(rootState.user.team)
      .collection('customers')
      .doc(customerID)
      .onSnapshot((snapshot) => {
        commit('SET_CUSTOMER', mapDocument<Customer>(snapshot))
      })
  },

  /**
   * Load an address in the store
   *
   * @param context
   * @returns
   */
  fetchAddress({ commit, state, rootState }) {
    if (!rootState.user?.team || !state.customer?.$key) {
      return
    }

    this.$fire.firestore
      .collection('teams')
      .doc(rootState.user.team)
      .collection('customers')
      .doc(state.customer.$key)
      .onSnapshot((snapshot) => {
        commit('SET_ADDRESS', mapDocument<Address>(snapshot))
      })
  },

  /**
   * Load an invoice in the context
   *
   * @param context
   * @param invoiceID
   * @returns
   */
  fetchInvoice({ commit, state, rootState }, invoiceID: string) {
    if (
      !rootState.user?.team ||
      !state.customer?.$key ||
      !state.address?.$key
    ) {
      return
    }

    this.$fire.firestore
      .collection('teams')
      .doc(rootState.user.team)
      .collection('customers')
      .doc(state.customer.$key)
      .collection('invoices')
      .doc(invoiceID)
      .onSnapshot((snapshot) => {
        commit('SET_INVOICE', mapDocument<Invoice>(snapshot))
      })
  },
}
