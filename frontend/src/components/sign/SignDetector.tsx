import React, { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    const initializeDetector = async () => {
      await tf.ready();
      
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
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
        camera.start();
      }

      setIsModelLoaded(true);
    };

    initializeDetector();
  }, [webcamRef]);

  const onResults = (results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = results.image.width;
    canvas.height = results.image.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks) {
      for (const landmarks of results.multiHandLandmarks) {
        drawLandmarks(ctx, landmarks);
        const detectedSign = classifyGesture(landmarks);
        
        if (detectedSign) {
          detectionBufferRef.current.push(detectedSign);
          
          if (detectionBufferRef.current.length > 10) {
            detectionBufferRef.current.shift();
          }
          
          const mostCommon = getMostCommonSign(detectionBufferRef.current);
          if (mostCommon) {
            onSignDetected(mostCommon);
          }
        }
      }
    }
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    landmarks.forEach((landmark) => {
      const x = landmark.x * ctx.canvas.width;
      const y = landmark.y * ctx.canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [0, 9], [9, 10], [10, 11], [11, 12],
      [0, 13], [13, 14], [14, 15], [15, 16],
      [0, 17], [17, 18], [18, 19], [19, 20]
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
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const wrist = landmarks[0];

    const distance = (p1: any, p2: any) => 
      Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const allFingersUp = 
      indexTip.y < wrist.y && 
      middleTip.y < wrist.y && 
      ringTip.y < wrist.y && 
      pinkyTip.y < wrist.y;

    if (allFingersUp) return 'Hello';

    const thumbIndexClose = distance(thumbTip, indexTip) < 0.05;
    if (thumbIndexClose) return 'OK';

    const onlyIndexUp = indexTip.y < wrist.y && 
                        middleTip.y > wrist.y && 
                        ringTip.y > wrist.y && 
                        pinkyTip.y > wrist.y;
    if (onlyIndexUp) return 'One';

    const indexMiddleUp = indexTip.y < wrist.y && 
                          middleTip.y < wrist.y && 
                          ringTip.y > wrist.y && 
                          pinkyTip.y > wrist.y;
    if (indexMiddleUp) return 'Two';

    const fist = indexTip.y > wrist.y && 
                 middleTip.y > wrist.y && 
                 ringTip.y > wrist.y && 
                 pinkyTip.y > wrist.y;
    if (fist) return 'Yes';

    return null;
  };

  const getMostCommonSign = (buffer: string[]): string | null => {
    if (buffer.length < 5) return null;
    
    const counts: { [key: string]: number } = {};
    buffer.forEach(sign => {
      counts[sign] = (counts[sign] || 0) + 1;
    });

    let maxCount = 0;
    let mostCommon = null;
    for (const [sign, count] of Object.entries(counts)) {
      if (count > maxCount && count >= 5) {
        maxCount = count;
        mostCommon = sign;
      }
    }

    return mostCommon;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export default SignDetector;
