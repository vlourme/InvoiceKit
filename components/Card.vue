<template>
  <v-card class="mx-auto" :max-width="width">
    <v-toolbar v-if="!noToolbar" flat>
      <v-toolbar-title class="grey--text">
        <slot name="title"></slot>
      </v-toolbar-title>

      <template v-if="withSearch">
        <v-spacer></v-spacer>

        <slot name="search"></slot>
      </template>

      <v-spacer></v-spacer>

      <slot name="actions"></slot>
    </v-toolbar>

    <v-divider v-if="!noDivider"></v-divider>

    <v-card-text v-if="!noBody" key="body">
      <slot></slot>
    </v-card-text>

    <slot v-else key="body"></slot>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  name: 'Card',
  props: {
    withSearch: Boolean,
    width: {
      default: 700,
      type: Number,
      required: false,
    } as PropOptions<number>,
    noBody: Boolean,
    noToolbar: Boolean,
    noDivider: Boolean,
  },
})
</script>
