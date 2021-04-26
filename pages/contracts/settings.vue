<template>
  <form @submit.prevent="saveTeam">
    <Header>
      Paramètres pour les contrats
      <template #actions>
        <base-nav-button :disabled="!hasPrimaryKey" type="submit">
          Enregistrer
        </base-nav-button>
      </template>
    </Header>

    <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
      <FormDescription>
        <template #title>Modèles</template>
        <template #description>
          Les modèles permettent de définir différents schémas de contrats
          utilisable par défaut.
        </template>
        <template #actions>
          <base-button-inline
            v-if="isAdmin"
            info
            icon="plus"
            @click.prevent="dialog = true"
          >
            Ajouter un modèle
          </base-button-inline>
        </template>
      </FormDescription>

      <div class="col-span-2 mx-2 bg-gray-50 rounded-lg py-2">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left p-4 font-medium text-gray-600">Nom</th>
                <th class="text-left p-4 font-medium text-gray-600">
                  Révisions
                </th>
                <th class="text-left p-4 font-medium text-gray-600">Prix</th>
                <th class="p-4 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <draggable v-model="extension.models" tag="tbody">
              <tr
                v-for="(field, idx) in extension.models || []"
                :key="idx"
                class="cursor-move active:bg-blue-100"
              >
                <td class="px-4 py-3">{{ field.title }}</td>
                <td class="px-4 py-3">
                  {{ field.revisions === -1 ? 'Illimité' : field.revisions }}
                </td>
                <td class="px-4 py-3">{{ field.price }} €</td>
                <td class="px-4 py-3 text-right">
                  <button
                    class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                    type="button"
                    @click.prevent="editModel(idx)"
                  >
                    Modifier
                  </button>

                  <button
                    class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                    type="button"
                    @click.prevent="deleteModel(idx)"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            </draggable>
          </table>
        </div>
      </div>

      <form @submit.prevent="addModel">
        <base-slideover :activator.sync="dialog" :on-close="closeModal">
          <template #title>Créer un modèle</template>
          <div>
            <!-- Label -->
            <base-label for="title">Nom du modèle</base-label>

            <!-- Select -->
            <base-input
              id="title"
              v-model.trim="model.title"
              type="text"
              required
            />
          </div>
          <div class="mt-2">
            <!-- Label -->
            <base-label for="description">Description</base-label>

            <!-- Select -->
            <base-textarea id="description" v-model.trim="model.description" />
          </div>
          <div class="grid grid-cols-2 gap-2 mt-2">
            <div>
              <!-- Label -->
              <base-label for="revisions">Révisions</base-label>

              <!-- Select -->
              <base-input
                id="revisions"
                v-model.number="model.revisions"
                type="number"
                min="-1"
              />
            </div>
            <div>
              <!-- Label -->
              <base-label for="price">Prix en Euro</base-label>

              <!-- Select -->
              <base-input
                id="Prix"
                v-model.number="model.price"
                type="number"
                min="0"
              />
            </div>
          </div>

          <div class="flex justify-end w-full mt-5">
            <base-button type="submit" info class="w-full sm:ml-0"
              >Confirmer</base-button
            >
          </div>
        </base-slideover>
      </form>
    </div>

    <extensions-fields :extension.sync="extension" />
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useContext,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import draggable from 'vuedraggable'
import RootState from '~/store'
import { defaultTeam, Team } from '~/types/team'
import { NotificationType } from '~/types/notification'
import useExtension from '~/composables/useExtension'
import { defaultContractModel } from '~/types/contract'

export default defineComponent({
  components: {
    draggable,
  },
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()

    // Data
    const team = ref<Team>(defaultTeam())
    const model = reactive({
      dialog: false,
      update: -1,
      model: defaultContractModel(),
    })

    // Computed
    const teamStore = computed(() => store.state.team.team!)
    const isAdmin = computed(() => store.getters['team/isAdmin'])
    const { state, hasPrimaryKey, setState } = useExtension()

    // On mount
    useFetch(() => {
      team.value = _.cloneDeep(teamStore.value)
      setState(team.value.extensions.contracts)

      if (!state.value.models) {
        state.value.models = []
      }
    })

    // Methods
    const saveTeam = async () => {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(team.value.$key!)
        .update(team.value)

      ctx.$notify(
        'Les changements ont étés enregistrés',
        NotificationType.SUCCESS
      )
    }

    const addModel = () => {
      if (model.update > -1) {
        state.value.models![model.update] = model.model
      } else {
        state.value.models?.push(model.model)
      }

      closeModal()
    }

    const editModel = (idx: number) => {
      model.model = state.value.models![idx]
      model.dialog = true
      model.update = idx
    }

    const deleteModel = (idx: number) => {
      delete state.value.models![idx]
    }

    const closeModal = () => {
      model.model = defaultContractModel()
      model.update = -1
      model.dialog = false
    }

    return {
      extension: state,
      ...toRefs(model),
      hasPrimaryKey,
      isAdmin,
      addModel,
      editModel,
      deleteModel,
      closeModal,
      saveTeam,
    }
  },
})
</script>
