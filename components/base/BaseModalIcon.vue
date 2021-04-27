<template>
  <div
    :class="`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${bg} sm:mx-0 sm:h-10 sm:w-10`"
  >
    <i :class="`bx bxs-${icon} ${fg} text-xl`"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    } as PropOptions<string>,
    bg: {
      type: String,
      required: false,
      default: 'bg-indigo-100',
    } as PropOptions<string>,
    fg: {
      type: String,
      required: false,
      default: 'text-indigo-600',
    } as PropOptions<string>,
  },
})
</script>
