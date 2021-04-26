import {
  toRefs,
  useContext,
  useRouter,
  computed,
  reactive,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { mapDocument, mapSnapshot } from '~/helpers/documentMapper'
import { Address } from '~/types/address'
import { Customer, defaultCustomer } from '~/types/customer'
import { Invoice } from '~/types/invoice'
import useUserRole from '~/composables/useUserRole'
import { Contract } from '~/types/contract'

const state = reactive({
  oldState: defaultCustomer(),
  customer: defaultCustomer(),
  addresses: [] as Address[],
  invoices: [] as Invoice[],
  contracts: [] as Contract[],
})

export default () => {
  // Context
  const ctx = useContext()
  const router = useRouter()

  // Computed
  const { user, role } = useUserRole()
  const hasChanges = computed(() => !_.isEqual(state.customer, state.oldState))

  // Methods
  const resetState = () => {
    state.oldState = defaultCustomer()
    state.customer = defaultCustomer()
    state.addresses = []
    state.invoices = []
  }

  const loadCustomer = async (customerId: string) => {
    const doc = await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .get()

    state.customer = mapDocument<Customer>(doc)
    state.oldState = _.cloneDeep(state.customer)
  }

  const loadAddresses = (customerId: string) => {
    ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .collection('addresses')
      .onSnapshot((snapshot) => {
        state.addresses = mapSnapshot<Address>(snapshot)
      })
  }

  const loadInvoices = (customerId: string) => {
    ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .collection('invoices')
      .onSnapshot((snapshot) => {
        state.invoices = mapSnapshot<Invoice>(snapshot)
      })
  }

  const loadContracts = (customerId: string) => {
    ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(customerId)
      .collection('contracts')
      .onSnapshot((snapshot) => {
        state.contracts = mapSnapshot<Contract>(snapshot)
      })
  }

  const saveCustomer = async (update: boolean): Promise<void> => {
    if (update) {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .doc(state.customer.$key!)
        .update(state.customer)

      state.oldState = _.cloneDeep(state.customer)
    } else {
      const doc = await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .add(state.customer)

      await router.push(`/customers/${doc.id}`)
    }
  }

  const deleteCustomer = async (): Promise<void> => {
    await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(state.customer.$key!)
      .delete()

    await router.push('/customers')
  }

  return {
    state: toRefs(state),
    user,
    role,
    hasChanges,
    resetState,
    loadCustomer,
    loadAddresses,
    loadInvoices,
    loadContracts,
    saveCustomer,
    deleteCustomer,
  }
}
