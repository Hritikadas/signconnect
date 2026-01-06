import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import RecentRooms from '../RecentRooms';

const Dashboard: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  // Mock data for recent rooms - replace with actual data from your backend
  const [recentRooms] = useState([
    {
      id: 'room-123',
      name: 'Team Meeting',
      lastJoined: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      participantCount: 3
    },
    {
      id: 'room-456',
      name: 'ASL Practice Session',
      lastJoined: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      participantCount: 5
    },
    {
      id: 'room-789',
      name: 'Client Presentation',
      lastJoined: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      participantCount: 2
    }
  ]);

  const createRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to SignConnect
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          AI-powered sign language interpretation and video conferencing
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎥</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create Room
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start a new video call with sign language interpretation
            </p>
          </div>
          <button
            onClick={createRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition duration-200 text-lg"
          >
            Create New Room
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚪</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Join Room
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a room ID to join an existing call
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              onClick={joinRoom}
              disabled={!roomId.trim()}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg transition duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Recent Rooms Section */}
      <div className="mb-12">
        <RecentRooms rooms={recentRooms} onJoinRoom={handleJoinRoom} />
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Features</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">🤟</div>
            <h4 className="font-semibold mb-1">Real-time Sign Detection</h4>
            <p className="text-sm opacity-90">AI-powered gesture recognition</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💬</div>
            <h4 className="font-semibold mb-1">Live Chat</h4>
            <p className="text-sm opacity-90">Text and sign language support</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🌍</div>
            <h4 className="font-semibold mb-1">Multi-Language</h4>
            <p className="text-sm opacity-90">ASL, ISL, BSL support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
