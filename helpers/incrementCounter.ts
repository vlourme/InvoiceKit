import { Context } from '@nuxt/types'
import _ from 'lodash'
import { Team } from '~/types/team'

/**
 * Increment a distributed counter
 */
export const changeValue = async (
  app: Context,
  counter: string,
  amount = 1,
  increment = true
) => {
  // Update counter
  const teamId: string = app.store.state.auth.user.team

  // Get team
  const team: Team = _.cloneDeep(app.store.state.team.team)

  // Initialize counter
  if (!team.counter) {
    team.counter = {}
  }

  // Initialize counter value
  if (!team.counter[counter]) {
    team.counter[counter] = 0
  }

  // Increment
  if (increment) {
    team.counter[counter] += amount
  } else if (team.counter[counter] > 0) {
    team.counter[counter] -= amount
  }

  // Update on firestore
  await app.$fire.firestore.collection('teams').doc(teamId).update(team)

  // Commit changes
  app.store.commit('team/SET_TEAM', team)
}

/**
 * Add 1 to counter
 *
 * @param app Context
 * @param counter Counter Name
 */
export const increment = async (app: Context, counter: string, amount = 1) => {
  await changeValue(app, counter, amount)
}

/**
 * Remove 1 to counter
 *
 * @param app Context
 * @param counter Counter Name
 */
export const decrement = async (app: Context, counter: string, amount = 1) => {
  await changeValue(app, counter, amount, false)
}
