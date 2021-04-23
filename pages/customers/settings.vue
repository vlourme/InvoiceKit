<template>
  <form @submit.prevent="saveTeam">
    <Header>
      Paramètres pour les fiches clients
      <template #actions>
        <base-nav-button :disabled="!hasPrimaryKey" type="submit">
          Enregistrer
        </base-nav-button>
      </template>
    </Header>

    <extensions-fields :extension.sync="extension" />

    <form-box>
      <template #description>
        <FormDescription>
          <template #title>Formatage</template>
          <template #description>
            Le formatage correspond a l'affichage du client, si vous voulez
            qu'il apparaisse toujours avec d'autres champs, indiquez-les ici.
          </template>
        </FormDescription>
      </template>

      <div class="mt-2">
        <base-label for="format">Formatage du nom d'affichage</base-label>
        <base-input
          id="format"
          v-model="extension.formatting"
          type="text"
          required
        />
      </div>
    </form-box>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import RootState from '~/store'
import { defaultTeam } from '~/types/team'
import { NotificationType } from '~/types/notification'
import useExtension from '~/composables/useExtension'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()

    // Data
    const team = ref(defaultTeam())

    // Computed
    const isAdmin = computed(() => store.getters['team/isAdmin'])
    const { state, setState, hasPrimaryKey } = useExtension()

    // On mount
    useFetch(() => {
      team.value = _.cloneDeep(store.state.team.team!)
      setState(team.value.extensions.customers)
    })

    const saveTeam = async () => {
      await ctx.$fire.firestore
        .collection('teams')
        .doc(team.value.$key!)
        .update(team.value)

      ctx.$notify(
        'Les changements ont étés enregistrés',
        NotificationType.SUCCESS
      )
    }

    return {
      ...state,
      hasPrimaryKey,
      isAdmin,
      saveTeam,
    }
  },
})
</script>
