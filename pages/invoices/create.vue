<template>
  <form v-if="!$fetchState.pending" @submit.prevent="saveInvoice(false)">
    <div class="flex flex-col h-screen overflow-y-hidden pr-80">
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

        <invoice-sidebar></invoice-sidebar>
      </div>
    </div>

    <invoice-dialog-deposit></invoice-dialog-deposit>

    <invoice-dialog-promotion></invoice-dialog-promotion>

    <invoice-dialog-note></invoice-dialog-note>
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
      resetState,
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

      resetState()
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
