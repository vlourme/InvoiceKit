import * as admin from 'firebase-admin'
import { firestore } from 'firebase-admin'
import * as functions from 'firebase-functions'

const { FieldValue } = firestore
const db = admin.firestore()

export const leaveTeam = functions.https.onCall(async (payload, context) => {
  // Check for authenticated user
  const uid = context.auth?.uid
  if (!uid) {
    return { success: false, message: 'Not authenticated' }
  }

  // Query
  const doc = await db.collection('teams').doc(payload.teamId).get()

  // Get data
  const data = doc.data()

  // Check if document is not empty
  if (!doc.exists || !data) {
    return { success: false, message: 'Team is not found' }
  }

  // Prevent owner leaving without deleting team
  if (data.owner === uid) {
    return {
      success: false,
      message: 'Owner cannot leave team without deleting it',
    }
  }

  // Update members
  return doc.ref
    .update({
      ['members.' + uid]: FieldValue.delete(),
    })
    .then(() => {
      return { success: true, message: 'User leaved the team' }
    })
    .catch(() => {
      return { success: false, message: 'Error while updating team members' }
    })
})
