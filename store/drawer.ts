import { ActionTree, MutationTree } from 'vuex'
import { AuthModuleState } from './auth'

export const state = () => ({
  drawer: true,
})

export type DrawerModuleState = ReturnType<typeof state>

export const mutations: MutationTree<DrawerModuleState> = {
  SET_DRAWER: (state) => {
    state.drawer = !state.drawer
  },
}

export const actions: ActionTree<DrawerModuleState, AuthModuleState> = {
  toggle({ commit }) {
    commit('SET_DRAWER')
  },
}
