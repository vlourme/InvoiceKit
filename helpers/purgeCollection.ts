import { Context } from '@nuxt/types'
import firebase from 'firebase'
import _ from 'lodash'

/**
 * Delete every item from a (sub-)collections and defined path
 *
 * @param app Nuxt Context
 * @param path Path before collections to purge
 */
export const purge = async (
  app: Context,
  path: string,
  collections: string[]
): Promise<void> => {
  // Trim trailing slash
  path = _.trimEnd(path, '/')

  // Iterate collections
  for (const collection of collections) {
    const docs = await app.$fire.firestore
      .collection(`${path}/${collection}`)
      .get()

    purgeCollection(docs)
  }
}

/**
 * Purge a collection from a query
 *
 * @param docs
 */
export const purgeCollection = (
  docs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
): void => {
  docs.forEach(async (doc) => {
    await doc.ref.delete()
  })
}
