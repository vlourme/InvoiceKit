<template>
  <FormBox>
    <template #description>
      <FormDescription>
        <template #title>Exportation des documents</template>
        <template #description>
          Paramètres pour la création et l'exportation des documents PDF et
          l'impression.
        </template>
      </FormDescription>
    </template>

    <div class="mt-2">
      <label for="color">Couleur d'accent</label>
      <div class="flex items-center">
        <div class="mt-1">
          <input
            id="color"
            ref="colorPicker"
            v-model="team.rendering.accent"
            type="color"
            hidden
            list
            :disabled="!isAdmin"
          />
          <base-button
            base
            class="py-2.5 sm:ml-0"
            @click="$refs.colorPicker.click()"
          >
            Changer
          </base-button>
        </div>
        <base-select
          id="role"
          v-model="team.rendering.accentEnabled"
          :disabled="!isAdmin"
          required
          class="ml-2"
          :items="colors"
        />
      </div>
    </div>
    <div class="mt-2">
      <base-label for="zip">Demander une signature</base-label>
      <base-select
        id="role"
        v-model="team.rendering.signature"
        :disabled="!isAdmin"
        required
        :items="signature"
      />
    </div>
    <div class="mt-2">
      <base-label for="zip">Afficher la quantité</base-label>
      <base-select
        id="role"
        v-model="team.rendering.quantityEnabled"
        :disabled="!isAdmin"
        required
        :items="quantity"
      />
    </div>
  </FormBox>
</template>

<script lang="ts">
import { defineComponent, PropOptions, reactive } from '@nuxtjs/composition-api'
import useTeam from './useTeam'
import { RenderingSignature, Team } from '~/types/team'

export default defineComponent({
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  setup(props, { emit }) {
    // Data
    const refs = reactive({
      signature: [
        { text: 'Pas de signature', value: RenderingSignature.None },
        { text: 'Devis uniquement', value: RenderingSignature.Quote },
        { text: 'Factures uniquement', value: RenderingSignature.Invoice },
        { text: 'Devis et factures', value: RenderingSignature.Both },
      ],
      quantity: [
        { text: 'Afficher', value: true },
        { text: 'Cacher', value: false },
      ],
      colors: [
        { text: 'Utiliser la couleur personnalisée', value: true },
        { text: 'Utiliser la couleur de base', value: false },
      ],
    })

    // Computed
    const { team, isAdmin } = useTeam(props, emit)

    return { team, isAdmin, ...refs }
  },
})
</script>
