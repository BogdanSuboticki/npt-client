import { Navigate } from "react-router";
import { useUser } from "../../context/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('super-admin' | 'admin' | 'user' | 'komitent')[];
  excludedRoles?: ('super-admin' | 'admin' | 'user' | 'komitent')[];
}

export default function ProtectedRoute({ children, allowedRoles, excludedRoles }: ProtectedRouteProps) {
  const { userType } = useUser();

  // If excluded roles are specified and user type is in excluded roles, redirect to home
  if (excludedRoles && excludedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  // If allowed roles specified, check if user type is in allowed roles
  if (allowedRoles) {
    // If user type is not in allowed roles, redirect to home
    if (!allowedRoles.includes(userType)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

