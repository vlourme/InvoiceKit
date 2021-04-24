<template>
  <div class="flex flex-col h-full max-h-screen overflow-y-hidden">
    <Header class="bg-gray-50">
      Clients

      <template #actions>
        <base-nav-input
          v-model="search"
          placeholder="Chercher un client"
          @input="fetchData"
        />

        <base-nav-button v-if="role > 0" @click.prevent="modal = true">
          Créer un client
        </base-nav-button>
      </template>
    </Header>

    <div class="flex-1 flex flex-col h-8/9">
      <div class="flex flex-col h-full">
        <div class="flex-grow overflow-auto">
          <table class="relative w-full">
            <thead>
              <tr class="border-b">
                <template
                  v-for="(field, idx) in team.extensions.customers.fields"
                >
                  <th
                    v-if="field.featured"
                    :key="idx"
                    class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                  >
                    {{ field.name }}
                  </th>
                </template>
                <th class="sticky top-0 bg-gray-50 text-right"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(customer, idx) in results"
                :key="idx"
                class="even:bg-gray-50"
              >
                <td class="px-6 py-4 text-left">
                  {{ customer[values[0]] }}
                </td>
                <td class="px-6 py-4 text-left">
                  {{ customer[values[1]] }}
                </td>
                <td class="px-6 py-4 text-left">
                  {{ customer[values[2]] }}
                </td>
                <td class="px-6 py-4 text-right">
                  <nuxt-link
                    class="text-blue-500 hover:text-blue-700 transition-colors"
                    :to="`/customers/${customer.$key}`"
                    >Voir la fiche</nuxt-link
                  >
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
      <BaseButton base :disabled="!canLoadMore" @click.prevent="fetchData">
        Charger plus de résultats
      </BaseButton>
    </div>
    <base-slideover :activator.sync="modal" :on-close="closeModal">
      <template #title>Créer un client</template>

      <form @submit.prevent="saveCustomer(false)">
        <extensions-inputs
          :fields="team.extensions.customers.fields"
          :state.sync="customer"
        />

        <div class="flex w-full justify-end items-center mt-2">
          <base-button info type="submit">Sauvegarder</base-button>
        </div>
      </form>
    </base-slideover>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
import useSearch from '~/composables/useSearch'
import { getPrimaryKey, getValues } from '~/composables/useExtensibleField'
import RootState from '~/store'
import { Customer, defaultCustomer } from '~/types/customer'
import useCustomer from '~/composables/useCustomer'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()

    // Computed
    const team = computed(() => store.state.team.team!)
    const role = computed(() => store.getters['team/role'])

    // Data
    const { state, hasChanges, resetState, saveCustomer } = useCustomer()
    const modal = ref(false)
    const primary = getPrimaryKey(team.value, 'customers')
    const values = getValues(team.value, 'customers')

    // Search
    const { search, results, canLoadMore, fetchData } = useSearch<Customer>(
      'customers',
      `/teams/${team.value.$key}/customers`,
      primary.value
    )

    // Methods
    const closeModal = () => {
      state.customer.value = defaultCustomer()
    }

    // Fetch
    useFetch(async () => {
      await fetchData()
      resetState()
    })

    return {
      resetState,
      saveCustomer,
      fetchData,
      ...state,
      hasChanges,
      modal,
      role,
      team,
      values,
      primary,
      search,
      results,
      canLoadMore,
      closeModal,
    }
  },
  head: {
    title: 'Clients',
  },
})
</script>
