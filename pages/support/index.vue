<template>
  <div>
    <Header> Aide et support </Header>

    <div class="p-4 grid grid-cols-4">
      <div class="col-span-3">
        <div v-if="page">
          <h2 class="text-3xl font-semibold text-gray-600">{{ page.title }}</h2>
          <nuxt-content class="prose" :document="page"> </nuxt-content>
        </div>
        <div v-else>
          <p>Vous pouvez voir les fiches d'aides disponibles sur la droite.</p>
        </div>
      </div>
      <div>
        <div class="w-full px-2 py-3 bg-gray-50 rounded-md">
          <h1 class="text-2xl my-2 mx-3">Articles</h1>
          <ul>
            <li v-for="article in articles" :key="article.path">
              <button
                :class="{
                  'bg-blue-100 hover:bg-current pointer-events-none':
                    article.path === path,
                }"
                class="flex justify-between w-full px-3 rounded-md hover:bg-gray-100 transition-colors focus:outline-none items-center py-2"
                type="button"
                @click="show(article.path)"
              >
                <p class="font-medium text-gray-700 text-left">
                  {{ article.title }}
                </p>
                <p class="font-light text-gray-500 text-sm text-right">
                  {{ article.category }}
                </p>
              </button>
            </li>
          </ul>
        </div>
      </div>
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
    const articles = ref<IContentDocument[]>([])
    const page = ref<IContentDocument | null>()

    // Computed
    const path = computed(() => {
      return page.value?.path ?? null
    })

    // Fetch
    useFetch(async () => {
      articles.value = (await ctx
        .$content('support')
        .only(['title', 'description', 'category'])
        .sortBy('category')
        .sortBy('order')
        .fetch()) as IContentDocument[]
    })

    // Methods
    const show = async (path: string) => {
      page.value = (await ctx.$content(path).fetch()) as IContentDocument
    }

    return { page, articles, show, path }
  },
})
</script>
