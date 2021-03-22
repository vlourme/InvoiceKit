import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'
const tools = require('firebase-tools')

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamCustomerDelete = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}')
  .onDelete(async (handler, context) => {
    // Delete sub-collections
    await tools.firestore.delete(handler.ref.path, {
      project: 'invoicekit01',
      recursive: true,
      yes: true,
    })

    // Delete linked invoices
    const batch = db.batch()

    const ref = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('invoices')
      .where('customer.$key', '==', context.params.customerId)
      .get()

    for (const doc of ref.docs) {
      batch.delete(doc.ref)
    }

    await batch.commit()

    // Update counter
    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        'counter.customers': FieldValue.increment(-1),
      })
  })
