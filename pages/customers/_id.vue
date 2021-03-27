<template>
  <form @submit.prevent="updateCustomer">
    <Header>
      Modifier une fiche client

      <template v-if="role > 0" #actions>
        <button
          type="submit"
          class="bg-gray-200 bg-opacity-50 h-full px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
        >
          Mettre à jour
        </button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Mettre à jour un nouveau client</template>
          <template #description>
            Mettre à jour un client pour lui assigner des adresses, factures et
            contrats.
          </template>
          <template v-if="role > 0" #actions>
            <button
              type="button"
              class="text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
              @click.prevent="deleteCustomer()"
            >
              <i class="bx bx-minus mr-2"></i>
              Supprimer le client
            </button>
          </template>
        </FormDescription>
      </template>

      <div class="mt-2">
        <label for="name">Nom complet</label>
        <input
          id="name"
          v-model="customer.fullName"
          required
          minlength="1"
          :disabled="role === 0"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="society">Entreprise</label>
        <input
          id="society"
          v-model="customer.society"
          :disabled="role === 0"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="customer.email"
          :disabled="role === 0"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="phone">Téléphone</label>
        <input
          id="phone"
          v-model="customer.phone"
          :disabled="role === 0"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>

      <div class="mt-2">
        <label for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="customer.notes"
          :disabled="role === 0"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        ></textarea>
      </div>
    </FormBox>

    <customers-addresses class="my-4"></customers-addresses>

    <customers-invoices class="my-4"></customers-invoices>
  </form>
</template>

<script lang="ts">
import { mapGetters, mapState } from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
import { NotificationType } from '~/types/notification'
import { Customer } from '~/types/customer'
import { DialogType } from '~/types/dialog'

export default Vue.extend({
  name: 'ViewCustomer',
  layout: 'dashboard',
  async asyncData({ route, store }) {
    const { id } = route.params
    await store.dispatch('payload/fetchCustomer', id)
    await store.dispatch('payload/fetchAddresses', id)
  },
  data: () => ({
    hasChanges: false,
    rules: {
      email: [(v: string) => !v || /.+@.+/.test(v) || "L'email est invalide."],
    },
    customer: {} as Customer,
    dialog: false,
  }),
  head() {
    return {
      title: `${this.customerState.fullName} — Fiche client`,
    }
  },
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('payload', {
      customerState: 'customer',
    }),
  },
  mounted() {
    this.customer = Object.assign({}, this.customerState)

    this.$watch(
      'customer',
      () => {
        this.hasChanges = !_.isEqual(this.customer, this.customerState)
      },
      { deep: true }
    )
  },
  methods: {
    async updateCustomer(): Promise<void> {
      // Update customer
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customerState.$key)
        .update(this.customer)

      this.$notify('Le document à été sauvegardé', NotificationType.SUCCESS)
      this.hasChanges = false
    },

    /**
     * TODO: There is a small error during less than 1 second after deleting
     * This is due to the snapshot trying to refresh.
     */
    deleteCustomer(): void {
      this.$dialog({
        title: 'Supprimer cette fiche client',
        message:
          'Tout le contenu associé sera supprimé (factures, contrats, etc.) et irrécuperable.',
        type: DialogType.Error,
        callback: async () => await this.deleteCallback(),
        showCancel: true,
        actionMessage: 'Supprimer',
      })
    },

    async deleteCallback(): Promise<void> {
      // Delete customer
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customerState.$key)
        .delete()

      await this.$router.push('/customers')
    },
  },
})
</script>
