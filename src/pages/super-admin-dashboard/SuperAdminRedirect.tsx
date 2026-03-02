import { Navigate } from "react-router";
import { useUser } from "../../context/UserContext";

/**
 * Wraps any page to redirect super-admin users to /database.
 * Super admins should only access the database dashboard.
 */
export default function SuperAdminRedirect({ children }: { children: React.ReactNode }) {
  const { userType } = useUser();

  if (userType === "super-admin") {
    return <Navigate to="/database" replace />;
  }

  return <>{children}</>;
}
