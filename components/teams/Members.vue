<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <FormDescription>
      <template #title>Gerer les membres</template>
      <template #description>
        Gerer les membres de cet espace de travail
      </template>
      <template #actions>
        <base-button-inline
          v-if="isAdmin"
          info
          icon="plus"
          @click.prevent="dialog = true"
        >
          Ajouter un membre
        </base-button-inline>
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
              <td class="px-4 py-3">
                {{ getRole(team.members[member.$key]) }}
              </td>
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
          <base-modal-icon icon="user" />
        </template>
        <template #content>
          <div
            v-if="error"
            class="mt-2 bg-red-400 bg-opacity-30 rounded-md px-4 py-2"
          >
            {{ error }}
          </div>
          <div class="mt-2">
            <base-label for="email">Email</base-label>
            <base-input
              id="email"
              v-model="email"
              :disabled="!isAdmin || update > -1"
              :readonly="update > -1"
              type="text"
              required
              :class="{ 'opacity-60': update > -1 }"
            />
          </div>
          <div class="mt-2">
            <base-label for="role">Permissions</base-label>
            <base-select
              id="role"
              v-model="role"
              :disabled="!isAdmin"
              required
              :items="roles"
            />
          </div>
        </template>
        <template #footer>
          <base-button success type="submit">
            {{ update > -1 ? 'Mettre à jour' : 'Ajouter' }}
          </base-button>

          <base-button base type="button" @click="closeDialog">
            Annuler
          </base-button>
        </template>
      </Modal>
    </form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropOptions,
  ref,
  useContext,
  useFetch,
  useStore,
} from '@nuxtjs/composition-api'
import useTeam from './useTeam'
import RootState from '~/store'
import { MemberPermission, Team } from '~/types/team'
import User from '~/types/user'
import { SelectItem } from '~/types/UI'
import { mapDocument } from '~/helpers/documentMapper'
import { DialogType } from '~/types/dialog'
import getRole from '~/composables/useMemberPermission'

export default defineComponent({
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  setup(props, { emit }) {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()

    // Data
    const members = ref<User[]>([])
    const dialog = ref(false)
    const email = ref('')
    const update = ref(-1)
    const error = ref('')
    const role = ref(MemberPermission.Editor)
    const roles: SelectItem[] = [
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
    ]

    // Computed
    const { team, isAdmin } = useTeam(props, emit)
    const user = computed(() => store.state.auth.user)

    // Fetch
    useFetch(async () => {
      // Load members
      for (const uid in team.value.members) {
        const doc = await ctx.$fire.firestore.collection('users').doc(uid).get()

        members.value.push(mapDocument<User>(doc))
      }

      // Sort by permissions
      members.value.sort(
        (a, b) => team.value.members[b.$key!] - team.value.members[a.$key!]
      )
    })

    // Methods
    const addMember = async (): Promise<void> => {
      // Check for update
      if (update.value > -1) {
        // Get member
        const member = members.value[update.value]

        team.value.members[member.$key!] = role.value
      } else {
        // Search for user
        const doc = await ctx.$fire.firestore
          .collection('users')
          .where('email', '==', email.value)
          .limit(1)
          .get()

        // Check if empty
        if (doc.empty) {
          error.value = "Aucun membre n'a été trouvé pour cet email."
          return
        }

        // Check if already in team
        if (team.value.members[doc.docs[0].id]) {
          error.value = 'Ce membre est déjà dans la team.'
          return
        }

        // Add user
        team.value.members[doc.docs[0].id] = role.value
        members.value.push(mapDocument<User>(doc.docs[0]))
      }

      // Close dialog
      closeDialog()
    }

    const editUser = (user: User, idx: number): void => {
      update.value = idx
      email.value = user.email
      role.value = team.value.members[user.$key!]
      dialog.value = true
    }

    const closeDialog = (): void => {
      error.value = ''
      email.value = ''
      role.value = MemberPermission.Editor
      update.value = -1
      dialog.value = false
    }

    const kickUser = (user: User, idx: number): void => {
      ctx.$dialog({
        type: DialogType.Error,
        title: 'Supprimer ce membre ?',
        message:
          'Vous pourrez le re-inviter plus tard, aucune donnée ne sera perdue.',
        showCancel: true,
        actionMessage: 'Supprimer',
        callback: () => {
          delete team.value.members[user.$key!]
          members.value.splice(idx, 1)
        },
      })
    }

    return {
      members,
      dialog,
      email,
      update,
      error,
      role,
      roles,
      team,
      isAdmin,
      user,
      getRole,
      addMember,
      editUser,
      closeDialog,
      kickUser,
    }
  },
})
</script>
