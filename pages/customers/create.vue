<template>
  <Header>
    <template #title>Créer une fiche client</template>

    <template #actions>
      <v-btn :elevation="0" @click="createCustomer">
        <v-icon left>mdi-check</v-icon>
        Créer
      </v-btn>
    </template>

    <Card no-toolbar no-divider margin>
      <v-form v-model="valid">
        <v-text-field
          v-model="customer.fullName"
          label="Nom complet"
          placeholder="John Doe"
        ></v-text-field>

        <v-text-field v-model="customer.society" label="Société"></v-text-field>

        <v-text-field
          v-model="customer.email"
          :rules="rules.email"
          label="Email"
        ></v-text-field>

        <v-text-field v-model="customer.phone" label="Téléphone"></v-text-field>

        <v-textarea v-model="customer.notes" label="Notes"></v-textarea>
      </v-form>
    </Card>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
import { Customer } from '~/types/customer'
import { NotificationType } from '~/types/notification'

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
      // Check validity
      if (!this.valid) {
        this.$notify('Le formulaire est invalide', NotificationType.WARNING)
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
