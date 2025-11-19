import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'

// Firebase configuration - hardcoded values
const firebaseConfig = {
  apiKey: "AIzaSyDPYCFbVGakt0uBmE3OZRh00wUDDXgvgXY",
  authDomain: "skn-hackfest.firebaseapp.com",
  projectId: "skn-hackfest",
  storageBucket: "skn-hackfest.firebasestorage.app",
  messagingSenderId: "687898768842",
  appId: "1:687898768842:web:812be8fba162b2bfc9cb33",
  databaseURL: "https://skn-hackfest-default-rtdb.asia-southeast1.firebasedatabase.app",
}

// Initialize Firebase
let app: FirebaseApp | null = null
let database: Database | null = null
let firestore: Firestore | null = null
let auth: Auth | null = null

// Check if we're on the client side
const isBrowser = typeof window !== 'undefined'

// Synchronous initialization function
const initializeFirebase = (): void => {
  if (!isBrowser) return

  try {
    if (!getApps().length) {
      // Validate required fields silently
      if (!firebaseConfig.projectId || !firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
        console.warn('Firebase config is incomplete')
        return
      }

      // Initialize Firebase app with complete config
      try {
        app = initializeApp(firebaseConfig)
      } catch (error: any) {
        // Silently handle initialization errors
        if (error.code !== 'app/already-initialized') {
          console.warn('Firebase app initialization warning:', error.message)
        }
        try {
          app = getApp()
        } catch {
          // App not available
        }
      }

      if (app) {
        // Initialize database - MUST pass databaseURL explicitly for Realtime Database
        try {
          database = getDatabase(app, firebaseConfig.databaseURL)
        } catch (error: any) {
          // Silently handle - database might not be needed immediately
          if (process.env.NODE_ENV === 'development') {
            console.warn('Firebase Database initialization warning:', error.message)
          }
        }

        // Initialize other services
        try {
          firestore = getFirestore(app)
          auth = getAuth(app)
        } catch (error: any) {
          // Silently handle
          if (process.env.NODE_ENV === 'development') {
            console.warn('Firebase services initialization warning:', error.message)
          }
        }
      }
    } else {
      try {
        app = getApp()
        if (app) {
          try {
            database = getDatabase(app, firebaseConfig.databaseURL)
          } catch {
            // Silently handle
          }
          try {
            firestore = getFirestore(app)
            auth = getAuth(app)
          } catch {
            // Silently handle
          }
        }
      } catch {
        // Silently handle
      }
    }
  } catch (error: any) {
    // Completely silent - don't break Fast Refresh
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase initialization warning (non-blocking):', error.message)
    }
  }
}

// Initialize on client side synchronously
if (isBrowser) {
  initializeFirebase()
}

// Export initialization function for components that need to ensure Firebase is ready
export { initializeFirebase }

// Export instances (may be null initially)
export { app, database, firestore, auth } 
