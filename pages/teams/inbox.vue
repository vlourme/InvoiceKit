<template>
  <div>
    <Header> Invitations </Header>

    <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
      <FormDescription>
        <template #title>Invitations</template>
        <template #description>
          Vous verrez ici vos invitations pour entrer dans une team et
          collaborer.
        </template>
      </FormDescription>

      <div class="col-span-2 mx-2 bg-gray-50 rounded-lg py-2">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left px-4 py-2 font-medium text-gray-600">
                  Nom de la team
                </th>
                <th class="text-left px-4 py-2 font-medium text-gray-600">
                  Permissions
                </th>
                <th class="text-left px-4 py-2 font-medium text-gray-600">
                  Propriétaire
                </th>
                <th class="text-right"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invite in invites" :key="invite.$key">
                <td class="px-4 py-3">{{ invite.name }}</td>
                <td class="px-4 py-3">{{ getPermission(invite.role) }}</td>
                <td class="px-4 py-3">{{ invite.owner }}</td>
                <td class="px-4 py-3 text-right">
                  <button
                    class="text-blue-500 hover:text-blue-600 transition-colors focus:outline-none mr-2"
                    @click.prevent="join(invite)"
                  >
                    Rejoindre la team
                  </button>
                  <button
                    class="text-red-500 hover:text-red-600 transition-colors focus:outline-none"
                    @click.prevent="reject(invite)"
                  >
                    Rejeter
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p
            v-if="invites.length === 0"
            class="w-full inline-flex justify-center items-center font-semibold text-gray-600 py-4"
          >
            Aucune invitations
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { mapSnapshot } from '~/helpers/documentMapper'
import RootState from '~/store'
import { Invite } from '~/types/invite'
import getPermission from '~/composables/useMemberPermission'
import { NotificationType } from '~/types/notification'

export default defineComponent({
  name: 'Settings',
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()
    const router = useRouter()

    // Computed
    const auth = computed(() => store.state.auth.auth)

    // Data
    const invites = ref<Invite[]>([])

    // Mount
    onMounted(() => {
      ctx.$fire.firestore
        .collection('users')
        .doc(auth.value?.uid)
        .collection('invites')
        .onSnapshot((snapshot) => {
          invites.value = mapSnapshot<Invite>(snapshot)
        })
    })

    // Methods
    const acceptInvite = ctx.$fire.functions.httpsCallable('acceptInvite')

    const join = async (invite: Invite) => {
      const response = await acceptInvite({
        inviteId: invite.$key,
      })

      if (!response.data.success) {
        ctx.$notify('Impossible de rejoindre la team', NotificationType.ERROR)
      } else {
        store.dispatch('team/switchTeam', invite.teamId)
        router.push('/dashboard')
      }
    }

    const reject = async (invite: Invite) => {
      await ctx.$fire.firestore
        .collection('users')
        .doc(auth.value?.uid)
        .collection('invites')
        .doc(invite.$key)
        .delete()

      ctx.$notify("L'invitation à été supprimée.", NotificationType.INFO)
    }

    return { invites, join, reject, getPermission }
  },
  head: {
    title: 'Invitations',
  },
})
</script>
