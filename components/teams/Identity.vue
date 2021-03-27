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
              ref="filebase-input"
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
