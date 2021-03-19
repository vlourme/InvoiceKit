import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()
const FieldValue = firestore.FieldValue

export const onTeamCustomerDelete = functions.firestore
  .document('/teams/{teamId}/customers/{customerId}')
  .onDelete((_handler, context) => {
    return db
      .collection('teams')
      .doc(context.params.teamId)
      .update({
        'counter.customers': FieldValue.increment(-1),
      })
  })
