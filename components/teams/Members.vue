<template>
  <Card>
    <template #title> Gérer les membres </template>

    <template #actions>
      <v-btn v-if="isAdmin" text @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        Ajouter un membre
      </v-btn>
    </template>

    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Membre</th>
            <th class="text-left">Permissions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, idx) in members" :key="user.$key">
            <td>{{ user.name }}</td>
            <td>
              <v-chip v-if="user.$key === team.owner" color="success">
                Propriétaire
              </v-chip>

              <v-chip v-else-if="getRole(user) == 2" color="error">
                Administrateur
              </v-chip>

              <v-chip v-else-if="getRole(user) == 1" color="warning">
                Editeur
              </v-chip>

              <v-chip v-else-if="getRole(user) == 0" color="primary">
                Lecteur
              </v-chip>
            </td>
            <td class="text-right">
              <template
                v-if="
                  isAdmin &&
                  user.$key !== team.owner &&
                  user.$key !== userState.$key
                "
              >
                <v-btn icon @click="editUser(user, idx)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <v-btn icon @click="kickUser(user, idx)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-dialog v-model="dialog" width="500" @click:outside="closeDialog">
      <v-card>
        <v-card-title>
          {{ update > -1 ? 'Editer un membre' : 'Ajouter un membre' }}
        </v-card-title>

        <v-card-text>
          <v-alert v-if="error" type="error">
            {{ error }}
          </v-alert>

          <v-text-field
            v-model="email"
            label="Email du membre"
            :disabled="update > -1"
            placeholder="john.doe@example.com"
          ></v-text-field>

          <v-select
            v-model="role"
            :items="roles"
            label="Permissions du membre"
          />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" text @click="addMember">
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { MemberPermission, Team } from '@/types/team'
import { mapGetters, mapState } from 'vuex'
import User from '~/types/user'
import { mapDocument } from '~/helpers/documentMapper'
import { DialogType } from '~/types/dialog'

export default Vue.extend({
  name: 'Members',
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    members: [] as User[],
    dialog: false,
    email: '',
    update: -1,
    role: MemberPermission.Editor,
    roles: [
      {
        text: 'Lecteur',
        value: MemberPermission.Viewer,
      },
      {
        text: 'Editeur',
        value: MemberPermission.Editor,
      },
      {
        text: 'Administrateur',
        value: MemberPermission.Admin,
      },
    ],
    error: '',
  }),
  async fetch() {
    // Load members
    for (const uid in this.team.members) {
      const doc = await this.$fire.firestore.collection('users').doc(uid).get()

      this.members.push(mapDocument<User>(doc))
    }

    // Sort by permissions
    this.members.sort(
      (a, b) => this.team.members[b.$key!] - this.team.members[a.$key!]
    )
  },
  computed: {
    ...mapGetters('team', ['isAdmin']),
    ...mapState('auth', {
      userState: 'user',
    }),
    team: {
      get(): Team {
        return this.teamState
      },

      set(value: Team): void {
        this.$emit('update:team', value)
      },
    },
  },
  methods: {
    getRole(user: User): MemberPermission {
      return this.team.members[user.$key!]
    },

    async addMember(): Promise<void> {
      // Check for update
      if (this.update > -1) {
        // Get member
        const member = this.members[this.update]

        this.team.members[member.$key] = this.role
      } else {
        // Search for user
        const doc = await this.$fire.firestore
          .collection('users')
          .where('email', '==', this.email)
          .limit(1)
          .get()

        // Check if empty
        if (doc.empty) {
          this.error = "Aucun membre n'a été trouvé pour cet email."
          return
        }

        // Check if already in team
        if (this.team.members[doc.docs[0].id]) {
          this.error = 'Ce membre est déjà dans la team.'
          return
        }

        // Add user
        this.team.members[doc.docs[0].id] = this.role
        this.members.push(mapDocument<User>(doc.docs[0]))
      }

      // Close dialog
      this.closeDialog()
    },

    editUser(user: User, idx: number): void {
      this.update = idx
      this.email = user.email
      this.role = this.team.members[user.$key!]
      this.dialog = true
    },

    closeDialog(): void {
      this.error = ''
      this.email = ''
      this.role = MemberPermission.Editor
      this.update = -1
      this.dialog = false
    },

    kickUser(user: User, idx: number): void {
      this.$dialog({
        type: DialogType.Error,
        title: 'Supprimer ce membre ?',
        message:
          'Vous pourrez le re-inviter plus tard, aucune donnée ne sera perdue.',
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: () => {
          delete this.team.members[user.$key!]
          this.members.splice(idx, 1)
        },
      })
    },
  },
})
</script>
