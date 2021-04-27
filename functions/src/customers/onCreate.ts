import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { client, getIndexName } from './../algolia'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamCustomerCreate = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}')
  .onCreate(async (handler, context) => {
    // Store in algolia
    const index = client.initIndex(getIndexName('customers'))
    await index.saveObject({
      ...handler.data(),
      objectID: handler.id,
      teamID: context.params.teamId,
    })

    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        'counter.customers': FieldValue.increment(1),
      })
  })
