import { Ref, ref, useContext } from '@nuxtjs/composition-api'
import { mapSnapshot } from '~/helpers/documentMapper'
import { Model } from '~/types/model'

interface OptionalProperty extends Model {
  [$key: string]: any
}

export default <T extends OptionalProperty>(
  id: string,
  path: string,
  value: T[] = []
) => {
  // Context
  const ctx = useContext()

  // Data
  const search = ref('')
  const results = ref(value) as Ref<T[]>

  // Methods
  const doSearch = async (): Promise<void> => {
    if (search.value.length >= 2 || search.value.length === 0) {
      results.value = []
      await getData()
    }
  }

  const getData = async (): Promise<void> => {
    // Query
    let query = ctx.$fire.firestore
      .collection(path)
      .orderBy(id)
      .startAfter(
        results.value.length > 0
          ? results.value[results.value.length - 1][id] ?? null
          : null
      )
      .limit(15)

    // On search
    if (search.value.length >= 3) {
      results.value = []
      query = query.startAt(search.value).endAt(search.value + '\uF8FF')
    }

    // Get ref
    const ref = await query.get()

    // Push customers
    results.value.push(...mapSnapshot<T>(ref))
  }

  return { search, results, doSearch, getData }
}
