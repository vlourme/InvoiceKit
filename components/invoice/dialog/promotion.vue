<template>
  <Modal :activator.sync="display">
    <template #icon>
      <base-modal-icon icon="offer" />
    </template>
    <template #title> Ajouter ou modifier une réduction </template>
    <template #content>
      <div class="mt-2">
        <base-label for="promotion">Réduction en pourcentage (%)</base-label>

        <base-input
          id="promotion"
          v-model.number="invoice.promotion"
          type="number"
        />
      </div>
    </template>
    <template #footer>
      <base-button info @click.prevent="display = false">Fermer</base-button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { computed, defineComponent, PropOptions } from '@nuxtjs/composition-api'
import useInvoice from '~/composables/useInvoice'

export default defineComponent({
  props: {
    dialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
  },
  setup(props, { emit }) {
    // Data
    const { state } = useInvoice()

    // Computed
    const display = computed({
      get(): boolean {
        return props.dialog!
      },
      set(val: boolean) {
        emit('update:dialog', val)
      },
    })

    return { ...state, display }
  },
})
</script>
