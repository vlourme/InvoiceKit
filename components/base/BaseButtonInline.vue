<template>
  <button
    :class="{
      'text-indigo-400 hover:text-indigo-500': info,
      'text-yellow-400 hover:text-yellow-500': warning,
      'text-green-400 hover:text-green-500': success,
      'text-red-400 hover:text-red-500': danger,
    }"
    class="w-full text-sm font-semibold inline-flex items-center focus:outline-none"
    type="button"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <i :class="`bx bx-${icon} mr-2`"></i>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  props: {
    icon: {
      type: String,
      required: true,
    } as PropOptions<string>,
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
