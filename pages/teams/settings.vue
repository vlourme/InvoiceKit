<template>
  <Header>
    <v-form v-model="valid">
      <Card margin>
        <template #title>Paramètres de la team</template>

        <template #actions>
          <v-btn text @click="updateTeam">
            <v-icon left>mdi-check</v-icon>
            Sauvegarder
          </v-btn>
        </template>

        <v-text-field
          v-model="teamModel.name"
          label="Nom de la team"
          placeholder="John Doe"
        />
      </Card>

      <teams-members :team.sync="teamModel" class="my-4" />

      <teams-identity :team.sync="teamModel" class="my-4" />

      <teams-localization :team.sync="teamModel" class="my-4" />

      <teams-fields :team.sync="teamModel" class="my-4" />
    </v-form>

    <v-snackbar v-model="snackbar" :timeout="3000">
      {{ text }}
    </v-snackbar>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
import Team from '~/types/team'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  middleware({ store, redirect }) {
    if (!store.state.team) {
      redirect('/dashboard')
    }
  },
  data: () => ({
    valid: false,
    teamModel: {} as Team,
    text: '',
    snackbar: false,
  }),
  fetch() {
    this.teamModel = Object.assign({}, this.team)
  },
  head: {
    title: 'Paramètres de la team',
  },
  computed: {
    ...mapState(['auth', 'user', 'team']),
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
          this.text = 'Les paramètres ont étés sauvegardés.'
          this.snackbar = true
        })
        .catch(() => {
          this.text = 'Une erreur est survenue lors de la sauvegarde.'
          this.snackbar = true
        })
    },
  },
})
</script>
