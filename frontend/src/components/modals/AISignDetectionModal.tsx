import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { 
  X, 
  Camera, 
  CameraOff, 
  Hand, 
  Zap, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Eye
} from 'lucide-react';

interface AISignDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DetectionResult {
  sign: string;
  confidence: number;
  timestamp: number;
}

const AISignDetectionModal: React.FC<AISignDetectionModalProps> = ({ isOpen, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isDetecting, setIsDetecting] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [currentSign, setCurrentSign] = useState<string>('');
  const [detectionHistory, setDetectionHistory] = useState<DetectionResult[]>([]);
  const [cameraError, setCameraError] = useState<string>('');

  // Mock AI signs for demonstration
  const mockSigns = useMemo(() => 
    ['Hello', 'Thank You', 'Please', 'Yes', 'No', 'Good', 'Bad', 'More', 'Stop', 'Help'], 
    []
  );

  // Request camera permission
  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermission('granted');
      setCameraError('');
      // Stop the stream immediately as webcam component will handle it
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      setCameraError('Camera access denied. Please enable camera permissions to use AI sign detection.');
    }
  }, []);

  // Mock AI detection simulation
  const simulateAIDetection = useCallback(() => {
    if (!isDetecting) return;

    // Simulate confidence fluctuation between 80-99%
    const baseConfidence = 80 + Math.random() * 19;
    const fluctuation = (Math.sin(Date.now() / 1000) * 5); // Smooth fluctuation
    const newConfidence = Math.max(80, Math.min(99, baseConfidence + fluctuation));
    
    setConfidence(newConfidence);

    // Occasionally detect a sign (every 3-5 seconds)
    if (Math.random() < 0.02) { // 2% chance per frame (~60fps = every 3-5 seconds)
      const randomSign = mockSigns[Math.floor(Math.random() * mockSigns.length)];
      const detectionConfidence = 85 + Math.random() * 14; // 85-99%
      
      setCurrentSign(randomSign);
      
      const newDetection: DetectionResult = {
        sign: randomSign,
        confidence: detectionConfidence,
        timestamp: Date.now()
      };
      
      setDetectionHistory(prev => [newDetection, ...prev.slice(0, 4)]); // Keep last 5 detections
      
      // Clear current sign after 2 seconds
      setTimeout(() => setCurrentSign(''), 2000);
    }
  }, [isDetecting, mockSigns]);

  // Start/stop detection
  const toggleDetection = () => {
    if (cameraPermission !== 'granted') {
      requestCameraPermission();
      return;
    }
    setIsDetecting(!isDetecting);
  };

  // Simulation loop
  useEffect(() => {
    if (!isDetecting) return;

    const interval = setInterval(simulateAIDetection, 50); // ~20fps for smooth animation
    return () => clearInterval(interval);
  }, [isDetecting, simulateAIDetection]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDetecting(false);
      setConfidence(0);
      setCurrentSign('');
      setDetectionHistory([]);
    }
  }, [isOpen]);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-200/50 bg-gradient-to-r from-blue-50/50 to-sky-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Hand className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">AI Sign Detection</h2>
                  <p className="text-sm text-slate-600">Real-time gesture recognition</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/70 border border-blue-200/50 text-slate-700 hover:bg-red-50/70 hover:text-red-600 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Camera Feed */}
                <div className="lg:col-span-2">
                  <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-blue-200/50">
                    {cameraPermission === 'granted' ? (
                      <>
                        <Webcam
                          ref={webcamRef}
                          className="w-full h-full object-cover"
                          mirrored={true}
                          onUserMediaError={(error) => {
                            console.error('Webcam error:', error);
                            setCameraError('Failed to access camera. Please check your camera permissions.');
                          }}
                        />
                        
                        {/* AI Overlay */}
                        {isDetecting && (
                          <>
                            {/* Confidence Bar */}
                            <div className="absolute top-4 left-4 right-4">
                              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white text-sm font-medium flex items-center">
                                    <Eye className="w-4 h-4 mr-2" />
                                    AI Confidence
                                  </span>
                                  <span className="text-emerald-400 font-mono text-sm">
                                    {confidence.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidence}%` }}
                                    transition={{ duration: 0.1 }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Current Detection */}
                            {currentSign && (
                              <motion.div
                                className="absolute bottom-4 left-4 right-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                              >
                                <div className="bg-emerald-500/90 backdrop-blur-sm rounded-lg p-4 text-center">
                                  <div className="text-white text-2xl font-bold mb-1">
                                    {currentSign}
                                  </div>
                                  <div className="text-emerald-100 text-sm">
                                    Detected with {confidence.toFixed(0)}% confidence
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Hand Tracking Indicators */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <motion.div
                                className="w-8 h-8 border-2 border-emerald-400 rounded-full"
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{ 
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            </div>
                          </>
                        )}

                        {/* Status Indicator */}
                        <div className="absolute top-4 right-4">
                          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                            isDetecting 
                              ? 'bg-emerald-500/90 text-white' 
                              : 'bg-slate-500/90 text-white'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              isDetecting ? 'bg-white animate-pulse' : 'bg-slate-300'
                            }`} />
                            <span className="text-sm font-medium">
                              {isDetecting ? 'DETECTING' : 'STANDBY'}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-white">
                          {cameraPermission === 'denied' ? (
                            <>
                              <CameraOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
                              <h3 className="text-lg font-semibold mb-2">Camera Access Denied</h3>
                              <p className="text-slate-300 mb-4 max-w-sm">
                                Please enable camera permissions to use AI sign detection
                              </p>
                            </>
                          ) : (
                            <>
                              <Camera className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                              <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
                              <p className="text-slate-300 mb-4 max-w-sm">
                                Click "Enable Camera" to start AI sign detection
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {cameraError && (
                    <motion.div
                      className="mt-4 p-4 bg-red-50/80 border border-red-200/50 rounded-xl flex items-center space-x-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{cameraError}</span>
                    </motion.div>
                  )}

                  {/* Controls */}
                  <div className="mt-6 flex items-center justify-center space-x-4">
                    <motion.button
                      onClick={requestCameraPermission}
                      disabled={cameraPermission === 'granted'}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        cameraPermission === 'granted'
                          ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-sky-600 text-white hover:shadow-lg'
                      }`}
                      whileHover={cameraPermission !== 'granted' ? { scale: 1.05 } : {}}
                      whileTap={cameraPermission !== 'granted' ? { scale: 0.95 } : {}}
                    >
                      {cameraPermission === 'granted' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                          Camera Enabled
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2 inline" />
                          Enable Camera
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={toggleDetection}
                      disabled={cameraPermission !== 'granted'}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        cameraPermission !== 'granted'
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : isDetecting
                          ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-lg'
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                      }`}
                      whileHover={cameraPermission === 'granted' ? { scale: 1.05 } : {}}
                      whileTap={cameraPermission === 'granted' ? { scale: 0.95 } : {}}
                    >
                      {isDetecting ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 inline" />
                          Stop Detection
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2 inline" />
                          Start Detection
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>

                {/* Detection Panel */}
                <div className="space-y-6">
                  {/* Current Status */}
                  <div className="bg-gradient-to-br from-blue-50/50 to-sky-50/50 rounded-xl p-4 border border-blue-200/50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Detection Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Camera</span>
                        <span className={`text-sm font-medium ${
                          cameraPermission === 'granted' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {cameraPermission === 'granted' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">AI Model</span>
                        <span className="text-sm font-medium text-emerald-600">Ready</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Detection</span>
                        <span className={`text-sm font-medium ${
                          isDetecting ? 'text-emerald-600' : 'text-slate-600'
                        }`}>
                          {isDetecting ? 'Running' : 'Stopped'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detection History */}
                  <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-xl p-4 border border-emerald-200/50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      <Hand className="w-5 h-5 mr-2" />
                      Recent Detections
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {detectionHistory.length > 0 ? (
                        detectionHistory.map((detection, index) => (
                          <motion.div
                            key={detection.timestamp}
                            className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-emerald-200/50"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div>
                              <div className="font-medium text-slate-800">{detection.sign}</div>
                              <div className="text-xs text-slate-600">{formatTime(detection.timestamp)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-mono text-emerald-600">
                                {detection.confidence.toFixed(1)}%
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <Hand className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No detections yet</p>
                          <p className="text-xs">Start detection to see results</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl p-4 border border-amber-200/50">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">Tips</h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Ensure good lighting for better detection
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Keep hands visible in the camera frame
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Hold gestures for 2-3 seconds for recognition
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AISignDetectionModal;