import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamInvoiceUpdate = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}/invoices/{docId}')
  .onUpdate(async (handler, context) => {
    // Check for status change
    const before = handler.before.data()
    const after = handler.after.data()

    // Prepare changes
    const changes: { [key: string]: firestore.FieldValue } = {}

    // Check for status changes
    if (before.status !== after.status) {
      changes['counter.' + before.status] = FieldValue.increment(-1)
      changes['counter.' + after.status] = FieldValue.increment(1)
    }

    // Check for type changes
    if (before.type !== after.type) {
      changes['counter.' + before.type] = FieldValue.increment(-1)
      changes['counter.' + after.type] = FieldValue.increment(1)
    }

    // Update index
    const ref = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('invoices')
      .where('link', '==', handler.before.id)
      .limit(1)
      .get()

    if (ref.docs[0]) {
      const doc = ref.docs[0]

      await doc.ref.update({
        ...doc.data(),
        id: after.id,
        updatedAt: new Date(),
        status: after.status,
        type: after.type,
      })
    }

    // Make changes
    if (Object.keys(changes).length === 0) {
      return
    }

    // Update counter
    return db.collection('teams').doc(context.params.teamId).update(changes)
  })
