import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamInvoiceDelete = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}/invoices/{docId}')
  .onDelete(async (handler, context) => {
    // Create index
    const index = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('invoices')
      .where('link', '==', handler.id)
      .limit(1)
      .get()

    // Delete index
    if (index.docs[0]) {
      index.docs[0].ref.delete()
    }

    // Get data
    const invoice = handler.data()

    // Change
    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        ['counter.' + invoice.status]: FieldValue.increment(-1),
        ['counter.' + invoice.type]: FieldValue.increment(-1),
      })
  })
