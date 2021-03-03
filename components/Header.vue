<template>
  <div>
    <v-toolbar color="#5386E4" dark extended flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-toolbar>

    <slot></slot>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Header',
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('SET_DRAWER', val)
      },
    },
  },
  methods: {
    ...mapActions(['toggleDrawer']),
  },
}
</script>
