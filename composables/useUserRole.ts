import { computed, useStore } from '@nuxtjs/composition-api'
import RootState from '~/store'

export default () => {
  const store = useStore<RootState>()

  const user = computed(() => store.state.auth.user!)
  const role = computed(() => store.getters['team/role'])

  return { user, role }
}
