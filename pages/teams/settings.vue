<template>
  <form @submit.prevent="updateTeam">
    <Header>
      Paramètres de la team

      <template #actions>
        <button
          type="submit"
          class="bg-gray-200 bg-opacity-50 h-full px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
        >
          Enregistrer
        </button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Votre team</template>
          <template #description>
            Mettez à jour les informations essentielles de votre espace de
            travail.
          </template>
          <template #actions>
            <button
              v-if="isOwner"
              type="button"
              class="text-sm mb-2 font-semibold text-red-400 hover:text-red-500 flex items-center focus:outline-none"
              @click.prevent="deleteTeam()"
            >
              <i class="bx bx-minus mr-2"></i>
              Supprimer la team
            </button>

            <button
              v-if="!isOwner"
              type="button"
              class="text-sm font-semibold text-yellow-500 hover:text-yellow-600 flex items-center focus:outline-none"
              @click.prevent="leaveTeam()"
            >
              <i class="bx bx-exit mr-2"></i>
              Quitter la team
            </button>
          </template>
        </FormDescription>
      </template>

      <div class="mt-2">
        <label for="name">Nom de la team</label>
        <input
          id="name"
          v-model="team.name"
          required
          minlength="1"
          :disabled="!isAdmin"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>
    </FormBox>

    <teams-members :team-state.sync="team" class="my-4"></teams-members>

    <teams-identity :team-state.sync="team" class="my-4"></teams-identity>

    <teams-localization
      :team-state.sync="team"
      class="my-4"
    ></teams-localization>

    <teams-rendering :team-state.sync="team" class="my-4"></teams-rendering>

    <teams-fields :team-state.sync="team" class="my-4"></teams-fields>
  </form>
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
    if (!store.state.auth.user.team) {
      redirect('/dashboard')
    }
  },
  data: () => ({
    team: {} as Team,
  }),
  fetch() {
    this.team = _.cloneDeep(this.teamState)
  },
  head: {
    title: 'Paramètres de la team',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
    ...mapState('team', {
      teamState: 'team',
    }),
    ...mapGetters('team', ['isAdmin', 'isOwner']),
    hasChanges(): boolean {
      return !_.isEqual(this.team, this.teamState)
    },
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
