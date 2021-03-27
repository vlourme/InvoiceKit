<template>
  <form @submit.prevent="createCustomer">
    <Header>
      Créer une fiche client

      <template #actions>
        <button
          type="submit"
          class="bg-gray-200 bg-opacity-50 h-full px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
        >
          Enregister
        </button>
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
        <label for="name">Nom complet</label>
        <input
          id="name"
          v-model="customer.fullName"
          required
          minlength="1"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="society">Entreprise</label>
        <input
          id="society"
          v-model="customer.society"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="customer.email"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="phone">Téléphone</label>
        <input
          id="phone"
          v-model="customer.phone"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="customer.notes"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        ></textarea>
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
