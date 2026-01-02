import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, push, onValue, off, set } from 'firebase/database';
import { database } from '../../config/firebase';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  type: 'text' | 'sign' | 'system';
}

const SessionRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { currentUser } = useFirebaseAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [sessionStatus, setSessionStatus] = useState<string>('loading');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session data and messages
  useEffect(() => {
    if (!sessionId || !currentUser) return;

    // Listen for session updates
    const sessionRef = ref(database, `sessions/${sessionId}`);
    const sessionUnsubscribe = onValue(sessionRef, (snapshot) => {
      const session = snapshot.val();
      if (session) {
        setSessionStatus(session.status);
        setParticipants(session.participants || []);
      } else {
        setSessionStatus('not-found');
      }
    });

    // Listen for messages
    const messagesRef = ref(database, `sessions/${sessionId}/messages`);
    const messagesUnsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.entries(messagesData).map(([id, message]: [string, any]) => ({
          id,
          ...message
        }));
        messagesList.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(messagesList);
      }
    });

    return () => {
      off(sessionRef, 'value', sessionUnsubscribe);
      off(messagesRef, 'value', messagesUnsubscribe);
    };
  }, [sessionId, currentUser]);

  const sendMessage = async (text: string, type: 'text' | 'sign' = 'text') => {
    if (!sessionId || !currentUser || !text.trim()) return;

    const messagesRef = ref(database, `sessions/${sessionId}/messages`);
    const newMessageData = {
      text: text.trim(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Anonymous',
      timestamp: Date.now(),
      type
    };

    try {
      await push(messagesRef, newMessageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  const leaveSession = async () => {
    if (!sessionId || !currentUser) return;

    try {
      // Send leave message
      await sendMessage(`${currentUser.displayName} left the session`, 'system');
      
      // Update session status
      await set(ref(database, `sessions/${sessionId}/status`), 'ended');
      
      // Update user status back to available
      await set(ref(database, `users/${currentUser.uid}/status`), 'available');
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error leaving session:', error);
    }
  };

  const simulateSignDetection = () => {
    const signs = ['Hello', 'Thank you', 'Yes', 'No', 'Please', 'Sorry'];
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    sendMessage(`[Sign detected: ${randomSign}]`, 'sign');
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'not-found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">The session you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🎥</span>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Session Room
                </h1>
                <p className="text-sm text-gray-500">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={simulateSignDetection}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                🤟 Simulate Sign
              </button>
              <button
                onClick={leaveSession}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Leave Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 p-6">
          <div className="bg-gray-900 rounded-lg h-full flex items-center justify-center">
            <div className="text-center text-white">
              <span className="text-6xl mb-4 block">📹</span>
              <h3 className="text-xl font-semibold mb-2">Video Call Area</h3>
              <p className="text-gray-300">
                Video calling feature will be integrated here
              </p>
              <div className="mt-6 space-x-4">
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  🎤 Mute
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  📹 Camera
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                  🖥️ Share Screen
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <span className="text-3xl mb-2 block">💬</span>
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.type === 'system'
                        ? 'bg-gray-100 text-gray-600 text-center text-sm'
                        : message.senderId === currentUser?.uid
                        ? 'bg-indigo-600 text-white'
                        : message.type === 'sign'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type !== 'system' && message.senderId !== currentUser?.uid && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 opacity-75 ${
                      message.senderId === currentUser?.uid ? 'text-indigo-200' : 'text-gray-500'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionRoom;