<template>
  <Header>
    <template #title>Modifier une fiche client</template>

    <template v-if="role > 0" #actions>
      <v-btn class="ml-2" :elevation="0" color="red" @click="deleteCustomer">
        <v-icon left>mdi-delete</v-icon>
        Supprimer
      </v-btn>

      <v-badge overlap color="warning" :value="hasChanges">
        <v-btn class="ml-2" :elevation="0" @click="updateCustomer">
          <v-icon left>mdi-check</v-icon>
          Mettre à jour
        </v-btn>
      </v-badge>
    </template>

    <Card no-toolbar no-divider margin>
      <v-form v-model="valid">
        <v-text-field
          v-model="customer.fullName"
          label="Nom complet"
          :disabled="role === 0"
          placeholder="John Doe"
        ></v-text-field>

        <v-text-field
          v-model="customer.society"
          :disabled="role === 0"
          label="Société"
        ></v-text-field>

        <v-text-field
          v-model="customer.email"
          :rules="rules.email"
          :disabled="role === 0"
          label="Email"
        ></v-text-field>

        <v-text-field
          v-model="customer.phone"
          :disabled="role === 0"
          label="Téléphone"
        ></v-text-field>

        <v-textarea
          v-model="customer.notes"
          :disabled="role === 0"
          label="Notes"
        ></v-textarea>
      </v-form>
    </Card>

    <customers-addresses class="my-4"></customers-addresses>

    <customers-invoices class="my-4"></customers-invoices>
  </Header>
</template>

<script lang="ts">
import { mapGetters, mapState } from 'vuex'
import Vue from 'vue'
import { NotificationType } from '~/types/notification'
import { Customer } from '~/types/customer'
import { DialogType } from '~/types/dialog'
import { purge, purgeCollection } from '~/helpers/purgeCollection'
import _ from 'lodash'

export default Vue.extend({
  name: 'ViewCustomer',
  layout: 'dashboard',
  async asyncData({ route, store }) {
    const { id } = route.params
    await store.dispatch('payload/fetchCustomer', id)
    await store.dispatch('payload/fetchAddresses', id)
  },
  data: () => ({
    valid: false,
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
      // Check validity
      if (!this.valid) {
        this.$notify('Le formulaire est invalide', NotificationType.WARNING)
        return
      }

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

      // Get every addresses and invocies from sub-collection
      await purge(
        this.$fire,
        `teams/${this.user.team}/customers/${this.customer.$key}`,
        ['addresses', 'invoices']
      )

      // Get every invoices linked
      const invoices = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .where('customer.$key', '==', this.customerState.$key)
        .get()

      // Delete invoices
      purgeCollection(invoices)

      await this.$router.push('/customers')
    },
  },
})
</script>
