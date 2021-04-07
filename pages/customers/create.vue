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

      <div class="mt-2">
        <base-label for="name">Nom complet</base-label>
        <base-input
          id="name"
          v-model="customer.fullName"
          required
          minlength="1"
        />
      </div>

      <div class="mt-2">
        <base-label for="society">Entreprise</base-label>
        <base-input id="society" v-model="customer.society" />
      </div>

      <div class="mt-2">
        <base-label for="email">Email</base-label>
        <base-input id="email" v-model="customer.email" />
      </div>

      <div class="mt-2">
        <base-label for="phone">Téléphone</base-label>
        <base-input id="phone" v-model="customer.phone" />
      </div>

      <div class="mt-2">
        <base-label for="notes">Notes</base-label>
        <base-textarea id="notes" v-model="customer.notes"></base-textarea>
      </div>
    </FormBox>
  </form>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import useCustomer from '~/composables/useCustomer'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Data
    const { state, role, hasChanges, resetState, saveCustomer } = useCustomer()

    onMounted(resetState)

    return {
      ...state,
      hasChanges,
      saveCustomer,
      role,
    }
  },
  head: {
    title: 'Créer une fiche client',
  },
})
</script>
