<template>
  <FormBox>
    <template #description>
      <FormDescription>
        <template #title> Informations sur le document </template>

        <template #description>
          Les informations essentielles sur le document
        </template>

        <template #actions>
          <base-button-inline danger icon="minus" @click.prevent="askDelete">
            Supprimer le document
          </base-button-inline>
        </template>
      </FormDescription>
    </template>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <div>
          <base-label for="id">Identifiant</base-label>
          <base-input
            id="id"
            v-model.trim="invoice.id"
            :disabled="role === 0"
            required
          />
        </div>
        <div class="mt-1">
          <base-label for="type">Identifiant</base-label>
          <base-select
            id="type"
            v-model="invoice.type"
            :disabled="role === 0"
            required
            :items="types"
          />
        </div>
      </div>
      <div>
        <div>
          <base-label for="date">Date</base-label>
          <base-input
            id="date"
            v-model.trim="invoice.date"
            :disabled="role === 0"
            type="date"
            required
          />
        </div>

        <div class="mt-1">
          <base-label for="status">Statut</base-label>
          <base-select
            id="status"
            v-model="invoice.status"
            :disabled="role === 0"
            required
            :items="statuses"
          />
        </div>
      </div>
    </div>
  </FormBox>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from '@nuxtjs/composition-api'
import useInvoice from '~/composables/useInvoice'
import { DialogType } from '~/types/dialog'
import { InvoiceStatus, InvoiceType } from '~/types/invoice'

export default defineComponent({
  setup() {
    // Context
    const ctx = useContext()

    // Data
    const { state, role, canDelete, deleteInvoice } = useInvoice()
    const selects = reactive({
      types: [
        { text: 'Facture', value: InvoiceType.Invoice },
        { text: 'Devis', value: InvoiceType.Estimation },
      ],
      statuses: [
        { text: 'Aucun', value: InvoiceStatus.None },
        { text: 'Impayé', value: InvoiceStatus.Unpaid },
        { text: 'En attente', value: InvoiceStatus.Pending },
        { text: 'Payé', value: InvoiceStatus.Paid },
      ],
    })

    // Methods
    const askDelete = (): void => {
      ctx.$dialog({
        title: 'Supprimer la facture',
        message: 'Une fois supprimée, celle-ci sera irrecupérable.',
        type: DialogType.Error,
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await deleteInvoice(),
      })
    }

    return {
      ...state,
      ...selects,
      role,
      canDelete,
      askDelete,
      deleteInvoice,
    }
  },
})
</script>
