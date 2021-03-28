import { computed, useStore } from '@nuxtjs/composition-api'
import RootState from '~/store'
import { Team } from '~/types/team'

export default (props: any, emit: (event: string, ...args: any[]) => void) => {
  const store = useStore<RootState>()

  const team = computed({
    get(): Team {
      return props.teamState
    },

    set(value: Team): void {
      emit('update:team', value)
    },
  })

  const isAdmin = computed(() => store.getters['team/isAdmin'])
  const isOwner = computed(() => store.getters['team/isOwner'])

  return { team, isAdmin, isOwner }
}
