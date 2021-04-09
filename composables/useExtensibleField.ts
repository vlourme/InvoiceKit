import { computed, useStore } from '@nuxtjs/composition-api'
import RootState from '~/store'
import { ExtensibleField, FieldType } from '~/types/team'

export default (extension: string) => {
  // Context
  const store = useStore<RootState>()

  // Get team
  const team = computed(() => store.state.team.team!)

  // Get primary field
  const primary = () =>
    team.value.extensions[extension].find((value) => {
      return value.primary
    })

  // Get values keys
  const values = () =>
    team.value.extensions[extension].map((value) => value.value)

  // Get featured keys
  const featured = () =>
    team.value.extensions[extension].filter((value) => value.featured)

  // Get input type
  const getInputType = (type: FieldType) => {
    switch (type) {
      case FieldType.Number:
        return 'number'
      case FieldType.Email:
        return 'email'
      case FieldType.Date:
        return 'date'
      case FieldType.Text:
      default:
        return 'text'
    }
  }

  return { team, primary, values, featured, getInputType }
}
