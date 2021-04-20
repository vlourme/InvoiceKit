<template>
  <div class="flex items-end justify-center">
    <div
      v-for="(n, idx) in getChartData()"
      :key="idx"
      class="mx-2 mt-2 flex flex-col items-center"
    >
      <div :style="`height: ${n}px`" class="bg-gray-50 w-1 rounded-full"></div>
      <div class="text-gray-400 text-sm mt-2">
        {{ data[idx] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    height: {
      type: Number,
      default: 100,
    },
    data: {
      type: Array,
      default: [],
    } as PropOptions<number[]>,
  } as const,
  setup({ height, data }) {
    const getChartData = (): number[] => {
      // Find hightest number
      const hightest = Math.max(...data!)

      const result = []

      for (const n of data!) {
        let value = (n * height) / hightest

        if (value < 5) {
          value = 5
        }

        result.push(Math.round(value))
      }

      return result
    }

    return { getChartData }
  },
})
</script>
