import {
  toRefs,
  useContext,
  useRouter,
  computed,
  reactive,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { mapDocument, mapSnapshot } from '~/helpers/documentMapper'
import { Customer, defaultCustomer } from '~/types/customer'
import useUserRole from '~/composables/useUserRole'
import { Model } from '~/types/model'
import { Address } from '~/types/address'
import { Invoice } from '~/types/invoice'
import { Contract } from '~/types/contract'

const state = reactive({
  oldState: defaultCustomer(),
  customer: defaultCustomer(),
  collections: {
    addresses: [] as Address[],
    invoices: [] as Invoice[],
    contracts: [] as Contract[],
  } as { [key: string]: any[] },
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

  const loadCollection = async <T extends Model>(
    name: string,
    listener = false
  ) => {
    const ref = ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(state.customer.$key)
      .collection(name)

    if (listener) {
      ref.onSnapshot((snapshot) => {
        state.collections[name] = mapSnapshot<T>(snapshot)
      })
    } else {
      const data = await ref.get()
      state.collections[name] = mapSnapshot<T>(data)
    }
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
    loadCollection,
    saveCustomer,
    deleteCustomer,
  }
}
