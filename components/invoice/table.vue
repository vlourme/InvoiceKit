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
        <draggable v-model="invoice.fields" tag="tbody" class="divide-y">
          <tr
            v-for="(item, idx) in invoice.fields"
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
              {{ getPriceAtIndex(invoice, idx) }} €
              <div class="text-sm font-normal text-gray-400">
                dont {{ item.tax }} % de taxes
              </div>
            </td>
          </tr>
        </draggable>
      </table>

      <form @submit.prevent="addField">
        <BaseSlideover :activator.sync="dialog">
          <template #title>
            {{ update > -1 ? 'Modifier un objet' : 'Ajouter un objet' }}
          </template>

          <div>
            <base-label for="description">Description</base-label>
            <base-textarea
              id="description"
              v-model.trim="field.description"
              spellcheck
              required
              rows="5"
            ></base-textarea>
          </div>
          <div v-if="team.rendering.quantityEnabled" class="mt-2">
            <base-label for="quantity">Quantité</base-label>
            <base-input
              id="quantity"
              v-model.number="field.quantity"
              min="0"
              required
            />
          </div>

          <div class="mt-2">
            <base-label for="price"> Prix en Euro (€) </base-label>
            <base-input id="price" v-model.number="field.price" min="0" />
          </div>

          <div class="mt-2">
            <base-label for="taxes"> Taxes en pourcentage (%) </base-label>
            <base-input id="taxes" v-model.number="field.tax" min="0" />
          </div>
          <div class="flex justify-between items-center w-full mt-4">
            <div>
              <base-button
                v-if="update > -1"
                danger
                :margin="false"
                @click.prevent="deleteField"
              >
                Supprimer
              </base-button>
            </div>

            <div>
              <base-button
                base
                :margin="false"
                type="button"
                @click.prevent="closeField"
              >
                Fermer
              </base-button>

              <base-button info class="ml-2" :margin="false" type="submit">
                {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
              </base-button>
            </div>
          </div>
        </BaseSlideover>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useStore,
} from '@nuxtjs/composition-api'
import draggable from 'vuedraggable'
import { getPriceAtIndex } from '~/composables/useInvoicePricing'
import useInvoice from '~/composables/useInvoice'
import { defaultField } from '~/types/invoice'
import RootState from '~/store'

export default defineComponent({
  components: {
    draggable,
  },
  setup() {
    // Context
    const store = useStore<RootState>()

    // Data
    const { state, role } = useInvoice()
    const data = reactive({
      field: defaultField(),
      dialog: false,
      update: -1,
    })

    // Computed
    const team = computed(() => store.state.team.team!)

    // Methods
    const addField = (): void => {
      if (data.update === -1) {
        state.invoice.value.fields.push(data.field)
      } else {
        state.invoice.value.fields[data.update] = data.field
      }

      data.update = -1
      data.field = defaultField()
      data.dialog = false
    }

    const deleteField = (): void => {
      state.invoice.value.fields.splice(data.update, 1)
      closeField()
    }

    const closeField = (): void => {
      data.field = defaultField()
      data.update = -1
      data.dialog = false
    }

    const editField = (idx: number): void => {
      data.field = state.invoice.value.fields[idx]
      data.update = idx
      data.dialog = true
    }

    return {
      ...state,
      ...toRefs(data),
      role,
      team,
      getPriceAtIndex,
      addField,
      deleteField,
      closeField,
      editField,
    }
  },
})
</script>
