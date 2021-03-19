<template>
  <Header>
    <template #title>
      {{ invoice.data.type == 'QUOTE' ? 'Devis' : 'Facture' }}
      #{{ invoice.data.id }}
    </template>

    <template v-if="role > 0" #actions>
      <v-btn color="error" :elevation="0" @click="deleteInvoice">
        <v-icon left>mdi-delete</v-icon>
        Supprimer
      </v-btn>

      <v-badge overlap color="warning" :value="hasChanges">
        <v-btn class="ml-2" :elevation="0" @click="updateInvoice">
          <v-icon left>mdi-check</v-icon>
          Sauvegarder
        </v-btn>
      </v-badge>
    </template>

    <v-form v-model="valid">
      <invoice-editor :invoice-state.sync="invoice"></invoice-editor>

      <invoice-table :invoice-state.sync="invoice"></invoice-table>

      <invoice-dialog-deposit
        :invoice-state.sync="invoice"
        :dialog.sync="depositDialog"
      ></invoice-dialog-deposit>

      <invoice-dialog-promotion
        :invoice-state.sync="invoice"
        :dialog.sync="promotionDialog"
      ></invoice-dialog-promotion>

      <invoice-dialog-note
        :invoice-state.sync="invoice"
        :dialog.sync="noteDialog"
      ></invoice-dialog-note>

      <invoice-sidebar
        :invoice="invoice"
        :promotion-dialog.sync="promotionDialog"
        :deposit-dialog.sync="depositDialog"
        :note-dialog.sync="noteDialog"
      ></invoice-sidebar>
    </v-form>
  </Header>
</template>

<script lang="ts">
import { Invoice, InvoiceType } from '@/types/invoice'
import _ from 'lodash'
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { DialogType } from '~/types/dialog'
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
    hasChanges: false,
    invoice: new InvoiceImpl(),
    promotionDialog: false,
    depositDialog: false,
    noteDialog: false,
    valid: false,
  }),
  head() {
    return {
      title: `${
        this.invoice.data.type === InvoiceType.Estimation ? 'Devis' : 'Facture'
      } #${this.invoice.data.id}`,
    }
  },
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('payload', {
      customer: 'customer',
      invoiceState: 'invoice',
    }),
  },
  mounted() {
    this.invoice.data = _.cloneDeep(this.invoiceState)

    this.$watch(
      'invoice',
      () => {
        this.hasChanges = !_.isEqual(this.invoice.data, this.invoiceState)
      },
      { deep: true }
    )
  },
  methods: {
    async updateInvoice() {
      if (!this.customer.$key || !this.valid) {
        this.$notify('Impossible de sauvegarder', NotificationType.WARNING)
        return
      }

      const { invoice } = this.$route.params

      // Update invoice
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .doc(invoice)
        .update({
          ...this.invoice.data,
          updatedAt: new Date(),
        } as Invoice)

      this.$notify('Le document à été sauvegardé', NotificationType.SUCCESS)
      this.hasChanges = false
    },

    deleteInvoice(): void {
      this.$dialog({
        title: 'Supprimer la facture',
        message: 'Une fois supprimée, celle-ci sera irrecupérable.',
        type: DialogType.Error,
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await this.deleteCallback(),
      })
    },

    async deleteCallback() {
      const { invoice } = this.$route.params

      // Delete invoice
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.customer.$key)
        .collection('invoices')
        .doc(invoice)
        .delete()

      // Redirect
      this.$router.push('/invoices/')
    },
  },
})
</script>
