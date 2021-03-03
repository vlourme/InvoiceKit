<template>
  <Card no-body>
    <template #title>Factures</template>

    <template #actions>
      <v-btn color="success" text @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        Ajouter
      </v-btn>
    </template>

    <v-data-table
      :items="invoices"
      :headers="invoiceHeaders"
      @click:row="navigateToInvoice"
    >
      <template #item.updatedAt="{ item }">
        {{ new Date(item.updatedAt * 1000).toLocaleString() }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Créer une nouvelle facture </v-card-title>

        <v-card-text>
          Séléctionnez l'adresse à utiliser pour la facture.
        </v-card-text>

        <v-data-table
          :headers="addressHeaders"
          :items="addresses"
          @click:row="makeInvoice"
        >
        </v-data-table>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="dialog = false">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { DataTableHeader } from 'vuetify'
import { mapState } from 'vuex'
import { mapSnapshot } from '~/helpers/DocumentMapper'
import { Address, AddressHeaders } from '~/types/address'
import { Invoice } from '~/types/invoice'

export default Vue.extend({
  name: 'Invoices',
  props: {
    id: {
      type: String,
      required: true,
    } as PropOptions<string>,
    addresses: {
      type: Array,
      required: true,
    } as PropOptions<Address[]>,
  },
  data: () => ({
    invoiceHeaders: [
      {
        text: 'ID',
        value: 'id',
      },
      {
        text: 'Date de facturation',
        value: 'date',
      },
      {
        text: 'Dernière mise à jour',
        value: 'updatedAt',
      },
    ] as Array<DataTableHeader>,
    invoices: [] as Invoice[],
    addressHeaders: AddressHeaders,
    dialog: false,
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(this.id)
      .collection('invoices')
      .onSnapshot((snapshot) => {
        this.invoices = mapSnapshot<Invoice>(snapshot)
      })
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    makeInvoice(item: Address) {
      this.$router.push({
        path: '/invoices/create',
        query: {
          customer: this.$route.params.id,
          address: item.$key,
        },
      })
    },

    navigateToInvoice(invoice: Invoice) {
      this.$router.push(`/invoices/${this.$route.params.id}/${invoice.$key}`)
    },
  },
})
</script>
