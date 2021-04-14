<template>
  <div class="font-body subpixel-antialiased w-full h-screen bg-white">
    <transition
      enter-class="-translate-x-full"
      enter-to-class="translate-x-0"
      enter-active-class="transform transition ease-in-out duration-500"
      leave-active-class="transform transition ease-in-out duration-500"
      leave-class="translate-x-0 w-0"
      leave-to-class="-translate-x-full"
    >
      <nav
        v-show="drawer"
        class="fixed top-0 left-0 z-10 flex flex-col h-screen max-w-xs w-full bg-gray-100 border-r"
      >
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
                <component
                  :is="item.absolute ? 'a' : 'nuxt-link'"
                  v-for="item in link.routes"
                  :key="item.route"
                  :target="item.absolute ? '_blank' : null"
                  :to="item.absolute ? null : item.route"
                  :href="item.absolute ? item.route : null"
                  :class="{
                    'bg-white rounded-md shadow': $route.path.startsWith(
                      item.route
                    ),
                  }"
                  class="my-2 flex items-center justify-between w-full py-2 px-3 text-gray-500 cursor-pointer group hover:bg-white hover:bg-opacity-50 rounded-md transition-colors"
                >
                  <div class="inline-flex items-center">
                    <i
                      :class="{
                        [item.icon]: true,
                        'text-indigo-600': $route.path.startsWith(item.route),
                      }"
                      class="bx text-xl mr-4"
                    ></i>

                    <p
                      :class="{
                        'font-bold': $route.path.startsWith(item.route),
                      }"
                      class="font-medium"
                    >
                      {{ item.name }}
                    </p>
                  </div>

                  <div
                    v-if="item.settings"
                    class="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition inline-flex items-center"
                  >
                    <nuxt-link title="Paramètres" :to="item.settings">
                      <i class="bx bxs-customize text-lg"></i>
                    </nuxt-link>
                  </div>
                </component>
              </div>
            </div>
          </aside>
        </div>
      </nav>
    </transition>

    <main
      :class="{ 'pl-80': drawer, 'pl-0': !drawer }"
      class="max-h-screen w-full overflow-y-auto transition-all duration-500"
    >
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
              settings: '/customers/settings',
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
              route: 'https://github.com/vlourme/invoicekit',
              absolute: true,
              name: 'Signaler un bug',
              icon: 'bxs-bug',
            },
          ],
        },
      ],
    })

    // Computed
    const drawer = computed(() => store.state.drawer.drawer)
    const user = computed(() => store.state.auth.user)

    // Methods
    const logout = async (): Promise<void> => {
      await ctx.$fire.auth.signOut()

      await router.push({ path: '/' })
    }

    return { ...toRefs(data), user, logout, drawer }
  },
})
</script>
