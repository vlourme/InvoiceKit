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
        <button
          v-if="isAdmin"
          class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
          @click.prevent="dialog = true"
        >
          <i class="bx bx-plus mr-2"></i>
          Ajouter un champ
        </button>
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
                  @click="editField(idx)"
                >
                  Modifier
                </button>

                <button
                  v-if="isAdmin"
                  class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                  @click="deleteField(idx)"
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
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <i class="bx bxs-info-circle text-indigo-600 text-xl"></i>
          </div>
        </template>
        <template #content>
          <div class="mt-2">
            <label class="text-sm text-gray-500" for="field">Champ</label>
            <input
              id="field"
              v-model="value"
              :disabled="!isAdmin"
              type="text"
              required
              :class="{ 'opacity-60': !isAdmin }"
              class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            />
          </div>
        </template>
        <template #footer>
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </button>

          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="closeDialog"
          >
            Annuler
          </button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'
import _ from 'lodash'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'Fields',
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    dialog: false,
    value: '',
    update: -1,
  }),
  computed: {
    ...mapGetters('team', ['isAdmin']),
    team: {
      get(): Team {
        return this.teamState
      },

      set(value: Team): void {
        this.$emit('update:team', value)
      },
    },
  },
  methods: {
    addField() {
      if (this.update === -1) {
        this.team.fields.push(this.value)
      } else {
        this.team.fields[this.update] = this.value
      }

      this.closeDialog()
    },

    editField(idx: number) {
      this.update = idx
      this.value = _.clone(this.team.fields[this.update])
      this.dialog = true
    },

    deleteField(idx: number) {
      this.team.fields.splice(idx, 1)
    },

    closeDialog() {
      this.$nextTick(() => {
        this.dialog = false
        this.update = -1
        this.value = ''
      })
    },
  },
})
</script>
