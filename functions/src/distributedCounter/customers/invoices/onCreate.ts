import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamInvoiceCreate = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}/invoices/{docId}')
  .onCreate(async (handler, context) => {
    // Get date
    const date = new Date()

    // Get invoice data
    const invoice = handler.data()

    // Get customer reference
    const ref = await db
      .collection('teams')
      .doc(context.params.teamId)
      .collection('customers')
      .doc(context.params.customerId)
      .get()

    // Create index
    db.collection('teams')
      .doc(context.params.teamId)
      .collection('invoices')
      .add({
        createdAt: date,
        updatedAt: date,
        customer: {
          ...ref.data(),
          $key: ref.id,
        },
        id: invoice.id,
        link: handler.id,
        status: invoice.status,
        type: invoice.type,
      })

    // Change
    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        ['counter.' + invoice.status]: FieldValue.increment(1),
        ['counter.' + invoice.type]: FieldValue.increment(1),
      })
  })
