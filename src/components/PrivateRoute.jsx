import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Optional: Better user feedback during auth check
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          fontSize: '1.2rem',
          color: '#4B5563',
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
