<template>
  <div class="flex flex-col h-screen overflow-y-hidden">
    <Header>
      Factures

      <template #actions>
        <base-nav-input
          v-model="search"
          placeholder="Chercher une facture"
          @input="doSearch"
        />
      </template>
    </Header>

    <div class="flex-1 flex flex-col h-full">
      <div class="flex flex-col h-full">
        <div class="flex-grow overflow-auto">
          <table class="relative w-full">
            <thead>
              <tr>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  ID
                </th>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Type
                </th>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Client
                </th>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Statut
                </th>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Dernière mise à jour
                </th>
                <th class="sticky top-0 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(invoice, idx) in invoices"
                :key="idx"
                class="even:bg-gray-50"
              >
                <td class="px-6 py-4 text-center font-semibold">
                  {{ invoice.id }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ invoice.type === 'QUOTE' ? 'Devis' : 'Facture' }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ invoice.customer.fullName }}
                  <span
                    v-if="invoice.customer.society"
                    class="text-sm text-gray-400"
                  >
                    ({{ invoice.customer.society }})
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  {{ getStatus(invoice) }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ invoice.updatedAt.toDate().toLocaleString() }}
                </td>
                <td width="200" class="px-6 py-4 text-center">
                  <nuxt-link
                    class="text-blue-500 hover:text-blue-700"
                    :to="`/invoices/${invoice.customer.$key}/${invoice.link}`"
                  >
                    Voir le document
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
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
    invoiceCount(): number {
      return (
        (this.team?.counter?.INVOICE ?? 0) + (this.team?.counter?.QUOTE ?? 0)
      )
    },
  },
  async mounted() {
    await this.getData()
  },
  methods: {
    async doSearch(): Promise<void> {
      if (this.search.length >= 2 || this.search.length === 0) {
        this.invoices = []
        await this.getData()
      }
    },

    async getData(): Promise<void> {
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

    async navigateToInvoice(invoice: InvoiceIndex): Promise<void> {
      await this.$router.push(
        `/invoices/${invoice.customer.$key}/${invoice.link}`
      )
    },

    getStatus(invoice: InvoiceIndex): string {
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
  },
})
</script>
