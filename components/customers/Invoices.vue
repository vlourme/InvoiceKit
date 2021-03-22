<template>
  <Card no-body>
    <template #title>Factures</template>

    <template v-if="role > 0" #actions>
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
        {{ new Date(item.updatedAt.seconds * 1000).toLocaleString() }}
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="650">
      <v-card>
        <v-card-title> Créer une nouvelle facture </v-card-title>

        <v-card-text>
          Séléctionnez l'adresse à utiliser pour la facture.
        </v-card-text>

        <input
          ref="fileInput"
          accept="application/json"
          type="file"
          hidden
          @change="importDone"
        />

        <v-data-table
          :headers="addressHeaders"
          :items="addresses"
          :items-per-page="-1"
          hide-default-footer
          @click:row="makeInvoice"
        >
          <template #item.actions="{ item }">
            <v-btn icon @click.stop="startImport(item)">
              <v-icon>mdi-upload</v-icon>
            </v-btn>
          </template>
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
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import { mapGetters, mapState } from 'vuex'
import { mapSnapshot } from '~/helpers/documentMapper'
import { Address, AddressHeaders } from '~/types/address'
import { Invoice } from '~/types/invoice'
import { importLegacy } from '~/helpers/legacyImport'

export default Vue.extend({
  name: 'Invoices',
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
    import: {} as Address,
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(this.customer.$key)
      .collection('invoices')
      .onSnapshot((snapshot) => {
        this.invoices = mapSnapshot<Invoice>(snapshot)
      })
  },
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('payload', ['customer', 'addresses']),
  },
  methods: {
    makeInvoice(item: Address) {
      this.$router.push({
        path: '/invoices/create',
        query: {
          customer: this.customer.$key,
          address: item.$key,
        },
      })
    },

    startImport(address: Address): void {
      this.import = address
      ;(this.$refs.fileInput as any).click()
    },

    async importDone(event: any): Promise<void> {
      const docId = await importLegacy(
        this.$nuxt.context,
        this.customer,
        this.import.$key!,
        event.target.files[0]
      )

      this.$router.push(`/invoices/${this.customer.$key}/${docId}`)
    },

    navigateToInvoice(invoice: Invoice) {
      this.$router.push(`/invoices/${this.customer.$key}/${invoice.$key}`)
    },
  },
})
</script>
