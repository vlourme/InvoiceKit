<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title>Gerer les membres</template>
      <template #description>
        Gerer les membres de cet espace de travail
      </template>
      <template #actions>
        <button
          v-if="isAdmin"
          class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
          @click.prevent="dialog = true"
        >
          <i class="bx bx-plus mr-2"></i>
          Ajouter un membre
        </button>
      </template>
    </FormDescription>

    <div class="col-span-2 mx-2 bg-gray-50 rounded-lg py-2">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-4 font-medium text-gray-600">Nom</th>
              <th class="text-left p-4 font-medium text-gray-600">Email</th>
              <th class="text-left p-4 font-medium text-gray-600">
                Permissions
              </th>
              <th class="p-4 font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, idx) in members" :key="idx">
              <td class="px-4 py-3 font-semibold">{{ member.name }}</td>
              <td class="px-4 py-3">{{ member.email }}</td>
              <td class="px-4 py-3">{{ getRole(member) }}</td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="isAdmin"
                  type="button"
                  class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                  @click.prevent="editUser(member, idx)"
                >
                  Modifier
                </button>

                <button
                  v-if="isAdmin"
                  type="button"
                  class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                  @click.prevent="kickUser(member, idx)"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <form @submit.prevent="addMember">
      <Modal :activator.sync="dialog">
        <template #title>
          {{ update > -1 ? 'Modifier un membre' : 'Ajouter un membre' }}
        </template>
        <template #icon>
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <i class="bx bxs-user text-indigo-600 text-xl"></i>
          </div>
        </template>
        <template #content>
          <div
            v-if="error"
            class="mt-2 bg-red-400 bg-opacity-30 rounded-md px-4 py-2"
          >
            {{ error }}
          </div>
          <div class="mt-2">
            <label class="text-sm text-gray-500" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              :disabled="!isAdmin || update > -1"
              :readonly="update > -1"
              type="text"
              required
              :class="{ 'opacity-60': update > -1 }"
              class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
            />
          </div>
          <div class="mt-2">
            <label class="text-sm text-gray-500" for="role">Permissions</label>
            <div class="relative w-full">
              <select
                id="role"
                v-model="role"
                :disabled="!isAdmin"
                required
                class="w-full inline-block appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
              >
                <template v-for="item in roles">
                  <option :key="item.value" :value="item.value">
                    {{ item.text }}
                  </option>
                </template>
              </select>
              <div
                class="pointer-events-none absolute inset-y-0 right-0 flex items-center mt-0.5 pr-3"
              >
                <i class="bx bx-down-arrow-alt text-xl"></i>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <button
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </button>

          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="closeDialog"
          >
            Annuler
          </button>
        </template>
      </Modal>
    </form>
  </div>
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
    getRole(user: User): string {
      switch (this.team.members[user.$key!]) {
        case MemberPermission.Editor:
          return 'Editeur'
        case MemberPermission.Admin:
          return 'Administrateur'
        case MemberPermission.Viewer:
        default:
          return 'Lecteur'
      }
    },

    async addMember(): Promise<void> {
      // Check for update
      if (this.update > -1) {
        // Get member
        const member = this.members[this.update]

        this.team.members[member.$key!] = this.role
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
