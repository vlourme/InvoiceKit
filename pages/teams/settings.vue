<template>
  <Header>
    <template #title>Paramètres de la team</template>

    <template #actions>
      <v-badge overlap color="warning" :value="hasChanges">
        <v-btn v-if="isAdmin" :elevation="0" @click="updateTeam">
          <v-icon left>mdi-check</v-icon>
          Sauvegarder
        </v-btn>
      </v-badge>
    </template>

    <v-form v-model="valid">
      <Card>
        <template #title> Paramètres de la team </template>

        <template #actions>
          <v-btn v-if="!isOwner" text color="error" @click="leaveTeam">
            <v-icon left>mdi-close</v-icon>
            Quitter la team
          </v-btn>

          <v-btn v-else text color="error" @click="deleteTeam">
            <v-icon left>mdi-delete</v-icon>
            Supprimer la team
          </v-btn>
        </template>

        <v-text-field
          v-model="team.name"
          :disabled="!isAdmin"
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
import { mapActions, mapGetters, mapState } from 'vuex'
import Vue from 'vue'
import _ from 'lodash'
import { Team } from '~/types/team'
import { NotificationType } from '~/types/notification'
import { DialogType } from '~/types/dialog'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  middleware({ store, redirect }) {
    if (!store.state.team.team) {
      redirect('/dashboard')
    }
  },
  data: () => ({
    hasChanges: false,
    valid: false,
    team: {} as Team,
  }),
  head: {
    title: 'Paramètres de la team',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
    ...mapGetters('team', ['isAdmin', 'isOwner']),
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

    // Start watcher
    this.$watch(
      'team',
      () => {
        this.hasChanges = !_.isEqual(this.team, this.teamState)
      },
      { deep: true }
    )
  },
  methods: {
    ...mapActions('team', ['switchTeam', 'getTeams']),

    deleteTeam(): void {
      this.$dialog({
        type: DialogType.Error,
        title: 'Êtes-vous sur de supprimer la team ?',
        message:
          'Toutes les données associées seront supprimées et irrécupérables.',
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await this.deleteTeamCallback(),
      })
    },

    async deleteTeamCallback() {
      const fn = this.$fire.functions.httpsCallable('deleteTeam', {
        timeout: 2000,
      })

      try {
        const res = await fn({ teamId: this.user.team })

        if (res.data.success) {
          this.$notify('La team à été supprimée', NotificationType.SUCCESS)

          await this.changeTeam()
        } else {
          throw new Error('team was not deleted')
        }
      } catch (e) {
        console.error(e)
        this.$notify('Impossible de supprimer la team', NotificationType.ERROR)
      }
    },

    leaveTeam(): void {
      this.$dialog({
        type: DialogType.Warning,
        title: 'Êtes-vous sur de quitter la team ?',
        message:
          'Si vous voulez revenir dans cette team, le propriétaire devra vous inviter à nouveau.',
        showCancel: true,
        actionMessage: 'Quitter',
        callback: async () => await this.leaveTeamCallback(),
      })
    },

    async leaveTeamCallback(): Promise<void> {
      const fn = this.$fire.functions.httpsCallable('leaveTeam', {
        timeout: 2000,
      })

      try {
        const response = await fn({ teamId: this.user.team })

        if (response.data.success) {
          this.$notify('Vous avez quitté la team.', NotificationType.SUCCESS)

          await this.changeTeam()
        } else {
          throw new Error('cannot leave team')
        }
      } catch (e) {
        console.error(e)
        this.$notify('Impossible de quitter la team', NotificationType.ERROR)
      }
    },

    async changeTeam() {
      // Switch to profile
      await this.switchTeam()

      // Reload teams
      await this.getTeams(false)

      // Redirect to dashboard
      this.$router.push('/dashboard')
    },

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

          // Reset changes
          this.hasChanges = false
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
