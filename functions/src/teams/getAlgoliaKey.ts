import * as functions from 'firebase-functions'
import { client, ALGOLIA_SEARCH_KEY } from './../algolia'

export const onTeamCreate = functions.firestore
  .document('/teams/{teamId}')
  .onCreate((handler, context) => {
    // Get API key
    const key = client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, {
      filters: `teamID:${context.params.teamId}`,
    })

    // Store key
    return handler.ref.update({
      algoliaKey: key,
    })
  })
