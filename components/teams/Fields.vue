<template>
  <Card>
    <template #title>Champs</template>

    <template #actions>
      <v-btn v-if="isAdmin" text @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        Ajouter un champ
      </v-btn>
    </template>

    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Champ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in team.fields" :key="item">
            <td>{{ item }}</td>
            <td class="text-right d-flex align-center">
              <v-btn
                v-if="isAdmin"
                icon
                color="warning"
                @click="editField(idx)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="isAdmin"
                icon
                color="error"
                @click="deleteField(idx)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
          {{
            update > -1
              ? 'Mettre à jour une information'
              : 'Ajouter une information'
          }}
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="value"
            label="Texte"
            placeholder="Identifiant TVA: FR 00 123456789"
            hint="Ces champs seront ajoutés en bas de page sur les documents"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" text @click="addField">
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
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
