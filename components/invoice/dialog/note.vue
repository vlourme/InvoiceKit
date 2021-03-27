<template>
  <Modal :activator.sync="display">
    <template #icon>
      <div
        class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
      >
        <i class="bx bxs-note text-indigo-600 text-xl"></i>
      </div>
    </template>
    <template #title> Ajouter ou modifier une note </template>
    <template #content>
      <div class="mt-2">
        <label class="text-sm text-gray-500" for="note">Note</label>
        <textarea
          id="note"
          v-model.trim="invoice.data.note"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        ></textarea>
      </div>
    </template>
    <template #footer>
      <button
        class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-gray-100 hover:bg-indigo-600 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        type="button"
        @click.prevent="display = false"
      >
        Fermer
      </button>
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
