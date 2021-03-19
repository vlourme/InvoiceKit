<template>
  <div>
    <Header>
      <template #title>Tableau de bord</template>

      <v-row v-if="team">
        <v-col>
          <v-card>
            <v-card-text>
              <p class="display-1 text--primary">
                {{ getCounter('INVOICE') }}
              </p>
              <p>Factures</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <v-card-text>
              <p class="display-1 text--primary">
                {{ getCounter('QUOTE') }}
              </p>
              <p>Devis</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <v-card-text>
              <p class="display-1 text--primary">
                {{ getCounter('customers') }}
              </p>
              <p>Clients</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div v-else class="d-flex flex-column align-center my-4">
        <v-icon x-large color="error" class="my-4">mdi-briefcase</v-icon>

        <v-card :width="344" class="my-4">
          <v-card-title>Créer une team</v-card-title>
          <v-card-text>
            Une team est obligatoire pour utiliser InvoiceKit.
          </v-card-text>
          <v-card-actions>
            <v-spacer />

            <v-btn to="/teams/create" text color="success"> Continuer </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </Header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Dashboard',
  layout: 'dashboard',
  fetch() {},
  head: () => ({
    title: 'Tableau de bord',
  }),
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('team', ['team']),
  },
  methods: {
    getCounter(value: string): number {
      if (!this.team.counter) {
        return 0
      }

      return this.team.counter[value] ?? 0
    },
  },
})
</script>
