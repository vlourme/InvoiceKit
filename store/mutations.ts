import { MutationTree } from 'vuex'
import firebase from 'firebase'
import InitialState from './state'
import { RootState } from './root'
import User from '~/types/user'
import Team from '~/types/team'
import { Notification } from '~/types/notification'

const mutations: MutationTree<RootState> = {
  RESET_STORE: (state) => {
    Object.assign(state, InitialState())
  },

  SET_AUTH_USER: (state, authUser: firebase.User) => {
    state.auth = {
      uid: authUser.uid,
      email: authUser.email,
    }
  },

  SET_USER: (state, user: User) => {
    state.user = user
  },

  SET_TEAM: (state, team: Team) => {
    state.team = team
  },

  SET_TEAMS: (state, teams: Record<string, Team>) => {
    state.teams = teams
  },

  SET_DRAWER: (state, drawer) => {
    state.drawer = drawer
  },

  SET_NOTIFICATION: (state, notification: Notification) => {
    state.notification = notification
  },
}

export default mutations
