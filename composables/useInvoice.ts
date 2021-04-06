import { useContext, useRouter, useStore } from '@nuxtjs/composition-api'
import { computed, reactive, ref, toRefs, watch } from '@vue/composition-api'
import _ from 'lodash'
import { getFinalPrice, getTotalTaxes } from './useInvoicePricing'
import { mapDocument } from '~/helpers/documentMapper'
import RootState from '~/store'
import { Address, defaultAddress } from '~/types/address'
import { Customer, defaultCustomer } from '~/types/customer'
import { defaultInvoice, Invoice } from '~/types/invoice'

const state = reactive({
  oldState: defaultInvoice(),
  invoice: defaultInvoice(),
  customer: defaultCustomer(),
  address: defaultAddress(),
  taxes: 0,
  total: 0,
})

export default () => {
  // Context
  const ctx = useContext()
  const store = useStore<RootState>()
  const router = useRouter()

  // Computed
  const user = computed(() => store.state.auth.user!)
  const role = computed(() => store.getters['team/role'])
  const hasChanges = computed(() => !_.isEqual(state.invoice, state.oldState))
  const canDelete = computed(() => !state.invoice.$key)

  // Watchers
  watch(
    state.invoice,
    (invoice) => {
      state.taxes = getTotalTaxes(invoice)
      state.total = getFinalPrice(invoice)
    },
    { deep: true }
  )

  // Methods
  const loadCustomer = async (customerId: string) => {
    const ref = await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .get()

    state.customer = mapDocument<Customer>(ref)
  }

  const loadAddress = async (customerId: string, addressId: string) => {
    const ref = await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .collection('addresses')
      .doc(addressId)
      .get()

    state.address = mapDocument<Address>(ref)
    state.invoice.address = ref.id
  }

  const loadInvoice = async (customerId: string, invoiceId: string) => {
    const ref = await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .collection('invoices')
      .doc(invoiceId)
      .get()

    state.invoice = mapDocument<Invoice>(ref)
    state.oldState = _.cloneDeep(state.invoice)
  }

  const saveInvoice = async (update: boolean) => {
    // Save invoice
    if (update) {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .doc(state.customer.$key!)
        .collection('invoices')
        .doc(state.invoice.$key!)
        .update(state.invoice)

      // Update old state
      state.oldState = _.cloneDeep(state.invoice)
    } else {
      const doc = await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .doc(state.customer.$key!)
        .collection('invoices')
        .add(state.invoice)

      // Redirect
      await router.push(`/invoices/${state.customer.$key}/${doc.id}`)
    }
  }

  const deleteInvoice = async (): Promise<boolean> => {
    if (!canDelete.value) {
      return false
    }

    await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(state.customer.$key!)
      .collection('invoices')
      .doc(state.invoice.$key!)
      .delete()

    // Redirect
    await router.push('/invoices/')
    return true
  }

  return {
    state: toRefs(state),
    user,
    role,
    hasChanges,
    canDelete,
    loadCustomer,
    loadAddress,
    loadInvoice,
    saveInvoice,
    deleteInvoice,
  }
}
