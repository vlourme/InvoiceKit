import { ActionTree } from 'vuex'
import firebase from 'firebase'
import { RootState } from './root'
import Team from '~/types/team'
import { Notification } from '~/types/notification'

const actions: ActionTree<RootState, RootState> = {
  /**
   * Store the user
   *
   * @param user User from Firebase
   */
  async onAuthStateChanged(
    { commit, dispatch },
    { authUser }: { authUser: firebase.User }
  ): Promise<void> {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }

    // Refresh token

    try {
      await authUser.getIdToken(false)
    } catch (e) {
      console.error(e)
    }

    // Commit
    commit('SET_AUTH_USER', authUser)

    // Get user
    await dispatch('getUser')

    // Get teams
    await dispatch('getTeam')
  },

  getUser({ commit, state }): void {
    this.$fire.firestore
      .collection('users')
      .doc(state.auth?.uid)
      .onSnapshot((snapshot) => {
        commit('SET_USER', snapshot.data())
      })
  },

  /**
   * Get teams user belong to
   *
   * @param uid User ID
   */
  async getTeam({ commit, state }): Promise<void> {
    const ref = this.$fire.firestore
      .collection('teams')
      .where('members', 'array-contains', state.auth?.uid)

    const doc = await ref.get()
    const teams = doc.docs.reduce(
      (ac, a) => ({ ...ac, [a.id]: a.data() }),
      {}
    ) as { [key: string]: Team }

    if (state.user && state.user.team) {
      commit('SET_TEAM', teams[state.user.team])
    }

    commit('SET_TEAMS', teams)
  },

  async switchTeam({ state }, id: string | null): Promise<void> {
    await this.$fire.firestore
      .collection('users')
      .doc(state.auth?.uid)
      .update({
        ...state.user,
        team: id,
      })

    this.$router.go(0)
  },

  sendNotification({ commit }, notification: Notification) {
    commit('SET_NOTIFICATION', notification)
  },
}

export default actions
