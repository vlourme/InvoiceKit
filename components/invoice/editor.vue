<template>
  <FormBox>
    <template #description>
      <FormDescription>
        <template #title> Informations sur le document </template>

        <template #description>
          Les informations essentielles sur le document
        </template>

        <template #actions>
          <button
            type="button"
            class="text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
            @click.prevent="deleteInvoice()"
          >
            <i class="bx bx-minus mr-2"></i>
            Supprimer le document
          </button>
        </template>
      </FormDescription>
    </template>

    <div class="grid grid-cols-2 gap-2">
      <div>
        <div>
          <label class="text-sm text-gray-500" for="id">Identifiant</label>
          <input
            id="id"
            v-model="invoice.data.id"
            :disabled="role === 0"
            type="text"
            required
            class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
          />
        </div>
        <div class="mt-1">
          <label class="text-sm text-gray-500" for="type">
            Type de document
          </label>
          <div class="relative w-full">
            <select
              id="type"
              v-model="invoice.data.type"
              :disabled="role === 0"
              required
              class="w-full inline-block appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            >
              <template v-for="type in types">
                <option :key="type.value" :value="type.value">
                  {{ type.text }}
                </option>
              </template>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center mt-0.5 pr-3"
            >
              <i class="bx bx-down-arrow-alt text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <label class="text-sm text-gray-500" for="date">Date</label>
          <input
            id="date"
            v-model="invoice.data.date"
            :disabled="role === 0"
            type="date"
            required
            class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
          />
        </div>

        <div class="mt-1">
          <label class="text-sm text-gray-500" for="status"> Statut </label>
          <div class="relative w-full">
            <select
              id="status"
              v-model="invoice.data.status"
              :disabled="role === 0"
              required
              class="w-full inline-block appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            >
              <template v-for="status in statuses">
                <option :key="status.value" :value="status.value">
                  {{ status.text }}
                </option>
              </template>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center mt-0.5 pr-3"
            >
              <i class="bx bx-down-arrow-alt text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FormBox>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { mapGetters, mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { DialogType } from '~/types/dialog'
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
  }),
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('payload', ['customer']),
    ...mapGetters('team', ['role']),
    invoice: {
      get(): InvoiceImpl {
        return this.invoiceState
      },
      set(val: InvoiceImpl) {
        this.$emit('update:invoice', val)
      },
    },
  },
  methods: {
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

    async deleteCallback(): Promise<void> {
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
