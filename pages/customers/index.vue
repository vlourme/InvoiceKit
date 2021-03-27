<template>
  <div class="flex flex-col h-screen overflow-y-hidden">
    <Header>
      Clients

      <template #actions>
        <input
          v-model="search"
          placeholder="Chercher un client"
          class="bg-gray-200 bg-opacity-50 hover:bg-opacity-100 focus:bg-opacity-100 focus:outline-none px-4 h-full"
          @input="doSearch"
        />

        <nuxt-link
          v-if="role > 0"
          to="/customers/create"
          class="bg-gray-200 bg-opacity-50 h-full px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
        >
          Créer un client
        </nuxt-link>
      </template>
    </Header>

    <div class="flex-1 flex flex-col h-full">
      <div class="flex flex-col h-full">
        <div class="flex-grow overflow-auto">
          <table class="relative w-full">
            <thead>
              <tr>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Nom complet
                </th>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Entreprise
                </th>
                <th class="sticky top-0 px-6 py-3 bg-gray-50 text-gray-700">
                  Email
                </th>
                <th class="sticky top-0 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(customer, idx) in customers"
                :key="idx"
                class="even:bg-gray-50"
              >
                <td class="px-6 py-4 text-center">
                  {{ customer.fullName }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ customer.society }}
                </td>
                <td class="px-6 py-4 text-center">
                  {{ customer.email }}
                </td>
                <td width="200" class="px-6 py-4 text-center">
                  <nuxt-link
                    class="text-blue-500 hover:text-blue-700"
                    :to="`/customers/${customer.$key}`"
                    >Voir la fiche</nuxt-link
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Customer } from '@/types/customer'
import { mapSnapshot } from '~/helpers/documentMapper'

export default Vue.extend({
  name: 'Customers',
  layout: 'dashboard',
  data: () => ({
    loading: false,
    search: '',
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
  async mounted() {
    await this.getData()
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
