import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

/**
 * Holds the current session (user + role) and exposes login/logout.
 * Wrap the app once, near the root, above the router.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      login: setUser,
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
