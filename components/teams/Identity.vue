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
          <button
            v-if="isAdmin"
            class="text-sm mb-2 font-semibold text-indigo-400 hover:text-indigo-500 flex items-center focus:outline-none"
            @click.prevent="dialog = true"
          >
            <i class="bx bx-plus mr-2"></i>
            Ajouter un logo
          </button>
        </template>
      </FormDescription>
    </template>

    <div class="mt-2">
      <label for="title">Nom de l'entreprise</label>
      <input
        id="title"
        v-model="team.identity.title"
        type="text"
        :disabled="!isAdmin"
        class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
      />
    </div>
    <div class="mt-2">
      <label for="juridicTitle">Nom juridique de l'entreprise</label>
      <input
        id="juridicTitle"
        v-model="team.identity.juridicalTitle"
        type="text"
        :disabled="!isAdmin"
        class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
      />
    </div>
    <div class="mt-2">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="team.identity.email"
        type="email"
        :disabled="!isAdmin"
        class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
      />
    </div>
    <div class="mt-2">
      <label for="phone">Téléphone</label>
      <input
        id="phone"
        v-model="team.identity.phone"
        type="tel"
        :disabled="!isAdmin"
        class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
      />
    </div>
    <div class="mt-2">
      <label for="website">Site internet</label>
      <input
        id="website"
        v-model="team.identity.website"
        type="url"
        :disabled="!isAdmin"
        class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
      />
    </div>

    <form @submit.prevent="uploadImage">
      <Modal :activator.sync="dialog">
        <template #title> Ajouter ou modifier le logo </template>
        <template #icon>
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <i class="bx bxs-image text-indigo-600 text-xl"></i>
          </div>
        </template>
        <template #content>
          <div v-if="image" class="mt-2">
            <label class="text-sm text-gray-500" for="image"
              >Image actuelle</label
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
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click.prevent="$refs.fileInput.click()"
            >
              Changer l'image
            </button>

            <button
              v-if="image"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click.prevent="deleteImage"
            >
              Supprimer l'image
            </button>
          </div>
        </template>
        <template #footer>
          <button
            v-if="file"
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Ajouter l'image
          </button>

          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="dialog = false"
          >
            Fermer
          </button>
        </template>
      </Modal>
    </form>
  </FormBox>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'
import { mapGetters, mapState } from 'vuex'

export default Vue.extend({
  name: 'Identity',
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    rules: {
      email: [(v: string) => !v || /.+@.+/.test(v) || "L'email est invalide."],
      url: [(v: string) => !v || /.+\.\w\w.*/.test(v) || "L'URL est invalide."],
    },
    dialog: false,
    error: '',
    file: null as File | null,
    image: '',
  }),
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('team', ['isAdmin']),
    team: {
      get(): Team {
        return this.teamState
      },

      set(value: Team): void {
        this.$emit('update:team', value)
      },
    },
  },
  mounted() {
    // Get image
    this.$fire.storage
      .ref(this.user.team)
      .getDownloadURL()
      .then((url) => {
        this.image = url
      })
  },
  methods: {
    onFileChange(e: any) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.file = files[0]
    },

    async uploadImage() {
      if (!this.file) {
        this.error = "Aucune image n'a été séléctionnée."
        return
      }

      // Upload file
      const task = await this.$fire.storage
        .ref(`/teams/${this.user.team}`)
        .put(this.file)

      // Change image
      this.image = await task.ref.getDownloadURL()

      this.dialog = false
    },

    async deleteImage() {
      try {
        await this.$fire.storage.ref(`/teams/${this.user.team}`).delete()

        this.image = ''
      } catch {}
    },
  },
})
</script>
