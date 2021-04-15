import * as functions from 'firebase-functions'
import algolia from 'algoliasearch'

export const ALGOLIA_ID = functions.config().algolia.app_id
export const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key
export const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key

export const client = algolia(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)

export const getIndexName = (name: string) => {
  if (functions.config().runtime.env === 'production') {
    return `PROD_${name}`
  } else {
    return `DEV_${name}`
  }
}
