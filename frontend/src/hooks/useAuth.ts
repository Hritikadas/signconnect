import { useFirebaseAuth } from '../contexts/FirebaseAuthContext.tsx';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
  providerData: Array<{
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  }>;
}

export interface UseAuthReturn {
  // User data
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // User info helpers
  displayName: string;
  firstName: string;
  email: string;
  photoURL: string | null;
  isGoogleUser: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Real-time data
  onlineUsers: any[];
  availableUsers: any[];
  createSession: (targetUserId: string) => Promise<string>;
  joinSession: (sessionId: string) => Promise<void>;
  currentSession: any;
}

export const useAuth = (): UseAuthReturn => {
  const {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    onlineUsers,
    availableUsers,
    createSession,
    joinSession,
    currentSession
  } = useFirebaseAuth();

  // Transform Firebase user to our AuthUser interface
  const user: AuthUser | null = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
    emailVerified: currentUser.emailVerified,
    isAnonymous: currentUser.isAnonymous,
    metadata: {
      creationTime: currentUser.metadata.creationTime,
      lastSignInTime: currentUser.metadata.lastSignInTime
    },
    providerData: currentUser.providerData.map(provider => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      photoURL: provider.photoURL
    }))
  } : null;

  // Helper computed values
  const isAuthenticated = !!currentUser;
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const firstName = displayName.split(' ')[0];
  const email = currentUser?.email || '';
  const photoURL = currentUser?.photoURL;
  const isGoogleUser = currentUser?.providerData.some(provider => provider.providerId === 'google.com') || false;

  return {
    // User data
    user,
    isAuthenticated,
    isLoading: loading,
    
    // User info helpers
    displayName,
    firstName,
    email,
    photoURL,
    isGoogleUser,
    
    // Auth methods
    login,
    loginWithGoogle,
    register,
    logout,
    
    // Real-time data
    onlineUsers,
    availableUsers,
    createSession,
    joinSession,
    currentSession
  };
};