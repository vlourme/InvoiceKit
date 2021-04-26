import {
  toRefs,
  useContext,
  useRouter,
  computed,
  reactive,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { mapDocument } from '~/helpers/documentMapper'
import useUserRole from '~/composables/useUserRole'
import { Contract, defaultContract } from '~/types/contract'

const state = reactive({
  oldState: defaultContract(),
  contract: defaultContract(),
  customerId: '',
})

export default (customerId: string) => {
  // Store customer
  state.customerId = customerId

  // Context
  const ctx = useContext()
  const router = useRouter()

  // Computed
  const { user, role } = useUserRole()
  const hasChanges = computed(() => !_.isEqual(state.contract, state.oldState))

  // Methods
  const resetState = () => {
    state.oldState = defaultContract()
    state.contract = defaultContract()
  }

  const loadContract = async (contractId: string) => {
    const doc = await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(state.customerId)
      .collection('contracts')
      .doc(contractId)
      .get()

    state.contract = mapDocument<Contract>(doc)
    state.oldState = _.cloneDeep(state.contract)
  }

  const saveContract = async (update: boolean): Promise<void> => {
    if (update) {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .doc(state.customerId)
        .collection('contracts')
        .doc(state.contract.$key)
        .update(state.contract)

      state.oldState = _.cloneDeep(state.contract)
    } else {
      const doc = await ctx.$fire.firestore
        .collection('teams')
        .doc(user.value.team!)
        .collection('customers')
        .doc(state.customerId)
        .collection('contracts')
        .add(state.contract)

      await router.push(`/customers/${doc.id}`)
    }
  }

  const deleteContract = async (): Promise<void> => {
    await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .collection('customers')
      .doc(state.customerId)
      .collection('contracts')
      .doc(state.contract.$key!)
      .delete()

    await router.push('/customers')
  }

  return {
    state: toRefs(state),
    user,
    role,
    hasChanges,
    resetState,
    loadContract,
    saveContract,
    deleteContract,
  }
}
