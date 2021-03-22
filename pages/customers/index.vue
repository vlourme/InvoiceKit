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
        label="Chercher un client (par nom complet)"
        @input="doSearch"
      ></v-text-field>
    </template>

    <template v-if="role > 0" #actions>
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
        :loading="loading"
        :server-items-length="customerCount"
        :items-per-page="15"
        :options.sync="options"
        @click:row="navigateToCustomer"
      >
      </v-data-table>
    </Card>
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Customer, CustomerHeaders } from '@/types/customer'
import { mapSnapshot } from '~/helpers/documentMapper'

export default Vue.extend({
  name: 'Customers',
  layout: 'dashboard',
  data: () => ({
    loading: false,
    search: '',
    options: {},
    headers: CustomerHeaders,
    customers: [] as Customer[],
  }),
  head: {
    title: 'Clients',
  },
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('team', ['team']),
    customerCount(): number {
      return this.team?.counter?.customers ?? 0
    },
  },
  watch: {
    options: {
      deep: true,
      async handler(): Promise<void> {
        await this.getData()
      },
    },
  },
  methods: {
    async doSearch(): Promise<void> {
      if (this.search.length >= 3 || this.search.length === 0) {
        this.customers = []
        await this.getData()
      }
    },

    async getData(): Promise<void> {
      // Toggle loading
      this.loading = true

      // Query
      let query = this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .orderBy('fullName')
        .startAfter(
          this.customers.length > 0
            ? this.customers[this.customers.length - 1].fullName
            : null
        )
        .limit(15)

      // On search
      if (this.search.length >= 3) {
        this.customers = []
        query = query.startAt(this.search).endAt(this.search + '\uF8FF')
      }

      // Get ref
      const ref = await query.get()

      // Push customers
      this.customers.push(...mapSnapshot<Customer>(ref))

      // Untoggle loading
      this.loading = false
    },

    async navigateToCustomer(customer: Customer): Promise<void> {
      await this.$router.push(`/customers/${customer.$key}`)
    },
  },
})
</script>
