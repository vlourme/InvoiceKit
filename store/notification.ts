import { Notification } from '@/types/notification'
import { ActionTree, MutationTree } from 'vuex/types/index'
import { AuthModuleState } from './auth'

export const state = () => ({
  notification: null as Notification | null,
})

export type NotificationModuleState = ReturnType<typeof state>

export const mutations: MutationTree<NotificationModuleState> = {
  SET_NOTIFICATION: (state, notification: Notification) => {
    state.notification = notification
  },
}

export const actions: ActionTree<NotificationModuleState, AuthModuleState> = {
  send({ commit }, notification: Notification) {
    commit('SET_NOTIFICATION', notification)
  },
}
