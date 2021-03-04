<template>
  <div>
    <v-toolbar color="#5386E4" dark extended flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-toolbar>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    drawer: {
      get() {
        return this.$store.state.sidebar.drawer
      },
      set(val) {
        this.$store.commit('sidebar/SET_DRAWER', val)
      },
    },
  },
}
</script>
