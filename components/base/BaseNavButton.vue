<template>
  <button
    v-bind="$attrs"
    type="button"
    class="px-4 py-2 mr-2 rounded-md disabled:opacity-60 disabled:pointer-events-none bg-gray-200 text-gray-700 border-2 border-transparent inline-flex font-medium items-center hover:bg-gray-300 focus:outline-none focus:border-gray-200"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>
