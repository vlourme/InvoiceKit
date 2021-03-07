<template>
  <Card>
    <template #title>Champs</template>

    <template #actions>
      <v-btn text @click="dialog = true">
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
          <tr v-for="(item, idx) in teamModel.fields" :key="idx">
            <td>{{ item }}</td>
            <td class="text-right">
              <v-btn icon @click="teamModel.fields.splice(idx, 1)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Ajouter un champ </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="value"
            label="Texte"
            placeholder="Identifiant TVA: FR 00 123456789"
            hint="Ces champs seront ajoutés en bas de page sur les documents"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" text @click="addField">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'

export default Vue.extend({
  name: 'Fields',
  props: {
    team: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    teamModel: {} as Team,
    dialog: false,
    value: '',
  }),
  watch: {
    teamModel: {
      deep: true,
      handler(val: Team) {
        this.$emit('update:team', val)
      },
    },
  },
  mounted() {
    // Clone
    this.teamModel = Object.assign({}, this.team)

    // Check for array definition
    if (!this.teamModel.fields) {
      this.teamModel.fields = []
    }
  },
  methods: {
    addField() {
      this.teamModel.fields.push(this.value)

      this.dialog = false
      this.value = ''

      this.$forceUpdate()
    },
  },
})
</script>
