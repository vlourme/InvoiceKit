<template>
  <div class="relative inline-block text-left">
    <div
      class="flex items-center cursor-pointer hover:text-gray-200 focus:text-gray-200"
      @click="menu = !menu"
    >
      <slot></slot>
    </div>

    <div
      :class="menu ? 'block' : 'hidden'"
      class="origin-top-right text-black absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      <slot name="menu"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  data: () => ({
    menu: false,
  }),
}
</script>
