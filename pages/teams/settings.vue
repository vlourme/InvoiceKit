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

    <teams-members class="my-4"></teams-members>

    <teams-identity class="my-4"></teams-identity>

    <teams-localization class="my-4"></teams-localization>

    <teams-rendering class="my-4"></teams-rendering>

    <teams-fields class="my-4"></teams-fields>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  useContext,
  useFetch,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import useTeam from '~/composables/useTeam'
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
    const ctx = useContext()
    const store = useStore<RootState>()
    const router = useRouter()

    // Service
    const { state, isAdmin, isOwner, load, save, remove, leave } = useTeam()

    // Fetch
    useFetch(async () => {
      await load()
    })

    // Methods
    const updateTeam = async () => {
      if (await save()) {
        ctx.$notify(
          'Les paramètres ont étés sauvegardés.',
          NotificationType.SUCCESS
        )
      } else {
        ctx.$notify(
          'Une erreur est survenue lors de la sauvegarde.',
          NotificationType.WARNING
        )
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
        callback: async () => await leaveCallback(),
      })
    }

    const leaveCallback = async () => {
      if (!(await leave())) {
        ctx.$notify('Impossible de quitter la team', NotificationType.WARNING)
      }

      ctx.$notify('Vous avez quitté la team', NotificationType.SUCCESS)
      await changeTeam()
    }

    const deleteTeam = () => {
      ctx.$dialog({
        type: DialogType.Error,
        title: 'Êtes-vous sur de supprimer la team ?',
        message:
          'Toutes les données associées seront supprimées et irrécupérables.',
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: async () => await deleteCallback(),
      })
    }

    const deleteCallback = async () => {
      if (!(await remove())) {
        ctx.$notify('Impossible de supprimer la team', NotificationType.ERROR)
      }

      await changeTeam()
    }

    const changeTeam = async () => {
      // Switch to profile
      await store.dispatch('team/switchTeam')

      // Reload teams
      await store.dispatch('team/getTeams', false)

      // Redirect to dashboard
      router.push('/dashboard')
    }

    return { ...state, isAdmin, isOwner, updateTeam, deleteTeam, leaveTeam }
  },
  head: {
    title: 'Paramètres de la team',
  },
})
</script>
