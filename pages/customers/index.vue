<template>
  <Header with-search>
    <template #title> Clients </template>

    <template #search>
      <v-text-field
        v-model="search"
        single-line
        flat
        solo-inverted
        hide-details
        label="Chercher un client"
      ></v-text-field>
    </template>

    <template #actions>
      <v-btn :elevation="0" to="/customers/create">
        <v-icon left> mdi-plus </v-icon>

        Ajouter un client
      </v-btn>
    </template>

    <Card :width="1000" no-body no-toolbar no-divider>
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
import { mapSnapshot } from '~/helpers/documentMapper'

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
        this.customers = mapSnapshot<Customer>(snapshot)
      })
  },
  head: {
    title: 'Clients',
  },
  computed: {
    ...mapState('auth', ['user']),
  },
  methods: {
    navigateToCustomer(customer: Customer) {
      this.$router.push(`/customers/${customer.$key}`)
    },
  },
})
</script>
