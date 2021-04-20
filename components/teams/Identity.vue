<template>
  <FormBox>
    <template #description>
      <FormDescription>
        <template #title>Identité de la team</template>
        <template #description>
          L'identité de la team permettra de remplir correctement les documents
          PDF.
        </template>
        <template #actions>
          <base-button-inline
            v-if="isAdmin"
            info
            icon="plus"
            @click.prevent="dialog = true"
          >
            Ajouter un logo
          </base-button-inline>
        </template>
      </FormDescription>
    </template>

    <div class="mt-2">
      <base-label for="title">Nom de l'entreprise</base-label>
      <base-input
        id="title"
        v-model="team.identity.title"
        type="text"
        :disabled="!isAdmin"
      />
    </div>
    <div class="mt-2">
      <base-label for="juridicTitle">Nom juridique de l'entreprise</base-label>
      <base-input
        id="juridicTitle"
        v-model="team.identity.juridicalTitle"
        type="text"
        :disabled="!isAdmin"
      />
    </div>
    <div class="mt-2">
      <base-label for="email">Email</base-label>
      <base-input
        id="email"
        v-model="team.identity.email"
        type="email"
        :disabled="!isAdmin"
      />
    </div>
    <div class="mt-2">
      <base-label for="phone">Téléphone</base-label>
      <base-input
        id="phone"
        v-model="team.identity.phone"
        type="tel"
        :disabled="!isAdmin"
      />
    </div>
    <div class="mt-2">
      <base-label for="website">Site internet</base-label>
      <base-input
        id="website"
        v-model="team.identity.website"
        type="url"
        :disabled="!isAdmin"
      />
    </div>

    <form @submit.prevent="uploadImage">
      <Modal :activator.sync="dialog">
        <template #title> Ajouter ou modifier le logo </template>
        <template #icon>
          <base-modal-icon icon="image" />
        </template>
        <template #content>
          <div v-if="image" class="mt-2">
            <base-label class="text-sm text-gray-500" for="image"
              >Image actuelle</base-label
            >
            <img class="max-h-60" :src="image" />
          </div>
          <div class="mt-2">
            <input
              ref="fileInput"
              type="file"
              accept="image/jpg,image/png,image/jpeg"
              hidden
              @change="onFileChange"
            />
            <base-button base @click.prevent="$refs.fileInput.click()">
              Changer l'image
            </base-button>

            <base-button v-if="image" base @click.prevent="deleteImage">
              Supprimer l'image
            </base-button>
          </div>
        </template>
        <template #footer>
          <base-button v-if="file" success type="submit">
            Ajouter l'image
          </base-button>

          <base-button base type="button" @click.prevent="dialog = false">
            Fermer
          </base-button>
        </template>
      </Modal>
    </form>
  </FormBox>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import useTeam from '~/composables/useTeam'
import RootState from '~/store'

export default defineComponent({
  setup() {
    // Context
    const store = useStore<RootState>()
    const ctx = useContext()

    // Data
    const data = reactive({
      image: '',
      file: null as File | null,
      dialog: false,
      error: '',
    })

    // Computed
    const user = store.state.auth.user
    const { state, isAdmin } = useTeam()

    // On mount
    onMounted(() => {
      ctx.$fire.storage
        .ref(user?.team!)
        .getDownloadURL()
        .then((url) => {
          data.image = url
        })
        .catch(() => {})
    })

    // Methods
    const onFileChange = (e: any) => {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      data.file = files[0]
    }

    const uploadImage = async () => {
      if (!data.file) {
        data.error = "Aucune image n'a été séléctionnée."
        return
      }

      // Upload file
      const task = await ctx.$fire.storage
        .ref(`/teams/${user?.team!}`)
        .put(data.file)

      // Change image
      data.image = await task.ref.getDownloadURL()

      data.dialog = false
    }

    const deleteImage = async () => {
      try {
        await ctx.$fire.storage.ref(`/teams/${user?.team!}`).delete()

        data.image = ''
      } catch {}
    }

    return {
      ...toRefs(data),
      ...state,
      isAdmin,
      onFileChange,
      uploadImage,
      deleteImage,
    }
  },
})
</script>
