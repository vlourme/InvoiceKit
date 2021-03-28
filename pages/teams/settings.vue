<template>
  <form @submit.prevent="updateTeam">
    <Header>
      Paramètres de la team

      <template #actions>
        <base-nav-button type="submit"> Enregistrer </base-nav-button>
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
            <base-button-inline
              v-if="isOwner"
              danger
              icon="minus"
              @click.prevent="deleteTeam"
            >
              Supprimer la team
            </base-button-inline>

            <base-button-inline
              v-if="!isOwner"
              warning
              icon="exit"
              type="button"
              @click.prevent="leaveTeam"
            >
              Quitter la team
            </base-button-inline>
          </template>
        </FormDescription>
      </template>

      <base-label for="name">Nom de la team</base-label>
      <base-input
        id="name"
        v-model="team.name"
        required
        minlength="1"
        :disabled="!isAdmin"
      />
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
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import RootState from '~/store'
import { DialogType } from '~/types/dialog'
import { NotificationType } from '~/types/notification'

export default defineComponent({
  name: 'Settings',
  layout: 'dashboard',
  middleware({ store, redirect }) {
    if (!store.state.auth.user.team) {
      redirect('/dashboard')
    }
  },
  setup() {
    // Context
    const store = useStore<RootState>()
    const ctx = useContext()
    const router = useRouter()

    // Data
    const user = store.state.auth.user!
    const teamState = store.state.team.team!
    const team = ref(_.cloneDeep(teamState))

    // Computed
    const isOwner = computed(() => store.getters['team/isOwner'])
    const isAdmin = computed(() => store.getters['team/isAdmin'])
    const hasChanges = computed((): boolean => {
      return !_.isEqual(team.value, teamState)
    })

    // Methods
    const deleteTeam = (): void => {
      ctx.$dialog({
        type: DialogType.Error,
        title: 'Êtes-vous sur de supprimer la team ?',
        message:
          'Toutes les données associées seront supprimées et irrécupérables.',
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await deleteTeamCallback(),
      })
    }

    const deleteTeamCallback = async () => {
      const fn = ctx.$fire.functions.httpsCallable('deleteTeam', {
        timeout: 2000,
      })

      try {
        const res = await fn({ teamId: user.team })

        if (res.data.success) {
          ctx.$notify('La team à été supprimée', NotificationType.SUCCESS)

          await changeTeam()
        } else {
          throw new Error('team was not deleted')
        }
      } catch (e) {
        console.error(e)
        ctx.$notify('Impossible de supprimer la team', NotificationType.ERROR)
      }
    }

    const leaveTeam = (): void => {
      ctx.$dialog({
        type: DialogType.Warning,
        title: 'Êtes-vous sur de quitter la team ?',
        message:
          'Si vous voulez revenir dans cette team, le propriétaire devra vous inviter à nouveau.',
        showCancel: true,
        actionMessage: 'Quitter',
        callback: async () => await leaveTeamCallback(),
      })
    }

    const leaveTeamCallback = async (): Promise<void> => {
      const fn = ctx.$fire.functions.httpsCallable('leaveTeam', {
        timeout: 2000,
      })

      try {
        const response = await fn({ teamId: user.team })

        if (response.data.success) {
          ctx.$notify('Vous avez quitté la team.', NotificationType.SUCCESS)

          await changeTeam()
        } else {
          throw new Error('cannot leave team')
        }
      } catch (e) {
        console.error(e)
        ctx.$notify('Impossible de quitter la team', NotificationType.ERROR)
      }
    }

    const changeTeam = async () => {
      // Switch to profile
      await store.dispatch('team/switchTeam')

      // Reload teams
      await store.dispatch('team/getTeams', false)

      // Redirect to dashboard
      router.push('/dashboard')
    }

    const updateTeam = (): void => {
      // Update
      ctx.$fire.firestore
        .collection('teams')
        .doc(user.team!)
        .update(team.value)
        .then(() => {
          ctx.$notify(
            'Les paramètres ont étés sauvegardés.',
            NotificationType.SUCCESS
          )

          // Reload team
          store.commit('team/SET_TEAM', team.value)
        })
        .catch(() => {
          ctx.$notify(
            'Une erreur est survenue lors de la sauvegarde.',
            NotificationType.WARNING
          )
        })
    }

    return {
      team,
      hasChanges,
      isOwner,
      isAdmin,
      deleteTeam,
      leaveTeam,
      updateTeam,
    }
  },
  head: {
    title: 'Paramètres de la team',
  },
})
</script>
