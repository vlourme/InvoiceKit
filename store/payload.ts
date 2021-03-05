import { ActionTree, MutationTree } from 'vuex/types/index'
import RootState from '.'
import { mapDocument, mapSnapshot } from '~/helpers/DocumentMapper'
import { Address } from '~/types/address'
import { Customer } from '~/types/customer'
import { Invoice } from '~/types/invoice'

export const state = () => ({
  customer: null as Customer | null,
  address: null as Address | null,
  addresses: [] as Address[],
  invoice: null as Invoice | null,
})

export type PayloadModuleState = ReturnType<typeof state>

export const mutations: MutationTree<PayloadModuleState> = {
  SET_CUSTOMER: (state, customer: Customer) => {
    state.customer = customer
  },

  SET_ADDRESS: (state, address: Address) => {
    state.address = address
  },

  SET_ADDRESSES: (state, addresses: Address[]) => {
    state.addresses = addresses
  },

  SET_INVOICE: (state, invoice: Invoice) => {
    state.invoice = invoice
  },
}

export const actions: ActionTree<PayloadModuleState, RootState> = {
  /**
   * Load a customer in the store
   *
   * @param context
   * @param customerID
   * @returns
   */
  async fetchCustomer({ commit, rootState }, customerID: string) {
    if (!rootState.auth.user?.team) {
      return
    }

    const doc = await this.$fire.firestore
      .collection('teams')
      .doc(rootState.auth.user.team)
      .collection('customers')
      .doc(customerID)
      .get()

    commit('SET_CUSTOMER', mapDocument<Customer>(doc))
  },

  /**
   * Fetch addresses for a customer
   *
   * @param context
   * @param customerID
   * @returns
   */
  fetchAddresses({ commit, rootState }, customerID: string) {
    if (!rootState.auth.user?.team) {
      return
    }

    this.$fire.firestore
      .collection('teams')
      .doc(rootState.auth.user.team)
      .collection('customers')
      .doc(customerID)
      .collection('addresses')
      .onSnapshot((snapshot) => {
        commit('SET_ADDRESSES', mapSnapshot<Address>(snapshot))
      })
  },

  /**
   * Load an address in the store
   *
   * @param context
   * @returns
   */
  async fetchAddress({ commit, state, rootState }, addressID: string) {
    if (!rootState.auth.user?.team || !state.customer?.$key) {
      return
    }

    const doc = await this.$fire.firestore
      .collection('teams')
      .doc(rootState.auth.user.team)
      .collection('customers')
      .doc(state.customer.$key)
      .collection('addresses')
      .doc(addressID)
      .get()

    commit('SET_ADDRESS', mapDocument<Address>(doc))
  },

  /**
   * Load an invoice in the context
   *
   * @param context
   * @param invoiceID
   * @returns
   */
  async fetchInvoice(
    { commit, dispatch, state, rootState },
    invoiceID: string
  ) {
    if (!rootState.auth.user?.team || !state.customer?.$key) {
      return
    }

    const doc = await this.$fire.firestore
      .collection('teams')
      .doc(rootState.auth.user.team)
      .collection('customers')
      .doc(state.customer.$key)
      .collection('invoices')
      .doc(invoiceID)
      .get()

    const invoice = mapDocument<Invoice>(doc)

    await dispatch('fetchAddress', invoice.address)

    commit('SET_INVOICE', invoice)
  },
}
