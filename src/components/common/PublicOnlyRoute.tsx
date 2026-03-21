import { Navigate } from "react-router";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const getToken = () => localStorage.getItem("authToken");

/**
 * PublicOnlyRoute - Wrapper for routes that should only be accessible to non-authenticated users
 * (e.g., login, signup pages). If the user is already authenticated, they are redirected
 * to the home page or specified redirect path.
 */
export default function PublicOnlyRoute({ children, redirectTo = "/" }: PublicOnlyRouteProps) {
  const token = getToken();

  // If user is authenticated, redirect them away from public-only pages
  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
