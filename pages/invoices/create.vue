<template>
  <form v-if="!$fetchState.pending" @submit.prevent="saveInvoice(false)">
    <div class="flex flex-col h-screen overflow-y-hidden">
      <Header>
        Créer un document

        <template #actions>
          <base-nav-button :disabled="!hasChanges" type="submit">
            Enregistrer
          </base-nav-button>
        </template>
      </Header>

      <div class="flex flex-1 h-full">
        <div class="flex-1">
          <invoice-editor
            :invoice-state.sync="invoice"
            :customer="customer"
          ></invoice-editor>

          <invoice-table></invoice-table>
        </div>

        <invoice-sidebar
          :promotion-dialog.sync="promotionDialog"
          :deposit-dialog.sync="depositDialog"
          :note-dialog.sync="noteDialog"
        ></invoice-sidebar>
      </div>
    </div>

    <invoice-dialog-deposit
      :dialog.sync="depositDialog"
    ></invoice-dialog-deposit>

    <invoice-dialog-promotion
      :dialog.sync="promotionDialog"
    ></invoice-dialog-promotion>

    <invoice-dialog-note :dialog.sync="noteDialog"></invoice-dialog-note>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import useInvoice from '~/composables/useInvoice'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Data
    const route = useRoute()
    const {
      state,
      hasChanges,
      loadCustomer,
      loadAddress,
      saveInvoice,
    } = useInvoice()
    const data = reactive({
      promotionDialog: false,
      depositDialog: false,
      noteDialog: false,
    })

    // Fetch
    useFetch(async () => {
      const query = route.value.query as { [key: string]: string }

      await loadCustomer(query.customer)
      await loadAddress(query.customer, query.address)
    })

    return { ...state, ...data, hasChanges, saveInvoice }
  },
  head: {
    title: 'Créer une facture',
  },
})
</script>
