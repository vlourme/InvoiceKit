<template>
  <div
    class="max-w-xs w-full min-h-full bg-gray-50 pb-20 overflow-y-auto border-l"
  >
    <!-- Customer -->
    <p class="px-4 mt-3 mb-1 font-semibold text-gray-500 text-sm">Client</p>
    <ul class="divide-y border-b">
      <!-- Full name -->
      <li class="p-4 inline-flex items-center w-full">
        <i class="bx text-xl bxs-user text-indigo-500"></i>
        <p class="ml-3">
          {{ customer.fullName }}
        </p>
      </li>
      <!-- Society -->
      <li v-if="customer.society" class="p-4 inline-flex items-center w-full">
        <i class="bx text-xl bxs-briefcase text-indigo-500"></i>
        <p class="ml-3">
          {{ customer.society }}
        </p>
      </li>
      <!-- Email -->
      <li v-if="customer.email" class="p-4 inline-flex items-center w-full">
        <i class="bx text-xl bxs-envelope text-indigo-500"></i>
        <p class="ml-3">
          {{ customer.email }}
        </p>
      </li>
      <!-- Phone -->
      <li v-if="customer.phone" class="p-4 inline-flex items-center w-full">
        <i class="bx text-xl bxs-phone text-indigo-500"></i>
        <p class="ml-3">
          {{ customer.phone }}
        </p>
      </li>
      <!-- Address -->
      <li class="p-4 inline-flex items-center w-full">
        <i class="bx text-xl bxs-map text-indigo-500"></i>
        <p class="ml-3">
          {{ address.street }}, {{ address.zip }} {{ address.city }},
          {{ address.country }}
        </p>
      </li>
    </ul>

    <!-- Pricing -->
    <p class="px-4 mt-3 mb-1 font-semibold text-gray-500 text-sm">
      Facturation
    </p>
    <ul class="divide-y border-b">
      <!-- Taxes -->
      <li class="p-4 inline-flex items-center w-full">
        <i class="bx text-xl bxs-paper-plane text-yellow-500"></i>
        <p class="ml-3 text-gray-500">
          <span class="font-medium text-gray-600">{{ tax }} €</span> de taxes
        </p>
      </li>
      <!-- Promotion -->
      <li class="p-4 inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
          <i class="bx text-xl bxs-offer text-yellow-500"></i>
          <p class="ml-3 text-gray-500">
            <span class="font-medium text-gray-600"
              >{{ invoice.data.promotion || 0 }} %</span
            >
            de réduction
          </p>
        </div>

        <button
          type="button"
          class="flex items-center justify-center focus:outline-none text-gray-700 hover:text-gray-400"
          @click.prevent="$emit('update:promotion-dialog', true)"
        >
          <i class="bx bx-dots-horizontal-rounded text-2xl"></i>
        </button>
      </li>
      <!-- Deposit -->
      <li class="p-4 inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
          <i class="bx text-xl bxs-purchase-tag text-yellow-500"></i>
          <p class="ml-3 text-gray-500">
            <span class="font-medium text-gray-600"
              >{{ invoice.data.deposit || 0 }} €</span
            >
            d'acompte
          </p>
        </div>

        <button
          type="button"
          class="flex items-center justify-center focus:outline-none text-gray-700 hover:text-gray-400"
          @click.prevent="$emit('update:deposit-dialog', true)"
        >
          <i class="bx bx-dots-horizontal-rounded text-2xl"></i>
        </button>
      </li>
      <!-- Total -->
      <li class="p-4 inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
          <i class="bx text-xl bxs-receipt text-yellow-500"></i>
          <p class="ml-3 text-gray-500">
            <span class="font-medium text-gray-600">{{ total || 0 }} €</span>
            au total TTC
          </p>
        </div>
      </li>
    </ul>

    <!-- Printing -->
    <p class="px-4 mt-3 mb-1 font-semibold text-gray-500 text-sm">
      Exportation
    </p>
    <div class="divide-y border-b">
      <button
        :disabled="!invoice.data.$key"
        type="button"
        class="p-4 inline-flex items-center hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none w-full"
        @click.prevent="save"
      >
        <i class="bx text-xl bxs-download text-blue-500"></i>
        <p class="ml-3 text-gray-500">Sauvegarder en PDF</p>
      </button>
      <button
        :disabled="!invoice.data.$key"
        type="button"
        class="p-4 inline-flex items-center hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none w-full"
        @click.prevent="printInvoice"
      >
        <i class="bx text-xl bxs-printer text-blue-500"></i>
        <p class="ml-3 text-gray-500">Imprimer le document</p>
      </button>
    </div>

    <!-- Misc -->
    <p class="px-4 mt-3 mb-1 font-semibold text-gray-500 text-sm">
      Autres actions
    </p>
    <div class="divide-y border-b">
      <button
        type="button"
        class="p-4 inline-flex items-center hover:bg-gray-100 transition-colors focus:outline-none w-full"
        @click.prevent="$emit('update:note-dialog', true)"
      >
        <i class="bx text-xl bxs-note text-green-500"></i>
        <p class="ml-3 text-gray-500">Ajouter une note</p>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import jsPDF from 'jspdf'
import Vue, { PropOptions } from 'vue'
import { mapGetters, mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import BasicInvoiceTemplate from '~/templates/basic'

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
    noteDialog: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
  },
  data: () => ({
    total: 0,
    tax: 0,
  }),
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('team', ['team']),
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
        this.total = this.invoice.getFinalPrice()
        this.tax = this.invoice.getTotalTaxes()
      },
    },
  },
  mounted() {
    this.total = this.invoice.getFinalPrice()
    this.tax = this.invoice.getTotalTaxes()
  },
  methods: {
    /**
     * Render PDF
     */
    async render(): Promise<jsPDF> {
      let logo = ''

      try {
        logo = await this.$fire.storage
          .ref(`/teams/${this.user.team}`)
          .getDownloadURL()
      } catch {}

      const template = new BasicInvoiceTemplate(
        this.invoice,
        this.customer,
        this.address,
        this.team,
        logo
      )

      return await template.render()
    },

    /**
     * Save PDF on computer
     */
    async save() {
      // Render
      const document = await this.render()

      // Get name
      const name = `${
        this.invoice.data.type === 'QUOTE' ? 'Devis' : 'Facture'
      } #${this.invoice.data.id}`

      // Save
      document.save(name)
    },

    /**
     * Print PDF in a new window
     */
    async printInvoice() {
      // Render
      const document = await this.render()

      // Print
      document.autoPrint()
      document.output('dataurlnewwindow')
    },
  },
})
</script>

<style scoped>
.wrap {
  white-space: normal;
}
</style>
