<template>
  <form @submit.prevent="createCustomer">
    <Header>
      Créer une fiche client

      <template #actions>
        <base-nav-button type="submit"> Enregister </base-nav-button>
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
import { mapState } from 'vuex'
import Vue from 'vue'
import { Customer } from '~/types/customer'

export default Vue.extend({
  name: 'CreateCustomer',
  layout: 'dashboard',
  data: () => ({
    valid: false,
    customer: {} as Customer,
    rules: {
      email: [(v: string) => !v || /.+@.+/.test(v) || "L'email est invalide."],
    },
  }),
  head: {
    title: 'Créer une fiche client',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
  },
  methods: {
    async createCustomer(): Promise<void> {
      // Create user
      const doc = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .add(this.customer)

      // Redirect to settings
      this.$router.push(`/customers/${doc.id}`)
    },
  },
})
</script>
