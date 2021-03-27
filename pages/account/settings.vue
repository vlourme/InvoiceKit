<template>
  <form @submit.prevent="updateProfile">
    <Header>
      Paramètres du compte

      <template #actions>
        <base-nav-button type="submit"> Sauvegarder </base-nav-button>
      </template>
    </Header>
    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Paramètres du compte</template>
          <template #description
            >Modifiez les paramètres de votre compte</template
          >
        </FormDescription>
      </template>

      <div class="mt-2">
        <base-label> Photo </base-label>
        <div class="mt-1 flex items-center">
          <img
            :src="user.image"
            class="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100"
          />
          <input
            ref="fileInput"
            hidden
            type="file"
            accept="image/jpg,image/png,image/jpeg"
            @change="changePicture"
          />
          <base-button base type="button" @click="$refs.fileInput.click()">
            Changer
          </base-button>
          <base-button
            v-if="canDeletePhoto"
            danger
            type="button"
            @click="deletePhoto"
          >
            Supprimer l'image
          </base-button>
        </div>
      </div>

      <div class="mt-4">
        <base-label for="name">Nom d'affichage</base-label>
        <base-input id="name" v-model="name" required minlength="1" />
      </div>
    </FormBox>
  </form>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import Vue from 'vue'

export default Vue.extend({
  name: 'Settings',
  layout: 'dashboard',
  data: () => ({
    name: '',
  }),
  head: {
    title: 'Paramètres du compte',
  },
  computed: {
    ...mapState('auth', ['auth', 'user']),
    canDeletePhoto(): boolean {
      return !(this.user.image as string).startsWith(
        'https://eu.ui-avatars.com'
      )
    },
  },
  mounted() {
    this.name = this.user.name
  },
  methods: {
    async changePicture(e: any) {
      const image = e.target.files[0]

      await this.deleteFromStorage()

      // Upload new image
      this.$fire.storage
        .ref(this.auth.uid)
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
    },
  },
})
</script>
