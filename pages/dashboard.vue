<template>
  <div>
    <Header>
      Tableau de bord

      <template #actions>
        <Dropdown>
          <base-nav-button>
            <span v-if="team">
              {{ team.name }}
            </span>
            <span v-else> Aucune team </span>
          </base-nav-button>

          <template #content>
            <div class="divide-y">
              <div v-if="teams" class="py-1">
                <button
                  v-for="(team, id, idx) in teams"
                  :key="idx"
                  :class="{ 'bg-blue-100': id === user.team }"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none w-full text-left"
                  role="menuitem"
                  @click="switchTeam(id)"
                >
                  {{ team.name }}
                </button>
              </div>
              <div class="py-1">
                <nuxt-link
                  to="/teams/create"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Créer une team
                </nuxt-link>
                <nuxt-link
                  to="/teams/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Paramètres de la team
                </nuxt-link>
              </div>
            </div>
          </template>
        </Dropdown>
      </template>
    </Header>

    <div v-if="team" class="p-4 grid grid-cols-3 gap-4">
      <div
        v-for="item in analytics"
        :key="item.value"
        class="bg-gray-100 rounded-lg px-4 py-2"
      >
        <p class="text-2xl font-bold">{{ getCounter(item.value) }}</p>
        <p class="font-light">{{ item.name }}</p>
      </div>
    </div>

    <p v-else class="p-2 max-w-3xl">
      <span class="font-bold text-lg"> Qu'est-ce que InvoiceKit ? </span>

      <br /><br />

      InvoiceKit est un outil de gestion de facturation. Il permet de créer des
      fiches clients, de leur assigner des informations, des adresses, etc. Bien
      evidemment de créer des factures, de les imprimer, etc.
      <br /><br />
      Nos objectifs d'ici peu de temps sont de proposer plus de customisation,
      le support des contrats/abonnements et plusieurs modèles d'impression de
      factures.
      <br /><br />
      Notre but est de proposer un produit très simple d'utilisation, facile à
      mettre en place que ce soit pour une personne seule ou une équipe de 10
      personnes et qui n'utilise que les informations dont il a besoin.

      <br />
      <br />

      <span class="font-bold text-lg">Commencer à utiliser InvoiceKit</span>

      <br /><br />

      Avant toutes choses, vous devez faire partie d'une team (ou espace de
      travail). Une fois dans une team vous pourrez utiliser le plein potentiel
      d'InvoiceKit.

      <br /><br />

      Créer sa propre team prend moins de 30 secondes. Rendez-vous sur la page
      <nuxt-link class="text-blue-600 border-b-2" to="/teams/create"
        >créer une team</nuxt-link
      >
      et renseignez le nom de votre team (ce nom peut-être le nom de votre
      entreprise par exemple). Ensuite, confirmez la création et c'est bon!

      <br /><br />

      Si vous souhaitez faire partie d'une team, donnez tout simplement
      l'adresse mail avec laquelle vous vous êtes inscrit à l'administrateur de
      la team, celui-ci pourra vous envoyer une invitation.

      <br /><br />
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'

export default Vue.extend({
  name: 'Dashboard',
  layout: 'dashboard',
  data: () => ({
    analytics: [
      {
        value: 'INVOICE',
        name: 'Factures',
      },
      {
        value: 'QUOTE',
        name: 'Devis',
      },
      {
        value: 'customers',
        name: 'Clients',
      },
    ],
  }),
  head: () => ({
    title: 'Tableau de bord',
  }),
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('team', ['team', 'teams']),
  },
  methods: {
    ...mapActions('team', ['switchTeam']),

    getCounter(value: string): number {
      if (!this.team.counter) {
        return 0
      }

      return this.team.counter[value] ?? 0
    },
  },
})
</script>
