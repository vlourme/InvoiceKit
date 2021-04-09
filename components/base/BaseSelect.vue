<template>
  <div class="relative w-full">
    <select
      v-bind="$attrs"
      class="w-full inline-block disabled:opacity-60 appearance-none mt-1 px-3 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 transition-colors rounded-md border-2 border-gray-200"
      @input="
        $emit(
          'input',
          bool ? $event.target.value == 'true' : $event.target.value
        )
      "
    >
      <template v-for="item in options">
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
</template>

<script lang="ts">
import { computed, defineComponent, PropOptions } from '@nuxtjs/composition-api'
import { SelectItem } from '~/types/UI'

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    } as PropOptions<SelectItem[]>,
    bool: {
      type: Boolean,
      required: false,
    } as PropOptions<boolean>,
  },
  setup(props) {
    // Computed
    const options = computed(() => props.items ?? [])

    return { options }
  },
})
</script>
