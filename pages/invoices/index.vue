<template>
  <Header>
    <Card margin :width="1000" with-search no-body>
      <template #title> Factures </template>

      <template #search>
        <v-text-field
          v-model="search"
          single-line
          solo-inverted
          hide-details
          label="Chercher une facture"
        />
      </template>

      <v-data-table
        :search="search"
        :headers="headers"
        :items="invoices"
        :items-per-page="15"
        @click:row="navigateToInvoice"
      >
        <template #item.updatedAt="{ item }">
          {{ new Date(item.updatedAt.seconds * 1000).toLocaleString() }}
        </template>
      </v-data-table>
    </Card>
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { InvoiceHeaders, InvoiceIndex } from '@/types/invoice'

export default Vue.extend({
  name: 'Invoices',
  layout: 'dashboard',
  data: () => ({
    search: '',
    headers: InvoiceHeaders,
    invoices: [] as InvoiceIndex[],
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('invoices')
      .onSnapshot((snapshot) => {
        this.invoices = snapshot.docs.map((v) => v.data() as InvoiceIndex)
      })
  },
  head: {
    title: 'Factures',
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    navigateToInvoice(invoice: InvoiceIndex) {
      this.$router.push(`/invoices/${invoice.customer.id}/${invoice.link}`)
    },
  },
})
</script>
