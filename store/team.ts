import { ActionTree, GetterTree, MutationTree } from 'vuex/types/index'
import RootState from '~/store'
import { Team } from '~/types/team'

export const state = () => ({
  teams: null as { [key: string]: Team } | null,
  team: null as Team | null,
})

export type TeamModuleState = ReturnType<typeof state>

export const getters: GetterTree<TeamModuleState, RootState> = {
  isOwner(state, _getters, rootState): boolean {
    return state.team?.owner === rootState.auth.auth?.uid
  },
}

export const mutations: MutationTree<TeamModuleState> = {
  SET_TEAM: (state, team: Team) => {
    state.team = team
  },

  SET_TEAMS: (state, teams: Record<string, Team>) => {
    state.teams = teams
  },
}

export const actions: ActionTree<TeamModuleState, RootState> = {
  /**
   * Get teams user belong to
   */
  async getTeams({ commit, rootState }): Promise<void> {
    const ref = this.$fire.firestore
      .collection('teams')
      .where('members', 'array-contains', rootState.auth.auth?.uid)

    const doc = await ref.get()
    const teams = doc.docs.reduce(
      (ac, a) => ({ ...ac, [a.id]: a.data() }),
      {}
    ) as { [key: string]: Team }

    if (rootState.auth.user && rootState.auth.user.team) {
      commit('SET_TEAM', teams[rootState.auth.user.team])
    }

    commit('SET_TEAMS', teams)
  },

  async switchTeam({ rootState }, id: string | null): Promise<void> {
    await this.$fire.firestore
      .collection('users')
      .doc(rootState.auth.auth?.uid)
      .update({
        ...rootState.auth.user,
        team: id,
      })

    this.$router.go(0)
  },
}
