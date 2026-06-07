import { db } from './firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  Timestamp,
} from 'firebase/firestore'

export const getAllApps = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'apps'))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching apps:', error)
    return []
  }
}

export const getAppById = async (appId: string) => {
  try {
    const docSnapshot = await getDoc(doc(db, 'apps', appId))
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching app:', error)
    return null
  }
}

export const createApp = async (appData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'apps'), {
      ...appData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { id: docRef.id, ...appData }
  } catch (error) {
    console.error('Error creating app:', error)
    throw error
  }
}

export const updateApp = async (appId: string, appData: any) => {
  try {
    await updateDoc(doc(db, 'apps', appId), {
      ...appData,
      updatedAt: Timestamp.now(),
    })
    return { id: appId, ...appData }
  } catch (error) {
    console.error('Error updating app:', error)
    throw error
  }
}

export const deleteApp = async (appId: string) => {
  try {
    await deleteDoc(doc(db, 'apps', appId))
    return true
  } catch (error) {
    console.error('Error deleting app:', error)
    throw error
  }
}

export const purchaseApp = async (userId: string, appId: string) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      const purchasedApps = userDoc.data().purchasedApps || []
      if (!purchasedApps.includes(appId)) {
        purchasedApps.push(appId)
        await updateDoc(userRef, { purchasedApps })

        // Create purchase record
        await addDoc(collection(db, 'purchases'), {
          userId,
          appId,
          purchaseDate: Timestamp.now(),
          amount: 29.99,
          status: 'completed',
        })
      }
    }
  } catch (error) {
    console.error('Error purchasing app:', error)
    throw error
  }
}

export const getUserPurchasedApps = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return userDoc.data().purchasedApps || []
    }
    return []
  } catch (error) {
    console.error('Error fetching purchased apps:', error)
    return []
  }
}
