<template>
  <v-dialog v-model="display" width="500">
    <v-card>
      <v-card-title>Ajouter une réduction</v-card-title>

      <v-card-text>
        <v-text-field
          :value="invoice.data.promotion"
          label="Réduction (en pourcentage)"
          append-icon="mdi-percentage"
          type="number"
          @input="$emit('update:invoice', $event.target.value)"
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
  name: 'InvoicePromotionDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
    invoice: {
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
  },
})
</script>
