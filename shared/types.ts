// Shared TypeScript types for frontend and backend

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  isSign?: boolean;
}

export interface Room {
  roomId: string;
  createdBy: string;
  participants: string[];
  messages: Message[];
  createdAt: Date;
  endedAt?: Date;
}

export interface SignLanguage {
  code: string;
  name: string;
  region: string;
}

export const SUPPORTED_SIGN_LANGUAGES: SignLanguage[] = [
  { code: 'ASL', name: 'American Sign Language', region: 'USA' },
  { code: 'BSL', name: 'British Sign Language', region: 'UK' },
  { code: 'ISL', name: 'Indian Sign Language', region: 'India' }
];

export interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  from: string;
  to: string;
}

export interface SocketEvents {
  'join-room': { roomId: string; userId: string; userName: string };
  'leave-room': { roomId: string };
  'chat-message': { roomId: string; message: Message };
  'sign-detected': { roomId: string; text: string; userId: string };
  'offer': { offer: any; to: string; roomId: string };
  'answer': { answer: any; to: string; roomId: string };
  'ice-candidate': { candidate: any; to: string; roomId: string };
}
