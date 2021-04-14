<template>
  <div>
    <transition
      enter-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-all duration-250"
      leave-active-class="transition-all duration-1000"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="absolute inset-0 z-20 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click.prevent="show = false"
      ></div>
    </transition>
    <transition
      enter-class="translate-x-full"
      enter-to-class="translate-x-0"
      enter-active-class="transition-all transform duration-500"
      leave-active-class="transition-all transform duration-500"
      leave-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="show"
        class="absolute z-30 inset-y-0 right-0 pl-10 max-w-full flex"
      >
        <div class="relative w-screen max-w-md">
          <div
            class="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll"
          >
            <div class="px-4 sm:px-6 flex justify-between items-center">
              <h2
                id="slide-over-title"
                class="text-lg font-medium text-gray-900"
              >
                <slot name="title"></slot>
              </h2>

              <button
                class="rounded-md text-gray-700 hover:text-600 pt-1 focus:outline-none focus:ring-2 focus:ring-white"
                type="button"
                @click.prevent="show = false"
              >
                <span class="sr-only">Fermer</span>
                <i class="bx bx-x text-3xl"></i>
              </button>
            </div>
            <div class="mt-6 relative flex-1 px-4 sm:px-6">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropOptions } from '@vue/composition-api'

export default defineComponent({
  props: {
    activator: {
      type: Boolean,
      required: true,
    } as PropOptions<boolean>,
    extended: {
      type: Boolean,
      required: false,
    } as PropOptions<boolean>,
  },
  setup(props, { emit }) {
    const show = computed({
      get(): boolean {
        return props.activator ?? false
      },
      set(value: boolean): void {
        emit('update:activator', value)
      },
    })

    return { show }
  },
})
</script>
