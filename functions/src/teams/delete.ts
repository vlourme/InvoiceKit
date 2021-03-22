import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
const tools = require('firebase-tools')

const db = admin.firestore()

export const deleteTeam = functions.https.onCall(async (payload, context) => {
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

  // Prevent members deleting team
  if (data.owner !== uid) {
    return {
      success: false,
      message: 'Only owner can delete a team',
    }
  }

  // Delete team
  return tools.firestore
    .delete(doc.ref.path, {
      project: 'invoicekit01',
      recursive: true,
      yes: true,
    })
    .then(() => {
      return {
        success: true,
        message: 'Team has been deleted',
      }
    })
    .catch(() => {
      return {
        success: false,
        message: 'Cannot delete team',
      }
    })
})
