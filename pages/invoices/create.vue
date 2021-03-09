<template>
  <Header>
    <template #title> Créer un document </template>

    <template #actions>
      <v-btn text @click="createInvoice">
        <v-icon left>mdi-check</v-icon>
        Sauvegarder
      </v-btn>
    </template>

    <v-form v-model="valid">
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
        :customer="customer"
        :promotion-dialog.sync="promotionDialog"
        :deposit-dialog.sync="depositDialog"
        :invoice="invoice"
      />
    </v-form>
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { InvoiceIndex } from '@/types/invoice'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'CreateInvoice',
  layout: 'dashboard',
  async asyncData({ store, route }) {
    // Type fix
    const query = route.query as { [key: string]: string }

    await store.dispatch('payload/fetchCustomer', query.customer)
    await store.dispatch('payload/fetchAddress', query.address)
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
    ...mapState('payload', ['customer', 'address']),
  },
  mounted() {
    this.invoice.data.address = this.address.$key
  },
  methods: {
    async createInvoice() {
      if (!this.customer.$key || !this.valid) {
        this.$notify('Impossible de sauvegarder', NotificationType.WARNING)
        return
      }

      // Create invoice
      const doc = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .add(this.invoice.data)

      // Register in a indexed list
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .add({
          id: this.invoice.data.id,
          type: this.invoice.data.type,
          link: doc.id,
          status: this.invoice.data.status,
          customer: this.customer,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as InvoiceIndex)

      // Redirect
      this.$router.push(`/invoices/${this.customer.$key}/${doc.id}`)
    },
  },
})
</script>
