<template>
  <Card>
    <template #title> Gérer les membres </template>

    <template #actions>
      <v-btn text @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        Ajouter un membre
      </v-btn>
    </template>

    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Membre</th>
            <th class="text-left">Administrateur</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in members" :key="idx">
            <td>{{ user.name }}</td>
            <td>{{ user.id === team.owner ? 'Oui' : 'Non' }}</td>
            <td class="text-right">
              <v-btn v-if="user.id !== team.owner" icon @click="kickUser(idx)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Ajouter un membre </v-card-title>

        <v-card-text>
          <v-alert v-if="error" type="error">
            {{ error }}
          </v-alert>

          <v-text-field
            v-model="email"
            label="Email du membre"
            placeholder="john.doe@example.com"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" text @click="addMember">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import Team from '@/types/team'
import User from '~/types/user'

export default Vue.extend({
  name: 'Members',
  props: {
    team: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    members: [] as User[],
    teamModel: {} as Team,
    dialog: false,
    email: '',
    error: '',
  }),
  computed: {
    watchMembers() {
      return this.teamModel.members
    },
  },
  watch: {
    watchMembers() {
      this.$emit('update:team', this.teamModel)

      this.loadMembers()
    },
  },
  mounted() {
    // Clone
    this.teamModel = Object.assign({}, this.team)
  },
  methods: {
    loadMembers(): void {
      // Reset
      this.members = []

      // Load members
      this.team.members.forEach(async (member: string) => {
        const doc = await this.$fire.firestore
          .collection('users')
          .doc(member)
          .get()

        this.members.push({
          ...doc.data(),
          $key: member,
        } as User)
      })
    },

    async addMember(): Promise<void> {
      // Search for user
      const doc = await this.$fire.firestore
        .collection('users')
        .where('email', '==', this.email)
        .get()

      // Check if empty
      if (doc.empty) {
        this.error = "Aucun membre n'a été trouvé pour cet email."
        return
      }

      // Check if already in team
      if (this.teamModel.members.includes(doc.docs[0].id)) {
        this.error = 'Ce membre est déjà dans la team.'
        return
      }

      // Add user
      this.teamModel.members.push(doc.docs[0].id)

      // Reset variables
      this.error = ''
      this.email = ''
      this.dialog = false
    },

    kickUser(user: number): void {
      this.teamModel.members.splice(user, 1)
    },
  },
})
</script>
