import React from 'react';

interface Participant {
  id: string;
  name: string;
}

interface ParticipantListProps {
  participants: Participant[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  return (
    <div className="p-4">
      <h3 className="text-white font-semibold mb-4">Participants ({participants.length})</h3>
      <div className="space-y-2">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white">{participant.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;
