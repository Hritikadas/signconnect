import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, push, serverTimestamp, off } from 'firebase/database';
import { database } from '../config/firebase.ts';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext.tsx';

export interface Room {
  id: string;
  name: string;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  status: 'waiting' | 'active' | 'ended';
  participants: string[];
  participantCount: number;
  lastActivity: number;
}

export interface RecentActivity {
  id: string;
  name: string;
  avatar: string;
  duration: string;
  time: string;
  status: 'completed' | 'active' | 'waiting';
  type: 'call' | 'session' | 'meeting';
}

export const useFirebaseRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useFirebaseAuth();

  // Create a new room/session
  const createRoom = async (roomName?: string): Promise<string | null> => {
    if (!currentUser) {
      throw new Error('User must be authenticated to create a room');
    }

    if (!database) {
      console.warn('Firebase Realtime Database not configured');
      return null;
    }

    try {
      const roomsRef = ref(database, 'rooms');
      const newRoomRef = await push(roomsRef, {
        name: roomName || `${currentUser.displayName || 'User'}'s Room`,
        createdBy: currentUser.uid,
        createdByName: currentUser.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
        status: 'waiting',
        participants: [currentUser.uid],
        participantCount: 1,
        lastActivity: serverTimestamp()
      });

      return newRoomRef.key;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  };

  // Convert room data to recent activity format
  const convertToRecentActivity = useCallback((roomsData: Record<string, any>): RecentActivity[] => {
    if (!roomsData || !currentUser) return [];

    const activities: RecentActivity[] = [];
    
    Object.entries(roomsData).forEach(([roomId, room]) => {
      // Only include rooms where the current user was a participant
      if (room.participants && room.participants.includes(currentUser.uid)) {
        const createdAt = room.createdAt || Date.now();
        const lastActivity = room.lastActivity || createdAt;
        const timeAgo = getTimeAgo(lastActivity);
        
        // Calculate duration (mock for now - in real app, track actual session duration)
        const duration = calculateDuration(createdAt, lastActivity, room.status);
        
        activities.push({
          id: roomId,
          name: room.name || 'Unnamed Session',
          avatar: getAvatarForRoom(room),
          duration,
          time: timeAgo,
          status: room.status === 'active' ? 'active' : 'completed',
          type: determineRoomType(room.name)
        });
      }
    });

    // Sort by last activity (most recent first) and take top 3
    return activities
      .sort((a, b) => {
        const aTime = roomsData[a.id]?.lastActivity || 0;
        const bTime = roomsData[b.id]?.lastActivity || 0;
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [currentUser]);

  const getTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const calculateDuration = (startTime: number, endTime: number, status: string): string => {
    if (status === 'active') return 'Active now';
    
    const duration = Math.max(0, endTime - startTime);
    const minutes = Math.floor(duration / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const getAvatarForRoom = (room: any): string => {
    // Generate avatar based on room type or participants
    const avatars = ['👥', '👨‍💼', '👩‍💼', '🤝', '💼', '🎯', '📞'];
    const index = (room.name?.length || 0) % avatars.length;
    return avatars[index];
  };

  const determineRoomType = (roomName: string): 'call' | 'session' | 'meeting' => {
    const name = roomName?.toLowerCase() || '';
    if (name.includes('meeting')) return 'meeting';
    if (name.includes('session') || name.includes('practice')) return 'session';
    return 'call';
  };

  // Listen to Firebase rooms data
  useEffect(() => {
    if (!currentUser || !database) {
      setLoading(false);
      return;
    }

    const roomsRef = ref(database, 'rooms');
    
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Convert to rooms array
        const roomsArray: Room[] = Object.entries(data).map(([id, room]: [string, any]) => ({
          id,
          name: room.name || 'Unnamed Room',
          createdBy: room.createdBy || '',
          createdByName: room.createdByName || 'Anonymous',
          createdAt: room.createdAt || Date.now(),
          status: room.status || 'waiting',
          participants: room.participants || [],
          participantCount: room.participantCount || 0,
          lastActivity: room.lastActivity || room.createdAt || Date.now()
        }));

        setRooms(roomsArray);
        
        // Convert to recent activity
        const activities = convertToRecentActivity(data);
        setRecentActivity(activities);
      } else {
        setRooms([]);
        setRecentActivity([]);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Failed to fetch rooms:', error);
      setLoading(false);
    });

    return () => off(roomsRef, 'value', unsubscribe);
  }, [currentUser, convertToRecentActivity]);

  return {
    rooms,
    recentActivity,
    loading,
    createRoom
  };
};