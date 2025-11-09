import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute component for role-based access control
 *
 * @param children - The component to render if access is granted
 * @param allowedRoles - Array of role names that can access this route (e.g., ['Admin', 'Lecturer'])
 *                       If not provided, any authenticated user can access
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/edutrack/login" replace />;
  }

  // If allowedRoles is specified, check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    // Check if role exists and has description property
    if (!user.role || !user.role.description) {
      return (
        <Navigate
          to="/edutrack/unauthorized"
          replace
          state={{
            unauthorized: true,
            message: 'User role information is missing'
          }}
        />
      );
    }

    const userRole = user.role.description;

    // Check if user's role is in the allowed roles list
    const hasAccess = allowedRoles.some(
      allowedRole => allowedRole.toLowerCase() === userRole.toLowerCase()
    );

    if (!hasAccess) {
      // Redirect to unauthorized page
      return (
        <Navigate
          to="/edutrack/unauthorized"
          replace
          state={{
            unauthorized: true,
            message: `Access restricted to ${allowedRoles.join(', ')} only`
          }}
        />
      );
    }
  }

  // User is authenticated and has the required role
  return <>{children}</>;
}
