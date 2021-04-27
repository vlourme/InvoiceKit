import {
  computed,
  reactive,
  toRefs,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import { mapDocument } from '~/helpers/documentMapper'
import RootState from '~/store'
import { defaultTeam, Team } from '~/types/team'
import User from '~/types/user'

const state = reactive({
  team: defaultTeam(),
  oldState: defaultTeam(),
  members: [] as User[],
})

export default () => {
  // Context
  const ctx = useContext()
  const store = useStore<RootState>()

  // Computed
  const user = computed(() => store.state.auth.user!)
  const hasChanges = computed(() => !_.isEqual(state.team, state.oldState))
  const role = computed(() => store.getters['team/role'])
  const isAdmin = computed(() => store.getters['team/isAdmin'])
  const isOwner = computed(() => store.getters['team/isOwner'])

  // Methods
  const load = async (fetchMembers = true) => {
    const ref = await ctx.$fire.firestore
      .collection('teams')
      .doc(user.value.team!)
      .get()

    state.team = mapDocument<Team>(ref)
    state.oldState = _.cloneDeep(state.team)

    if (fetchMembers) {
      await loadMembers()
    }
  }

  const loadMembers = async () => {
    // Load members
    for (const uid in state.team.members) {
      const doc = await ctx.$fire.firestore.collection('users').doc(uid).get()

      state.members.push(mapDocument<User>(doc))
    }

    // Sort by permissions
    state.members.sort(
      (a, b) => state.team.members[b.$key!] - state.team.members[a.$key!]
    )
  }

  const save = async (): Promise<boolean> => {
    try {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(state.team.$key)
        .update(state.team)

      state.oldState = _.cloneDeep(state.team)

      return true
    } catch {
      return false
    }
  }

  const remove = async (): Promise<boolean> => {
    const func = ctx.$fire.functions.httpsCallable('deleteTeam')

    try {
      const res = await func({ teamId: state.team.$key })

      return res.data.success
    } catch {
      return false
    }
  }

  const leave = async (): Promise<boolean> => {
    const func = ctx.$fire.functions.httpsCallable('leaveTeam')

    try {
      const res = await func({ teamId: state.team.$key })

      return res.data.success
    } catch {
      return false
    }
  }

  return {
    state: toRefs(state),
    hasChanges,
    user,
    role,
    isAdmin,
    isOwner,
    load,
    save,
    remove,
    leave,
  }
}
