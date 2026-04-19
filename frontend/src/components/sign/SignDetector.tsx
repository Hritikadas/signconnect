import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface SignDetectorProps {
  webcamRef: React.RefObject<any>;
  onSignDetected: (text: string) => void;
}

const SignDetector: React.FC<SignDetectorProps> = ({ webcamRef, onSignDetected }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const detectionBufferRef = useRef<string[]>([]);
  const lastDetectedSignRef = useRef<string | null>(null);
  const lastDetectionTimeRef = useRef<number>(0);
  const cameraRef = useRef<Camera | null>(null);
  const handsRef = useRef<Hands | null>(null);
  const disposedRef = useRef(false);
  const onSignDetectedRef = useRef(onSignDetected);

  // Keep the callback ref in sync without triggering re-renders/re-effects
  useEffect(() => {
    onSignDetectedRef.current = onSignDetected;
  }, [onSignDetected]);

  // --- Text-to-Speech Function ---
  const speak = (text: string) => {
    window.speechSynthesis.cancel(); // Stop current speech to avoid overlapping
    const cleanText = text.replace(/[^\w\s]/gi, ''); // Remove emojis for cleaner speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    landmarks.forEach((landmark, index) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      if ([0, 4, 8, 12, 16, 20].includes(index)) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(index.toString(), x + 8, y);
        ctx.fillStyle = '#00FF00';
      }
    });

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]
    ];

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      ctx.beginPath();
      ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
      ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
      ctx.stroke();
    });
  };

  const classifyGesture = (landmarks: any[]): string | null => {
    try {
      const wrist = landmarks[0];
      const thumbTip = landmarks[4];
      const thumbIP = landmarks[3];
      const indexTip = landmarks[8];
      const indexPIP = landmarks[6];
      const middleTip = landmarks[12];
      const middlePIP = landmarks[10];
      const ringTip = landmarks[16];
      const ringPIP = landmarks[14];
      const pinkyTip = landmarks[20];
      const pinkyPIP = landmarks[18];

      const distance = (p1: any, p2: any) => 
        Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));

      const isFingerExtended = (tip: any, pip: any, wrist: any) => {
        return distance(tip, wrist) > distance(pip, wrist) * 1.1;
      };

      const thumbExtended = distance(thumbTip, thumbIP) > 0.05;
      const indexExtended = isFingerExtended(indexTip, indexPIP, wrist);
      const middleExtended = isFingerExtended(middleTip, middlePIP, wrist);
      const ringExtended = isFingerExtended(ringTip, ringPIP, wrist);
      const pinkyExtended = isFingerExtended(pinkyTip, pinkyPIP, wrist);

      // --- Gesture Logic ---
      if (thumbExtended && indexExtended && !middleExtended && !ringExtended && pinkyExtended) return 'I Love You 🤟';
      if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) return 'Victory ✌️';
      if (thumbExtended && indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return 'L-Shape 📐';
      if (pinkyExtended && !indexExtended && !middleExtended && !ringExtended) return 'Pinky Promise 🤙';
      if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return 'Thumbs Up 👍';
      
      const thumbIndexDist = distance(thumbTip, indexTip);
      if (thumbIndexDist < 0.04 && middleExtended && ringExtended && pinkyExtended) return 'OK 👌';
      if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) return 'Hello 👋';
      if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) return 'Fist ✊';

      return null;
    } catch (e) { return null; }
  };

  // Stable onResults handler — reads onSignDetected from ref so it never changes identity
  const onResults = useCallback((results: Results) => {
    // Guard: don't process results if the instance has been disposed
    if (disposedRef.current) return;

    if (!canvasRef.current || !canvasRef.current.getContext('2d')) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    canvas.width = results.image.width;
    canvas.height = results.image.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        drawLandmarks(ctx, landmarks);
        const detectedSign = classifyGesture(landmarks);
        
        if (detectedSign) {
          detectionBufferRef.current.push(detectedSign);
          if (detectionBufferRef.current.length > 10) detectionBufferRef.current.shift();
          
          const counts: any = {};
          detectionBufferRef.current.forEach(s => counts[s] = (counts[s] || 0) + 1);
          const mostCommon = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

          const now = Date.now();
          if (counts[mostCommon] >= 5 && (mostCommon !== lastDetectedSignRef.current || now - lastDetectionTimeRef.current > 3000)) {
            lastDetectedSignRef.current = mostCommon;
            lastDetectionTimeRef.current = now;
            speak(mostCommon); // Trigger Speech
            onSignDetectedRef.current(mostCommon);
          }
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Stable — never changes identity

  useEffect(() => {
    disposedRef.current = false;

    const init = async () => {
      try {
        await tf.ready();

        // If the component was unmounted while tf was loading, bail out
        if (disposedRef.current) return;

        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@latest/${file}`
        });

        hands.setOptions({ maxNumHands: 1, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        hands.onResults(onResults);
        handsRef.current = hands;

        if (webcamRef.current?.video) {
          cameraRef.current = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              // Guard: don't send frames if already disposed
              if (disposedRef.current || !handsRef.current) return;
              if (webcamRef.current?.video) {
                try {
                  await handsRef.current.send({ image: webcamRef.current.video });
                } catch (e) {
                  // Silently ignore errors from disposed WASM objects during teardown
                  if (!disposedRef.current) console.error(e);
                }
              }
            },
            width: 640, height: 480
          });
          await cameraRef.current.start();
          setIsModelLoaded(true);
        }
      } catch (err) { console.error(err); }
    };

    init();

    return () => {
      // Mark as disposed FIRST, before stopping camera/closing hands.
      // This prevents the onFrame callback from calling send() on a closing/closed instance.
      disposedRef.current = true;

      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }

      if (handsRef.current) {
        handsRef.current.close();
        handsRef.current = null;
      }
    };
  }, [webcamRef, onResults]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ opacity: 0.8 }} />
      {isModelLoaded && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          🤟 Sign Detection & Voice Active
        </div>
      )}
    </>
  );
};

export default SignDetector;