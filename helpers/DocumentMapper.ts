import firebase from 'firebase'
import Model from '~/types/model'

/**
 * Transform a snapshot containing multiple documents into a Array of Model
 * This will also assign the document id as `$key`
 *
 * @param snapshot
 * @returns Array
 */
export function mapSnapshot<T extends Model>(
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
): Array<T> {
  return snapshot.docs.map(
    (document) =>
      ({
        ...document.data(),
        $key: document.id,
      } as T)
  )
}

/**
 * Transform a snapshot document as Model with assigned `$key`
 *
 * @param document
 * @returns T
 */
export function mapDocument<T extends Model>(
  document: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): T {
  return {
    ...document.data(),
    $key: document.id,
  } as T
}
