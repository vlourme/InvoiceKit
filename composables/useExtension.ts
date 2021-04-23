import { computed, toRefs } from '@nuxtjs/composition-api'
import { reactive } from '@vue/reactivity'
import { defaultExtension, Extension } from '~/types/team'

const state = reactive({
  extension: defaultExtension(),
})

export default () => {
  // Computed
  const hasPrimaryKey = computed(() =>
    state.extension.fields.some((value) => value.primary)
  )

  // Methods
  const setState = (extension: Extension) => {
    state.extension = extension
  }

  return { state: toRefs(state), hasPrimaryKey, setState }
}
