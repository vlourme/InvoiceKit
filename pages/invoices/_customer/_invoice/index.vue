<template>
  <form v-if="!$fetchState.pending" @submit.prevent="updateInvoice">
    <div class="flex flex-col h-screen overflow-y-hidden pr-80">
      <Header>
        {{ invoice.type === 'QUOTE' ? 'Devis' : 'Facture' }}
        #{{ invoice.id }}

        <template #actions>
          <base-nav-button :disabled="!hasChanges" type="submit">
            Enregistrer
          </base-nav-button>
        </template>
      </Header>

      <div class="flex flex-1 h-full">
        <div class="flex-1">
          <invoice-editor></invoice-editor>

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
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api'
import useInvoice from '~/composables/useInvoice'
import { NotificationType } from '~/types/notification'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Data
    const ctx = useContext()
    const route = useRoute()
    const {
      state,
      hasChanges,
      loadInvoice,
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
      const { customer, invoice } = route.value.params

      await loadInvoice(customer, invoice)
      await loadCustomer(customer)
      await loadAddress(customer, state.invoice.value.address)
    })

    // Methods
    const updateInvoice = async () => {
      await saveInvoice(true)

      ctx.$notify(
        'Les changements ont bien étés sauvegardés',
        NotificationType.SUCCESS
      )
    }

    return { ...state, ...data, hasChanges, updateInvoice }
  },
  head: {
    title: 'Créer une facture',
  },
})
</script>
