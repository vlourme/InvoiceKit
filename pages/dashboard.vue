<template>
  <div>
    <Header> Tableau de bord</Header>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Dashboard',
  layout: 'dashboard',
  fetch() {},
  head: () => ({
    title: 'Tableau de bord',
  }),
  computed: {
    ...mapState(['user']),
  },
}
</script>

<style scoped></style>
