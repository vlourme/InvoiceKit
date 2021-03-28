<template>
  <FormBox>
    <template #description>
      <FormDescription>
        <template #title>Localisation de l'entreprise</template>
        <template #description>
          La localisation est utilisée pour remplir les documents PDF.
        </template>
      </FormDescription>
    </template>

    <div class="mt-2">
      <base-label for="address">Adresse</base-label>
      <base-input
        id="address"
        v-model="team.localization.street"
        type="text"
        :disabled="!isAdmin"
      />
    </div>
    <div class="mt-2 grid grid-cols-3 gap-2">
      <div>
        <base-label for="zip">Code postal</base-label>
        <base-input
          id="zip"
          v-model="team.localization.zip"
          type="text"
          :disabled="!isAdmin"
        />
      </div>
      <div>
        <base-label for="city">Ville</base-label>
        <base-input
          id="city"
          v-model="team.localization.city"
          type="text"
          :disabled="!isAdmin"
        />
      </div>
      <div>
        <base-label for="zip">Pays</base-label>
        <base-input
          id="country"
          v-model="team.localization.country"
          type="text"
          :disabled="!isAdmin"
        />
      </div>
    </div>
  </FormBox>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from '@nuxtjs/composition-api'
import useTeam from './useTeam'
import { Team } from '~/types/team'

export default defineComponent({
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  setup(props, { emit }) {
    return useTeam(props, emit)
  },
})
</script>
