<template>
  <Header>
    <template #title>Paramètres de la team</template>

    <template #actions>
      <v-btn :elevation="0" @click="updateTeam">
        <v-icon left>mdi-check</v-icon>
        Sauvegarder
      </v-btn>
    </template>

    <v-form v-model="valid">
      <Card>
        <template #title> Paramètres de la team </template>

        <v-text-field
          v-model="team.name"
          label="Nom de la team"
          placeholder="John Doe"
        ></v-text-field>
      </Card>

      <teams-members :team-state.sync="team" class="my-4"></teams-members>

      <teams-identity :team-state.sync="team" class="my-4"></teams-identity>

      <teams-localization
        :team-state.sync="team"
        class="my-4"
      ></teams-localization>

      <teams-rendering :team-state.sync="team" class="my-4"></teams-rendering>

      <teams-fields :team-state.sync="team" class="my-4"></teams-fields>
    </v-form>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
import { Team } from '~/types/team'
import { NotificationType } from '~/types/notification'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  middleware({ store, redirect }) {
    if (!store.state.team.team) {
      redirect('/dashboard')
    }
  },
  data: () => ({
    valid: false,
    team: {} as Team,
  }),
  head: {
    title: 'Paramètres de la team',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
    ...mapState('team', {
      teamState: 'team',
    }),
  },
  mounted() {
    this.team = _.cloneDeep(this.teamState)

    // Check for fields
    if (!this.team.fields) {
      this.team.fields = []
    }
  },
  methods: {
    updateTeam(): void {
      // Check validity
      if (!this.valid) {
        return
      }

      // Update
      this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .update(this.team)
        .then(() => {
          this.$notify(
            'Les paramètres ont étés sauvegardés.',
            NotificationType.SUCCESS
          )

          // Reload team
          this.$store.commit('team/SET_TEAM', this.team)
        })
        .catch(() => {
          this.$notify(
            'Une erreur est survenue lors de la sauvegarde.',
            NotificationType.WARNING
          )
        })
    },
  },
})
</script>
