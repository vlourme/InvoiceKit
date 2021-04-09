<template>
  <div
    class="max-w-xs w-full min-h-full bg-gray-50 pb-20 overflow-y-auto border-l"
  >
    <!-- Customer -->
    <p class="px-4 mt-3 mb-1 font-semibold text-gray-500 text-sm">Client</p>
    <ul class="divide-y border-b">
      <template v-if="featured.length > 0">
        <li class="p-4 inline-flex items-center w-full">
          <i class="bx text-xl bxs-user text-indigo-500"></i>
          <div class="ml-3 inline-flex flex-col">
            <p
              v-for="(field, idx) in featured"
              :key="idx"
              :class="{
                'font-semibold': field.primary,
                'text-gray-500 text-sm': !field.primary,
              }"
            >
              {{ customer[field.value] }}
            </p>
          </div>
        </li>
      </template>
      <!-- Address -->
      <li v-if="address" class="p-4 inline-flex items-center w-full">
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
          <span class="font-medium text-gray-600">{{ taxes }} €</span> de taxes
        </p>
      </li>
      <!-- Promotion -->
      <li class="p-4 inline-flex items-center justify-between w-full">
        <div class="inline-flex items-center">
          <i class="bx text-xl bxs-offer text-yellow-500"></i>
          <p class="ml-3 text-gray-500">
            <span class="font-medium text-gray-600"
              >{{ invoice.promotion || 0 }} %</span
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
              >{{ invoice.deposit || 0 }} €</span
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
        :disabled="!invoice.$key"
        type="button"
        class="p-4 inline-flex items-center hover:bg-gray-100 transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none w-full"
        @click.prevent="save"
      >
        <i class="bx text-xl bxs-download text-blue-500"></i>
        <p class="ml-3 text-gray-500">Sauvegarder en PDF</p>
      </button>
      <button
        :disabled="!invoice.$key"
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
import {
  computed,
  defineComponent,
  PropOptions,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import jsPDF from 'jspdf'
import { getFeaturedFields } from '~/composables/useExtensibleField'
import useInvoice from '~/composables/useInvoice'
import RootState from '~/store'
import BasicInvoiceTemplate from '~/templates/basic'

export default defineComponent({
  props: {
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
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()

    // Data
    const { state, user, role } = useInvoice()

    // Computed
    const team = computed(() => store.state.team.team!)
    const featured = getFeaturedFields(team.value, 'customers')

    // Methods
    const render = async (): Promise<jsPDF> => {
      let logo = ''

      try {
        logo = await ctx.$fire.storage
          .ref(`/teams/${user.value.team}`)
          .getDownloadURL()
      } catch {}

      const template = new BasicInvoiceTemplate(
        state.invoice.value,
        state.customer.value,
        state.address.value,
        team.value,
        logo
      )

      return await template.render()
    }

    /**
     * Save PDF on computer
     */
    const save = async () => {
      // Render
      const document = await render()

      // Get name
      const name = `${
        state.invoice.value.type === 'QUOTE' ? 'Devis' : 'Facture'
      } #${state.invoice.value.id}`

      // Save
      document.save(name)
    }

    const printInvoice = async () => {
      // Render
      const document = await render()

      // Print
      document.autoPrint()
      document.output('dataurlnewwindow')
    }

    return {
      ...state,
      save,
      printInvoice,
      role,
      featured,
    }
  },
})
</script>
