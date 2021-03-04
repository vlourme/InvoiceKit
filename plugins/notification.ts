import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import { Notification, NotificationType } from '~/types/notification'

export default ({ store }: Context, inject: Inject) => {
  inject('notify', (message: string, type: NotificationType) => {
    store.dispatch('notification/send', { message, type } as Notification)
  })
}
