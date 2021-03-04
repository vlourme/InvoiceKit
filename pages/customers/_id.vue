<template>
  <Header>
    <Card margin>
      <template #title>Créer une fiche client</template>

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

    <customers-addresses
      :id="$route.params.id"
      :addresses="addresses"
      class="my-4"
    />

    <customers-invoices
      :id="$route.params.id"
      :addresses="addresses"
      class="my-4"
    />

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
import { Customer } from '~/types/customer'
import { Address, AddressHeaders } from '~/types/address'
import { mapDocument, mapSnapshot } from '~/helpers/DocumentMapper'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'ViewCustomer',
  layout: 'dashboard',
  data: () => ({
    valid: false,
    customer: {} as Customer,
    rules: {
      email: [(v: string) => !v || /.+@.+/.test(v) || "L'email est invalide."],
    },
    dialog: false,
    invoiceDialog: false,
    addressHeaders: AddressHeaders,
    addresses: [] as Address[],
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(this.$route.params.id)
      .onSnapshot((snapshot) => {
        this.customer = mapDocument<Customer>(snapshot)
      })

    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(this.$route.params.id)
      .collection('addresses')
      .onSnapshot((snapshot) => {
        this.addresses = mapSnapshot<Address>(snapshot)
      })
  },
  head() {
    return {
      title: `${this.customer.fullName} — Fiche client`,
    }
  },
  computed: {
    ...mapState('auth', ['user']),
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
        .doc(this.$route.params.id)
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
        .doc(this.$route.params.id)
        .delete()
        .then(() => {
          this.$router.push('/customers')
        })
    },
  },
})
</script>
