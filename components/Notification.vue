<template>
  <div class="absolute z-50 my-4 top-0 left-0 w-screen">
    <transition
      enter-class="scale-75 opacity-0"
      enter-active-class="scale-100 opacity-100"
      class="transition-all transform translate-y-0"
    >
      <div
        v-if="notification"
        v-show="show"
        class="mx-auto max-w-xs transition-all transform translate-y-0 w-full flex items-center px-4 py-2 bg-gray-50 border-2 border-gray-100 shadow-md rounded-md"
        top
      >
        <i
          :class="{
            'bxs-check-circle text-green-500': notification.type === 0,
            'bxs-info-circle text-blue-500': notification.type === 1,
            'bxs-error text-yellow-500': notification.type === 2,
            'bxs-error-circle text-red-500': notification.type === 3,
          }"
          class="bx text-xl mr-3"
        ></i>

        {{ notification.message }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MutationPayload } from 'vuex/types/index'
import { Notification } from '~/types/notification'

export default Vue.extend({
  name: 'Notification',
  data: () => ({
    show: false,
    notification: null as Notification | null,
  }),
  mounted() {
    this.$store.subscribe((mutation: MutationPayload) => {
      if (mutation.type === 'notification/SET_NOTIFICATION') {
        this.notification = mutation.payload as Notification
        this.show = true

        setTimeout(() => {
          this.show = false
        }, 3000)
      }
    })
  },
})
</script>
