<template>
  <transition
    enter-class="opacity-0"
    enter-active-class="opacity-100"
    leave-active-class="opacity-100"
    leave-to-class="opacity-0"
    class="transition-all"
  >
    <div
      v-show="show"
      class="fixed z-10 inset-0 transition-all overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 transition-all duration-300 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          :class="{ 'sm:max-w-lg': !extended, 'sm:max-w-2xl': extended }"
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <slot name="icon"></slot>
              <div class="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  id="dialog-1-title"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  <slot name="title"></slot>
                </h3>
                <div class="mt-2">
                  <slot name="content"></slot>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
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
  computed: {
    show: {
      get(): boolean {
        return this.activator
      },
      set(value: boolean): void {
        this.$emit('update:activator', value)
      },
    },
  },
})
</script>
