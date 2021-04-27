<template>
  <form @submit.prevent="createTeam">
    <Header>
      Créer une team

      <template #actions>
        <base-nav-button type="submit"> Créer </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Créer une team</template>
          <template #description
            >Créer une team afin de collaborer avec plusieurs personnes sur les
            mêmes documents.</template
          >
        </FormDescription>
      </template>

      <div class="mt-2">
        <base-label for="user">Propriétaire</base-label>
        <base-input id="user" :value="user.name" disabled readonly />
      </div>

      <div class="mt-2">
        <base-label for="name">Nom de la team</base-label>
        <base-input
          id="name"
          v-model.trim="name"
          required
          minlength="1"
          maxlength="20"
        />
      </div>
    </FormBox>
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
import RootState from '~/store'
import { defaultTeam, MemberPermission, Team } from '~/types/team'

export default defineComponent({
  name: 'CreateTeam',
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()
    const ctx = useContext()
    const router = useRouter()

    // Data
    const name = ref('')

    // Computed
    const user = computed(() => store.state.auth.user!)

    // Methods
    const createTeam = async (): Promise<void> => {
      // Create team
      const team: Team = {
        ...defaultTeam(),
        name: name.value,
        owner: user.value?.$key!,
        members: {
          [user.value?.$key!]: MemberPermission.Admin,
        },
      }

      // Create reference
      const doc = await ctx.$fire.firestore.collection('teams').add(team)

      // Reload teams
      await store.dispatch('team/getTeams', false)

      // Change team
      await store.dispatch('team/switchTeam', doc.id)

      // Redirect to settings
      router.push('/teams/settings')
    }

    return { name, user, createTeam }
  },
  head: {
    title: 'Créer une team',
  },
})
</script>
