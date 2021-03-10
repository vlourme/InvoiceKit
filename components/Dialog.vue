<template>
  <v-dialog v-if="dialog" v-model="enabled" :width="500">
    <v-card color="grey darken-3">
      <v-card-title>
        {{ dialog.title }}
      </v-card-title>
      <v-card-text>
        {{ dialog.message }}
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn v-if="dialog.showCancel" text @click="enabled = !enabled">
          Fermer
        </v-btn>

        <v-btn :elevation="0" :color="getColor()" @click="action">
          {{ dialog.actionMessage }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { MutationPayload } from 'vuex'
import { Dialog, DialogType } from '~/types/dialog'

export default Vue.extend({
  name: 'Dialog',
  data: () => ({
    enabled: false,
    dialog: null as Dialog | null,
  }),
  mounted() {
    this.$store.subscribe((mutation: MutationPayload) => {
      if (mutation.type === 'dialog/SET_DIALOG') {
        this.dialog = mutation.payload as Dialog
        this.enabled = true
      }
    })
  },
  methods: {
    getColor(): string {
      if (!this.dialog) {
        return 'error'
      }

      switch (this.dialog.type) {
        case DialogType.Success:
          return 'success'
        case DialogType.Warning:
          return 'warning'
        case DialogType.Error:
        default:
          return 'error'
      }
    },

    action(): void {
      if (!this.dialog) {
        return
      }

      this.enabled = false
      this.dialog.callback()
    },
  },
})
</script>
