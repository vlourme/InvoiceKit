<template>
  <input
    v-bind="$attrs"
    type="text"
    class="px-4 py-2 mr-2 rounded-md bg-gray-200 text-gray-800 border-2 border-transparent inline-flex font-medium items-center hover:bg-gray-300 focus:outline-none focus:border-gray-200"
    @input="$emit('input', $event.target.value)"
  />
</template>
