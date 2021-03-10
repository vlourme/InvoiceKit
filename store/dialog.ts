import { ActionTree, MutationTree } from 'vuex'
import { Dialog } from './../types/dialog'
import { AuthModuleState } from './auth'

export const state = () => ({
  dialog: null as Dialog | null,
})

export type NotificationModuleState = ReturnType<typeof state>

export const mutations: MutationTree<NotificationModuleState> = {
  SET_DIALOG: (state, dialog: Dialog) => {
    state.dialog = dialog
  },
}

export const actions: ActionTree<NotificationModuleState, AuthModuleState> = {
  set({ commit }, dialog: Dialog) {
    commit('SET_DIALOG', dialog)
  },
}
