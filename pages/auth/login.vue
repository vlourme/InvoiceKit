<template>
  <v-form v-model="valid" @submit.prevent="login">
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-text-field
      v-model="email"
      type="email"
      label="Email"
      placeholder="john.doe@example.com"
      :rules="rules.email"
    ></v-text-field>

    <v-text-field
      v-model="password"
      type="password"
      label="Mot de passe"
      placeholder="••••••••"
      :rules="rules.password"
    ></v-text-field>

    <div class="d-flex">
      <v-spacer />

      <v-btn type="submit" color="indigo" class="white--text">Connexion</v-btn>
    </div>
  </v-form>
</template>

<script>
export default {
  name: 'Login',
  layout: 'auth',
  data: () => ({
    valid: false,
    rules: {
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
    email: '',
    password: '',
    error: null,
  }),
  methods: {
    async login() {
      if (!this.valid) {
        return (this.error = 'Les champs sont invalides')
      }

      try {
        // Login
        await this.$fire.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        )

        // Redirect
        await this.$router.push({ path: '/dashboard' })
      } catch (error) {
        this.error = error
      }
    },
  },
}
</script>

<style scoped></style>
