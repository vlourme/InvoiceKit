<template>
  <form @submit.prevent="saveContract(true)">
    <Header>
      Modifier un contrat

      <template #actions>
        <base-nav-button :disabled="!hasChanges" type="submit">
          Enregistrer
        </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Modifier un nouveau contrat</template>
          <template #description>
            Remplissez les informations concernant ce contrat.
          </template>
          <template v-if="role > 0" #actions>
            <base-button-inline danger icon="minus" @click.prevent="askDelete">
              Supprimer le contrat
            </base-button-inline>
          </template>
        </FormDescription>
      </template>

      <base-select v-model="contract.model" :items="selects" required />
      <extensions-inputs :fields="extension.fields" :state.sync="contract" />
    </FormBox>

    <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
      <FormDescription>
        <template #title>Événements</template>
        <template #description>
          Ajoutez les événements récents concernant ce contrat.
        </template>
        <template #actions>
          <base-button-inline
            v-if="role > 0"
            info
            icon="plus"
            @click.prevent="dialog = true"
          >
            Ajouter un événement
          </base-button-inline>
        </template>
      </FormDescription>

      <div class="col-span-2 mx-2 bg-gray-50 rounded-lg py-2">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-4 font-medium text-gray-600">
                  Description
                </th>
                <th class="text-left p-4 font-medium text-gray-600">Date</th>
                <th class="p-4 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <draggable v-model="contract.events" tag="tbody">
              <tr
                v-for="(event, idx) in contract.events || []"
                :key="idx"
                class="cursor-move active:bg-blue-100"
              >
                <td class="px-4 py-3">{{ event.name }}</td>
                <td class="px-4 py-3">{{ event.date }}</td>
                <td class="px-4 py-3 text-right">
                  <button
                    class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                    type="button"
                    @click.prevent="editEvent(idx)"
                  >
                    Modifier
                  </button>

                  <button
                    class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                    type="button"
                    @click.prevent="deleteEvent(idx)"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </draggable>
          </table>
        </div>
      </div>

      <form @submit.prevent="addEvent">
        <Modal :activator.sync="dialog" extended>
          <template #title>
            {{ update > -1 ? 'Modifier un événement' : 'Ajouter un événement' }}
          </template>
          <template #icon>
            <base-modal-icon icon="collection" />
          </template>
          <template #content>
            <div class="mt-2">
              <base-label for="name">Description</base-label>
              <base-textarea id="name" v-model="event.name" />
            </div>
            <div class="mt-2">
              <base-label for="date">Date</base-label>
              <base-input id="date" v-model="event.date" type="date" required />
            </div>
          </template>
          <template #footer>
            <base-button info type="submit">
              {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
            </base-button>

            <base-button base @click.prevent="closeDialog">Annuler</base-button>
          </template>
        </Modal>
      </form>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  useContext,
  useFetch,
  useRoute,
  useStore,
} from '@nuxtjs/composition-api'
import draggable from 'vuedraggable'
import useContract from '~/composables/useContract'
import RootState from '~/store'
import { ContractModel, defaultContractEvent } from '~/types/contract'
import { DialogType } from '~/types/dialog'
import { SelectItem } from '~/types/UI'

export default defineComponent({
  components: {
    draggable,
  },
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const route = useRoute()
    const store = useStore<RootState>()

    // Data
    const {
      state,
      role,
      hasChanges,
      resetState,
      saveContract,
      loadContract,
      deleteContract,
    } = useContract(route.value.params.customer)
    const data = reactive({
      selects: [] as SelectItem[],
      event: defaultContractEvent(),
      update: -1,
      dialog: false,
    })

    // Computed
    const team = computed(() => store.state.team.team!)
    const extension = computed(() => team.value.extensions.contracts)

    // Fetch
    useFetch(async () => {
      resetState()

      await loadContract(route.value.params.id)
    })

    // Methods
    onMounted(() => {
      // Get select values
      extension.value.models?.forEach((model: ContractModel) => {
        data.selects.push({
          text: `${model.title} - ${
            model.revisions > -1
              ? model.revisions + ' révisions'
              : 'Révision illimitées'
          } - ${model.price} €`,
          value: model,
        })
      })

      // Set default value
      if (extension.value.models && extension.value.models.length > -1) {
        state.contract.value.model = extension.value.models[0]
      }
    })

    const addEvent = () => {
      if (data.update > -1) {
        state.contract.value.events[data.update] = data.event
      } else {
        state.contract.value.events.push(data.event)
      }

      closeDialog()
    }

    const editEvent = (idx: number) => {
      data.update = idx
      data.event = state.contract.value.events[data.update]
      data.dialog = true
    }

    const deleteEvent = (idx: number) => {
      state.contract.value.events.splice(idx, 1)
    }

    const closeDialog = () => {
      data.dialog = false
      data.update = -1
      data.event = defaultContractEvent()
    }

    const askDelete = () => {
      ctx.$dialog({
        type: DialogType.Error,
        title: 'Supprimer ce contrat ?',
        message: 'Une fois supprimé, ce contrat ne sera pas récupérable.',
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await deleteContract(),
      })
    }

    return {
      ...state,
      ...toRefs(data),
      hasChanges,
      extension,
      role,
      saveContract,
      addEvent,
      editEvent,
      deleteEvent,
      closeDialog,
      askDelete,
    }
  },
  head: {
    title: 'Modifier un contrat',
  },
})
</script>
