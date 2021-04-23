import {
  computed,
  Ref,
  ref,
  useContext,
  useStore,
} from '@nuxtjs/composition-api'
import algolia from 'algoliasearch'
import { mapSnapshot } from '~/helpers/documentMapper'
import RootState from '~/store'
import { Model } from '~/types/model'

interface OptionalProperty extends Model {
  [$key: string]: any
}

export default <T extends OptionalProperty>(
  indexName: string,
  path: string,
  primaryKey: string,
  counter?: string[],
  value: T[] = []
) => {
  // Context
  const ctx = useContext()
  const store = useStore<RootState>()

  // Algolia instance
  if (!store.state.team.team?.algoliaKey) {
    throw new Error('no algolia key')
  }

  const client = algolia(
    ctx.env.algolia_app_id,
    store.state.team.team.algoliaKey
  )

  // Parse index name
  let indice = 'DEV_' + indexName
  if (!ctx.isDev) {
    indice = 'PROD_' + indexName
  }
  const index = client.initIndex(indice)

  // Data
  const mode = ref('base')
  const search = ref('')
  const results = ref(value) as Ref<OptionalProperty[]>

  // Computed
  const team = computed(() => store.state.team.team!)
  const canLoadMore = computed(() => {
    let max = 0

    if (!counter) {
      max = team.value.counter[indexName]
    } else {
      for (const val of counter) {
        max += team.value.counter[val]
      }
    }

    return max !== results.value.length
  })

  // Methods
  const fetchData = async (): Promise<void> => {
    if (search.value.length > 0) {
      mode.value = 'search'
      await executeSearch()
    } else {
      if (mode.value === 'search') {
        results.value = []
      }
      mode.value = 'base'

      await getBaseData()
    }
  }

  const getBaseData = async (): Promise<void> => {
    const query = ctx.$fire.firestore
      .collection(path)
      .orderBy(primaryKey)
      .startAfter(results.value.length)
      .limit(15)

    const data = await query.get()
    results.value.push(...mapSnapshot<T>(data))
  }

  const executeSearch = async (): Promise<void> => {
    // Query
    console.log(search.value)
    console.log(mode.value)
    const query = await index.search(search.value)

    const hits: OptionalProperty[] = []

    for (const hit of query.hits) {
      const obj: OptionalProperty = {
        ...hit,
      }
      obj.$key = hit.objectID
      hits.push(obj)
    }

    console.log(query)
    console.log(hits)

    results.value = hits
  }

  return { search, results, canLoadMore, fetchData }
}
