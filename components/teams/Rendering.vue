<template>
  <Card>
    <template #title>Fichiers PDF</template>

    <v-select
      v-model="teamModel.signature"
      :items="signature"
      prepend-icon="mdi-account-check"
      label="Signature requise en fin de document"
    />
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { RenderingSignature, Team } from '@/types/team'

export default Vue.extend({
  name: 'Rendering',
  props: {
    team: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  data: () => ({
    teamModel: {} as Team,
    signature: [
      { text: 'Pas de signature', value: RenderingSignature.None },
      { text: 'Devis uniquement', value: RenderingSignature.Quote },
      { text: 'Factures uniquement', value: RenderingSignature.Invoice },
      { text: 'Devis et factures', value: RenderingSignature.Both },
    ],
  }),
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
  },
})
</script>
