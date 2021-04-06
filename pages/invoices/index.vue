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

    <div class="flex-1 flex flex-col h-8/9">
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
                v-for="(invoice, idx) in results"
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

    <div
      v-if="results.length >= 15"
      class="flex h-1/9 items-center justify-end px-4 py-2 bg-gray-50 border-t"
    >
      <BaseButton base :disabled="!canLoadMore" @click.prevent="getData">
        Charger plus de résultats
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useFetch,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import useSearch from '~/composables/useSearch'
import RootState from '~/store'
import { InvoiceIndex, InvoiceStatus } from '~/types/invoice'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()
    const router = useRouter()

    // Computed
    const user = computed(() => store.state.auth.user)
    const team = computed(() => store.state.team.team!)
    const canLoadMore = computed(() => {
      return (
        (team.value.counter.INVOICE ?? 0 + team.value.counter.QUOTE ?? 0) !==
        results.value.length
      )
    })

    // Search
    const { search, getData, doSearch, results } = useSearch<InvoiceIndex>(
      'id',
      `teams/${user.value?.team}/invoices`
    )

    // Mounted
    useFetch(async () => {
      if (!user.value?.team) {
        await router.push('/dashboard')
        return
      }

      await getData()
    })

    // Methods
    const getStatus = (invoice: InvoiceIndex): string => {
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
    }

    return { doSearch, getData, getStatus, search, results, canLoadMore }
  },
  head: {
    title: 'Factures',
  },
})
</script>
