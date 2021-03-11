<template>
  <Card>
    <template #title>Fichiers PDF</template>
    <template #actions>
      <v-btn text @click="color = true">Changer la couleur d'accent</v-btn>
    </template>

    <v-select
      v-model="team.signature"
      :items="signature"
      prepend-icon="mdi-account-check"
      label="Signature requise en fin de document"
    ></v-select>

    <v-dialog v-model="color" :width="300">
      <v-card>
        <v-color-picker
          v-model="team.accent"
          :dot-size="25"
          :swatches-max-height="200"
          @input="enableAccent"
        ></v-color-picker>

        <v-card-actions>
          <v-btn color="error" text @click="reset">Reset</v-btn>

          <v-spacer></v-spacer>

          <v-btn color="primary" text @click="color = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { RenderingSignature, Team } from '@/types/team'

export default Vue.extend({
  name: 'Rendering',
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    color: false,
    signature: [
      { text: 'Pas de signature', value: RenderingSignature.None },
      { text: 'Devis uniquement', value: RenderingSignature.Quote },
      { text: 'Factures uniquement', value: RenderingSignature.Invoice },
      { text: 'Devis et factures', value: RenderingSignature.Both },
    ],
  }),
  computed: {
    team: {
      get(): Team {
        return this.teamState
      },

      set(value: Team): void {
        this.$emit('update:team', value)
      },
    },
  },
  methods: {
    reset() {
      this.team.accentEnabled = false
      this.color = false
    },

    enableAccent() {
      this.team.accentEnabled = true
    },
  },
})
</script>
