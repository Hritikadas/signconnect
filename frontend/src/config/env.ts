// Frontend environment variable validation

interface EnvConfig {
  apiUrl: string;
  socketUrl: string;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    databaseURL: string;
    measurementId?: string;
  };
  sentryDsn?: string;
  environment: string;
}

const requiredEnvVars = [
  'REACT_APP_API_URL',
  'REACT_APP_SOCKET_URL',
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FIREBASE_DATABASE_URL'
];

function validateEnv(): EnvConfig {
  const missing: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    const errorMessage = 
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `See .env.example for reference.`;
    
    console.error('❌ Environment Configuration Error:', errorMessage);
    
    // In development, show a user-friendly error
    if (process.env.NODE_ENV === 'development') {
      throw new Error(errorMessage);
    }
  }

  return {
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001',
    firebase: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || '',
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    },
    sentryDsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development'
  };
}

export const env = validateEnv();

// Log configuration on startup (without sensitive data)
if (process.env.NODE_ENV === 'development') {
  console.log('📋 Frontend Environment Configuration:');
  console.log(`   API URL: ${env.apiUrl}`);
  console.log(`   Socket URL: ${env.socketUrl}`);
  console.log(`   Firebase Project: ${env.firebase.projectId}`);
  console.log(`   Environment: ${env.environment}`);
  console.log(`   Sentry: ${env.sentryDsn ? 'Enabled' : 'Disabled'}`);
}

// Remove console.logs in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  // Keep console.error and console.warn for important messages
}
