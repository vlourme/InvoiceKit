<template>
  <Header>
    <Card margin>
      <template #title>Créer une fiche client</template>

      <template #actions>
        <v-btn text color="primary" @click="createCustomer">
          <v-icon left>mdi-check</v-icon>
          Créer
        </v-btn>
      </template>

      <v-form v-model="valid">
        <v-text-field
          v-model="customer.fullName"
          label="Nom complet"
          placeholder="John Doe"
        />

        <v-text-field v-model="customer.society" label="Société" />

        <v-text-field
          v-model="customer.email"
          :rules="rules.email"
          label="Email"
        />

        <v-text-field v-model="customer.phone" label="Téléphone" />

        <v-textarea v-model="customer.notes" label="Notes" />
      </v-form>
    </Card>
  </Header>
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
    ...mapState(['auth', 'user']),
  },
  methods: {
    async createCustomer(): Promise<void> {
      // Check validity
      if (!this.valid) {
        return
      }

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
