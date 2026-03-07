import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import Login from './components/auth/Login.tsx';
import Register from './components/auth/Register.tsx';
import Dashboard from './components/dashboard/Dashboard.tsx';
import Layout from './components/layout/Layout.tsx';
import VideoCall from './components/video/VideoCall.tsx';
import SessionRoom from './components/session/SessionRoom.tsx';
import './index.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Video Call Route (without Layout)
const VideoCallRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Landing Page Component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">SignConnect</h1>
        <p className="text-2xl text-gray-700 mb-4">AI-Powered Sign Language Interpreter Platform</p>
        <p className="text-lg text-gray-600 mb-12">
          Real-time sign language detection, video conferencing, and accessible communication
        </p>
        
        <div className="flex gap-4 justify-center mb-16">
          <a
            href="/login"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
          >
            Get Started
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🤟</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Sign Detection</h3>
            <p className="text-gray-600">AI-powered gesture recognition using MediaPipe & TensorFlow.js</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Video Conferencing</h3>
            <p className="text-gray-600">WebRTC-based video calls with multiple participants</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600">Real-time messaging with Socket.IO</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="App font-['Inter',sans-serif]">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Dashboard Route */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* Video Call Room Route */}
              <Route
                path="/room/:roomId"
                element={
                  <VideoCallRoute>
                    <VideoCall />
                  </VideoCallRoute>
                }
              />
              
              {/* Session Room Route (Firebase-based) */}
              <Route
                path="/session/:sessionId"
                element={
                  <VideoCallRoute>
                    <SessionRoom />
                  </VideoCallRoute>
                }
              />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;