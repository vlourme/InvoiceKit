<template>
  <div>
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
        <base-label for="name">Propriétaire</base-label>
        <base-input id="name" :value="user.name" disabled readonly />
      </div>

      <div class="mt-2">
        <base-label for="name">Nom de la team</base-label>
        <base-input
          id="name"
          v-model="name"
          required
          minlength="1"
          maxlength="20"
        />
      </div>
    </FormBox>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'
import { Team, defaultTeam, MemberPermission } from '~/types/team'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  data: () => ({
    name: '',
  }),
  head: {
    title: 'Créer une team',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
  },
  methods: {
    ...mapActions('team', ['getTeams', 'switchTeam']),

    async createTeam(): Promise<void> {
      // Create team
      const team: Team = {
        ...defaultTeam(),
        name: this.name,
        owner: this.user.$key,
        members: {
          [this.user.$key]: MemberPermission.Admin,
        },
      }

      const doc = await this.$fire.firestore.collection('teams').add(team)

      // Reload teams
      await this.getTeams(false)

      // Change team
      await this.switchTeam(doc.id)

      // Redirect to settings
      this.$router.push('/teams/settings')
    },
  },
})
</script>
