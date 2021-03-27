<template>
  <form @submit.prevent="updateProfile">
    <Header>
      Paramètres du compte

      <template #actions>
        <button
          type="submit"
          class="bg-gray-200 bg-opacity-50 h-full px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
        >
          Sauvegarder
        </button>
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
        <label> Photo </label>
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
          <button
            type="button"
            class="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="$refs.fileInput.click()"
          >
            Changer
          </button>
          <button
            v-if="canDeletePhoto"
            type="button"
            class="ml-3 bg-white py-2 px-3 border border-transparent rounded-md shadow-sm text-sm leading-4 font-medium text-gray-50 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="deletePhoto"
          >
            Supprimer l'image
          </button>
        </div>
      </div>

      <div class="mt-4">
        <label for="name">Nom d'affichage</label>
        <input
          id="name"
          v-model="name"
          required
          minlength="1"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>
    </FormBox>
  </form>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
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
