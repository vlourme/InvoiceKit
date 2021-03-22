<template>
  <Card>
    <template #title>Information complémentaires de l'entreprise</template>

    <v-text-field
      v-model="team.localization.street"
      :disabled="!isAdmin"
      label="Adresse"
      placeholder="12 rue des lilas"
    ></v-text-field>

    <v-row>
      <v-col>
        <v-text-field
          v-model="team.localization.city"
          :disabled="!isAdmin"
          label="Ville"
          placeholder="Lille"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="team.localization.zip"
          :disabled="!isAdmin"
          label="Code postal"
          placeholder="59000"
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="team.localization.country"
          :disabled="!isAdmin"
          label="Pays"
          placeholder="France"
        ></v-text-field>
      </v-col>
    </v-row>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'Localization',
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
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
})
</script>
