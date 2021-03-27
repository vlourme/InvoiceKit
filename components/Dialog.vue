<template>
  <Modal v-if="dialog" :activator.sync="enabled">
    <template #title>
      {{ dialog.title }}
    </template>
    <template #icon>
      <div
        :class="{
          'bg-green-100': dialog.type === 0,
          'bg-yellow-100': dialog.type === 1,
          'bg-red-100': dialog.type === 2,
        }"
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
      >
        <i
          :class="{
            'bxs-check-circle text-green-500': dialog.type === 0,
            'bxs-info-circle text-yellow-500': dialog.type === 1,
            'bxs-error-circle text-red-500': dialog.type === 2,
          }"
          class="bx text-xl"
        ></i>
      </div>
    </template>
    <template #content>
      {{ dialog.message }}
    </template>
    <template #footer>
      <button
        :class="{
          'bg-green-500 hover:bg-green-600': dialog.type === 0,
          'bg-yellow-500 hover:bg-yellow-600': dialog.type === 1,
          'bg-red-500 hover:bg-red-600': dialog.type === 2,
        }"
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm"
        type="submit"
        @click="action"
      >
        {{ dialog.actionMessage }}
      </button>

      <button
        v-if="dialog.showCancel"
        type="button"
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="enabled = false"
      >
        Annuler
      </button>
    </template>
  </Modal>
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
