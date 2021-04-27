<template>
  <div class="flex flex-col h-full max-h-screen overflow-y-hidden">
    <Header class="bg-gray-50">
      Contrats

      <template #actions>
        <base-nav-input
          v-model="search"
          placeholder="Chercher un contrat"
          @input="fetchData"
        />
      </template>
    </Header>

    <div class="flex-1 flex flex-col h-8/9">
      <div class="flex flex-col h-full">
        <div class="flex-grow overflow-auto">
          <extensions-table
            name="contracts"
            :extension="extension"
            :results="results"
            :is-index="true"
          >
            <template #header-before>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-gray-700 font-medium"
              >
                Client
              </th>
            </template>
            <template #header-after>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-gray-700 font-medium"
              >
                Événements
              </th>
            </template>

            <template #data-before="{ data }">
              <td class="px-6 py-4 text-left">
                <nuxt-link
                  class="border-b border-blue-300 pb-1 hover:text-blue-500 hover:border-blue-400 transition-colors"
                  :to="'/customers/' + data.customer.$key"
                >
                  {{ data.customer[customerPrimary.value] }}
                </nuxt-link>
              </td>
            </template>
            <template #data-after="{ data }">
              <td class="px-6 py-4 text-left">
                {{ data.events.length }}
              </td>
            </template>

            <template #link="{ data }">
              <nuxt-link
                class="text-blue-500 hover:text-blue-700 transition-colors"
                :to="`/contracts/${data.customer.$key}/${data.link}`"
                >Voir la fiche</nuxt-link
              >
            </template>
          </extensions-table>
        </div>
      </div>
    </div>
    <div
      v-if="results.length >= 15"
      class="flex h-1/9 items-center justify-end px-4 py-2 bg-gray-50 border-t"
    >
      <BaseButton base :disabled="!canLoadMore" @click.prevent="fetchData">
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
  useStore,
} from '@nuxtjs/composition-api'
import useSearch from '~/composables/useSearch'
import { getPrimaryKey, getValues } from '~/composables/useExtensibleField'
import RootState from '~/store'
import { Contract } from '~/types/contract'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()

    // Computed
    const role = computed(() => store.getters['team/role'])
    const canLoadMore = computed(() => {
      return team.value.counter.customers !== results.value.length
    })
    const team = computed(() => store.state.team.team!)
    const extension = computed(() => team.value.extensions.contracts!)

    // Data
    const customerPrimary = getPrimaryKey(team.value, 'customers')
    const primary = getPrimaryKey(team.value, 'contracts')
    const values = getValues(team.value, 'contracts')

    // Search
    const { search, results, fetchData } = useSearch<Contract>(
      'contracts',
      `/teams/${team.value.$key}/contracts`,
      primary.value
    )

    // Mounted
    useFetch(async () => {
      await fetchData()
    })

    return {
      role,
      extension,
      values,
      primary,
      customerPrimary,
      search,
      results,
      fetchData,
      canLoadMore,
    }
  },
  head: {
    title: 'Contrats',
  },
})
</script>
