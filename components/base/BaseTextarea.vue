<template>
  <textarea
    v-bind="$attrs"
    class="w-full mt-1 px-4 py-2 bg-gray-50 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-gray-200"
    @input="$emit('input', $event.target.value)"
  >
    <slot></slot>
  </textarea>
</template>
