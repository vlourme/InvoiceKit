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
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import RootState from '~/store'
import { NotificationType } from '~/types/notification'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const store = useStore<RootState>()

    // Computed
    const user = computed(() => store.state.auth.user!)
    const canDeletePhoto = computed(() => {
      return !user.value.image.startsWith('https://eu.ui-avatars.com')
    })

    // Data
    const name = ref(user.value.name)

    // Methods
    const changePicture = async (e: any) => {
      const image = e.target.files[0]

      if (canDeletePhoto.value) {
        await deleteFromStorage()
      }

      // Upload new image
      ctx.$fire.storage
        .ref(user.value.$key!)
        .put(image)
        .then(async (snapshot) => {
          await ctx.$fire.firestore
            .collection('users')
            .doc(user.value.$key!)
            .update({
              ...user.value,
              image: await snapshot.ref.getDownloadURL(),
            })
        })
    }

    const deleteFromStorage = async () => {
      try {
        await ctx.$fire.storage.refFromURL(user.value.image).delete()
      } catch {
        ctx.$notify("Impossible de supprimer l'image", NotificationType.ERROR)
      }
    }

    const deletePhoto = async () => {
      await deleteFromStorage()

      await ctx.$fire.firestore
        .collection('users')
        .doc(user.value.$key!)
        .update({
          ...user.value,
          image: 'https://eu.ui-avatars.com/api/?name=' + user.value.name,
        })
    }

    const updateProfile = async () => {
      // Update name
      if (name.value !== user.value.name) {
        await ctx.$fire.firestore
          .collection('users')
          .doc(user.value.$key!)
          .update({
            ...user.value,
            name: name.value,
          })
      }
    }

    return {
      name,
      user,
      canDeletePhoto,
      updateProfile,
      deletePhoto,
      changePicture,
    }
  },
  head: {
    title: 'Paramètres du compte',
  },
})
</script>
