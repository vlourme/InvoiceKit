<template>
  <transition
    enter-class="opacity-0 scale-70"
    enter-to-class="opacity-100 scale-100"
    enter-active-class="transition-all transition-fastest ease-out-quad"
    leave-active-class="transition-all transition-faster ease-in-quad"
    leave-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-70"
  >
    <slot></slot>
  </transition>
</template>
