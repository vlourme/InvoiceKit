<template>
  <Card margin :width="1000">
    <template #title>
      <template v-if="invoice.data.$key">
        {{ invoice.data.type == 'QUOTE' ? 'Devis' : 'Facture ' }}
        #{{ invoice.data.id }}
      </template>
      <v-template v-else>Créer une facture</v-template>
    </template>

    <template #actions>
      <v-btn text color="success" type="submit">
        <v-icon left>mdi-check</v-icon>
        Créer
      </v-btn>
    </template>

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
              :value="date"
              label="Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="invoice.data.date" locale="fr-fr" scrollable>
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
  </Card>
</template>

<script lang="ts">
import { format, parseISO } from 'date-fns'
import Vue, { PropOptions } from 'vue'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { InvoiceStatus, InvoiceType } from '~/types/invoice'

export default Vue.extend({
  name: 'InvoiceStatus',
  props: {
    invoiceState: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
  },
  data: () => ({
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
    dateMenu: false,
  }),
  computed: {
    invoice: {
      get(): InvoiceImpl {
        return this.invoiceState
      },
      set(val: InvoiceImpl) {
        this.$emit('update:invoice', val)
      },
    },
    date(): string {
      return format(
        parseISO(new Date(this.invoice.data.date).toISOString()),
        'dd/MM/yyyy'
      )
    },
  },
})
</script>
