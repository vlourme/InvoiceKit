<template>
  <Modal :activator.sync="display">
    <template #icon>
      <base-modal-icon icon="purchase-tag" />
    </template>
    <template #title> Ajouter ou modifier un acompte </template>
    <template #content>
      <div class="mt-2">
        <base-label for="deposit">Acompte en Euro (€)</base-label>

        <base-input
          id="deposit"
          v-model.number="invoice.data.deposit"
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
import Vue, { PropOptions } from 'vue'
import InvoiceImpl from '~/implementations/InvoiceImpl'

export default Vue.extend({
  name: 'InvoiceDeposit',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
    invoiceState: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
  },
  computed: {
    display: {
      get(): boolean {
        return this.dialog
      },
      set(val: boolean) {
        this.$emit('update:dialog', val)
      },
    },
    invoice: {
      get(): InvoiceImpl {
        return this.invoiceState
      },
      set(val: InvoiceImpl): void {
        this.$emit('update:invoice', val)
      },
    },
  },
})
</script>
