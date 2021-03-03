<template>
  <Header>
    <Card margin :width="1000" with-search no-body>
      <template #title> Clients </template>

      <template #search>
        <v-text-field
          v-model="search"
          single-line
          solo-inverted
          hide-details
          label="Chercher un client"
        />
      </template>

      <template #actions>
        <v-btn text to="/customers/create">
          <v-icon left> mdi-plus </v-icon>

          Ajouter un client
        </v-btn>
      </template>

      <v-data-table
        :search="search"
        :headers="headers"
        :items="customers"
        :items-per-page="15"
        @click:row="navigateToCustomer"
      >
      </v-data-table>
    </Card>
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Customer, CustomerHeaders } from '@/types/customer'

export default Vue.extend({
  name: 'Customers',
  layout: 'dashboard',
  data: () => ({
    search: '',
    headers: CustomerHeaders,
    customers: [] as Customer[],
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .onSnapshot((snapshot) => {
        this.customers = snapshot.docs.map(
          (v) =>
            ({
              $key: v.id,
              ...v.data(),
            } as Customer)
        )
      })
  },
  head: {
    title: 'Clients',
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    navigateToCustomer(customer: Customer) {
      this.$router.push(`/customers/${customer.$key}`)
    },
  },
})
</script>
