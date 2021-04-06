<template>
  <input
    v-bind="$attrs"
    type="text"
    class="w-full mt-1 px-4 py-2 bg-gray-50 disabled:opacity-60 focus:outline-none focus:border-indigo-500 rounded-md border-2 transition-colors border-gray-200"
    @input="$emit('input', $event.target.value)"
  />
</template>
