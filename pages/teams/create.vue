<template>
  <Header>
    <template #title>Créer une team</template>

    <template #actions>
      <v-btn :elevation="0" @click="createTeam">
        <v-icon left>mdi-check</v-icon>
        Créer
      </v-btn>
    </template>

    <Card no-divider no-toolbar>
      <v-form v-model="valid">
        <v-text-field
          label="Propriétaire"
          readonly
          disabled
          :value="user.name"
        ></v-text-field>

        <v-text-field
          v-model="name"
          label="Nom de la team"
          :rules="rules.name"
          placeholder="John Doe"
        ></v-text-field>
      </v-form>
    </Card>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'
import { Team, RenderingSignature } from '~/types/team'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  data: () => ({
    valid: false,
    rules: {
      name: [
        (v: string) => !!v || 'Le nom est requis.',
        (v: string) =>
          v.length < 20 || 'Le nom doit faire maximum 20 caractères',
      ],
    },
    name: '',
  }),
  head: {
    title: 'Créer une team',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
  },
  methods: {
    async createTeam(): Promise<void> {
      // Check validity
      if (!this.valid) {
        return
      }

      // Create team
      const team: Team = {
        name: this.name,
        members: {
          [this.auth.uid]: 2,
        },
        owner: this.auth.uid,
        signature: RenderingSignature.Both,
        accentEnabled: false,
        quantityEnabled: true,
        title: null,
        juridicalTitle: null,
        email: null,
        phone: null,
        website: null,
        street: null,
        zip: null,
        city: null,
        country: null,
        accent: null,
        $key: null,
        fields: [],
      }

      const doc = await this.$fire.firestore.collection('teams').add(team)

      // Change team
      this.$store.dispatch('switchTeam', doc.id)

      // Redirect to settings
      this.$router.push('/teams/settings')
    },
  },
})
</script>
