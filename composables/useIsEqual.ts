import _ from 'lodash'
import { computed } from '@nuxtjs/composition-api'

export default (actual: any, old: any) => {
  return computed(() => !_.isEqual(actual, old))
}
