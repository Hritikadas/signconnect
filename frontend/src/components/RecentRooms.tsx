import React from 'react';

interface Room {
  id: string;
  name: string;
  lastJoined: Date;
  participantCount?: number;
}

interface RecentRoomsProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
}

const RecentRooms: React.FC<RecentRoomsProps> = ({ rooms, onJoinRoom }) => {
  const formatLastJoined = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (rooms.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Rooms</h3>
        <p className="text-gray-500 text-center py-8">
          No recent rooms found. Join a room to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Rooms</h3>
      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{room.name}</h3>
              <p className="text-sm text-gray-500">
                Last joined: {formatLastJoined(room.lastJoined)}
              </p>
              {room.participantCount !== undefined && (
                <p className="text-xs text-gray-400">
                  {room.participantCount} participant{room.participantCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <button
              onClick={() => onJoinRoom(room.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRooms;