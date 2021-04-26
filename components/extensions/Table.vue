<template>
  <table class="relative w-full">
    <thead>
      <tr class="border-b">
        <template v-for="(field, idx) in extension.fields">
          <th
            v-if="field.featured"
            :key="idx"
            :class="{
              'sticky top-0 text-gray-700': isIndex,
              'text-gray-600': !isIndex,
            }"
            class="px-6 py-3 bg-gray-50 text-left font-medium"
          >
            {{ field.name }}
          </th>
        </template>
        <th
          :class="{ 'sticky top-0': isIndex }"
          class="bg-gray-50 text-right"
        ></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, idx) in results" :key="idx" class="even:bg-gray-50">
        <td class="px-6 py-4 text-left">
          {{ result[values[0]] }}
        </td>
        <td class="px-6 py-4 text-left">
          {{ result[values[1]] }}
        </td>
        <td class="px-6 py-4 text-left">
          {{ result[values[2]] }}
        </td>
        <td class="px-6 py-4 text-right">
          <slot name="link" :id="result.$key"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropOptions,
  useStore,
} from '@nuxtjs/composition-api'
import { getValues } from '~/composables/useExtensibleField'
import RootState from '~/store'
import { Extension } from '~/types/team'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    } as PropOptions<string>,
    extension: {
      type: Object,
      required: true,
    } as PropOptions<Extension>,
    results: {
      type: Array,
      required: true,
    } as PropOptions<any[]>,
    isIndex: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    // Context
    const store = useStore<RootState>()

    // Computed
    const team = computed(() => store.state.team.team!)

    // Data
    const values = getValues(team.value, props.name!)

    return { values }
  },
})
</script>
