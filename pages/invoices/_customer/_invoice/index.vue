<template>
  <Header>
    <v-form v-model="valid" @submit.prevent="updateInvoice">
      <invoice-editor :invoice-state.sync="invoice" />

      <invoice-table :invoice-state.sync="invoice" />

      <invoice-dialog-deposit
        :invoice-state.sync="invoice"
        :dialog.sync="depositDialog"
      />
      <invoice-dialog-promotion
        :invoice-state.sync="invoice"
        :dialog.sync="promotionDialog"
      />

      <invoice-sidebar
        :invoice="invoice"
        :promotion-dialog.sync="promotionDialog"
        :deposit-dialog.sync="depositDialog"
      />
    </v-form>
  </Header>
</template>

<script lang="ts">
import {
  Invoice,
  InvoiceIndex,
  InvoiceStatus,
  InvoiceType,
} from '@/types/invoice'
import { cloneDeep } from 'lodash'
import Vue from 'vue'
import { mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'UpdateInvoice',
  layout: 'dashboard',
  async asyncData({ store, route }) {
    const { customer, invoice } = route.params

    await store.dispatch('payload/fetchCustomer', customer)
    await store.dispatch('payload/fetchInvoice', invoice)
  },
  data: () => ({
    invoice: new InvoiceImpl(),
    promotionDialog: false,
    depositDialog: false,
    valid: false,
  }),
  head: {
    title: 'Créer une facture',
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('payload', {
      customer: 'customer',
      invoiceState: 'invoice',
    }),
  },
  mounted() {
    this.invoice.data = cloneDeep(this.invoiceState)
  },
  methods: {
    async updateInvoice() {
      if (!this.customer.$key || !this.valid) {
        this.$notify('Impossible de sauvegarder', NotificationType.WARNING)
        return
      }

      const id = this.$route.params.invoice

      // Create invoice
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .doc(id)
        .update({
          ...this.invoice.data,
          updatedAt: new Date(),
        } as Invoice)

      // Register in a indexed list
      const index = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .where('link', '==', id)
        .limit(1)
        .get()

      if (index.docs[0].id) {
        await this.$fire.firestore
          .collection('teams')
          .doc(this.user.team)
          .collection('invoices')
          .doc(index.docs[0].id)
          .update({
            ...index.docs[0].data(),
            type: this.invoice.data.type,
            status: this.invoice.data.status,
            customer: this.customer,
            id: this.invoice.data.id,
            updatedAt: new Date(),
          } as InvoiceIndex)
      }

      this.$notify('Le document à été sauvegardé', NotificationType.SUCCESS)
    },
  },
})
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>
