import { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

interface Peer {
  peerId: string;
  peer: SimplePeer.Instance;
  stream?: MediaStream;
  userName: string;
}

export const useWebRTC = (roomId: string, socket: Socket | null, user: any) => {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const peersRef = useRef<Peer[]>([]);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true
        });
        setLocalStream(stream);
        localStreamRef.current = stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initMedia();

    return () => {
      localStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!socket || !localStream) return;

    socket.emit('join-room', { roomId, userId: user.id, userName: user.name });

    socket.on('user-joined', ({ userId, userName }: any) => {
      const peer = createPeer(userId, socket, localStream, userName);
      peersRef.current.push({ peerId: userId, peer, userName });
      setPeers([...peersRef.current]);
    });

    socket.on('offer', ({ offer, userId, userName }: any) => {
      const peer = addPeer(offer, userId, socket, localStream, userName);
      peersRef.current.push({ peerId: userId, peer, userName });
      setPeers([...peersRef.current]);
    });

    socket.on('answer', ({ answer, userId }: any) => {
      const peerObj = peersRef.current.find(p => p.peerId === userId);
      peerObj?.peer.signal(answer);
    });

    socket.on('ice-candidate', ({ candidate, userId }: any) => {
      const peerObj = peersRef.current.find(p => p.peerId === userId);
      peerObj?.peer.signal(candidate);
    });

    socket.on('user-left', ({ userId }: any) => {
      const peerObj = peersRef.current.find(p => p.peerId === userId);
      if (peerObj) {
        peerObj.peer.destroy();
        peersRef.current = peersRef.current.filter(p => p.peerId !== userId);
        setPeers([...peersRef.current]);
      }
    });

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('user-left');
      peersRef.current.forEach(({ peer }) => peer.destroy());
    };
  }, [socket, localStream, roomId, user]);

  const createPeer = (userId: string, socket: Socket, stream: MediaStream, userName: string) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: true,
      stream
    });

    peer.on('signal', (signal) => {
      socket.emit('offer', { offer: signal, to: userId, roomId });
    });

    peer.on('stream', (remoteStream) => {
      const peerObj = peersRef.current.find(p => p.peerId === userId);
      if (peerObj) {
        peerObj.stream = remoteStream;
        setPeers([...peersRef.current]);
      }
    });

    return peer;
  };

  const addPeer = (offer: any, userId: string, socket: Socket, stream: MediaStream, userName: string) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: true,
      stream
    });

    peer.on('signal', (signal) => {
      socket.emit('answer', { answer: signal, to: userId, roomId });
    });

    peer.on('stream', (remoteStream) => {
      const peerObj = peersRef.current.find(p => p.peerId === userId);
      if (peerObj) {
        peerObj.stream = remoteStream;
        setPeers([...peersRef.current]);
      }
    });

    peer.signal(offer);
    return peer;
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      
      peersRef.current.forEach(({ peer }) => {
        const sender = peer._pc?.getSenders().find((s: any) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      });

      screenTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  const stopScreenShare = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      peersRef.current.forEach(({ peer }) => {
        const sender = peer._pc?.getSenders().find((s: any) => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  };

  return {
    peers,
    localStream,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare
  };
};
