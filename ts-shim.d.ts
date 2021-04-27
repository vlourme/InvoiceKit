import Vue from 'vue'
import { NotificationType } from './types/notification'
import { Dialog } from '~/types/dialog'

declare module '*.vue' {
  export default Vue
}

declare module '@nuxt/types/index' {
  interface Context {
    /**
     * Send a notification to the user as a snackbar
     *
     * @file helpers/notification.ts
     * @param message
     * @param type
     */
    $notify(message: string, type: NotificationType): void

    /**
     * Create a confirm dialog dynamically
     *
     * @file helpers/dialog.ts
     * @param dialog
     */
    $dialog(dialog: Dialog): void
  }
}
