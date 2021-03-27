<template>
  <Modal :activator.sync="display">
    <template #icon>
      <base-modal-icon icon="note" />
    </template>
    <template #title> Ajouter ou modifier une note </template>
    <template #content>
      <div class="mt-2">
        <base-label for="note">Note</base-label>

        <base-textarea
          id="note"
          v-model.trim="invoice.data.note"
        ></base-textarea>
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
  name: 'InvoiceNote',
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
