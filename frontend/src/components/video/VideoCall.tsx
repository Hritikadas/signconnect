import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Webcam from 'react-webcam';
import { useAuth } from '../../contexts/AuthContext';
import SignDetector from '../sign/SignDetector';
import ChatPanel from '../chat/ChatPanel';
import ParticipantList from './ParticipantList';
import VideoControls from './VideoControls';
import { useWebRTC } from '../../hooks/useWebRTC';
import { useSocket } from '../../hooks/useSocket';

const VideoCall: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isSignDetectionActive, setIsSignDetectionActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [detectedText, setDetectedText] = useState('');

  const socket = useSocket(roomId!);
  const { peers, localStream, toggleAudio, toggleVideo, startScreenShare, stopScreenShare } = useWebRTC(
    roomId!,
    socket,
    user!
  );

  const handleSignDetected = (text: string) => {
    setDetectedText(text);
    if (socket && text) {
      socket.emit('sign-detected', { roomId, text, userId: user?.id });
    }
  };

  const handleToggleAudio = () => {
    toggleAudio();
    setIsMuted(!isMuted);
  };

  const handleToggleVideo = () => {
    toggleVideo();
    setIsVideoOff(!isVideoOff);
  };

  const handleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
      setIsScreenSharing(false);
    } else {
      await startScreenShare();
      setIsScreenSharing(true);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Room: {roomId?.slice(0, 8)}...</h2>
          <p className="text-gray-400 text-sm">{peers.length + 1} participants</p>
        </div>
        <button
          onClick={() => setIsSignDetectionActive(!isSignDetectionActive)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isSignDetectionActive
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isSignDetectionActive ? '🤟 Sign Detection ON' : '🤟 Sign Detection OFF'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-4">
          {/* Main Video */}
          <div className="flex-1 bg-black rounded-lg overflow-hidden relative mb-4">
            {!isVideoOff && (
              <Webcam
                ref={webcamRef}
                audio={false}
                className="w-full h-full object-cover"
                mirrored
              />
            )}
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">👤</span>
                  </div>
                  <p className="text-white">Camera Off</p>
                </div>
              </div>
            )}
            
            {/* Sign Detection Overlay */}
            {isSignDetectionActive && !isVideoOff && webcamRef.current && (
              <SignDetector
                webcamRef={webcamRef}
                onSignDetected={handleSignDetected}
              />
            )}
            
            {/* Detected Text Display */}
            {detectedText && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Detected Sign:</p>
                <p className="text-lg font-semibold">{detectedText}</p>
              </div>
            )}
          </div>

          {/* Participant Videos */}
          <div className="grid grid-cols-4 gap-2 h-32">
            {peers.map((peer) => (
              <div key={peer.peerId} className="bg-gray-800 rounded-lg overflow-hidden relative">
                <video
                  ref={(video) => {
                    if (video && peer.stream) {
                      video.srcObject = peer.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                  {peer.userName}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <VideoControls
            isMuted={isMuted}
            isVideoOff={isVideoOff}
            isScreenSharing={isScreenSharing}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onScreenShare={handleScreenShare}
            onLeave={() => window.location.href = '/dashboard'}
          />
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-gray-800 flex flex-col">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setIsChatOpen(true)}
              className={`flex-1 py-3 font-medium ${
                isChatOpen ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className={`flex-1 py-3 font-medium ${
                !isChatOpen ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              Participants
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {isChatOpen ? (
              <ChatPanel roomId={roomId!} socket={socket} />
            ) : (
              <ParticipantList participants={[{ id: user!.id, name: user!.name }, ...peers.map(p => ({ id: p.peerId, name: p.userName }))]} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
