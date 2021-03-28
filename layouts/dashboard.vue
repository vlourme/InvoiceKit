<template>
  <div class="flex w-full h-screen bg-white divide-x">
    <nav class="flex flex-col h-screen max-w-xs w-full shadow-md bg-gray-50">
      <div class="flex-1">
        <p class="text-center text-gray-700 font-bold text-2xl px-4 py-6">
          InvoiceKit <span class="font-light text-gray-500">Suite</span>
        </p>

        <aside class="py-2">
          <template v-for="link in links">
            <nuxt-link
              :key="link.name"
              :to="link.route"
              class="px-6 py-4 inline-flex items-center hover:bg-gray-200 transition-all w-full"
            >
              <i
                :class="{
                  'text-indigo-500': $route.path == link.route,
                  [link.icon]: true,
                }"
                class="bx text-xl text-gray-700"
              ></i>

              <div
                :class="{
                  'text-indigo-500': $route.path == link.route,
                }"
                class="ml-6 font-medium text-gray-600"
              >
                {{ link.name }}
              </div>
            </nuxt-link>
          </template>
        </aside>
      </div>

      <div class="relative inline-block text-left">
        <div
          class="flex items-center justify-center w-full hover:bg-gray-200 py-6 cursor-pointer"
          @click="open = !open"
        >
          <img :src="user.image" class="rounded-full h-12 w-12" />

          <div class="px-4">
            <p class="leading-tight font-semibold text-lg">
              {{ user.name }}
            </p>
            <p class="text-sm">{{ user.email }}</p>
          </div>
        </div>

        <div
          :class="{ block: open, hidden: !open }"
          class="origin-top-right absolute bottom-0 right-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
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
        </div>
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
  ref,
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
    const open = ref(false)
    const links = ref([
      {
        route: '/dashboard',
        name: 'Tableau de bord',
        icon: 'bxs-home',
        teamRequired: false,
      },
      {
        route: '/customers',
        name: 'Clients',
        icon: 'bxs-user',
        teamRequired: true,
      },
      {
        route: '/invoices',
        name: 'Factures',
        icon: 'bxs-cabinet',
        teamRequired: true,
      },
    ])

    // Computed
    const user = computed(() => store.state.auth.user!)

    // Methods
    const logout = async (): Promise<void> => {
      await ctx.$fire.auth.signOut()

      await router.push({ path: '/' })
    }

    return { open, links, user, logout }
  },
})
</script>
