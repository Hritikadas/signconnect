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

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = results.image.width;
    canvas.height = results.image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        drawLandmarks(ctx, landmarks);
        const detectedSign = classifyGesture(landmarks);
        
        if (detectedSign) {
          detectionBufferRef.current.push(detectedSign);
          
          // Keep buffer size manageable
          if (detectionBufferRef.current.length > 15) {
            detectionBufferRef.current.shift();
          }
          
          // Get most common sign from buffer
          const mostCommon = getMostCommonSign(detectionBufferRef.current);
          
          // Only send if it's different from last detected or enough time has passed
          const now = Date.now();
          if (mostCommon && 
              (mostCommon !== lastDetectedSignRef.current || 
               now - lastDetectionTimeRef.current > 3000)) {
            lastDetectedSignRef.current = mostCommon;
            lastDetectionTimeRef.current = now;
            onSignDetected(mostCommon);
            // Clear buffer after successful detection
            detectionBufferRef.current = [];
          }
        }
      }
    } else {
      // No hands detected, clear buffer
      if (detectionBufferRef.current.length > 0) {
        detectionBufferRef.current = [];
      }
    }
  }, [onSignDetected]);

  useEffect(() => {
    const initializeDetector = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow.js ready');
        
        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7
        });

        hands.onResults(onResults);

        if (webcamRef.current?.video) {
          const camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (webcamRef.current?.video) {
                await hands.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480
          });
          cameraRef.current = camera;
          camera.start();
          console.log('MediaPipe Hands initialized');
        }

        setIsModelLoaded(true);
      } catch (error) {
        console.error('Error initializing sign detector:', error);
      }
    };

    initializeDetector();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [webcamRef, onResults]);

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    // Draw points
    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    landmarks.forEach((landmark, index) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw landmark numbers for debugging
      if (index === 0 || index === 4 || index === 8 || index === 12 || index === 16 || index === 20) {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(index.toString(), x + 8, y);
        ctx.fillStyle = '#00FF00';
      }
    });

    // Draw connections
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],      // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],      // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17]            // Palm
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
      // Key landmarks
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

      // Helper function to calculate distance
      const distance = (p1: any, p2: any) => 
        Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));

      // Helper function to check if finger is extended
      const isFingerExtended = (tip: any, pip: any, wrist: any) => {
        const tipToWrist = distance(tip, wrist);
        const pipToWrist = distance(pip, wrist);
        return tipToWrist > pipToWrist * 1.1;
      };

      // Check each finger
      const thumbExtended = distance(thumbTip, thumbIP) > 0.05;
      const indexExtended = isFingerExtended(indexTip, indexPIP, wrist);
      const middleExtended = isFingerExtended(middleTip, middlePIP, wrist);
      const ringExtended = isFingerExtended(ringTip, ringPIP, wrist);
      const pinkyExtended = isFingerExtended(pinkyTip, pinkyPIP, wrist);

      // Count extended fingers
      const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

      // THUMBS UP - Thumb up, all other fingers closed
      if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return 'Thumbs Up 👍';
      }

      // THUMBS DOWN - Thumb down, all other fingers closed
      if (thumbTip.y > wrist.y && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return 'Thumbs Down 👎';
      }

      // PEACE / VICTORY - Index and middle extended, others closed
      if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
        return 'Peace ✌️';
      }

      // OK SIGN - Thumb and index touching, others extended
      const thumbIndexDistance = distance(thumbTip, indexTip);
      if (thumbIndexDistance < 0.04 && middleExtended && ringExtended && pinkyExtended) {
        return 'OK 👌';
      }

      // POINTING - Only index extended
      if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return 'Pointing ☝️';
      }

      // ROCK / HORNS - Index and pinky extended, others closed
      if (indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
        return 'Rock On 🤘';
      }

      // CALL ME - Thumb and pinky extended, others closed
      if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
        return 'Call Me 🤙';
      }

      // HELLO / OPEN HAND - All fingers extended
      if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
        return 'Hello 👋';
      }

      // FIST / YES - All fingers closed
      if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
        return 'Fist ✊';
      }

      // NUMBER GESTURES
      if (extendedCount === 1 && indexExtended) {
        return 'One 1️⃣';
      }
      if (extendedCount === 2 && indexExtended && middleExtended) {
        return 'Two 2️⃣';
      }
      if (extendedCount === 3 && indexExtended && middleExtended && ringExtended) {
        return 'Three 3️⃣';
      }
      if (extendedCount === 4) {
        return 'Four 4️⃣';
      }

      // STOP - All fingers extended, palm facing forward
      if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
        return 'Stop ✋';
      }

      return null;
    } catch (error) {
      console.error('Error classifying gesture:', error);
      return null;
    }
  };

  const getMostCommonSign = (buffer: string[]): string | null => {
    if (buffer.length < 3) return null;
    
    const counts: { [key: string]: number } = {};
    buffer.forEach(sign => {
      counts[sign] = (counts[sign] || 0) + 1;
    });

    let maxCount = 0;
    let mostCommon: string | null = null;
    
    for (const [sign, count] of Object.entries(counts)) {
      if (count > maxCount && count >= 3) {
        maxCount = count;
        mostCommon = sign;
      }
    }

    return mostCommon;
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.8 }}
      />
      {isModelLoaded && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          🤟 Sign Detection Active
        </div>
      )}
    </>
  );
};

export default SignDetector;
