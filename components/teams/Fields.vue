<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title>Champs personnalisés</template>
      <template #description>
        Les champs personnalisés sont affichés en pied de page, ils sont
        utilisés pour afficher des informations nécéssaires comme le numéro de
        SIRET.
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
              <th class="p-4 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(field, idx) in team.fields" :key="idx">
              <td class="px-4 py-3">{{ field }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="isAdmin"
                  class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                  type="button"
                  @click.prevent="editField(idx)"
                >
                  Modifier
                </button>

                <button
                  v-if="isAdmin"
                  class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                  type="button"
                  @click.prevent="deleteField(idx)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <form @submit.prevent="addField">
      <Modal :activator.sync="dialog">
        <template #title>
          {{ update > -1 ? 'Modifier un champ' : 'Ajouter un champ' }}
        </template>
        <template #icon>
          <base-modal-icon icon="info-circle" />
        </template>
        <template #content>
          <div class="mt-2">
            <base-label for="field">Champ</base-label>
            <base-input
              id="field"
              v-model="value"
              :disabled="!isAdmin"
              type="text"
              required
              :class="{ 'opacity-60': !isAdmin }"
            />
          </div>
        </template>
        <template #footer>
          <base-button success type="submit">
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </base-button>

          <base-button base @click.prevent="closeDialog">Annuler</base-button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropOptions, ref } from '@nuxtjs/composition-api'
import _ from 'lodash'
import useTeam from './useTeam'
import { Team } from '~/types/team'

export default defineComponent({
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  setup(props, { emit }) {
    // Data
    const dialog = ref(false)
    const update = ref(-1)
    const value = ref('')

    // Computed
    const { team, isAdmin } = useTeam(props, emit)

    // Methods
    const addField = () => {
      if (update.value > -1) {
        team.value.fields[update.value] = value.value
      } else {
        team.value.fields.push(value.value)
      }

      closeDialog()
    }

    const editField = (idx: number) => {
      update.value = idx
      value.value = _.clone(team.value.fields[update.value])
      dialog.value = true
    }

    const deleteField = (idx: number) => {
      team.value.fields.splice(idx, 1)
    }

    const closeDialog = () => {
      dialog.value = false
      update.value = -1
      value.value = ''
    }

    return {
      dialog,
      update,
      value,
      team,
      isAdmin,
      addField,
      editField,
      deleteField,
      closeDialog,
    }
  },
})
</script>
