import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

/**
 * Role guard. Redirects to /login when unauthenticated, or to `fallback`
 * when the user's role isn't in `allow`.
 */
export default function ProtectedRoute({ allow = [], fallback = "/" }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(role))
    return <Navigate to={fallback} replace />;

  return <Outlet />;
}
