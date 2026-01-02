import React, { useState } from 'react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { useNavigate } from 'react-router-dom';

const FirebaseDashboard: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    onlineUsers, 
    availableUsers, 
    createSession, 
    currentSession 
  } = useFirebaseAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStartSession = async (targetUserId: string) => {
    setLoading(targetUserId);
    try {
      const sessionId = await createSession(targetUserId);
      console.log('Session created:', sessionId);
      // Navigate to session room
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'in-session': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'in-session': return 'In Session';
      default: return 'Offline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🤟</span>
              <h1 className="text-2xl font-bold text-gray-900">SignConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium">{currentUser?.displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Current Session Alert */}
          {currentSession && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-blue-400 text-xl">🎥</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Active Session
                  </h3>
                  <p className="text-sm text-blue-700">
                    You are currently in session: {currentSession.id}
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => navigate(`/session/${currentSession.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Join Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Online Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {onlineUsers.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Available Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {availableUsers.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">🔥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Your Status
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {currentSession ? 'In Session' : 'Available'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Users */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Available Users
              </h3>
              
              {availableUsers.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-4 block">😴</span>
                  <p className="text-gray-500">No users available for sessions right now.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Users will appear here when they're online and available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {user.displayName}
                          </h4>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {getStatusText(user.status)}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">
                              {formatLastSeen(user.lastSeen)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartSession(user.uid)}
                        disabled={loading === user.uid || currentSession !== null}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading === user.uid ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Connecting...
                          </div>
                        ) : (
                          'Start Session'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Online Users */}
          {onlineUsers.length > availableUsers.length && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  All Online Users
                </h3>
                <div className="space-y-3">
                  {onlineUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.displayName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {user.displayName}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {getStatusText(user.status)} • {formatLastSeen(user.lastSeen)}
                          </p>
                        </div>
                      </div>
                      {user.status !== 'available' && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {user.status === 'in-session' ? 'Busy' : 'Unavailable'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseDashboard;