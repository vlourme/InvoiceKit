<template>
  <button
    v-bind="$attrs"
    type="button"
    class="bg-gray-200 bg-opacity-50 disabled:opacity-60 disabled:pointer-events-none h-14 px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>
