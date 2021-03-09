<template>
  <Card>
    <template #title>Identité de l'entreprise</template>

    <template #actions>
      <v-btn text @click="dialog = true">
        <v-icon left>mdi-image</v-icon>
        Ajouter un logo
      </v-btn>
    </template>

    <v-text-field
      v-model="teamModel.title"
      label="Nom de l'entreprise"
    ></v-text-field>

    <v-text-field
      v-model="teamModel.juridicalTitle"
      label="Nom juridique de l'entreprise"
      placeholder="Entreprise SARL"
    ></v-text-field>

    <v-text-field
      v-model="teamModel.email"
      label="Email"
      placeholder="society@example.com"
      :rules="rules.email"
    ></v-text-field>
    <v-text-field
      v-model="teamModel.phone"
      label="Téléphone"
      placeholder="+33 01 02 03 04 05"
    ></v-text-field>
    <v-text-field
      v-model="teamModel.website"
      label="Site internet"
      placeholder="example.com"
      :rules="rules.url"
    ></v-text-field>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Ajouter un logo </v-card-title>

        <v-card-text>
          <v-alert v-if="error" type="error">
            {{ error }}
          </v-alert>

          <v-card v-if="image" color="white" class="py-4">
            <v-img :src="image" contain max-height="150"></v-img>
          </v-card>

          <v-file-input
            v-model="file"
            class="mt-4"
            accept="image/*"
            label="Logo"
          ></v-file-input>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="warning" text @click="deleteImage">Supprimer</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" text @click="uploadImage">Confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Identity',
  props: {
    team: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    teamModel: {} as Team,
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
  },
  watch: {
    teamModel: {
      deep: true,
      handler(val: Team) {
        // Emit to parent
        this.$emit('update:team', val)
      },
    },
  },
  mounted() {
    // Clone
    this.teamModel = Object.assign({}, this.team)

    // Get image
    this.$fire.storage
      .ref(this.user.team)
      .getDownloadURL()
      .then((url) => {
        this.image = url
      })
  },
  methods: {
    async uploadImage() {
      if (!this.file) {
        this.error = "Aucune image n'a été séléctionnée."
        return
      }

      // Upload file
      const task = await this.$fire.storage.ref(this.user.team).put(this.file)

      // Change image
      this.image = await task.ref.getDownloadURL()

      this.dialog = false
    },

    async deleteImage() {
      try {
        await this.$fire.storage.ref(this.user.team).delete()

        this.image = ''
      } catch {}
    },
  },
})
</script>
