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
        <div>
          <input
            id="color"
            ref="colorPicker"
            v-model="team.rendering.accent"
            type="color"
            hidden
            list
            :disabled="!isAdmin"
          />
          <button
            type="button"
            class="mt-1 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 sm:w-auto sm:text-sm"
            @click="$refs.colorPicker.click()"
          >
            Changer
          </button>
        </div>
        <div class="relative w-full ml-2">
          <select
            id="role"
            v-model="team.rendering.accentEnabled"
            :disabled="!isAdmin"
            required
            class="w-full inline-block appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
          >
            <template v-for="item in colors">
              <option :key="item.value" :value="item.value">
                {{ item.text }}
              </option>
            </template>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center mt-0.5 pr-3"
          >
            <i class="bx bx-down-arrow-alt text-xl"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <label for="zip">Demander une signature</label>
      <div class="relative w-full">
        <select
          id="role"
          v-model="team.rendering.signature"
          :disabled="!isAdmin"
          required
          class="w-full inline-block appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        >
          <template v-for="item in signature">
            <option :key="item.value" :value="item.value">
              {{ item.text }}
            </option>
          </template>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center mt-0.5 pr-3"
        >
          <i class="bx bx-down-arrow-alt text-xl"></i>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <label for="zip">Afficher la quantité</label>
      <div class="relative w-full">
        <select
          id="role"
          v-model="team.rendering.quantityEnabled"
          :disabled="!isAdmin"
          required
          class="w-full inline-block appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
        >
          <template v-for="item in quantity">
            <option :key="item.value" :value="item.value">
              {{ item.text }}
            </option>
          </template>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center mt-0.5 pr-3"
        >
          <i class="bx bx-down-arrow-alt text-xl"></i>
        </div>
      </div>
    </div>
  </FormBox>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { RenderingSignature, Team } from '@/types/team'
import { mapGetters } from 'vuex'

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
    quantity: [
      { text: 'Afficher', value: true },
      { text: 'Cacher', value: false },
    ],
    colors: [
      { text: 'Utiliser la couleur personnalisée', value: true },
      { text: 'Utiliser la couleur de base', value: false },
    ],
  }),
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
  methods: {
    reset() {
      this.team.rendering.accentEnabled = false
      this.color = false
    },

    enableAccent() {
      this.team.rendering.accentEnabled = true
    },
  },
})
</script>
