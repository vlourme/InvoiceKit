<template>
  <v-dialog v-model="display" width="500">
    <v-card>
      <v-card-title>Ajouter un acompte</v-card-title>

      <v-card-text>
        <v-text-field
          v-model.number="invoice.data.deposit"
          label="Acompte (en Euro)"
          append-icon="mdi-currency-eur"
          type="number"
        ></v-text-field>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" text @click="display = false"> Fermer </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import InvoiceImpl from '~/implementations/InvoiceImpl'

export default Vue.extend({
  name: 'InvoiceDeposit',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
    invoiceState: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
  },
  computed: {
    display: {
      get() {
        return this.dialog
      },
      set(val: boolean) {
        this.$emit('update:dialog', val)
      },
    },
    invoice: {
      get() {
        return this.invoiceState
      },
      set(val: InvoiceImpl) {
        this.$emit('update:invoice', val)
      },
    },
  },
})
</script>
