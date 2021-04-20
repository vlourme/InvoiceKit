<template>
  <Modal :activator.sync="depositDialog">
    <template #icon>
      <base-modal-icon icon="purchase-tag" />
    </template>
    <template #title> Ajouter ou modifier un acompte </template>
    <template #content>
      <div class="mt-2">
        <base-label for="deposit">Acompte en Euro (€)</base-label>

        <base-input
          id="deposit"
          v-model.number="invoice.deposit"
          type="number"
        />
      </div>
    </template>
    <template #footer>
      <base-button info @click.prevent="depositDialog = false"
        >Fermer</base-button
      >
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
