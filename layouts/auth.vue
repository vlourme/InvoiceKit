<template>
  <div
    id="main"
    class="font-body subpixel-antialiased h-screen flex justify-center items-center"
  >
    <div class="p-4 rounded-md bg-gray-100 max-w-md w-full">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  middleware: 'preventAuth',
}
</script>

<style scoped>
#main {
  background: url('~/assets/auth-pattern.png');
}
</style>
