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
          v-model="teamModel.name"
          label="Nom de la team"
          placeholder="John Doe"
        />
      </Card>

      <teams-members :team.sync="teamModel" class="my-4" />

      <teams-identity :team.sync="teamModel" class="my-4" />

      <teams-localization :team.sync="teamModel" class="my-4" />

      <teams-rendering :team.sync="teamModel" class="my-4" />

      <teams-fields :team.sync="teamModel" class="my-4" />
    </v-form>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
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
    teamModel: {} as Team,
  }),
  fetch() {
    this.teamModel = Object.assign({}, this.team)
  },
  head: {
    title: 'Paramètres de la team',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
    ...mapState('team', ['team']),
  },
  methods: {
    updateTeam(): void {
      // Check validity
      if (!this.valid) {
        return
      }

      // Create team
      this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .update(this.teamModel)
        .then(() => {
          this.$notify(
            'Les paramètres ont étés sauvegardés.',
            NotificationType.SUCCESS
          )
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
