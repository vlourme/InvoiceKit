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
      <label for="address">Adresse</label>
      <input
        id="address"
        v-model="team.localization.street"
        type="text"
        :disabled="!isAdmin"
        class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
      />
    </div>
    <div class="mt-2 grid grid-cols-3 gap-2">
      <div>
        <label for="zip">Code postal</label>
        <input
          id="zip"
          v-model="team.localization.zip"
          type="text"
          :disabled="!isAdmin"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>
      <div>
        <label for="city">Ville</label>
        <input
          id="city"
          v-model="team.localization.city"
          type="text"
          :disabled="!isAdmin"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>
      <div>
        <label for="zip">Pays</label>
        <input
          id="country"
          v-model="team.localization.country"
          type="text"
          :disabled="!isAdmin"
          class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        />
      </div>
    </div>
  </FormBox>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Team } from '@/types/team'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'Localization',
  props: {
    teamState: {
      type: Object,
      required: true,
    } as PropOptions<Team>,
  },
  computed: {
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
})
</script>
