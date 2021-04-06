import { ActionTree, GetterTree, MutationTree } from 'vuex/types/index'
import { mapDocument, mapSnapshot } from '~/helpers/documentMapper'
import RootState from '~/store'
import { MemberPermission, Team } from '~/types/team'
import User from '~/types/user'

export const state = () => ({
  teams: null as { [key: string]: Team } | null,
  team: null as Team | null,
})

export type TeamModuleState = ReturnType<typeof state>

export const getters: GetterTree<TeamModuleState, RootState> = {
  isOwner(state, _getters, rootState): boolean {
    return state.team?.owner === rootState.auth.auth?.uid
  },

  isAdmin(state, _getters, rootState): boolean {
    return (
      state.team?.owner === rootState.auth.auth?.uid ||
      state.team?.members[rootState.auth.auth?.uid!] === 2
    )
  },

  role(state, _getters, rootState): MemberPermission | undefined {
    const uid = rootState.auth.auth?.uid
    return state.team?.members[uid ?? '']
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
    const uid = rootState.auth.auth?.uid

    try {
      const ref = await this.$fire.firestore
        .collection('teams')
        .where(`members.${uid}`, '>=', 0)
        .get()

      const teams = mapSnapshot<Team>(ref)

      const sorted: { [key: string]: Team } = {}

      teams.forEach((team) => {
        sorted[team.$key!] = team
      })

      commit('SET_TEAMS', sorted)
    } catch (err) {
      console.error(err)
    }
  },

  async switchTeam(
    { rootState, commit, dispatch },
    id: string | null = null
  ): Promise<void> {
    // Avoid rewritting
    if (rootState.auth.user?.team !== id) {
      console.info('[Store] Switching from:', rootState.auth.user?.team)
      console.info('[Store] Change user team to:', id)

      // Update last team
      await this.$fire.firestore
        .collection('users')
        .doc(rootState.auth.auth?.uid)
        .update({
          ...rootState.auth.user,
          team: id || null,
        } as User)
    }

    // Load team
    if (id) {
      try {
        console.log('[Store] Loading team:', id)
        const ref = await this.$fire.firestore.collection('teams').doc(id).get()

        if (ref.exists) {
          commit('SET_TEAM', mapDocument<Team>(ref))
        } else {
          throw new Error('cannot get team')
        }
      } catch {
        console.log('[Store] Switching to empty team')
        await dispatch('switchTeam', null)
      }
    }
  },
}
