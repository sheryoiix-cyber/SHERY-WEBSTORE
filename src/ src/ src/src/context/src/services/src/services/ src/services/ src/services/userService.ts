import { db } from './firebase'
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'

export const getUserProfile = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export const updateUserProfile = async (userId: string, data: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), data)
    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}
