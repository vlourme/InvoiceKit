import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

const db = admin.firestore()

export const teamCharts = functions.pubsub
  .schedule('0 0 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    // Database
    const ref = await db.collection('teams').get()
    const batch = db.batch()

    // Date
    const old = new Date()
    old.setDate(old.getDate() - 14)
    const oldFormat = old.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]

    // Get teams
    for (const doc of ref.docs) {
      const team = doc.data()

      // Delete old charts
      if (team.charts[oldFormat]) {
        delete team.charts[oldFormat]
      }

      // Add new charts
      team.charts[today] = team.counter

      // Add to batch
      batch.update(doc.ref, team)
    }

    // Execute batch
    return batch.commit()
  })
