<template>
  <form @submit.prevent="updateInvoice">
    <div class="flex flex-col h-screen overflow-y-hidden">
      <Header>
        {{ invoice.data.type === 'QUOTE' ? 'Devis' : 'Facture' }}
        #{{ invoice.data.id }}

        <template #actions>
          <button
            type="submit"
            class="bg-gray-200 bg-opacity-50 h-full px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
          >
            Enregistrer
          </button>
        </template>
      </Header>

      <div class="flex flex-1 h-full">
        <div class="flex-1">
          <invoice-editor :invoice-state.sync="invoice"></invoice-editor>

          <invoice-table :invoice-state.sync="invoice"></invoice-table>
        </div>

        <invoice-sidebar
          :customer="customer"
          :invoice="invoice"
          :promotion-dialog.sync="promotionDialog"
          :deposit-dialog.sync="depositDialog"
          :note-dialog.sync="noteDialog"
        ></invoice-sidebar>
      </div>
    </div>

    <invoice-dialog-deposit
      :invoice-state.sync="invoice"
      :dialog.sync="depositDialog"
    ></invoice-dialog-deposit>

    <invoice-dialog-promotion
      :invoice-state.sync="invoice"
      :dialog.sync="promotionDialog"
    ></invoice-dialog-promotion>

    <invoice-dialog-note
      :invoice-state.sync="invoice"
      :dialog.sync="noteDialog"
    ></invoice-dialog-note>
  </form>
</template>

<script lang="ts">
import { Invoice, InvoiceType } from '@/types/invoice'
import _ from 'lodash'
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import firebase from 'firebase'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { DialogType } from '~/types/dialog'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'UpdateInvoice',
  layout: 'dashboard',
  async asyncData({ store, route }): Promise<void> {
    const { customer, invoice } = route.params

    await store.dispatch('payload/fetchCustomer', customer)
    await store.dispatch('payload/fetchInvoice', invoice)
  },
  data: () => ({
    hasChanges: false,
    invoice: new InvoiceImpl(),
    promotionDialog: false,
    depositDialog: false,
    noteDialog: false,
    valid: false,
  }),
  head(): object {
    return {
      title: `${
        this.invoice.data.type === InvoiceType.Estimation ? 'Devis' : 'Facture'
      } #${this.invoice.data.id}`,
    }
  },
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('payload', {
      customer: 'customer',
      invoiceState: 'invoice',
    }),
  },
  mounted(): void {
    this.invoice.data = _.cloneDeep(this.invoiceState)

    this.$watch(
      'invoice',
      () => {
        this.hasChanges = !_.isEqual(this.invoice.data, this.invoiceState)
      },
      { deep: true }
    )
  },
  methods: {
    async updateInvoice(): Promise<void> {
      const { invoice } = this.$route.params

      // Update invoice
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .doc(invoice)
        .update({
          ...this.invoice.data,
          updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        } as Invoice)

      this.$notify('Le document à été sauvegardé', NotificationType.SUCCESS)
      this.hasChanges = false
    },
  },
})
</script>
