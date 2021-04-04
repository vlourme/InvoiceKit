<template>
  <div class="relative inline-block text-left">
    <div @click="open = !open">
      <slot></slot>
    </div>

    <BaseTransition>
      <div
        v-if="open"
        ref="content"
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div class="py-1" role="none">
          <slot name="content"></slot>
        </div>
      </div>
    </BaseTransition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Dropdown',
  data: () => ({
    open: false,
  }),
})
</script>
