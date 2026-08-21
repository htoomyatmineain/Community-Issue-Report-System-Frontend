import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ROLE_HOME_PATH } from "@/lib/rbac";

/**
 * Role guard. Redirects to /login when unauthenticated.
 *
 * On a role mismatch, `fallback` wins if given; otherwise it redirects to
 * the current user's own role home rather than a hardcoded path — sending a
 * STAFF user to a citizen-only "/" would otherwise redirect straight back
 * into this same guard and loop.
 */
export default function ProtectedRoute({ allow = [], fallback }) {
  const { isAuthenticated, isInitializing, role } = useAuth();

  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(role)) {
    return <Navigate to={fallback ?? ROLE_HOME_PATH[role] ?? "/login"} replace />;
  }

  return <Outlet />;
}
