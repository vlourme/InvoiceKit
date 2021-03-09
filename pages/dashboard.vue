<template>
  <div>
    <Header>
      <template #title>Tableau de bord</template>
    </Header>
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
    ...mapState('auth', ['user']),
  },
}
</script>

<style scoped></style>
