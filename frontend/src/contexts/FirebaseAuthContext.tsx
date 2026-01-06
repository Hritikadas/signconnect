import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { ref, set, onDisconnect, serverTimestamp, onValue, off } from 'firebase/database';
import { auth, database, googleProvider } from '../config/firebase.ts';

interface FirebaseAuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  onlineUsers: OnlineUser[];
  availableUsers: OnlineUser[];
  createSession: (targetUserId: string) => Promise<string>;
  joinSession: (sessionId: string) => Promise<void>;
  currentSession: Session | null;
}

interface OnlineUser {
  uid: string;
  displayName: string;
  email: string;
  isOnline: boolean;
  lastSeen: number;
  status: 'available' | 'busy' | 'in-session';
}

interface Session {
  id: string;
  participants: string[];
  createdBy: string;
  createdAt: number;
  status: 'waiting' | 'active' | 'ended';
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider');
  }
  return context;
};

export const FirebaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<OnlineUser[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  // Authentication functions
  const register = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Set user data in database
      await setUserOnlineStatus(userCredential.user, true);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await setUserOnlineStatus(userCredential.user, true);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await setUserOnlineStatus(userCredential.user, true);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (currentUser) {
        await setUserOnlineStatus(currentUser, false);
      }
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(authError.message);
    }
  };

  // User status management
  const setUserOnlineStatus = async (user: User, isOnline: boolean) => {
    if (!database) {
      console.warn('Firebase Realtime Database not configured - skipping user status update');
      return;
    }

    const userRef = ref(database, `users/${user.uid}`);
    const userData = {
      uid: user.uid,
      displayName: user.displayName || 'Anonymous',
      email: user.email || '',
      isOnline,
      lastSeen: serverTimestamp(),
      status: isOnline ? 'available' : 'offline'
    };

    await set(userRef, userData);

    if (isOnline) {
      // Set up disconnect handler
      const disconnectRef = ref(database, `users/${user.uid}/isOnline`);
      await onDisconnect(disconnectRef).set(false);
      
      const lastSeenRef = ref(database, `users/${user.uid}/lastSeen`);
      await onDisconnect(lastSeenRef).set(serverTimestamp());
      
      const statusRef = ref(database, `users/${user.uid}/status`);
      await onDisconnect(statusRef).set('offline');
    }
  };

  // Session management
  const createSession = async (targetUserId: string): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');
    if (!database) throw new Error('Firebase Realtime Database not configured');

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionRef = ref(database, `sessions/${sessionId}`);
    
    const sessionData: Session = {
      id: sessionId,
      participants: [currentUser.uid, targetUserId],
      createdBy: currentUser.uid,
      createdAt: Date.now(),
      status: 'waiting'
    };

    await set(sessionRef, sessionData);

    // Update user status to busy
    await set(ref(database, `users/${currentUser.uid}/status`), 'in-session');
    await set(ref(database, `users/${targetUserId}/status`), 'in-session');

    // Send invitation to target user
    const invitationRef = ref(database, `invitations/${targetUserId}/${sessionId}`);
    await set(invitationRef, {
      sessionId,
      from: currentUser.uid,
      fromName: currentUser.displayName || 'Anonymous',
      createdAt: Date.now(),
      status: 'pending'
    });

    setCurrentSession(sessionData);
    return sessionId;
  };

  const joinSession = useCallback(async (sessionId: string): Promise<void> => {
    if (!currentUser) throw new Error('User not authenticated');
    if (!database) throw new Error('Firebase Realtime Database not configured');

    const sessionRef = ref(database, `sessions/${sessionId}`);
    await set(ref(database, `sessions/${sessionId}/status`), 'active');
    
    // Accept invitation
    await set(ref(database, `invitations/${currentUser.uid}/${sessionId}/status`), 'accepted');

    // Listen for session updates
    onValue(sessionRef, (snapshot) => {
      const session = snapshot.val();
      if (session) {
        setCurrentSession(session);
      }
    });
  }, [currentUser]);

  // Listen for online users
  useEffect(() => {
    if (!currentUser || !database) return;

    const usersRef = ref(database, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      if (users) {
        const userList: OnlineUser[] = Object.values(users);
        const onlineUserList = userList.filter(user => 
          user.isOnline && user.uid !== currentUser.uid
        );
        const availableUserList = onlineUserList.filter(user => 
          user.status === 'available'
        );
        
        setOnlineUsers(onlineUserList);
        setAvailableUsers(availableUserList);
      }
    });

    return () => off(usersRef, 'value', unsubscribe);
  }, [currentUser]);

  // Listen for invitations
  useEffect(() => {
    if (!currentUser || !database) return;

    const invitationsRef = ref(database, `invitations/${currentUser.uid}`);
    const unsubscribe = onValue(invitationsRef, (snapshot) => {
      const invitations = snapshot.val();
      if (invitations) {
        // Handle incoming invitations
        Object.entries(invitations).forEach(([sessionId, invitation]: [string, any]) => {
          if (invitation.status === 'pending') {
            // Show invitation notification
            const accept = window.confirm(
              `${invitation.fromName} wants to start a session with you. Accept?`
            );
            if (accept) {
              joinSession(sessionId);
            } else {
              // Decline invitation
              if (database) {
                set(ref(database, `invitations/${currentUser.uid}/${sessionId}/status`), 'declined');
              }
            }
          }
        });
      }
    });

    return () => off(invitationsRef, 'value', unsubscribe);
  }, [currentUser, joinSession]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await setUserOnlineStatus(user, true);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: FirebaseAuthContextType = {
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
  };

  return (
    <FirebaseAuthContext.Provider value={value}>
      {!loading && children}
    </FirebaseAuthContext.Provider>
  );
};