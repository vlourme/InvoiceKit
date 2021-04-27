<template>
  <div class="h-14 w-full flex items-center bg-white">
    <div class="flex-1 inline-flex items-center py-2 px-4">
      <button
        class="inline-flex items-center focus:outline-none"
        type="button"
        @click.prevent="toggleDrawer"
      >
        <i class="bx bx-menu text-2xl mr-2"></i>
      </button>
      <h2 class="font-semibold text-xl leading-loose">
        <slot></slot>
      </h2>
    </div>

    <div class="h-14 flex items-center mr-2">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import RootState from '~/store'

export default defineComponent({
  setup() {
    const store = useStore<RootState>()

    const toggleDrawer = () => {
      store.dispatch('drawer/toggle')
    }

    return { toggleDrawer }
  },
})
</script>
