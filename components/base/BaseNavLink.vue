<template>
  <nuxt-link
    v-bind="$attrs"
    class="bg-gray-200 bg-opacity-50 h-14 px-4 inline-flex font-medium items-center hover:bg-opacity-100 focus:outline-none"
    v-on="$listeners"
  >
    <slot></slot>
  </nuxt-link>
</template>
