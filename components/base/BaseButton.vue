<template>
  <button
    :class="{
      'border-gray-300 bg-white hover:bg-gray-50 text-gray-700': base,
      'border-transparent bg-indigo-500 hover:bg-indigo-600 text-gray-100': info,
      'border-transparent bg-green-500 hover:bg-green-600 text-gray-100': success,
      'border-transparent bg-yellow-500 hover:bg-yellow-600 text-gray-100': warning,
      'border-transparent bg-red-500 hover:bg-red-600 text-gray-100': danger,
    }"
    class="mt-3 w-full inline-flex disabled:opacity-60 disabled:pointer-events-none justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
    type="button"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    base: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    info: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    success: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    warning: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
    danger: {
      type: Boolean,
      default: false,
    } as PropOptions<boolean>,
  },
})
</script>
