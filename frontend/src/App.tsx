import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Simple test landing page
const TestLandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-6">SignConnect</h1>
      <p className="text-xl text-gray-600 mb-8">AI-Powered Sign Language Platform</p>
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto">
        <p className="text-green-600 font-semibold text-lg mb-4">✅ App is Working!</p>
        <p className="text-gray-500 mb-6">React Router and components are loading correctly</p>
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/login'}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
          <button 
            onClick={() => window.location.href = '/register'}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Register
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SimpleLogin = () => (
  <div className="min-h-screen bg-blue-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Login Page</h1>
      <p className="text-gray-600 mb-4">Login functionality coming soon...</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  </div>
);

const SimpleRegister = () => (
  <div className="min-h-screen bg-green-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Register Page</h1>
      <p className="text-gray-600 mb-4">Registration functionality coming soon...</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Back to Home
      </button>
    </div>
  </div>
);

const SimpleDashboard = () => (
  <div className="min-h-screen bg-purple-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-4">Dashboard functionality coming soon...</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Back to Home
      </button>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App font-['Inter',sans-serif]">
        <Routes>
          <Route path="/" element={<TestLandingPage />} />
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/register" element={<SimpleRegister />} />
          <Route path="/dashboard" element={<SimpleDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;