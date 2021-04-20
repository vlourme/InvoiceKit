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
              <td class="px-4 py-3 font-semibold">
                <div class="inline-flex items-center">
                  <img :src="member.image" class="h-8 w-8 rounded-full mr-2" />
                  {{ member.name }}
                </div>
              </td>
              <td class="px-4 py-3">{{ member.email }}</td>
              <td class="px-4 py-3">
                {{ getRole(team.members[member.$key]) }}
              </td>
              <td class="px-4 py-3 text-right">
                <div v-if="isAdmin && member.$key !== team.owner">
                  <button
                    type="button"
                    class="text-sm font-semibold text-indigo-400 hover:text-indigo-500 inline-flex items-center focus:outline-none"
                    @click.prevent="editUser(member, idx)"
                  >
                    Modifier
                  </button>

                  <button
                    type="button"
                    class="ml-4 text-sm font-semibold text-red-400 hover:text-red-500 inline-flex items-center focus:outline-none"
                    @click.prevent="kickUser(member, idx)"
                  >
                    Supprimer
                  </button>
                </div>
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
  defineComponent,
  reactive,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
import { MemberPermission } from '~/types/team'
import User from '~/types/user'
import { DialogType } from '~/types/dialog'
import getRole from '~/composables/useMemberPermission'
import { NotificationType } from '~/types/notification'
import useTeam from '~/composables/useTeam'

export default defineComponent({
  setup() {
    // Context
    const ctx = useContext()

    // Data
    const data = reactive({
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
          text: 'Éditeur',
          value: MemberPermission.Editor,
        },
        {
          text: 'Administrateur',
          value: MemberPermission.Admin,
        },
      ],
    })

    // Computed
    const { state, user, isAdmin } = useTeam()

    // Methods
    const invite = ctx.$fire.functions.httpsCallable('inviteUser')

    const addMember = async (): Promise<void> => {
      // Check for update
      if (data.update > -1) {
        // Get member
        const member = state.members.value[data.update]

        state.team.value.members[member.$key!] = data.role
      } else {
        // Add user
        const response = await invite({
          email: data.email,
          teamId: state.team.value.$key,
          role: data.role,
        })

        if (!response.data.success) {
          ctx.$notify(
            "Impossible d'inviter cet utilisateur",
            NotificationType.ERROR
          )
        } else {
          ctx.$notify('Le membre à été invité.', NotificationType.SUCCESS)
        }
      }

      // Close dialog
      closeDialog()
    }

    const editUser = (user: User, idx: number): void => {
      data.update = idx
      data.email = user.email
      data.role = state.team.value.members[user.$key!]
      data.dialog = true
    }

    const closeDialog = (): void => {
      data.update = -1
      data.email = ''
      data.role = MemberPermission.Editor
      data.dialog = false
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
          delete state.team.value.members[user.$key!]
          state.members.value.splice(idx, 1)
        },
      })
    }

    return {
      ...state,
      ...toRefs(data),
      user,
      isAdmin,
      getRole,
      addMember,
      editUser,
      closeDialog,
      kickUser,
    }
  },
})
</script>
