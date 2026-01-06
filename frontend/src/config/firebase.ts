import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingVars);
  throw new Error(`Missing Firebase configuration: ${missingVars.join(', ')}`);
}

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY!,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN!,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || undefined,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.REACT_APP_FIREBASE_APP_ID!,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || undefined
};

// Log configuration in development (without sensitive data)
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    databaseURL: firebaseConfig.databaseURL,
    region: firebaseConfig.databaseURL?.includes('asia-southeast1') ? 'Singapore' : 'US-Central',
    hasAnalytics: !!firebaseConfig.measurementId
  });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider with enhanced configuration
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
  // Allow any domain by not specifying hd parameter
});

// Add additional scopes for better user info
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Initialize Realtime Database (only if URL is provided)
export const database: Database | null = firebaseConfig.databaseURL ? getDatabase(app) : null;

// Initialize Analytics (only in production and if measurementId is provided)
export const analytics = firebaseConfig.measurementId && typeof window !== 'undefined' 
  ? getAnalytics(app) 
  : null;

// Warn if database URL is missing
if (!firebaseConfig.databaseURL) {
  console.warn('Firebase Realtime Database URL not configured. Real-time features will be disabled.');
}

// Test database connection in development
if (process.env.NODE_ENV === 'development' && database) {
  setTimeout(async () => {
    try {
      const { testFirebaseConnection } = await import('../utils/firebaseTest.ts');
      const isConnected = await testFirebaseConnection();
      if (isConnected) {
        console.log('🎉 Firebase Realtime Database is ready for SignConnect!');
      }
    } catch (error) {
      console.warn('Database connection test skipped:', error);
    }
  }, 2000);
}

// Connect to emulators in development
if (process.env.NODE_ENV === 'development') {
  // Uncomment these lines if you want to use Firebase emulators
  // import { connectAuthEmulator, connectDatabaseEmulator } from 'firebase/auth';
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // if (database) connectDatabaseEmulator(database, 'localhost', 9000);
}

export default app;