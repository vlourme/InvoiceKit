<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" color="#24272b" app width="300">
      <v-list>
        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-list-item v-bind="attrs" link class="px-4" v-on="on">
              <v-list-item-avatar>
                <v-img :src="user.image"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="title">
                  {{ user.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list dense>
            <v-list-item link to="/account/settings">
              <v-list-item-title>Paramètres du compte</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="logout">
              <v-list-item-title>Se déconnecter</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-item
          v-for="link in links"
          :key="link.route"
          :to="link.route"
          :disabled="link.teamRequired && !user.team"
          :color="!link.teamRequired ? 'primary' : ''"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ link.name }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <v-list dense>
          <v-menu>
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-briefcase</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ teamName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>Espace de travail</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>

            <v-list dense>
              <v-list-item
                v-for="(team, key) in teams"
                :key="team.name"
                link
                @click="switchTeam(key)"
              >
                <v-list-item-icon v-if="user.team === key">
                  <v-icon>mdi-check</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ team.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="teams.length > 0"></v-divider>
              <v-list-item link to="/teams/create">
                <v-list-item-title>Créer une team</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="user.team" link to="/teams/settings">
                <v-list-item-title>Paramètres de la team</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main class="main-bg">
      <nuxt></nuxt>
    </v-main>

    <!-- Plugins -->
    <notification></notification>
    <Dialog></Dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend({
  name: 'Dashboard',
  middleware: 'auth',
  data: () => ({
    links: [
      {
        route: '/dashboard',
        name: 'Accueil',
        icon: 'mdi-home',
        teamRequired: false,
      },
      {
        route: '/customers',
        name: 'Clients',
        icon: 'mdi-account-multiple',
        teamRequired: true,
      },
      {
        route: '/invoices',
        name: 'Factures',
        icon: 'mdi-table',
        teamRequired: true,
      },
    ],
  }),
  computed: {
    ...mapState('auth', ['auth', 'user']),
    ...mapState('team', ['teams']),
    teamName() {
      return !this.user.team ? 'Personnel' : this.teams[this.user.team].name
    },
    drawer: {
      get() {
        return this.$store.state.sidebar.drawer
      },
      set(val) {
        this.$store.commit('sidebar/SET_DRAWER', val)
      },
    },
  },
  methods: {
    ...mapActions('team', ['switchTeam']),

    async logout() {
      await this.$fire.auth.signOut()

      await this.$router.push({ path: '/' })
    },
  },
})
</script>

<style scoped>
.main-bg {
  background: #07070a;
}
</style>
