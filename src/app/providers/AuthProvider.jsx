import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { TOKEN_STORAGE_KEY } from "@/services/apiClient";
import { authApi } from "@/features/auth/api/authApi";

const AuthContext = createContext(null);

/**
 * Holds the current session (user + role) and exposes login/logout.
 * Wrap the app once, near the root, above the router.
 *
 * On mount, a persisted token is validated against GET /api/auth/me so a
 * page refresh doesn't lose the session (api-standards.md: "me ... Used by
 * the frontend on page refresh"). `isInitializing` covers that window so
 * ProtectedRoute doesn't flash-redirect to /login before it resolves.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setIsInitializing(false);
      return;
    }

    authApi
      .me()
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem(TOKEN_STORAGE_KEY))
      .finally(() => setIsInitializing(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isInitializing,
      /** `session` is a login/register/demo response: { token?, ...userFields }. */
      login: (session) => {
        const { token, ...profile } = session;
        if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
        setUser(profile);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      },
    }),
    [user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
