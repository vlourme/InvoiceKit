<template>
  <Header>
    <Card margin :width="1000">
      <template #title>
        {{ invoice.data.type == 'QUOTE' ? 'Devis' : 'Facture' }}
        {{ invoice.data.id }}
      </template>

      <template #actions>
        <v-btn text color="success" @click="updateInvoice">
          <v-icon left>mdi-check</v-icon>
          Mettre à jour
        </v-btn>
      </template>

      <v-form v-model="valid">
        <v-text-field
          v-model="invoice.data.id"
          label="Identifiant"
          prepend-icon="mdi-pound"
          placeholder="41-FR/2021"
          :rules="[(v) => !!v || 'L\'identifiant est obligatoire']"
        />

        <v-row>
          <v-col>
            <v-select
              v-model="invoice.data.type"
              :items="types"
              prepend-icon="mdi-file"
              label="Type de document"
            ></v-select>
          </v-col>
          <v-col>
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
      :invoice="invoice"
      :promotion-dialog.sync="promotionDialog"
      :deposit-dialog.sync="depositDialog"
    />
  </Header>
</template>

<script lang="ts">
import { InvoiceIndex, Type } from '@/types/invoice'
import { cloneDeep } from 'lodash/lang'
import Vue from 'vue'
import { mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'UpdateInvoice',
  layout: 'dashboard',
  async asyncData({ store, route }) {
    const { customer, invoice } = route.params

    await store.dispatch('payload/fetchCustomer', customer)
    await store.dispatch('payload/fetchInvoice', invoice)
  },
  data: () => ({
    invoice: new InvoiceImpl(),
    types: [
      { text: 'Facture', value: Type.Invoice },
      { text: 'Devis', value: Type.Estimation },
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
    ...mapState('payload', {
      customer: 'customer',
      invoiceState: 'invoice',
    }),
  },
  mounted() {
    this.invoice.data = cloneDeep(this.invoiceState)
  },
  methods: {
    async updateInvoice() {
      if (!this.customer.$key || !this.valid) {
        this.$notify('Impossible de sauvegarder', NotificationType.WARNING)
        return
      }

      const id = this.$route.params.invoice

      // Create invoice
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .doc(id)
        .update(this.invoice.data)

      // Register in a indexed list
      const index = await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('invoices')
        .where('link', '==', id)
        .limit(1)
        .get()

      if (index.docs[0].id) {
        await this.$fire.firestore
          .collection('teams')
          .doc(this.user.team)
          .collection('invoices')
          .doc(index.docs[0].id)
          .update({
            ...index.docs[0].data(),
            updatedAt: new Date(),
          } as InvoiceIndex)
      }

      this.$notify('Le document à été sauvegardé', NotificationType.SUCCESS)
    },
  },
})
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>
