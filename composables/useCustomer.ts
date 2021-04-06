import {
  toRefs,
  useContext,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { computed, reactive } from '@vue/composition-api'
import _ from 'lodash'
import { mapDocument, mapSnapshot } from '~/helpers/documentMapper'
import RootState from '~/store'
import { Address } from '~/types/address'
import { Customer, defaultCustomer } from '~/types/customer'
import { Invoice } from '~/types/invoice'

const state = reactive({
  oldState: defaultCustomer(),
  customer: defaultCustomer(),
  addresses: [] as Address[],
  invoices: [] as Invoice[],
})

export default () => {
  // Context
  const ctx = useContext()
  const store = useStore<RootState>()
  const router = useRouter()

  // Computed
  const user = computed(() => store.state.auth.user!)
  const role = computed(() => store.getters['team/role'])
  const hasChanges = computed(() => !_.isEqual(state.customer, state.oldState))

  // Methods
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
    loadCustomer,
    loadAddresses,
    loadInvoices,
    saveCustomer,
    deleteCustomer,
  }
}
