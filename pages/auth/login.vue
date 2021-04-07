<template>
  <form @submit.prevent="login">
    <h1 class="text-center py-8 font-bold text-2xl">
      Connectez-vous à InvoiceKit
    </h1>

    <div
      v-if="error"
      class="w-full px-4 py-3 mt-2 text-white bg-red-400 rounded-md"
    >
      {{ error }}
    </div>

    <div class="flex flex-col my-2">
      <label class="text-sm mb-1" for="email"> Email </label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="bx bx-envelope text-gray-600"></i>
        </div>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="john.doe@example.com"
          class="pl-9 pr-4 py-2 w-full focus:ring-2 focus:outline-none rounded-md border border-transparent"
        />
      </div>
    </div>

    <div class="flex flex-col my-2">
      <label class="text-sm mb-1" for="password">Mot de passe</label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="bx bx-key text-gray-600"></i>
        </div>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="pl-9 pr-4 py-2 w-full focus:ring-2 focus:outline-none rounded-md border border-transparent"
        />
      </div>
    </div>

    <div class="flex justify-end">
      <nuxt-link class="text-sm text-gray-500" to="/auth/register"
        >Pas encore inscrit ?</nuxt-link
      >
    </div>

    <button
      class="w-full rounded-md focus:outline-none bg-indigo-500 hover:bg-indigo-600 text-white py-2 mt-2"
      type="submit"
    >
      Se connecter
    </button>
  </form>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'auth',
  setup() {
    // Context
    const ctx = useContext()

    // Data
    const email = ref('')
    const password = ref('')
    const error = ref('')

    // Methods
    const login = async () => {
      try {
        await ctx.$fire.auth.signInWithEmailAndPassword(
          email.value,
          password.value
        )

        window.location.href = '/dashboard'
      } catch (err) {
        error.value = err
      }
    }

    return { email, password, error, login }
  },
  head: {
    title: 'Connectez-vous',
  },
})
</script>
