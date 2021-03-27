<template>
  <FormBox>
    <template #description>
      <FormDescription>
        <template #title> Informations sur le document </template>

        <template #description>
          Les informations essentielles sur le document
        </template>

        <template #actions>
          <base-button-inline
            danger
            icon="minus"
            @click.prevent="deleteInvoice"
          >
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
            v-model.trim="invoice.data.id"
            :disabled="role === 0"
            required
          />
        </div>
        <div class="mt-1">
          <base-label for="type">Identifiant</base-label>
          <base-select
            id="type"
            v-model="invoice.data.type"
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
            v-model.trim="invoice.data.date"
            :disabled="role === 0"
            type="date"
            required
          />
        </div>

        <div class="mt-1">
          <base-label for="status">Statut</base-label>
          <base-select
            id="status"
            v-model="invoice.data.status"
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
import Vue, { PropOptions } from 'vue'
import { mapGetters, mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { DialogType } from '~/types/dialog'
import { InvoiceStatus, InvoiceType } from '~/types/invoice'

export default Vue.extend({
  name: 'InvoiceStatus',
  props: {
    invoiceState: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
  },
  data: () => ({
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
  }),
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('payload', ['customer']),
    ...mapGetters('team', ['role']),
    invoice: {
      get(): InvoiceImpl {
        return this.invoiceState
      },
      set(val: InvoiceImpl) {
        this.$emit('update:invoice', val)
      },
    },
  },
  methods: {
    deleteInvoice(): void {
      this.$dialog({
        title: 'Supprimer la facture',
        message: 'Une fois supprimée, celle-ci sera irrecupérable.',
        type: DialogType.Error,
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await this.deleteCallback(),
      })
    },

    async deleteCallback(): Promise<void> {
      const { invoice } = this.$route.params

      // Delete invoice
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .doc(invoice)
        .delete()

      // Redirect
      this.$router.push('/invoices/')
    },
  },
})
</script>
