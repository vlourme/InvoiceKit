<template>
  <form @submit.prevent="createInvoice">
    <div class="flex flex-col h-screen overflow-y-hidden">
      <Header>
        Créer un document

        <template #actions>
          <base-nav-button type="submit"> Enregistrer </base-nav-button>
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
import Vue from 'vue'
import { mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'

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
    noteDialog: false,
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
      // Create invoice
      const doc = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .add(this.invoice.data)

      // Redirect
      this.$router.push(`/invoices/${this.customer.$key}/${doc.id}`)
    },
  },
})
</script>
