<template>
  <div class="min-h-screen">
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
              <div v-if="teams && Object.keys(teams).length > 0" class="py-1">
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
                  to="/teams/inbox"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Invitations
                </nuxt-link>
                <nuxt-link
                  v-if="team"
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

    <div v-if="team" class="p-4 md:grid grid-cols-3 gap-4">
      <charts-graph :data="customers"> Clients </charts-graph>
      <charts-graph :data="invoices"> Devis et factures </charts-graph>
      <charts-graph :data="paid"> Factures payées </charts-graph>
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
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
import RootState from '~/store'

export default defineComponent({
  name: 'Dashboard',
  layout: 'dashboard',
  setup() {
    // Context
    const store = useStore<RootState>()

    // Computed
    const user = computed(() => store.state.auth.user!)
    const teams = computed(() => store.state.team.teams)
    const team = computed(() => store.state.team.team)

    // Get data
    const data = reactive({
      customers: [] as number[],
      invoices: [] as number[],
      paid: [] as number[],
    })

    useFetch(() => {
      if (!team.value?.charts) {
        return
      }

      Object.keys(team.value.charts)
        .sort()
        .forEach((v) => {
          const day = team.value?.charts[v]

          data.customers.push(day?.customers ?? 0)
          data.invoices.push((day?.INVOICE ?? 0) + (day?.QUOTE ?? 0))
          data.paid.push(day?.PAID ?? 0)
        })
    })

    // Methods
    const switchTeam = async (id: string | null) => {
      await store.dispatch('team/switchTeam', id)
    }

    return { ...toRefs(data), user, teams, team, switchTeam }
  },
  head: {
    title: 'Tableau de bord',
  },
})
</script>
