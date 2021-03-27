<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title> Factures </template>
      <template #description> Gerez les factures du client </template>
      <template #actions>
        <button
          class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
          @click="dialog = true"
        >
          <i class="bx bx-plus mr-2"></i>
          Créer un nouveau devis ou facture
        </button>
      </template>
    </FormDescription>

    <div class="col-span-2 mx-2 bg-gray-50 py-2 rounded-lg">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-4 font-medium text-gray-600">ID</th>
              <th class="text-left p-4 font-medium text-gray-600">Type</th>
              <th class="text-left p-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y even:bg-gray-100">
            <tr v-for="(item, idx) in invoices" :key="idx">
              <td class="p-3">{{ item.id }}</td>
              <td class="p-3">
                {{ item.type === 'QUOTE' ? 'Devis' : 'Facture' }}
              </td>
              <td class="p-3">{{ item.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <form @submit.prevent="makeInvoice">
      <Modal :activator.sync="dialog" extended>
        <template #title> Créer un devis ou une facture </template>
        <template #icon>
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <i class="bx bxs-receipt text-indigo-600 text-xl"></i>
          </div>
        </template>
        <template #content>
          <input ref="fileInput" hidden type="file" accept="application/json" />

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b">
                  <th
                    class="text-left font-medium text-gray-600 px-4 py-2"
                  ></th>
                  <th class="text-left font-medium text-gray-600 px-4 py-2">
                    Adresse
                  </th>
                  <th class="text-left font-medium text-gray-600 px-4 py-2">
                    Ville
                  </th>
                  <th class="text-left font-medium text-gray-600 px-4 py-2">
                    Pays
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="(item, idx) in addresses" :key="idx">
                  <td class="px-4 py-2">
                    <input
                      :id="`address-${idx}`"
                      v-model="selected"
                      :value="idx"
                      name="address"
                      type="radio"
                      required
                      class="focus:outline-none mt-1 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                  </td>
                  <td class="px-4 py-2">
                    <label :for="`address-${idx}`">{{ item.street }}</label>
                  </td>
                  <td class="px-4 py-2">
                    <label :for="`address-${idx}`">
                      {{ item.zip }} {{ item.city }}
                    </label>
                  </td>
                  <td class="px-4 py-2">
                    <label :for="`address-${idx}`">
                      {{ item.country }}
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template #footer>
          <button
            :disabled="!!selected"
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 disabled:text-gray-400 disabled:bg-green-100 focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Confirmer
          </button>

          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="dialog = false"
          >
            Annuler
          </button>

          <div class="w-full"></div>

          <button
            :disabled="!!selected"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 disabled:text-gray-400 disabled:bg-gray-100 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="startImport"
          >
            Importer
          </button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { mapSnapshot } from '~/helpers/documentMapper'
import { Address } from '~/types/address'
import { Invoice } from '~/types/invoice'
import { importLegacy } from '~/helpers/legacyImport'

export default Vue.extend({
  name: 'Invoices',
  data: () => ({
    invoices: [] as Invoice[],
    selected: -1,
    dialog: false,
    import: {} as Address,
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(this.customer.$key)
      .collection('invoices')
      .onSnapshot((snapshot) => {
        this.invoices = mapSnapshot<Invoice>(snapshot)
      })
  },
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('auth', ['user']),
    ...mapState('payload', ['customer', 'addresses']),
  },
  methods: {
    makeInvoice() {
      this.$router.push({
        path: '/invoices/create',
        query: {
          customer: this.customer.$key,
          address: this.addresses[this.selected].$key,
        },
      })
    },

    startImport(): void {
      this.import = this.addresses[this.selected]
      ;(this.$refs.fileInput as any).click()
    },

    async importDone(event: any): Promise<void> {
      const docId = await importLegacy(
        this.$nuxt.context,
        this.customer,
        this.import.$key!,
        event.target.files[0]
      )

      this.$router.push(`/invoices/${this.customer.$key}/${docId}`)
    },

    navigateToInvoice(invoice: Invoice) {
      this.$router.push(`/invoices/${this.customer.$key}/${invoice.$key}`)
    },
  },
})
</script>
