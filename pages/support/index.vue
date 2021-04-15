<template>
  <div class="flex h-screen">
    <div class="max-w-xs w-full bg-gray-50 h-full border-r p-4">
      <div
        v-for="(category, idx) in categories"
        :key="idx"
        class="mt-2 first:mt-0"
      >
        <p class="uppercase text-gray-500 font-semibold text-sm">
          {{ category.title }}
        </p>
        <ul class="mt-1">
          <li v-for="item in category.articles" :key="item.slug">
            <button
              :class="{ 'bg-blue-200 pointer-events-none': path == item.path }"
              class="px-2 py-1.5 rounded-md bg-gray-200 hover:bg-blue-100 text-gray-800 focus:outline-none w-full text-left my-1"
              type="button"
              @click.prevent="show(item.path)"
            >
              {{ item.title }}
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto">
      <Header>{{ page ? page.title : 'Aide et support' }}</Header>
      <nuxt-content
        :document="page"
        class="prose prose-sm sm:prose lg:prose-lg xl:prose-xl prose-indigo max-w-xl py-2 px-4"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { IContentDocument } from '@nuxt/content/types/content'
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()

    // Data
    const categories = ref([
      {
        title: 'Bases',
        articles: [] as IContentDocument[],
      },
      {
        title: 'Avancé',
        articles: [] as IContentDocument[],
      },
    ])
    const page = ref<IContentDocument | null>()

    // Computed
    const path = computed(() => {
      return page.value?.path ?? null
    })

    // Fetch
    useFetch(async () => {
      for (const cat of categories.value) {
        cat.articles = (await ctx
          .$content('support')
          .only(['title', 'description', 'category'])
          .where({ category: cat.title })
          .sortBy('order')
          .fetch()) as IContentDocument[]
      }

      // Load first article by default
      await show(categories.value[0].articles[0].path)
    })

    // Methods
    const show = async (path: string) => {
      page.value = (await ctx.$content(path).fetch()) as IContentDocument
    }

    return { page, categories, show, path }
  },
})
</script>
