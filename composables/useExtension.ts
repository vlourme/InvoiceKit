import { computed, ref } from '@nuxtjs/composition-api'
import { defaultExtension, Extension } from '~/types/team'

const state = ref(defaultExtension())

export default () => {
  // Computed
  const hasPrimaryKey = computed(() =>
    state.value.fields.some((value) => value.primary)
  )

  // Methods
  const setState = (extension: Extension) => {
    state.value = extension
  }

  return { state, hasPrimaryKey, setState }
}
