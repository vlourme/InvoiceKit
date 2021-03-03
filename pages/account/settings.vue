<template>
  <Header>
    <Card margin>
      <template #title>Paramètres du compte</template>

      <template #actions>
        <v-btn text @click="updateProfile">
          <v-icon left>mdi-check</v-icon>
          Sauvegarder
        </v-btn>
      </template>

      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" sm="12" md="4">
            <div
              class="d-flex fill-height flex-column justify-center align-center"
            >
              <v-avatar size="96">
                <v-img :src="user.image" />
              </v-avatar>

              <input
                ref="upload"
                hidden
                type="file"
                accept="image/*"
                @change="changePicture"
              />

              <v-btn text class="mt-2" @click="$refs.upload.click()">
                Changer la photo
              </v-btn>

              <v-btn text color="error" class="mt-2" @click="deletePhoto">
                Supprimer la photo
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" sm="12" md="8">
            <v-text-field
              v-model="name"
              label="Nom"
              :rules="rules.name"
              placeholder="John Doe"
            />

            <v-text-field
              v-model="email"
              label="Email"
              :rules="rules.email"
              placeholder="john.doe@example.com"
            />
          </v-col>
        </v-row>
      </v-form>
    </Card>
  </Header>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  data: () => ({
    valid: false,
    rules: {
      name: [(v: string) => !!v || 'Le nom est requis.'],
      email: [
        (v: string) => !!v || "L'email est requis.",
        (v: string) => /.+@.+/.test(v) || "L'adresse mail est invalide.",
      ],
    },
    name: '',
    email: '',
  }),
  head: {
    title: 'Paramètres du compte',
  },
  computed: {
    ...mapState(['auth', 'user']),
  },
  mounted() {
    this.name = this.user.name
    this.email = this.auth.email
  },
  methods: {
    async changePicture(e: any) {
      const image = e.target.files[0]

      await this.deleteFromStorage()

      // Upload new image
      this.$fire.storage
        .ref(uuidv4())
        .put(image)
        .then(async (snapshot) => {
          await this.$fire.firestore
            .collection('users')
            .doc(this.auth.uid)
            .update({
              ...this.user,
              image: await snapshot.ref.getDownloadURL(),
            })
        })
    },

    async deleteFromStorage() {
      try {
        await this.$fire.storage.refFromURL(this.user.photoURL).delete()
      } catch {
        /* Do nothing */
      }
    },

    async deletePhoto() {
      await this.deleteFromStorage()

      await this.$fire.firestore
        .collection('users')
        .doc(this.auth.uid)
        .update({
          ...this.user,
          image: 'https://eu.ui-avatars.com/api/?name=' + this.user.name,
        })
    },

    async updateProfile() {
      // Check form
      if (!this.valid) {
        return
      }

      // Update name
      if (this.name !== this.user.name) {
        await this.$fire.firestore
          .collection('users')
          .doc(this.auth.uid)
          .update({
            ...this.user,
            name: this.name,
          })
      }

      // Update email
      // TODO: Use a modal to ask credentials
      if (this.email !== this.user.email) {
        await this.$fire.auth.currentUser?.updateEmail(this.email)

        await this.$fire.firestore
          .collection('users')
          .doc(this.auth.uid)
          .update({
            ...this.user,
            email: this.email,
          })
      }
    },
  },
})
</script>
