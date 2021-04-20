<template>
  <div class="rounded-lg text-white bg-gray-700">
    <div class="px-4 pt-4">
      <p class="text-lg font-semibold text-gray-200"><slot></slot></p>
      <div class="flex items-end">
        <p class="text-3xl text-gray-50">{{ last }}</p>
        <p
          :class="{
            'text-green-500': diff > 0,
            'text-red-500': diff < 0,
            'text-yellow-500': diff === 0,
          }"
          class="ml-2 mb-1 font-light text-sm"
        >
          {{ diff > 0 ? '▲' : '▲' }} {{ diff || 0 }}%
        </p>
      </div>
    </div>
    <charts-line :height="130" :data="data" class="mb-2" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    } as PropOptions<number[]>,
  },
  setup(props) {
    // Methods
    const getDiff = (stats: number[]): number => {
      const elements = stats.slice(Math.max(stats.length - 2, 0))

      const first = elements[0] || 0
      const last = elements[elements.length - 1] - first

      if (first === 0) {
        return 0
      }

      return Math.round((last / first) * 100)
    }

    const getLast = (stats: number[]): number => {
      return stats[stats.length - 1] ?? 0
    }

    // Data
    const diff = getDiff(props.data!)
    const last = getLast(props.data!)

    return { diff, last }
  },
})
</script>
