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
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  <abbr title="Identifiant">#</abbr>
                </th>
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Type
                </th>
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Client
                </th>
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Statut
                </th>
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Dernière mise à jour
                </th>
                <th class="sticky top-0 bg-gray-50 text-right"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(invoice, idx) in results"
                :key="idx"
                class="even:bg-gray-50"
              >
                <td class="px-6 py-4 font-semibold">
                  {{ invoice.id }}
                </td>
                <td class="px-6 py-4">
                  {{ invoice.type === 'QUOTE' ? 'Devis' : 'Facture' }}
                </td>
                <td class="px-6 py-4">
                  <nuxt-link
                    class="border-b border-blue-300 pb-1 hover:text-blue-500 hover:border-blue-400 transition-colors"
                    :to="'/customers/' + invoice.customer.$key"
                  >
                    {{ invoice.customer.fullName }}
                    <span
                      v-if="invoice.customer.society"
                      class="text-sm text-gray-400"
                    >
                      ({{ invoice.customer.society }})
                    </span>
                  </nuxt-link>
                </td>
                <td class="px-6 py-4">
                  <div class="inline-flex items-center">
                    <div
                      :class="{
                        'bg-gray-400': invoice.status === InvoiceStatus.None,
                        'bg-red-400': invoice.status === InvoiceStatus.Unpaid,
                        'bg-yellow-400':
                          invoice.status === InvoiceStatus.Pending,
                        'bg-green-400': invoice.status === InvoiceStatus.Paid,
                      }"
                      class="h-2 w-2 rounded-full mr-2"
                    ></div>
                    {{ getStatus(invoice) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  {{ invoice.updatedAt.toDate().toLocaleString() }}
                </td>
                <td width="200" class="px-6 py-4 text-right">
                  <nuxt-link
                    class="text-blue-500 hover:text-blue-700 transition-colors"
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

    return {
      doSearch,
      getData,
      getStatus,
      search,
      results,
      canLoadMore,
      InvoiceStatus,
    }
  },
  head: {
    title: 'Factures',
  },
})
</script>
