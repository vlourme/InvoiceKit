<template>
  <div class="px-4">
    <div
      class="w-full overflow-x-auto max-w-7xl mx-auto rounded-lg bg-gray-50 pt-2 pb-4"
    >
      <!-- Actions -->
      <div class="flex justify-end items-center px-4 py-2">
        <base-button base @click.prevent="dialog = true">
          Ajouter un objet
        </base-button>
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
          <base-modal-icon icon="package" />
        </template>
        <template #title>
          {{ update > -1 ? 'Modifier un objet' : 'Ajouter un objet' }}
        </template>
        <template #content>
          <div class="mt-2">
            <base-label for="description">Description</base-label>
            <base-textarea
              id="description"
              v-model.trim="field.description"
            ></base-textarea>
          </div>
          <div
            class="grid mt-2 gap-2"
            :class="{
              'grid-cols-3': team.rendering.quantityEnabled,
              'grid-cols-2': !team.rendering.quantityEnabled,
            }"
          >
            <div v-if="team.rendering.quantityEnabled">
              <base-label for="quantity">Quantité</base-label>
              <base-input id="quantity" v-model.number="field.quantity" />
            </div>

            <div>
              <base-label for="price"> Prix en Euro (€) </base-label>
              <base-input id="price" v-model.number="field.price" />
            </div>

            <div>
              <base-label for="taxes"> Taxes en pourcentage (%) </base-label>
              <base-input id="taxes" v-model.number="field.tax" />
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-between items-center w-full">
            <div>
              <base-button
                v-if="update > -1"
                danger
                @click.prevent="deleteField"
              >
                Supprimer
              </base-button>
            </div>

            <div>
              <base-button base type="button" @click.prevent="closeField">
                Fermer
              </base-button>

              <base-button info @click.prevent="addField">
                {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
              </base-button>
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
import { mapGetters, mapState } from 'vuex'
import InvoiceImpl from '~/implementations/InvoiceImpl'
import { defaultField } from '~/types/invoice'

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
