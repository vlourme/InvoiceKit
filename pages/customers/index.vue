<template>
  <div class="flex flex-col h-full max-h-screen overflow-y-hidden">
    <Header>
      Clients

      <template #actions>
        <base-nav-input
          v-model="search"
          placeholder="Chercher un client"
          @input="doSearch"
        />

        <base-nav-link v-if="role > 0" to="/customers/create">
          Créer un client
        </base-nav-link>
      </template>
    </Header>

    <div class="flex-1 flex flex-col h-8/9">
      <div class="flex flex-col h-full">
        <div class="flex-grow overflow-auto">
          <table class="relative w-full">
            <thead>
              <tr class="border-b">
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Nom complet
                </th>
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Entreprise
                </th>
                <th
                  class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700 text-left"
                >
                  Email
                </th>
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
                  {{ customer.fullName }}
                </td>
                <td class="px-6 py-4 text-left">
                  {{ customer.society }}
                </td>
                <td class="px-6 py-4 text-left">
                  {{ customer.email }}
                </td>
                <td width="200" class="px-6 py-4 text-right">
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
import { Customer } from '~/types/customer'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()
    const router = useRouter()

    // Computed
    const user = computed(() => store.state.auth.user)
    const role = computed(() => store.getters['team/role'])
    const team = computed(() => store.state.team.team!)
    const canLoadMore = computed(() => {
      return team.value.counter.customers !== results.value.length
    })

    // Search
    const { search, getData, doSearch, results } = useSearch<Customer>(
      'fullName',
      `teams/${user.value?.team}/customers`
    )

    // Mounted
    useFetch(async () => {
      if (!user.value?.team) {
        await router.push('/dashboard')
        return
      }

      await getData()
    })

    return { role, getData, doSearch, search, results, canLoadMore }
  },
  head: {
    title: 'Clients',
  },
})
</script>
