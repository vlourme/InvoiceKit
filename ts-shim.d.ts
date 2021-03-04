import Vue from 'vue'
import { NotificationType } from './types/notification'

declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Send a notification to the user as a snackbar
     *
     * @file helpers/notification.ts
     * @param message
     * @param type
     */
    $notify(message: string, type: NotificationType): void
  }
}
