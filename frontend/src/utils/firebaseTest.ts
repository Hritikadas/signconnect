// Firebase Database Connection Test Utility
import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase.ts';

export const testFirebaseConnection = async (): Promise<boolean> => {
  if (!database) {
    console.error('Firebase database not initialized');
    return false;
  }

  try {
    // Test write
    const testRef = ref(database, 'test/connection');
    await set(testRef, {
      timestamp: Date.now(),
      message: 'SignConnect database connection test',
      status: 'success'
    });

    // Test read
    const snapshot = await get(testRef);
    const data = snapshot.val();
    
    if (data && data.message === 'SignConnect database connection test') {
      console.log('✅ Firebase database connection successful!', data);
      
      // Clean up test data
      await set(testRef, null);
      
      return true;
    } else {
      console.error('❌ Firebase database read test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase database connection failed:', error);
    return false;
  }
};

// Test function that can be called from browser console
(window as any).testFirebase = testFirebaseConnection;