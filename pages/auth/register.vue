<template>
  <v-form v-model="valid" @submit.prevent="register">
    <v-alert v-if="error" type="error">
      {{ error }}
    </v-alert>

    <v-text-field
      v-model="name"
      type="text"
      label="Nom"
      placeholder="John Doe"
      :rules="rules.name"
    ></v-text-field>

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
      <v-spacer></v-spacer>

      <v-btn type="submit" color="indigo" class="white--text"
        >Inscription
      </v-btn>
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
        return (this.error = 'Les champs sont invalides')
      }

      try {
        // Register
        await this.$fire.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        )

        // Write a reference
        await this.$fire.firestore
          .collection('users')
          .doc(this.$fire.auth.currentUser.uid)
          .set({
            email: this.email,
            name: this.name,
            image: 'https://eu.ui-avatars.com/api/?name=' + this.name,
            team: null,
          })

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
