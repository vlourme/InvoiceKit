import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()

export const acceptInvite = functions.https.onCall(async (payload, context) => {
  // Check for authenticated user
  const uid = context.auth?.uid
  if (!uid) {
    return { success: false, message: 'Not authenticated' }
  }

  // Get invite data
  const ref = await db
    .collection('users')
    .doc(uid)
    .collection('invites')
    .doc(payload.inviteId)
    .get()

  if (!ref.exists) {
    return { success: false, message: 'Invite does not exists' }
  }
  const invite = ref.data()

  // Add user to the team
  return db
    .collection('teams')
    .doc(invite?.teamId)
    .update({
      [`members.` + uid]: invite?.role,
    })
    .then(async () => {
      // Delete invite
      await ref.ref.delete()

      return {
        success: true,
        message: 'User joined the team',
      }
    })
    .catch(() => ({
      success: false,
      message: 'Cannot join team',
    }))
})
