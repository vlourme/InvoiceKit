import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { client, getIndexName } from '../../algolia'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamContractDelete = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}/contracts/{docId}')
  .onDelete(async (handler, context) => {
    // Delete in algolia
    const algolia = client.initIndex(getIndexName('contracts'))
    await algolia.deleteObject(handler.id)

    // Create index
    const index = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('contracts')
      .where('link', '==', handler.id)
      .limit(1)
      .get()

    // Delete index
    if (index.docs[0]) {
      index.docs[0].ref.delete()
    }

    // Change
    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        'counter.contracts': FieldValue.increment(-1),
      })
  })
