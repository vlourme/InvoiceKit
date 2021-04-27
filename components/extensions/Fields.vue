<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title>Champs</template>
      <template #description>
        Les champs seront utilisés pour remplir les fiches. Un des champs doit
        obligatoirement être une clé primaire, celle-ci est utilisée comme
        référence pour indexer les documents.
      </template>
      <template #actions>
        <base-button-inline
          v-if="isAdmin"
          info
          icon="plus"
          @click.prevent="dialog = true"
        >
          Ajouter un champ
        </base-button-inline>
      </template>
    </FormDescription>

    <div class="col-span-2 mx-2 bg-gray-50 rounded-lg py-2">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-4 font-medium text-gray-600">Champ</th>
              <th class="text-left p-4 font-medium text-gray-600">Type</th>
              <th class="text-left p-4 font-medium text-gray-600">Requis</th>
              <th class="text-left p-4 font-medium text-gray-600">
                Mis en avant
              </th>
              <th class="p-4 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <draggable v-model="extension.fields" tag="tbody">
            <tr
              v-for="(field, idx) in extension.fields"
              :key="idx"
              class="cursor-move active:bg-blue-100"
            >
              <td class="px-4 py-3">
                <div class="inline-flex flex-col">
                  <div class="inline-flex items-center">
                    <i
                      v-if="field.primary"
                      class="bx bx-key text-yellow-500 text-lg mr-2"
                    ></i>
                    {{ field.name }}
                  </div>
                  <code class="text-xs text-gray-400">{{ field.value }}</code>
                </div>
              </td>
              <td class="px-4 py-3">{{ getType(field.type) }}</td>
              <td class="px-4 py-3">
                {{ field.required ? 'Oui' : 'Non' }}
              </td>
              <td class="px-4 py-3">
                {{ field.featured ? 'Oui' : 'Non' }}
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                  type="button"
                  @click.prevent="editField(idx)"
                >
                  Modifier
                </button>

                <button
                  class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                  type="button"
                  @click.prevent="deleteField(idx)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>

    <form @submit.prevent="addField">
      <Modal :activator.sync="dialog" extended>
        <template #title>
          {{ update > -1 ? 'Modifier un champ' : 'Ajouter un champ' }}
        </template>
        <template #icon>
          <base-modal-icon icon="extension" />
        </template>
        <template #content>
          <div class="mt-2">
            <base-label for="name">Nom du champ</base-label>
            <base-input id="name" v-model="field.name" type="text" required />
          </div>
          <div v-if="field.type !== FieldType.Select" class="mt-2">
            <base-label for="placeholder">Placeholder</base-label>
            <base-input
              id="placeholder"
              v-model="field.placeholder"
              type="text"
            />
          </div>
          <div class="grid grid-cols-4 gap-2 mt-2">
            <div>
              <base-label for="primary">Champ primaire</base-label>
              <base-select
                id="primary"
                v-model="field.primary"
                :items="selects.yesno"
                :disabled="hasPrimaryKey && field.primary === false"
                bool
                required
              />
            </div>

            <div>
              <base-label for="type">Type de champ</base-label>
              <base-select
                id="type"
                v-model.number="field.type"
                :items="selects.types"
                required
              />
            </div>

            <div>
              <base-label for="featured">Mis en avant</base-label>
              <base-select
                id="featured"
                v-model="field.featured"
                :items="selects.yesno"
                bool
                required
              />
            </div>

            <div>
              <base-label for="required">Obligatoire</base-label>
              <base-select
                id="required"
                v-model="field.required"
                :items="selects.yesno"
                bool
                required
              />
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-0.5">
            Un seul champ primaire est toléré par formulaire.
          </p>
          <div v-if="field.type === FieldType.Select" class="mt-2">
            <base-label for="select">Valeurs du sélecteur</base-label>
            <base-input id="select" v-model="select" type="text" required />
            <p class="text-xs text-gray-400 mt-0.5">
              Séparez les valeurs par des points-virgules.
            </p>
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
import slugify from 'slugify'
import useExtension from '~/composables/useExtension'
import RootState from '~/store'
import { defaultExtensionField, defaultTeam, FieldType } from '~/types/team'

export default defineComponent({
  components: {
    draggable,
  },
  setup() {
    // Context
    const store = useStore<RootState>()

    // Data
    const data = reactive({
      dialog: false,
      update: -1,
      field: defaultExtensionField(),
      state: defaultTeam(),
      select: '',
      selects: {
        types: [
          { text: 'Texte', value: FieldType.Text },
          { text: 'Nombre', value: FieldType.Number },
          { text: 'Date', value: FieldType.Date },
          { text: 'Selection', value: FieldType.Select },
          { text: 'Email', value: FieldType.Email },
          { text: 'Bloc de texte', value: FieldType.Textarea },
        ],
        yesno: [
          { text: 'Oui', value: true },
          { text: 'Non', value: false },
        ],
      },
    })

    // Computed
    const { state, hasPrimaryKey } = useExtension()
    const isAdmin = computed(() => store.getters['team/isAdmin'])

    // Methods
    const addField = () => {
      if (data.field.type === FieldType.Select) {
        // Empty placeholder (can't be used)
        data.field.placeholder = ''

        // Add selects
        const parts = data.select.split(';')
        if (parts.length < 1) {
          return
        }

        for (let part of parts) {
          part = part.trim()

          if (part.length > 0) {
            data.field.selects.push({
              text: part,
              value: slugify(part, '_'),
            })
          }
        }
      } else {
        data.field.selects = []
      }

      // Set value
      data.field.value = slugify(data.field.name, '_')

      if (data.update > -1) {
        state.value.fields[data.update] = data.field
      } else {
        state.value.fields.push(data.field)
      }

      closeDialog()
    }

    const editField = (idx: number) => {
      data.update = idx
      data.field = state.value.fields[data.update]
      data.select = data.field.selects.map((value) => value.text).join(';')
      data.dialog = true
    }

    const deleteField = (idx: number) => {
      state.value.fields.splice(idx, 1)
    }

    const closeDialog = () => {
      data.dialog = false
      data.update = -1
      data.field = defaultExtensionField()
    }

    const getType = (type: FieldType): string => {
      switch (type) {
        case FieldType.Number:
          return 'Nombres'
        case FieldType.Date:
          return 'Date'
        case FieldType.Select:
          return 'Selection'
        case FieldType.Email:
          return 'Email'
        case FieldType.Textarea:
          return 'Bloc de texte'
        case FieldType.Text:
          return 'Texte'
      }
    }

    return {
      ...toRefs(data),
      extension: state,
      isAdmin,
      addField,
      editField,
      deleteField,
      closeDialog,
      getType,
      hasPrimaryKey,
      FieldType,
    }
  },
})
</script>
