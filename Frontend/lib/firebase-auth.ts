import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup, 
  GoogleAuthProvider,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseAuthStateChanged
} from 'firebase/auth'
// Import app directly - it will be null initially but will be set when Firebase initializes
import { app } from './firebase'

// Initialize auth lazily to handle cases where app might not be initialized yet
let auth: ReturnType<typeof getAuth> | null = null
let googleProvider: GoogleAuthProvider | null = null

const getAuthInstance = async () => {
  // Check if we're on client side
  if (typeof window === 'undefined') {
    throw new Error('Firebase auth can only be used on the client side.')
  }

  // Ensure Firebase is initialized
  if (!app) {
    // Try to initialize if not already done
    const { initializeFirebase } = require('./firebase')
    await initializeFirebase()
  }

  // Get fresh app reference
  const firebaseApp = app

  if (!firebaseApp) {
    throw new Error('Firebase app not initialized. Please ensure Firebase is properly configured.')
  }
  
  if (!auth) {
    try {
      auth = getAuth(firebaseApp)
      googleProvider = new GoogleAuthProvider()
      // Set persistence when auth is first initialized
      setPersistence(auth, browserLocalPersistence)
        .catch((error) => {
          // Silently handle persistence errors
          if (process.env.NODE_ENV === 'development') {
            console.warn("Auth persistence warning:", error.message)
          }
        })
    } catch (error: any) {
      // Don't throw - return null or handle gracefully
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Auth initialization warning:', error.message)
      }
      throw error
    }
  }
  return auth
}

const getGoogleProvider = () => {
  if (!googleProvider) {
    getAuthInstance() // This will initialize googleProvider
  }
  return googleProvider!
}

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const authInstance = await getAuthInstance()
    const result = await createUserWithEmailAndPassword(authInstance, email, password)
    
    // Update the user's display name
    if (result.user) {
      await updateProfile(result.user, {
        displayName: displayName
      })
    }
    
    return { user: result.user, error: null }
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to create account'
    }
  }
}

// Email/Password Sign In
export const signIn = async (email: string, password: string) => {
  try {
    const authInstance = await getAuthInstance()
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password)
    return userCredential.user
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const authInstance = await getAuthInstance()
    const provider = getGoogleProvider()
    const result = await signInWithPopup(authInstance, provider)
    return { user: result.user, error: null }
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to sign in with Google'
    }
  }
}

let confirmationResultInstance: ConfirmationResult | null = null

// Phone Number Sign In
export const initializePhoneAuth = async () => {
  const authInstance = await getAuthInstance()
  if (!(window as any).recaptchaVerifier) {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(authInstance, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {}
    })
  }
  return (window as any).recaptchaVerifier
}

export const signInWithPhone = async (phoneNumber: string) => {
  try {
    const authInstance = await getAuthInstance()
    const recaptchaVerifier = await initializePhoneAuth()
    const result = await signInWithPhoneNumber(authInstance, phoneNumber, recaptchaVerifier)
    confirmationResultInstance = result
    return { confirmationResult: result, error: null }
  } catch (error: any) {
    return {
      confirmationResult: null,
      error: error.message || 'Failed to send verification code'
    }
  }
}

export const verifyPhoneCode = async (code: string) => {
  try {
    if (!confirmationResultInstance) {
      throw new Error('No confirmation result found')
    }
    const result = await confirmationResultInstance.confirm(code)
    return { user: result.user, error: null }
  } catch (error: any) {
    return {
      user: null,
      error: error.message || 'Failed to verify code'
    }
  }
}

// Sign Out
export const logOut = async () => {
  try {
    const authInstance = await getAuthInstance()
    await firebaseSignOut(authInstance)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// Get Current User
export const getCurrentUser = async () => {
  try {
    const authInstance = await getAuthInstance()
    return authInstance.currentUser
  } catch {
    return null
  }
}

// Auth State Observer
export const onAuthStateChanged = async (callback: Parameters<typeof firebaseAuthStateChanged>[1]) => {
  try {
    const authInstance = await getAuthInstance()
    return firebaseAuthStateChanged(authInstance, callback)
  } catch (error) {
    console.error('Auth state observer error:', error)
    // Return a no-op unsubscribe function
    return () => {}
  }
}