<template>
  <div class="h-14 w-full flex items-center bg-white border-b">
    <h2 class="py-2 px-4 font-semibold text-xl flex-1 leading-loose">
      <slot></slot>
    </h2>

    <div
      :class="{ 'border-l border-r': empty }"
      class="h-14 flex divide-x mr-4"
    >
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(_props, { slots }) {
    // Computed
    const empty = computed(() => {
      return !!slots.actions
    })

    return { empty }
  },
})
</script>
