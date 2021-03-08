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
        <template #item.type="{ item }">
          {{ item.type === 'QUOTE' ? 'Devis' : 'Facture' }}
        </template>
        <template #item.status="{ item }">
          <v-chip :color="getStatusColor(item)">
            {{ getStatus(item) }}
          </v-chip>
        </template>
        <template #item.updatedAt="{ item }">
          {{ new Date(item.updatedAt.seconds * 1000).toLocaleDateString() }}
        </template>
      </v-data-table>
    </Card>
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { InvoiceHeaders, InvoiceIndex, InvoiceStatus } from '@/types/invoice'
import { mapSnapshot } from '~/helpers/DocumentMapper'

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
        this.invoices = mapSnapshot<InvoiceIndex>(snapshot)
      })
  },
  head: {
    title: 'Factures',
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    navigateToInvoice(invoice: InvoiceIndex) {
      this.$router.push(`/invoices/${invoice.customer.$key}/${invoice.link}`)
    },

    getStatus(invoice: InvoiceIndex) {
      switch (invoice.status) {
        case InvoiceStatus.Unpaid:
          return 'Impayé'
        case InvoiceStatus.Pending:
          return 'En attente'
        case InvoiceStatus.Paid:
          return 'Payé'
        case InvoiceStatus.None:
        default:
          return 'Aucun'
      }
    },

    getStatusColor(invoice: InvoiceIndex) {
      switch (invoice.status) {
        case InvoiceStatus.Unpaid:
          return 'error'
        case InvoiceStatus.Pending:
          return 'warning'
        case InvoiceStatus.Paid:
          return 'success'
        case InvoiceStatus.None:
        default:
          return 'primary'
      }
    },
  },
})
</script>
