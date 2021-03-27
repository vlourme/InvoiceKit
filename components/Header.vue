<template>
  <div class="h-14 w-full flex items-center bg-white border-b">
    <h2 class="py-2 px-4 font-semibold text-xl flex-1 leading-loose">
      <slot></slot>
    </h2>

    <div class="h-14 flex divide-x border-l border-r mr-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
}
</script>
