<template>
  <form @submit.prevent="updateCustomer">
    <Header>
      Modifier une fiche client

      <template v-if="role > 0" #actions>
        <base-nav-button> Mettre à jour </base-nav-button>
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
            <base-button-inline
              danger
              icon="minus"
              @click.prevent="deleteCustomer"
            >
              Supprimer le client
            </base-button-inline>
          </template>
        </FormDescription>
      </template>

      <div class="mt-2">
        <base-label for="name">Nom complet</base-label>
        <base-input
          id="name"
          v-model="customer.fullName"
          required
          minlength="1"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="society">Entreprise</base-label>
        <base-input
          id="society"
          v-model="customer.society"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="email">Email</base-label>
        <base-input
          id="email"
          v-model="customer.email"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="phone">Téléphone</base-label>
        <base-input
          id="phone"
          v-model="customer.phone"
          :disabled="role === 0"
        />
      </div>

      <div class="mt-2">
        <base-label for="notes">Notes</base-label>
        <base-textarea
          id="notes"
          v-model="customer.notes"
          :disabled="role === 0"
        ></base-textarea>
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
