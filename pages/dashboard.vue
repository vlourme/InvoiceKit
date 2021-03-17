<template>
  <div>
    <Header>
      <template #title>Tableau de bord</template>

      <v-row justify="center">
        <v-col>
          <v-card>
            <v-card-text>
              <p class="display-1 text--primary">
                {{ team.counter.invoices }}
              </p>
              <p>Factures</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <v-card-text>
              <p class="display-1 text--primary">
                {{ team.counter.customers }}
              </p>
              <p>Clients</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <v-card>
            <v-card-text>
              <p class="display-1 text--primary">
                {{ team.counter.addresses }}
              </p>
              <p>Adresses</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </Header>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
}
</script>

<style scoped></style>
