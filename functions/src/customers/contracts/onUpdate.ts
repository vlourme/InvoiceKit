import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { client, getIndexName } from '../../algolia'

const db = admin.firestore()

export const onTeamContractUpdate = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}/contracts/{docId}')
  .onUpdate(async (handler, context) => {
    // Update in algolia
    const index = client.initIndex(getIndexName('contracts'))

    const after = handler.after.data()

    // Update index
    const ref = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('contracts')
      .where('link', '==', handler.before.id)
      .limit(1)
      .get()

    if (ref.docs[0]) {
      const doc = ref.docs[0]

      const data = {
        ...doc.data(),
        ...after,
        updatedAt: new Date(),
      }

      await doc.ref.update(data)

      await index.saveObject({
        ...data,
        objectID: handler.before.id,
        teamID: context.params.teamId,
      })
    }
  })
