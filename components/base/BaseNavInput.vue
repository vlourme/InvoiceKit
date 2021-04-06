<template>
  <input
    v-bind="$attrs"
    type="text"
    class="bg-gray-200 bg-opacity-50 hover:bg-opacity-100 focus:bg-opacity-100 focus:outline-none transition-colors px-4 h-full"
    @input="$emit('input', $event.target.value)"
  />
</template>
