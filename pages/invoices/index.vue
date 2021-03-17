<template>
  <Header with-search>
    <template #title> Factures </template>

    <template #actions>
      <v-text-field
        v-model="search"
        single-line
        flat
        solo-inverted
        hide-details
        label="Chercher une facture (par ID)"
        @input="doSearch"
      ></v-text-field>
    </template>

    <Card :width="1000" no-body no-toolbar no-divider>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="invoices"
        :loading="loading"
        :options.sync="options"
        :server-items-length="invoiceCount"
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
import { mapSnapshot } from '~/helpers/documentMapper'

export default Vue.extend({
  name: 'Invoices',
  layout: 'dashboard',
  data: () => ({
    loading: false,
    search: '',
    options: {},
    headers: InvoiceHeaders,
    invoices: [] as InvoiceIndex[],
  }),
  head: {
    title: 'Factures',
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('team', ['team']),
    invoiceCount() {
      return this.team?.counter?.invoices ?? 0
    },
  },
  watch: {
    options: {
      deep: true,
      async handler() {
        await this.getData()
      },
    },
  },
  methods: {
    async doSearch() {
      if (this.search.length >= 2 || this.search.length === 0) {
        this.invoices = []
        await this.getData()
      }
    },

    async getData() {
      // Toggle loading
      this.loading = true

      // Query
      let query = this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .orderBy('id')
        .startAfter(
          this.invoices.length > 0
            ? this.invoices[this.invoices.length - 1].id
            : null
        )
        .limit(15)

      // On search
      if (this.search.length >= 3) {
        this.invoices = []
        query = query.startAt(this.search).endAt(this.search + '\uF8FF')
      }

      // Get ref
      const ref = await query.get()

      // Push customers
      this.invoices.push(...mapSnapshot<InvoiceIndex>(ref))

      // Untoggle loading
      this.loading = false
    },

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
