import { useContext, useRouter } from '@nuxtjs/composition-api'
import { computed, reactive, toRefs, watch } from '@vue/composition-api'
import _ from 'lodash'
import { getFinalPrice, getTotalTaxes } from './useInvoicePricing'
import { mapDocument } from '~/helpers/documentMapper'
import { Address, defaultAddress } from '~/types/address'
import { Customer, defaultCustomer } from '~/types/customer'
import { defaultInvoice, Invoice } from '~/types/invoice'
import useUserRole from '~/composables/useUserRole'
import useIsEqual from '~/composables/useIsEqual'

const state = reactive({
  oldState: defaultInvoice(),
  invoice: defaultInvoice(),
  customer: defaultCustomer(),
  address: defaultAddress(),
  taxes: 0,
  total: 0,
  promotionDialog: false,
  depositDialog: false,
  noteDialog: false,
})

export default () => {
  // Context
  const ctx = useContext()
  const router = useRouter()

  // Computed
  const { user, role } = useUserRole()
  const hasChanges = useIsEqual(state.customer, state.oldState)
  const canDelete = computed(() => state.invoice.$key != null)

  // Watchers
  watch(
    state.invoice,
    (invoice) => {
      state.taxes = getTotalTaxes(invoice)
      state.total = getFinalPrice(invoice)
    },
    { deep: true, immediate: true }
  )

  // Methods
  const resetState = () => {
    state.invoice = defaultInvoice()
    state.address = defaultAddress()
    state.customer = defaultCustomer()
    state.oldState = defaultInvoice()
    state.taxes = 0
    state.total = 0
  }

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
    resetState,
    loadCustomer,
    loadAddress,
    loadInvoice,
    saveInvoice,
    deleteInvoice,
  }
}
