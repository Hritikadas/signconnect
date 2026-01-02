import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Socket } from 'socket.io-client';

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  isSign?: boolean;
}

interface ChatPanelProps {
  roomId: string;
  socket: Socket | null;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ roomId, socket }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('chat-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('sign-detected', ({ text, userId, userName }: any) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        userId,
        userName,
        text,
        timestamp: new Date(),
        isSign: true
      }]);
    });

    return () => {
      socket.off('chat-message');
      socket.off('sign-detected');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim() || !socket) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: user!.id,
      userName: user!.name,
      text: inputText,
      timestamp: new Date()
    };

    socket.emit('chat-message', { roomId, message });
    setMessages(prev => [...prev, message]);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${
                msg.userId === user?.id
                  ? 'bg-blue-600 text-white'
                  : msg.isSign
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-semibold">{msg.userName}</span>
                {msg.isSign && <span className="text-xs">🤟</span>}
              </div>
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
