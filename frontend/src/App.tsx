import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext';
import FirebaseLogin from './components/auth/FirebaseLogin';
import FirebaseRegister from './components/auth/FirebaseRegister';
import FirebaseProtectedRoute from './components/auth/FirebaseProtectedRoute';
import FirebaseDashboard from './components/dashboard/FirebaseDashboard';
import SessionRoom from './components/session/SessionRoom';
import './index.css';

function App() {
  return (
    <FirebaseAuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<FirebaseLogin />} />
            <Route path="/register" element={<FirebaseRegister />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <FirebaseProtectedRoute>
                  <FirebaseDashboard />
                </FirebaseProtectedRoute>
              }
            />
            <Route
              path="/session/:sessionId"
              element={
                <FirebaseProtectedRoute>
                  <SessionRoom />
                </FirebaseProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </FirebaseAuthProvider>
  );
}

export default App;