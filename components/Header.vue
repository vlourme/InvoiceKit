<template>
  <div>
    <v-app-bar app flat clipped-right color="#5386E4">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="app-bar">
        <slot name="title"></slot>
      </v-toolbar-title>

      <template v-if="withSearch">
        <v-spacer></v-spacer>

        <slot name="search"></slot>
      </template>

      <v-spacer />

      <slot name="actions"></slot>
    </v-app-bar>

    <v-container>
      <slot></slot>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    withSearch: Boolean,
  },
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
