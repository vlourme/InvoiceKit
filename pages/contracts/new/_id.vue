<template>
  <form @submit.prevent="saveContract(false)">
    <Header>
      Créer un contrat

      <template #actions>
        <base-nav-button :disabled="!hasChanges" type="submit">
          Enregistrer
        </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Créer un nouveau contrat</template>
          <template #description>
            Remplissez les informations concernant ce contrat.
          </template>
        </FormDescription>
      </template>

      <base-select v-model="contract.model" :items="selects" required />
      <extensions-inputs :fields="extension.fields" :state.sync="contract" />
    </FormBox>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useRoute,
  useStore,
} from '@nuxtjs/composition-api'
import useContract from '~/composables/useContract'
import RootState from '~/store'
import { ContractModel } from '~/types/contract'
import { FieldType } from '~/types/team'
import { SelectItem } from '~/types/UI'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const route = useRoute()
    const store = useStore<RootState>()

    // Data
    const { state, role, hasChanges, resetState, saveContract } = useContract(
      route.value.params.id
    )
    const selects = ref<SelectItem[]>([])

    // Computed
    const team = computed(() => store.state.team.team!)
    const extension = computed(() => team.value.extensions.contracts)

    // Methods
    onMounted(() => {
      resetState()

      // Get select values
      extension.value.models?.forEach((model: ContractModel) => {
        selects.value.push({
          text: `${model.title} - ${
            model.revisions > -1
              ? model.revisions + ' révisions'
              : 'Révision illimitées'
          } - ${model.price} €`,
          value: model,
        })
      })

      // Set default value
      if (extension.value.models && extension.value.models.length > -1) {
        state.contract.value.model = extension.value.models[0]
      }
    })

    return {
      ...state,
      hasChanges,
      extension,
      selects,
      saveContract,
      team,
      role,
      FieldType,
    }
  },
  head: {
    title: 'Créer un contrat',
  },
})
</script>
