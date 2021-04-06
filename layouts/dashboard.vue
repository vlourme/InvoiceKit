<template>
  <div class="font-body flex w-full h-screen bg-white divide-x">
    <nav class="flex flex-col h-screen max-w-xs w-full bg-gray-100">
      <div class="flex-1">
        <div class="p-6 flex justify-between items-center">
          <div class="text-3xl">
            <p class="font-medium text-gray-500">
              Invoice<span class="font-semibold text-gray-600">Kit</span>
            </p>
          </div>
          <Dropdown v-if="user">
            <img
              class="rounded-full h-11 w-11 cursor-pointer"
              :src="user.image"
              @click="open = !open"
            />

            <template #content>
              <div class="py-1" role="none">
                <nuxt-link
                  to="/account/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  >Paramètres du compte</nuxt-link
                >
                <a
                  class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  @click="logout"
                  >Se deconnecter</a
                >
              </div>
            </template>
          </Dropdown>
        </div>

        <aside class="px-6">
          <div v-for="link in links" :key="link.name" class="my-2">
            <p class="font-semibold text-xs uppercase text-gray-400">
              {{ link.name }}
            </p>
            <div class="py-1">
              <nuxt-link
                v-for="item in link.routes"
                :key="item.route"
                :to="item.route"
                :class="{
                  'bg-white rounded-md shadow': $route.path.startsWith(
                    item.route
                  ),
                }"
                class="my-2 flex items-center w-full py-2 px-3 text-gray-500 cursor-pointer group hover:bg-white hover:bg-opacity-50 rounded-md transition-colors"
              >
                <i
                  :class="{
                    [item.icon]: true,
                    'text-indigo-600': $route.path.startsWith(item.route),
                  }"
                  class="bx text-xl mr-4"
                ></i>

                <p
                  :class="{ 'font-bold': $route.path.startsWith(item.route) }"
                  class="font-medium"
                >
                  {{ item.name }}
                </p>
              </nuxt-link>
            </div>
          </div>
        </aside>
      </div>
    </nav>

    <main class="max-h-screen w-full overflow-y-auto">
      <nuxt></nuxt>
    </main>

    <Notification></Notification>
    <Dialog></Dialog>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  useContext,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import RootState from '~/store'

export default defineComponent({
  name: 'Dashboard',
  middleware: 'auth',
  setup() {
    // Context
    const store = useStore<RootState>()
    const ctx = useContext()
    const router = useRouter()

    // Data
    const data = reactive({
      open: false,
      links: [
        {
          name: 'General',
          routes: [
            {
              route: '/dashboard',
              name: 'Tableau de bord',
              icon: 'bxs-home',
            },
            {
              route: '/customers',
              name: 'Clients',
              icon: 'bxs-user',
            },
            {
              route: '/invoices',
              name: 'Factures',
              icon: 'bxs-cabinet',
            },
          ],
        },
        {
          name: 'Support',
          routes: [
            {
              route: '/support',
              name: 'Aide & Support',
              icon: 'bxs-message',
            },
            {
              route: '/issues',
              absolute: true,
              name: 'Signaler un bug',
              icon: 'bxs-bug',
            },
          ],
        },
      ],
    })

    // Computed
    const user = computed(() => store.state.auth.user)

    // Methods
    const logout = async (): Promise<void> => {
      await ctx.$fire.auth.signOut()

      await router.push({ path: '/' })
    }

    return { ...toRefs(data), user, logout }
  },
})
</script>
