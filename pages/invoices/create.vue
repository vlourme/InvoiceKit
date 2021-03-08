<template>
  <Header>
    <Card margin :width="1000">
      <template #title> Créer une facture </template>

      <template #actions>
        <v-btn text color="success" @click="createInvoice">
          <v-icon left>mdi-check</v-icon>
          Créer
        </v-btn>
      </template>

      <v-form v-model="valid">
        <v-row>
          <v-col>
            <v-text-field
              v-model="invoice.data.id"
              label="Identifiant"
              prepend-icon="mdi-pound"
              placeholder="41-FR/2021"
              :rules="[(v) => !!v || 'L\'identifiant est obligatoire']"
            />

            <v-select
              v-model="invoice.data.type"
              :items="types"
              prepend-icon="mdi-file"
              label="Type de document"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="invoice.data.status"
              :items="statuses"
              prepend-icon="mdi-chart-line-variant"
              label="Statut du document"
            />

            <v-dialog
              ref="dialog"
              v-model="dateMenu"
              :return-value.sync="invoice.data.date"
              persistent
              width="290px"
              @click:outside="dateMenu = false"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="invoice.data.date"
                  label="Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="invoice.data.date"
                locale="fr-fr"
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="error" @click="dateMenu = false">
                  Annuler
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(invoice.data.date)"
                >
                  Confirmer
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
      </v-form>
    </Card>

    <invoice-table :invoice-state.sync="invoice" />

    <invoice-dialog-deposit
      :invoice-state.sync="invoice"
      :dialog.sync="depositDialog"
    />
    <invoice-dialog-promotion
      :invoice-state.sync="invoice"
      :dialog.sync="promotionDialog"
    />

    <invoice-sidebar
      :customer="customer"
      :promotion-dialog.sync="promotionDialog"
      :deposit-dialog.sync="depositDialog"
      :invoice="invoice"
    />
  </Header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { InvoiceIndex, InvoiceStatus, InvoiceType } from '@/types/invoice'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'CreateInvoice',
  layout: 'dashboard',
  async asyncData({ store, route }) {
    // Type fix
    const query = route.query as { [key: string]: string }

    await store.dispatch('payload/fetchCustomer', query.customer)
    await store.dispatch('payload/fetchAddress', query.address)
  },
  data: () => ({
    invoice: new InvoiceImpl(),
    types: [
      { text: 'Facture', value: InvoiceType.Invoice },
      { text: 'Devis', value: InvoiceType.Estimation },
    ],
    statuses: [
      { text: 'Aucun', value: InvoiceStatus.None },
      { text: 'Impayé', value: InvoiceStatus.Unpaid },
      { text: 'En attente', value: InvoiceStatus.Pending },
      { text: 'Payé', value: InvoiceStatus.Paid },
    ],
    promotionDialog: false,
    depositDialog: false,
    dateMenu: false,
    valid: false,
  }),
  head: {
    title: 'Créer une facture',
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('payload', ['customer', 'address']),
  },
  mounted() {
    this.invoice.data.address = this.address.$key
  },
  methods: {
    async createInvoice() {
      if (!this.customer.$key || !this.valid) {
        this.$notify('Impossible de sauvegarder', NotificationType.WARNING)
        return
      }

      // Create invoice
      const doc = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .add(this.invoice.data)

      // Register in a indexed list
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .add({
          id: this.invoice.data.id,
          type: this.invoice.data.type,
          link: doc.id,
          status: this.invoice.data.status,
          customer: this.customer,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as InvoiceIndex)

      // Redirect
      this.$router.push(`/invoices/${this.customer.$key}/${doc.id}`)
    },
  },
})
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>
