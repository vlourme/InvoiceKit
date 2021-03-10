import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { Dialog } from '~/types/dialog'

export default ({ store }: Context, inject: Inject) => {
  inject('dialog', (dialog: Dialog) => {
    store.dispatch('dialog/set', dialog)
  })
}
