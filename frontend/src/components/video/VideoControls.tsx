import React from 'react';

interface VideoControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onScreenShare: () => void;
  onLeave: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onScreenShare,
  onLeave
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 py-4">
      <button
        onClick={onToggleAudio}
        className={`p-4 rounded-full transition ${
          isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <span className="text-2xl">{isMuted ? '🔇' : '🎤'}</span>
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-4 rounded-full transition ${
          isVideoOff ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
      >
        <span className="text-2xl">{isVideoOff ? '📷' : '📹'}</span>
      </button>

      <button
        onClick={onScreenShare}
        className={`p-4 rounded-full transition ${
          isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
        }`}
        aria-label={isScreenSharing ? 'Stop sharing' : 'Share screen'}
      >
        <span className="text-2xl">🖥️</span>
      </button>

      <button
        onClick={onLeave}
        className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
        aria-label="Leave call"
      >
        <span className="text-2xl">📞</span>
      </button>
    </div>
  );
};

export default VideoControls;
