<template>
  <Modal :activator.sync="promotionDialog">
    <template #icon>
      <base-modal-icon icon="offer" />
    </template>
    <template #title> Ajouter ou modifier une réduction </template>
    <template #content>
      <div class="mt-2">
        <base-label for="promotion">Réduction en pourcentage (%)</base-label>

        <base-input
          id="promotion"
          v-model.number="invoice.promotion.percent"
          type="number"
        />
      </div>
      <div class="mt-2">
        <base-label for="promotion">Réduction en Euro (€)</base-label>

        <base-input
          id="promotion"
          v-model.number="invoice.promotion.fixed"
          type="number"
        />
      </div>
    </template>
    <template #footer>
      <base-button info @click.prevent="promotionDialog = false"
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
