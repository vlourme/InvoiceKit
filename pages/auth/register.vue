<template>
  <div>
    <h1 class="text-center py-8 font-bold text-2xl">
      Inscrivez-vous sur InvoiceKit
    </h1>

    <div
      v-if="error"
      class="w-full px-4 py-3 mt-2 text-white bg-red-400 rounded-md"
    >
      {{ error }}
    </div>

    <form @submit.prevent="login">
      <div class="flex flex-col my-2">
        <label class="text-sm mb-1" for="name"> Nom complet </label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <i class="bx bx-user text-gray-600"></i>
          </div>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="John Doe"
            class="pl-9 pr-4 py-2 w-full focus:ring-2 focus:outline-none rounded-md border border-transparent"
          />
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
          <nuxt-link class="text-sm text-gray-500" to="/auth/login"
            >Déjà inscrit ?</nuxt-link
          >
        </div>

        <button
          class="w-full rounded-md focus:outline-none bg-indigo-500 hover:bg-indigo-600 text-white py-2 mt-2"
          type="submit"
        >
          Confirmer l'inscription
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'auth',
  data: () => ({
    valid: false,
    rules: {
      name: [(v) => !!v || 'Le nom est requis'],
      email: [
        (v) => !!v || "L'email est requis.",
        (v) => /.+@.+/.test(v) || "L'adresse mail est invalide.",
      ],
      password: [
        (v) => !!v || 'Le mot de passe est requis.',
        (v) =>
          v.length >= 8 || 'Le mot de passe doit faire minimum 8 charactères.',
      ],
    },
    name: '',
    email: '',
    password: '',
    error: null,
  }),
  methods: {
    async register() {
      if (!this.valid) {
        this.error = 'Les champs sont invalides'
        return
      }

      try {
        // Register
        const auth = await this.$fire.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        )

        // Write a reference
        await this.$fire.firestore
          .collection('users')
          .doc(auth.user.uid)
          .set({
            email: this.email,
            name: this.name,
            image: 'https://eu.ui-avatars.com/api/?name=' + this.name,
            team: null,
          })

        // Redirect
        this.$router.push({ path: '/dashboard' })
      } catch (error) {
        this.error = error
      }
    },
  },
}
</script>

<style scoped></style>
