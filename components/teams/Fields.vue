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
