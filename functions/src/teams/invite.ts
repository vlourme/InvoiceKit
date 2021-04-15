import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()

export const inviteUser = functions.https.onCall(async (payload, context) => {
  // Check for authenticated user
  const uid = context.auth?.uid
  if (!uid) {
    return { success: false, message: 'Not authenticated' }
  }

  // Check email
  const userRef = await db
    .collection('users')
    .where('email', '==', payload.email)
    .limit(1)
    .get()

  if (userRef.empty) {
    return { success: false, message: 'Cannot read user' }
  }

  // Get team
  const teamRef = await db.collection('teams').doc(payload.teamId).get()

  if (!teamRef.exists) {
    return { success: false, message: 'Cannot read team' }
  }
  const team = teamRef.data()

  // Get owner
  const ownerRef = await db.collection('users').doc(team?.owner).get()

  if (!ownerRef.exists) {
    return { success: false, message: 'Cannot read team owner' }
  }
  const owner = ownerRef.data()

  // Update members
  return db
    .collection('users')
    .doc(userRef.docs[0].id)
    .collection('invites')
    .add({
      name: team?.name,
      owner: owner?.name,
      teamId: payload.teamId,
      role: payload.role,
    })
    .then(() => ({
      success: true,
      message: 'Member was invited.',
    }))
    .catch(() => ({ success: false, message: 'Cannot invite user' }))
})
