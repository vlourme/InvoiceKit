import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()

export const onTeamCustomerUpdate = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}')
  .onUpdate(async (handler, context) => {
    // Get invoices
    const docs = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('invoices')
      .where('customer.$key', '==', context.params.customerId)
      .get()

    // Prepare batch operation
    const batch = db.batch()

    // Add operations
    docs.forEach((query) => {
      batch.update(query.ref, {
        customer: {
          ...handler.after.data(),
          $key: handler.after.id,
        },
      })
    })

    // Commit
    return batch.commit()
  })
