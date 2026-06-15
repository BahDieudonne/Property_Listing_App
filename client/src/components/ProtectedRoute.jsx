import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// A wrapper component that guards private pages from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" replace />;

  // User is authenticated, render the protected page
  return children;
};

export default ProtectedRoute;