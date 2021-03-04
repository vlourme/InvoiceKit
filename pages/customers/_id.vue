<template>
  <Header>
    <Card margin>
      <template #title>Modifier une fiche client</template>

      <template #actions>
        <v-btn text color="error" @click="dialog = true">
          <v-icon left>mdi-delete</v-icon>
          Supprimer
        </v-btn>

        <v-btn text color="primary" @click="updateCustomer">
          <v-icon left>mdi-check</v-icon>
          Mettre à jour
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

    <customers-addresses class="my-4" />

    <customers-invoices class="my-4" />

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Supprimer cette fiche client ? </v-card-title>

        <v-card-text>
          Une fois supprimée, cette fiche et les contenus associés (factures,
          contrats) seront irrécupérables.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="error" text @click="deleteCustomer">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
import { NotificationType } from '~/types/notification'
import { Customer } from '~/types/customer'

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
    ...mapState('auth', ['user']),
    ...mapState('payload', {
      customerState: 'customer',
    }),
  },
  mounted() {
    this.customer = Object.assign({}, this.customerState)
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
    },

    /**
     * TODO: There is a small error during less than 1 second after deleting
     * This is due to the snapshot trying to refresh.
     */
    deleteCustomer(): void {
      this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customerState.$key)
        .delete()
        .then(() => {
          this.$router.push('/customers')
        })
    },
  },
})
</script>
