<template>
  <div>
    <h1 class="text-lg font-medium text-gray-600">
      <slot name="title"></slot>
    </h1>
    <p class="text-sm text-gray-500">
      <slot name="description"></slot>
    </p>
    <div class="mt-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>
