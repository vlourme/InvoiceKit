<template>
  <Card>
    <template #title>Information complémentaires de l'entreprise</template>

    <v-text-field
      v-model="teamModel.street"
      label="Adresse"
      placeholder="12 rue des lilas"
    />

    <v-row>
      <v-col>
        <v-text-field
          v-model="teamModel.city"
          label="Ville"
          placeholder="Lille"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="teamModel.zip"
          label="Code postal"
          placeholder="59000"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="teamModel.country"
          label="Pays"
          placeholder="France"
        />
      </v-col>
    </v-row>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'

export default Vue.extend({
  name: 'Localization',
  props: {
    team: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    teamModel: {} as Team,
  }),
  watch: {
    teamModel: {
      deep: true,
      handler(val: Team) {
        // Emit to parent
        this.$emit('update:team', val)
      },
    },
  },
  mounted() {
    // Clone
    this.teamModel = Object.assign({}, this.team)
  },
})
</script>
