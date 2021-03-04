<template>
  <v-snackbar v-if="notification" v-model="snackbar" top :timeout="3000">
    <div class="d-flex align-center">
      <v-icon v-if="notification.type === 0" color="success" left>
        mdi-check
      </v-icon>

      <v-icon v-if="notification.type === 1" color="primary" left>
        mdi-information
      </v-icon>

      <v-icon v-if="notification.type === 2" color="warning" left>
        mdi-alert
      </v-icon>

      <v-icon v-if="notification.type === 3" color="error" left>
        mdi-alert-circle
      </v-icon>

      {{ notification.message }}
    </div>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
import { MutationPayload } from 'vuex/types/index'
import { RootState } from '~/store/root'
import { Notification } from '~/types/notification'

export default Vue.extend({
  name: 'Notification',
  data: () => ({
    snackbar: false,
    notification: null as Notification | null,
  }),
  mounted() {
    this.$store.subscribe((mutation: MutationPayload, state: RootState) => {
      if (mutation.type === 'SET_NOTIFICATION') {
        this.notification = state.notification
        this.snackbar = true
      }
    })
  },
})
</script>
