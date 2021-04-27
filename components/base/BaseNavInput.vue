<template>
  <div class="relative mr-2">
    <input
      v-bind="$attrs"
      type="text"
      class="px-4 py-2 rounded-md bg-gray-200 text-gray-800 border-2 border-transparent inline-flex font-medium items-center hover:bg-gray-300 focus:outline-none focus:border-gray-200 w-full"
      @input="$emit('input', $event.target.value)"
    />
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
    >
      <i class="bx bxl-algolia text-2xl text-blue-600"></i>
    </div>
  </div>
</template>
