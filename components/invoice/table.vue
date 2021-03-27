<template>
  <div class="px-4">
    <div
      class="w-full overflow-x-auto max-w-7xl mx-auto rounded-lg bg-gray-50 pt-2 pb-4"
    >
      <!-- Actions -->
      <div class="flex justify-end items-center px-4 py-2">
        <button
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          type="button"
          @click.prevent="dialog = true"
        >
          Ajouter un objet
        </button>
      </div>

      <!-- Fields -->
      <table class="w-full table-auto">
        <thead>
          <tr class="border-b">
            <th class="px-4 py-2 w-4"></th>
            <th class="text-left font-medium text-gray-600 px-4 py-2">Objet</th>
            <th
              v-if="team.rendering.quantityEnabled"
              class="text-right font-medium text-gray-600 px-4 py-2"
            >
              Quantité
            </th>
            <th class="text-right font-medium text-gray-600 px-4 py-2">Prix</th>
            <th class="text-right font-medium text-gray-600 px-4 py-2">
              Total TTC
            </th>
          </tr>
        </thead>
        <draggable v-model="invoice.data.fields" tag="tbody" class="divide-y">
          <tr
            v-for="(item, idx) in invoice.data.fields"
            :key="idx"
            class="cursor-move even:bg-gray-100 active:bg-blue-100"
          >
            <td class="px-4 py-3 w-4">
              <button
                class="focus:outline-none mt-2"
                type="button"
                @click.prevent="editField(idx)"
              >
                <i class="bx bxs-pencil text-2xl text-indigo-500"></i>
              </button>
            </td>
            <td
              class="px-4 py-3 text-left whitespace-pre-line"
              v-text="item.description"
            ></td>
            <td
              v-if="team.rendering.quantityEnabled"
              class="px-4 py-3 text-right"
            >
              {{ item.quantity }}
            </td>
            <td class="px-4 py-3 text-right">{{ item.price }} €</td>
            <td class="px-4 py-3 text-right font-semibold">
              {{ invoice.getPriceAtIndex(idx) }} €
              <div class="text-sm font-normal text-gray-400">
                dont {{ item.tax }} % de taxes
              </div>
            </td>
          </tr>
        </draggable>
      </table>

      <Modal :activator.sync="dialog" extended>
        <template #icon>
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <i class="bx bx-package text-indigo-600 text-xl"></i>
          </div>
        </template>
        <template #title>
          {{ update > -1 ? 'Modifier un objet' : 'Ajouter un objet' }}
        </template>
        <template #content>
          <div class="mt-2">
            <label class="text-sm text-gray-500" for="description"
              >Description</label
            >
            <textarea
              id="description"
              v-model.trim="field.description"
              class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            ></textarea>
          </div>
          <div
            class="grid mt-2 gap-2"
            :class="{
              'grid-cols-3': team.rendering.quantityEnabled,
              'grid-cols-2': !team.rendering.quantityEnabled,
            }"
          >
            <div v-if="team.rendering.quantityEnabled">
              <label class="text-sm text-gray-500" for="quantity"
                >Quantité</label
              >
              <input
                id="quantity"
                v-model.number="field.quantity"
                class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
              />
            </div>

            <div>
              <label class="text-sm text-gray-500" for="price">
                Prix en Euro (€)
              </label>
              <input
                id="price"
                v-model.number="field.price"
                class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
              />
            </div>

            <div>
              <label class="text-sm text-gray-500" for="taxes">
                Taxes en pourcentage (%)
              </label>
              <input
                id="taxes"
                v-model.number="field.tax"
                class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
              />
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between items-center w-full">
            <div>
              <button
                v-if="update > -1"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-gray-100 hover:bg-red-700 focus:outline-none focus:ring-2 sm:mt-0 sm:w-auto sm:text-sm"
                type="button"
                @click.prevent="deleteField"
              >
                Supprimer
              </button>
            </div>

            <div>
              <button
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:w-auto sm:text-sm"
                type="button"
                @click.prevent="closeField"
              >
                Fermer
              </button>

              <button
                class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-gray-100 hover:bg-indigo-600 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-1 sm:w-auto sm:text-sm"
                type="button"
                @click.prevent="addField"
              >
                {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
              </button>
            </div>
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import draggable from 'vuedraggable'
import { DataTableHeader } from 'vuetify'
import { mapGetters, mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import {
  defaultField,
  FieldHeaders,
  FieldHeadersWithQuantity,
} from '~/types/invoice'

export default Vue.extend({
  name: 'InvoiceTable',
  components: {
    draggable,
  },
  props: {
    invoiceState: {
      type: InvoiceImpl,
      required: true,
    } as PropOptions<InvoiceImpl>,
  },
  data: () => ({
    field: defaultField(),
    fieldHeaders: [] as DataTableHeader[],
    dialog: false,
    update: -1,
  }),
  computed: {
    ...mapGetters('team', ['role']),
    ...mapState('team', ['team']),
    invoice: {
      get(): InvoiceImpl {
        return this.invoiceState
      },
      set(val: InvoiceImpl): void {
        this.$emit('update:invoice', val)
      },
    },
  },
  mounted() {
    if (this.team.quantityEnabled) {
      this.fieldHeaders = FieldHeadersWithQuantity
    } else {
      this.fieldHeaders = FieldHeaders
    }
  },
  methods: {
    addField(): void {
      if (this.update === -1) {
        this.invoice.data.fields.push(this.field)
      } else {
        this.invoice.data.fields[this.update] = this.field
      }

      this.update = -1
      this.field = defaultField()
      this.dialog = false
    },

    deleteField(): void {
      this.invoice.data.fields.splice(this.update, 1)
      this.closeField()
    },

    closeField(): void {
      this.field = defaultField()
      this.update = -1
      this.dialog = false
    },

    editField(idx: number): void {
      this.field = this.invoice.data.fields[idx]
      this.update = idx
      this.dialog = true
    },
  },
})
</script>

<style scoped>
.cursor-move {
  cursor: move;
}
</style>
