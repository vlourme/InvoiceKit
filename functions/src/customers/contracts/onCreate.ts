import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
import { client, getIndexName } from '../../algolia'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamContractCreate = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}/contracts/{docId}')
  .onCreate(async (handler, context) => {
    // Get date
    const date = new Date()

    // Get contract data
    const contract = handler.data()

    // Get customer reference
    const ref = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('customers')
      .doc(context.params.customerId)
      .get()

    // Index data
    const data = {
      createdAt: date,
      updatedAt: date,
      customer: {
        ...ref.data(),
        $key: ref.id,
      },
      link: handler.id,
      ...contract,
    }

    // Create index
    db.collection('teams')
      .doc(context.params.teamId)
      .collection('contracts')
      .add(data)

    // Store in algolia
    const index = client.initIndex(getIndexName('contracts'))
    await index.saveObject({
      ...data,
      objectID: handler.id,
      teamID: context.params.teamId,
    })

    // Change
    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        'counter.contracts': FieldValue.increment(1),
      })
  })
