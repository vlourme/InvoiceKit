<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title> Factures </template>
      <template #description> Gerez les factures du client </template>
      <template #actions>
        <base-button-inline info icon="plus" @click.prevent="dialog = true">
          Créer un nouveau devis ou facture
        </base-button-inline>
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
          <base-button success :disabled="!!selected" type="submit">
            Confirmer
          </base-button>

          <base-button base type="button" @click.prevent="dialog = false">
            Annuler
          </base-button>

          <div class="w-full"></div>

          <base-button base :disabled="!!selected" @click.prevent="startImport">
            Importer
          </base-button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useFetch,
  useRouter,
} from '@nuxtjs/composition-api'
import useCustomer from '~/composables/useCustomer'
import { importLegacy } from '~/helpers/legacyImport'
import { defaultAddress } from '~/types/address'
import { Invoice } from '~/types/invoice'

export default defineComponent({
  setup() {
    // Context
    const ctx = useContext()
    const router = useRouter()

    // Data
    const selected = ref(-1)
    const dialog = ref(false)
    const importAddress = ref(defaultAddress())
    const fileInput = ref<HTMLElement | null>(null)

    // Computed
    const { state, role, loadInvoices } = useCustomer()

    // Fetch
    useFetch(() => {
      loadInvoices(state.customer.value.$key!)
    })

    // Methods
    const makeInvoice = () => {
      router.push({
        path: '/invoices/create',
        query: {
          customer: state.customer.value.$key,
          address: state.addresses.value[selected.value].$key,
        },
      })
    }

    const startImport = (): void => {
      importAddress.value = state.addresses.value[selected.value]
      fileInput.value?.click()
    }

    const importDone = async (event: any): Promise<void> => {
      const docId = await importLegacy(
        ctx.app,
        state.customer.value,
        importAddress.value.$key!,
        event.target.files[0]
      )

      router.push(`/invoices/${state.customer.value.$key}/${docId}`)
    }

    const navigateToInvoice = (invoice: Invoice) => {
      router.push(`/invoices/${state.customer.value.$key!}/${invoice.$key}`)
    }

    return {
      ...state,
      fileInput,
      selected,
      dialog,
      role,
      makeInvoice,
      startImport,
      importDone,
      navigateToInvoice,
    }
  },
})
</script>
