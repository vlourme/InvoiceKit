<template>
  <form @submit.prevent="saveCustomer(false)">
    <Header>
      Créer une fiche client

      <template #actions>
        <base-nav-button :disabled="!hasChanges" type="submit">
          Enregister
        </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Créer un nouveau client</template>
          <template #description
            >Créer un nouveau client pour lui assigner des adresses, factures et
            contrats.</template
          >
        </FormDescription>
      </template>

      <customers-inputs
        :fields="team.extensions.customers.fields"
        :customer-state.sync="customer"
      />
    </FormBox>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  useStore,
} from '@nuxtjs/composition-api'
import useCustomer from '~/composables/useCustomer'
import RootState from '~/store'
import { FieldType } from '~/types/team'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()

    // Data
    const { state, role, hasChanges, resetState, saveCustomer } = useCustomer()

    // Computed
    const team = computed(() => store.state.team.team!)

    // Methods
    onMounted(resetState)

    return {
      ...state,
      hasChanges,
      saveCustomer,
      team,
      role,
      FieldType,
    }
  },
  head: {
    title: 'Créer une fiche client',
  },
})
</script>
