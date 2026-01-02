import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

interface FirebaseProtectedRouteProps {
  children: React.ReactNode;
}

const FirebaseProtectedRoute: React.FC<FirebaseProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" replace />;
};

export default FirebaseProtectedRoute;