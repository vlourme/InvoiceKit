<template>
  <div class="py-8 px-6 max-w-7xl mx-auto grid grid-cols-3">
    <div class="py-2">
      <slot name="description"></slot>
    </div>
    <div class="col-span-2">
      <div class="w-full bg-gray-50 mx-2 p-6 rounded-lg">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
