<template>
  <v-navigation-drawer color="grey darken-4" app permanent clipped right>
    <v-list nav dense subheader>
      <v-subheader>Client</v-subheader>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ customer.fullName }}</v-list-item-title>
          <v-list-item-subtitle>Nom complet</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="customer.society">
        <v-list-item-icon>
          <v-icon>mdi-briefcase</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ customer.society }}</v-list-item-title>
          <v-list-item-subtitle>Entreprise</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="customer.phone">
        <v-list-item-icon>
          <v-icon>mdi-phone</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ customer.phone }}</v-list-item-title>
          <v-list-item-subtitle>Téléphone</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="customer.email">
        <v-list-item-icon>
          <v-icon>mdi-email</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ customer.email }}</v-list-item-title>
          <v-list-item-subtitle>Email</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="invoice.data.address">
        <v-list-item-icon>
          <v-icon>mdi-map</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ address.street }}, {{ address.city }} {{ address.zip }},
            {{ address.country }}
          </v-list-item-title>
          <v-list-item-subtitle>Adresse</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list subheader dense nav>
      <v-subheader>Facturation</v-subheader>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-arrow-top-right-thick</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ tax }} €</v-list-item-title>
          <v-list-item-subtitle>Taxes</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-plus-minus-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            — {{ invoice.data.promotion || 0 }} %
          </v-list-item-title>
          <v-list-item-subtitle>Réduction</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="$emit('update:promotion-dialog', true)">
            <v-icon color="grey lighten-1">mdi-pencil-circle</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-bank</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            — {{ invoice.data.deposit || 0 }} €
          </v-list-item-title>
          <v-list-item-subtitle>Acompte</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click="$emit('update:deposit-dialog', true)">
            <v-icon color="grey lighten-1">mdi-pencil-circle</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-arrow-down-thick</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ total }} €</v-list-item-title>
          <v-list-item-subtitle>Total TTC</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'

export default Vue.extend({
  name: 'InvoiceSidebar',
  props: {
    invoice: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
    promotionDialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
    depositDialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
  },
  data: () => ({
    total: 0,
    tax: 0,
  }),
  computed: {
    ...mapState('payload', {
      customer: 'customer',
      invoiceState: 'invoice',
      address: 'address',
    }),
  },
  watch: {
    'invoice.data': {
      deep: true,
      handler() {
        this.total = this.invoice.getTotalPrice()
        this.tax = this.invoice.getTotalTaxes()
      },
    },
  },
  mounted() {
    this.total = this.invoice.getTotalPrice()
    this.tax = this.invoice.getTotalTaxes()
  },
})
</script>
