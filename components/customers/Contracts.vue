<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title> Contrats </template>
      <template #description>
        Gérez les contrats liés à cette fiche client.
      </template>
      <template v-if="role > 0" #actions>
        <nuxt-link :to="`/contracts/new/${customer.$key}`">
          <base-button-inline info icon="plus">
            Créer un nouveau contrat
          </base-button-inline>
        </nuxt-link>
      </template>
    </FormDescription>

    <div class="col-span-2 mx-2 bg-gray-50 py-2 rounded-lg">
      <div class="overflow-x-auto">
        <extensions-table
          name="contracts"
          :extension="extension"
          :results="contracts"
        >
          <template #link="{ id }">
            <nuxt-link
              class="text-blue-500 hover:text-blue-700 transition-colors"
              :to="`/contracts/${customer.$key}/${id}`"
              >Voir le contrat</nuxt-link
            >
          </template>
        </extensions-table>
      </div>
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
import useCustomer from '~/composables/useCustomer'
import RootState from '~/store'

export default defineComponent({
  setup() {
    // Context
    const store = useStore<RootState>()

    // Computed
    const extension = computed(
      () => store.state.team.team?.extensions.contracts!
    )
    const { state, role, loadContracts } = useCustomer()

    // Fetch
    useFetch(() => {
      loadContracts(state.customer.value.$key!)
    })

    return {
      ...state,
      extension,
      role,
    }
  },
})
</script>
