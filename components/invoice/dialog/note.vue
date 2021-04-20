<template>
  <Modal :activator.sync="noteDialog">
    <template #icon>
      <base-modal-icon icon="note" />
    </template>
    <template #title> Ajouter ou modifier une note </template>
    <template #content>
      <div class="mt-2">
        <base-label for="note">Note</base-label>

        <base-textarea id="note" v-model.trim="invoice.note"></base-textarea>
      </div>
    </template>
    <template #footer>
      <base-button info @click.prevent="noteDialog = false">Fermer</base-button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import useInvoice from '~/composables/useInvoice'

export default defineComponent({
  setup() {
    const { state } = useInvoice()

    return { ...state }
  },
})
</script>
